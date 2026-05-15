// ===== CONSTANTS =====
const BRAND_LABELS = { luxury:"Luxury", grand:"Grand", holiday:"Holiday", muongthanh:"Mường Thanh" };

// ===== INIT =====
const params = new URLSearchParams(window.location.search);
const hotelSlug = params.get('hotel');
const roomType = params.get('room') || '';
const checkIn = params.get('checkIn') || getD(1);
const checkOut = params.get('checkOut') || getD(2);
const guests = parseInt(params.get('guests')) || 2;
const pricePerNight = parseInt(params.get('price')) || 0;
const nights = parseInt(params.get('nights')) || 1;
let baseTotal = parseInt(params.get('total')) || (pricePerNight * nights);
let extrasTotal = 0;
let activePaymentMethods = [];
let allVouchers    = [];
let appliedPromo   = null;
let discountAmount = 0;
let activeExtras   = [];   // loaded from DB
let serviceFee_pct = 5;    // loaded from DB, default 5

let hotel = null;

document.addEventListener('DOMContentLoaded', async () => {
  // Fetch hotel + extras + settings đồng thời
  const [hotelRes, extrasRes, settingsRes] = await Promise.allSettled([
    fetch('api/hotels.php?slug=' + hotelSlug).then(r => r.json()),
    fetch('api/extras.php').then(r => r.json()),
    fetch('api/settings.php').then(r => r.json()),
  ]);

  hotel = hotelRes.status === 'fulfilled' ? hotelRes.value.hotel : null;
  if (!hotel) { alert('Không tìm thấy khách sạn!'); history.back(); return; }

  activeExtras = extrasRes.status === 'fulfilled' ? (extrasRes.value.extras || []) : [];
  if (settingsRes.status === 'fulfilled') {
    serviceFee_pct = parseFloat(settingsRes.value.map?.service_fee_pct ?? 5);
  }

  // Back link
  document.getElementById('backToHotel').href = `hotel.html?id=${hotelSlug}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;

  renderSummary();
  renderExtras();
  loadPaymentMethods();
  loadVouchers();
  setupCardFormat();
  setupPromoCode();
  setupSteps();

  // Pre-fill form if logged in
  fetch('api/auth.php?action=me').then(r => r.json()).then(d => {
    if (!d.authenticated) return;
    const c = d.customer;
    if (c.last_name)  document.getElementById('lastName').value  = c.last_name;
    if (c.first_name) document.getElementById('firstName').value = c.first_name;
    if (c.email)      document.getElementById('email').value     = c.email;
    if (c.phone)      document.getElementById('phone').value     = c.phone;
    const natSel = document.getElementById('nationality');
    if (natSel && c.nationality) natSel.value = c.nationality;
  }).catch(() => {});
});

// ===== SUMMARY =====
function renderSummary() {
  document.getElementById('summaryImg').src = hotel.image;
  document.getElementById('summaryBrand').textContent = BRAND_LABELS[hotel.brand];
  document.getElementById('summaryName').textContent = hotel.name;
  document.getElementById('summaryRoom').textContent = roomType;
  document.getElementById('sCheckIn').textContent = formatDate(checkIn);
  document.getElementById('sCheckOut').textContent = formatDate(checkOut);
  document.getElementById('sGuests').textContent = guests + ' ' + t('booking.guests_unit');
  document.getElementById('sNights').textContent = nights + ' ' + t('booking.nights_unit');
  updatePriceBreakdown();
}

function updatePriceBreakdown() {
  const serviceFee = Math.round((baseTotal + extrasTotal) * serviceFee_pct / 100);
  discountAmount   = calcDiscount(baseTotal + extrasTotal + serviceFee);

  const lines = [
    `<div class="price-line"><span>${formatPrice(pricePerNight)} × ${nights} ${t('booking.nights_unit')}</span><span>${formatPrice(baseTotal)}</span></div>`,
    extrasTotal > 0 ? `<div class="price-line extras"><span>${t('booking.extra_services')}</span><span>+${formatPrice(extrasTotal)}</span></div>` : '',
    `<div class="price-line"><span>${t('booking.service_fee')} (${serviceFee_pct}%)</span><span>${formatPrice(serviceFee)}</span></div>`,
    discountAmount > 0 ? `<div class="price-line" style="color:var(--green)"><span>${t('booking.discount')} (${appliedPromo.code})</span><span>−${formatPrice(discountAmount)}</span></div>` : '',
  ];
  document.getElementById('priceBreakdown').innerHTML = lines.join('');
  const total = baseTotal + extrasTotal + serviceFee - discountAmount;
  document.getElementById('totalAmount').textContent = formatPrice(Math.max(0, total));
}

function calcDiscount(subtotal) {
  if (!appliedPromo) return 0;
  if (appliedPromo.discount_type === 'percent') {
    return Math.round(subtotal * appliedPromo.discount_value / 100);
  }
  return Math.min(Math.round(appliedPromo.discount_value), subtotal);
}

// ===== EXTRAS (loaded from DB) =====
function calcExtraPrice(ex) {
  switch (ex.calc_type) {
    case 'per_person':             return ex.price * guests;
    case 'per_night':              return ex.price * nights;
    case 'per_person_per_night':   return ex.price * guests * nights;
    default:                       return ex.price; // flat
  }
}

function renderExtras() {
  const grid = document.getElementById('extrasGrid');
  if (!grid) return;
  if (!activeExtras.length) { grid.innerHTML = ''; return; }

  grid.innerHTML = activeExtras.map(ex => `
    <label class="extra-item">
      <input type="checkbox" id="extra_${ex.code}"/>
      <div class="extra-info">
        <span class="extra-name">${ex.icon} ${ex.name_vi}</span>
        <span class="extra-price">${ex.note || formatPrice(ex.price)}</span>
      </div>
    </label>`).join('');

  activeExtras.forEach(ex => {
    document.getElementById('extra_' + ex.code).addEventListener('change', () => {
      extrasTotal = activeExtras.reduce((sum, e) => {
        return sum + (document.getElementById('extra_' + e.code)?.checked ? calcExtraPrice(e) : 0);
      }, 0);
      updatePriceBreakdown();
      renderVoucherCards();
    });
  });
}

// ===== VOUCHERS & PROMO CODE =====

function setupPromoCode() {
  const btn   = document.getElementById('promoApplyBtn');
  const input = document.getElementById('promoInput');
  btn.addEventListener('click', () => applyPromoCode(input.value.trim().toUpperCase()));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); applyPromoCode(input.value.trim().toUpperCase()); }
  });
  input.addEventListener('input', () => {
    input.classList.remove('is-valid', 'is-invalid');
    if (!input.value.trim() && appliedPromo) removePromo();
  });
}

// Load all active vouchers once on page load
async function loadVouchers() {
  try {
    const res  = await fetch('api/promotions.php?active=1');
    const data = await res.json();
    allVouchers = data.promotions || [];
  } catch (_) {
    allVouchers = [];
  }
  renderVoucherCards();
}

// Re-render cards (called on load and whenever extras change eligibility)
function renderVoucherCards() {
  const list = document.getElementById('voucherList');
  if (!list) return;

  if (!allVouchers.length) {
    list.innerHTML = '<div class="vc-empty">Không có voucher nào.</div>';
    document.getElementById('voucherCount').textContent = '';
    return;
  }

  // Sort: eligible first, then ineligible
  const withElig = allVouchers.map(v => ({ ...v, elig: checkEligibility(v) }));
  withElig.sort((a, b) => (b.elig.ok ? 1 : 0) - (a.elig.ok ? 1 : 0));

  const eligCount = withElig.filter(v => v.elig.ok).length;
  document.getElementById('voucherCount').textContent =
    eligCount > 0 ? `${eligCount} voucher có thể dùng` : 'Không có voucher phù hợp';

  list.innerHTML = withElig.map(v => {
    const isSelected  = appliedPromo && appliedPromo.code === v.code;
    const isIneligible = !v.elig.ok;
    const discLabel = v.discount_type === 'percent'
      ? `${t('booking.voucher_off')} ${parseFloat(v.discount_value)}%`
      : `${t('booking.voucher_off')} ${formatPrice(v.discount_value)}`;
    const lang = (typeof getLang === 'function') ? getLang() : 'vi';
    const expiry = v.valid_to
      ? `${t('booking.voucher_exp')}: ${new Date(v.valid_to).toLocaleDateString(lang === 'en' ? 'en-GB' : 'vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' })}`
      : '';

    const rightHtml = isIneligible
      ? `<span class="vc-reason">${v.elig.reason}</span>`
      : isSelected
        ? `<button class="vc-btn-remove" onclick="removePromo(); event.stopPropagation()">${t('booking.voucher_remove')}</button>`
        : `<button class="vc-btn-apply" onclick="selectVoucherCard('${v.code}'); event.stopPropagation()">${t('booking.voucher_select')}</button>`;

    return `<div class="voucher-card${isSelected ? ' vc-selected' : ''}${isIneligible ? ' vc-ineligible' : ''}"
                 id="vc-${v.code}"
                 ${!isIneligible ? `onclick="selectVoucherCard('${v.code}')"` : ''}>
      <span class="vc-code-tag">${v.code}</span>
      <div class="vc-info">
        <div class="vc-name">${v.name}</div>
        <div class="vc-sub">
          <span class="vc-discount-val">${discLabel}</span>
          ${expiry ? `<span>${expiry}</span>` : ''}
        </div>
      </div>
      <div class="vc-right">
        ${!isIneligible && !isSelected ? '<span class="vc-eligible-badge">Hợp lệ</span>' : ''}
        ${rightHtml}
      </div>
    </div>`;
  }).join('');
}

// Check if a promo is applicable for the current booking
function checkEligibility(p) {
  const today = new Date().toISOString().slice(0, 10);
  if (p.valid_from && p.valid_from > today)
    return { ok: false, reason: t('booking.promo_not_yet') };
  if (p.valid_to && p.valid_to < today)
    return { ok: false, reason: t('booking.promo_expired') };
  if (p.usage_limit > 0 && p.used_count >= p.usage_limit)
    return { ok: false, reason: t('booking.promo_used_up') };
  if (p.min_nights && nights < parseInt(p.min_nights))
    return { ok: false, reason: t('booking.promo_min_nights', p.min_nights) };
  if (p.min_total && (baseTotal + extrasTotal) < parseFloat(p.min_total))
    return { ok: false, reason: t('booking.promo_min_total', formatPrice(p.min_total)) };
  if (p.applies_to && p.applies_to !== 'all' && hotel && hotel.brand !== p.applies_to) {
    const brandNames = { luxury:'Luxury', grand:'Grand', holiday:'Holiday', muongthanh:'Mường Thanh' };
    return { ok: false, reason: t('booking.promo_brand_only', brandNames[p.applies_to] || p.applies_to) };
  }
  return { ok: true };
}

// Called when clicking a voucher card
function selectVoucherCard(code) {
  if (appliedPromo && appliedPromo.code === code) return; // already selected
  applyPromoCode(code);
}

// Core apply logic — used by card click AND manual input
async function applyPromoCode(code) {
  if (!code) return;
  const btn   = document.getElementById('promoApplyBtn');
  const input = document.getElementById('promoInput');
  btn.textContent = '...'; btn.disabled = true;
  setPromoFeedback('', '');

  try {
    const res  = await fetch(`api/promotions.php?action=validate&code=${encodeURIComponent(code)}`);
    const data = await res.json();

    if (!data.valid) {
      input.classList.add('is-invalid');
      setPromoFeedback('error', data.error || 'Mã không hợp lệ');
      appliedPromo = null; discountAmount = 0;
      updatePriceBreakdown();
      return;
    }

    const p    = data.promotion;
    const elig = checkEligibility(p);
    if (!elig.ok) {
      input.classList.add('is-invalid');
      setPromoFeedback('error', elig.reason);
      return;
    }

    // Apply
    appliedPromo = p;
    updatePriceBreakdown();
    input.value = p.code; input.classList.add('is-valid'); input.readOnly = true;
    const discLabel = p.discount_type === 'percent'
      ? `${parseFloat(p.discount_value)}%` : formatPrice(p.discount_value);
    setPromoFeedback('success',
      `✓ ${t('booking.promo_applied', p.name, discLabel)} &nbsp;<span class="promo-remove" id="promoRemove">✕</span>`
    );
    document.getElementById('promoRemove')?.addEventListener('click', removePromo);
    renderVoucherCards();
  } catch (_) {
    setPromoFeedback('error', t('booking.promo_check_err'));
  } finally {
    btn.textContent = t('booking.promo_apply_btn'); btn.disabled = false;
  }
}

function removePromo() {
  appliedPromo = null; discountAmount = 0;
  const input = document.getElementById('promoInput');
  input.value = ''; input.readOnly = false;
  input.classList.remove('is-valid', 'is-invalid');
  setPromoFeedback('', '');
  updatePriceBreakdown();
  renderVoucherCards();
}

function setPromoFeedback(type, html) {
  const el = document.getElementById('promoFeedback');
  el.className = 'promo-feedback' + (type ? ` ${type}` : ' hidden');
  el.innerHTML = html;
}

// ===== PAYMENT METHODS =====
const PM_ICONS = {
  card: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
    <line x1="6" y1="15" x2="10" y2="15"/>
  </svg>`,

  bank_transfer: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9l9-5 9 5"/>
    <line x1="12" y1="4" x2="12" y2="9"/>
    <rect x="4" y="9" width="3" height="8"/>
    <rect x="10.5" y="9" width="3" height="8"/>
    <rect x="17" y="9" width="3" height="8"/>
    <line x1="2" y1="17" x2="22" y2="17"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>`,

  cash: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 21V9l9-6 9 6v12H3z"/>
    <path d="M9 21v-6h6v6"/>
    <line x1="12" y1="3" x2="12" y2="9"/>
  </svg>`,

  momo: `<svg width="50" height="22" viewBox="0 0 50 22" style="flex-shrink:0">
    <rect width="50" height="22" rx="5" fill="#AF006E"/>
    <text x="25" y="15.5" text-anchor="middle" fill="white"
      font-size="10.5" font-weight="800" font-family="Arial,sans-serif" letter-spacing="0.3">MoMo</text>
  </svg>`,

  vnpay: `<svg width="56" height="22" viewBox="0 0 56 22" style="flex-shrink:0">
    <rect width="56" height="22" rx="5" fill="#003F8F"/>
    <rect x="2" y="2" width="18" height="18" rx="3" fill="#E5101D"/>
    <text x="11" y="15" text-anchor="middle" fill="white"
      font-size="9" font-weight="800" font-family="Arial,sans-serif">VN</text>
    <text x="38" y="15.5" text-anchor="middle" fill="white"
      font-size="10.5" font-weight="800" font-family="Arial,sans-serif" letter-spacing="0.5">PAY</text>
  </svg>`,

  other: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <rect x="3" y="6" width="18" height="13" rx="1"/>
    <circle cx="12" cy="12.5" r="2.5"/>
    <line x1="3" y1="9.5" x2="21" y2="9.5"/>
  </svg>`,
};

async function loadPaymentMethods() {
  try {
    const res  = await fetch('api/payment_methods.php?active=1');
    const data = await res.json();
    activePaymentMethods = data.methods || [];
  } catch (_) {
    // Fallback: default methods if API fails
    activePaymentMethods = [
      { code: 'card',          name_vi: 'Thẻ tín dụng / Ghi nợ',    description: 'Visa · Mastercard · JCB' },
      { code: 'bank_transfer', name_vi: 'Chuyển khoản ngân hàng',    description: 'Vietcombank · BIDV · Techcombank' },
      { code: 'momo',          name_vi: 'Ví điện tử MoMo',           description: 'Quét QR hoặc số điện thoại' },
      { code: 'cash',          name_vi: 'Thanh toán tại khách sạn',  description: 'Tiền mặt hoặc thẻ khi nhận phòng' },
    ];
  }

  if (!activePaymentMethods.length) {
    document.getElementById('pmContainer').innerHTML =
      '<p style="color:var(--muted);font-size:0.85rem;padding:1rem 0">Không có phương thức thanh toán nào khả dụng.</p>';
    return;
  }

  document.getElementById('pmContainer').innerHTML = activePaymentMethods.map((m, i) => `
    <label class="pm-option${i === 0 ? ' active' : ''}">
      <input type="radio" name="pm" value="${m.code}"${i === 0 ? ' checked' : ''}/>
      <div class="pm-body">
        <span class="pm-icon">${PM_ICONS[m.code] || '💳'}</span>
        <span class="pm-name">${m.name_vi}</span>
        ${m.description ? `<span class="pm-brands">${m.description}</span>` : ''}
      </div>
    </label>
  `).join('');

  // Show/hide card form based on first method
  document.getElementById('cardForm').classList.toggle('hidden', activePaymentMethods[0]?.code !== 'card');

  // Bind click handlers
  document.querySelectorAll('.pm-option').forEach(opt => {
    const radio = opt.querySelector('input[type="radio"]');
    opt.addEventListener('click', () => {
      document.querySelectorAll('.pm-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      radio.checked = true;
      document.getElementById('cardForm').classList.toggle('hidden', radio.value !== 'card');
    });
  });
}

// ===== CARD FORMAT =====
function setupCardFormat() {
  const cardNum = document.getElementById('cardNum');
  cardNum.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 16);
    e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
  });
  const cardExp = document.getElementById('cardExp');
  cardExp.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
    e.target.value = v;
  });
}

// ===== STEPS =====
let currentStep = 1;
function setupSteps() {
  document.getElementById('nextToStep2').addEventListener('click', () => {
    if (!validateStep1()) return;
    goStep(2);
  });
  document.getElementById('nextToStep3').addEventListener('click', () => {
    if (!validateStep2()) return;
    buildReview();
    goStep(3);
  });
  document.getElementById('confirmBtn').addEventListener('click', confirmBooking);
}

function goStep(n) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.add('hidden'));
  document.getElementById(`step${n}`).classList.remove('hidden');
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('active','done');
    if (i + 1 < n) s.classList.add('done');
    if (i + 1 === n) s.classList.add('active');
  });
  currentStep = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep1() {
  const req = ['lastName','firstName','email','phone'];
  let ok = true;
  req.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.style.borderBottom = '1px solid #e55';
      ok = false;
    } else el.style.borderBottom = '';
  });
  if (!ok) { alert('Vui lòng điền đầy đủ thông tin bắt buộc!'); }
  return ok;
}

function validateStep2() {
  if (!document.getElementById('agreePolicy').checked) {
    alert('Vui lòng đồng ý với chính sách trước khi tiếp tục!');
    return false;
  }
  const pm = document.querySelector('input[name="pm"]:checked').value;
  if (pm === 'card') {
    const cn = document.getElementById('cardNum').value.replace(/\s/g,'');
    if (cn.length < 16) { alert('Số thẻ không hợp lệ!'); return false; }
    if (!document.getElementById('cardExp').value.match(/^\d{2}\/\d{2}$/)) { alert('Ngày hết hạn không hợp lệ!'); return false; }
    if (document.getElementById('cardCvv').value.length < 3) { alert('CVV không hợp lệ!'); return false; }
  }
  return true;
}

function buildReview() {
  const serviceFee = Math.round((baseTotal + extrasTotal) * serviceFee_pct / 100);
  const grandTotal = Math.max(0, baseTotal + extrasTotal + serviceFee - discountAmount);
  const pm = document.querySelector('input[name="pm"]:checked')?.value || '';
  const pmLabel = (activePaymentMethods.find(m => m.code === pm) || {}).name_vi || pm;
  const rows = [
    [t('booking.rv_guest'), `${document.getElementById('lastName').value} ${document.getElementById('firstName').value}`],
    [t('booking.rv_email'), document.getElementById('email').value],
    [t('booking.rv_phone'), document.getElementById('phone').value],
    [t('booking.rv_hotel'), hotel.name],
    [t('booking.rv_room'), roomType],
    [t('booking.rv_checkin'), formatDate(checkIn)],
    [t('booking.rv_checkout'), formatDate(checkOut)],
    [t('booking.rv_nights'), nights + ' ' + t('booking.nights_unit')],
    [t('booking.rv_guests'), guests + ' ' + t('booking.guests_unit')],
    [t('booking.rv_payment'), pmLabel],
    ...(appliedPromo ? [[t('booking.rv_promo'), `<span style="color:var(--green)">${appliedPromo.code} − ${formatPrice(discountAmount)}</span>`]] : []),
    [t('booking.rv_total'), `<span style="color:var(--gold);font-family:var(--font-serif);font-size:1.2rem">${formatPrice(grandTotal)}</span>`]
  ];
  document.getElementById('reviewBox').innerHTML = rows.map(([k,v]) =>
    `<div class="review-row"><span>${k}</span><strong>${v}</strong></div>`
  ).join('');
}

async function confirmBooking() {
  const btn = document.getElementById('confirmBtn');
  const txt = document.getElementById('confirmBtnText');
  btn.classList.add('loading');
  txt.textContent = t('booking.processing');

  const pm = document.querySelector('input[name="pm"]:checked').value;
  const payload = {
    source:           'website',
    hotel_slug:       hotelSlug,
    hotel_name:       hotel.name,
    room_type:        roomType,
    check_in:         checkIn,
    check_out:        checkOut,
    nights:           nights,
    guests:           guests,
    last_name:        document.getElementById('lastName').value.trim(),
    first_name:       document.getElementById('firstName').value.trim(),
    email:            document.getElementById('email').value.trim(),
    phone:            document.getElementById('phone').value.trim(),
    nationality:      document.getElementById('nationality').value,
    special_requests: document.getElementById('specialReq').value.trim(),
    extra_breakfast:  document.getElementById('extra_breakfast')?.checked ? 1 : 0,
    extra_airport:    document.getElementById('extra_airport')?.checked   ? 1 : 0,
    extra_flowers:    document.getElementById('extra_flowers')?.checked   ? 1 : 0,
    extra_spa:        document.getElementById('extra_spa')?.checked       ? 1 : 0,
    payment_method:   pm,
    promo_code:       appliedPromo ? appliedPromo.code : null,
    discount_amount:  discountAmount,
    price_per_night:  pricePerNight,
    base_total:       baseTotal,
    extras_total:     extrasTotal,
    service_fee:      Math.round((baseTotal + extrasTotal) * serviceFee_pct / 100),
    grand_total:      Math.max(0, baseTotal + extrasTotal + Math.round((baseTotal + extrasTotal) * serviceFee_pct / 100) - discountAmount),
    status:           'pending',
  };

  try {
    const res  = await fetch('api/bookings.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    const data = await res.json();
    const ref  = data.ref_code || ('MT-' + Date.now().toString(36).toUpperCase());

    if (pm === 'bank_transfer') {
      showBankTransferScreen(ref, payload.grand_total);
    } else {
      document.getElementById('successRef').textContent = t('booking.ref_label') + ref;
      document.getElementById('successOverlay').classList.remove('hidden');
    }
  } catch (_) {
    const ref = 'MT-' + Date.now().toString(36).toUpperCase();
    document.getElementById('successRef').textContent = t('booking.ref_label') + ref;
    document.getElementById('successOverlay').classList.remove('hidden');
  } finally {
    btn.classList.remove('loading');
    txt.textContent = t('booking.confirm_btn');
  }
}

// ===== BANK TRANSFER SCREEN =====
let pollTimer = null;

async function showBankTransferScreen(ref, amount) {
  // Lấy thông tin ngân hàng từ server
  let bankInfo = { bank_name: '', account_number: '', account_name: '', bank_bin: '' };
  try {
    const r = await fetch('api/bank_info.php');
    bankInfo = await r.json();
  } catch (_) {}

  const qrAmount   = Math.round(amount);
  const accountNum = bankInfo.account_number || '';
  const accountName= bankInfo.account_name  || '';
  const bankName   = bankInfo.bank_name     || '';

  // Tạo QR SePay (hỗ trợ Virtual Account)
  const qrUrl = accountNum
    ? `https://qr.sepay.vn/img?acc=${accountNum}&bank=${encodeURIComponent(bankName)}&amount=${qrAmount}&des=${encodeURIComponent(ref)}`
    : '';

  // Điền thông tin
  document.getElementById('biBankName').textContent    = bankName;
  document.getElementById('biAccountNum').textContent  = accountNum;
  document.getElementById('biAccountName').textContent = accountName;
  document.getElementById('biAmount').textContent      = formatPrice(amount);
  document.getElementById('biContent').textContent     = ref;
  document.getElementById('bankRef').textContent       = ref;

  if (qrUrl) {
    document.getElementById('bankQrImg').src = qrUrl;
    document.getElementById('bankQrImg').style.display = 'block';
  } else {
    document.getElementById('bankQrImg').style.display = 'none';
  }

  document.getElementById('bankOverlay').classList.remove('hidden');
  document.getElementById('bookingLayout').style.display = 'none';

  // Bắt đầu polling
  startPolling(ref);
}

async function pollOnce(ref) {
  try {
    const r    = await fetch(`api/bookings.php?ref=${ref}&_=${Date.now()}`);
    const data = await r.json();
    if (data.status === 'confirmed' || data.status === 'checked_in') return true;
  } catch (_) {}
  return false;
}

function startPolling(ref) {
  let attempts = 0;
  const maxAttempts = 120; // 6 phút (120 × 3s)

  const run = async () => {
    attempts++;
    if (await pollOnce(ref)) {
      clearInterval(pollTimer);
      showBankConfirmed(ref);
      return;
    }
    if (attempts >= maxAttempts) {
      clearInterval(pollTimer);
      document.getElementById('pollingText').textContent = 'Hết thời gian chờ. Chúng tôi sẽ xác nhận qua email sau khi nhận được thanh toán.';
      document.querySelector('.polling-dot').style.animationPlayState = 'paused';
    }
  };

  run(); // check ngay lập tức
  pollTimer = setInterval(run, 3000); // sau đó mỗi 3 giây
}

function showBankConfirmed(ref) {
  document.getElementById('bankWaiting').classList.add('hidden');
  document.getElementById('bankConfirmed').classList.remove('hidden');
  document.getElementById('bankConfirmedRef').textContent = t('booking.ref_label') + ref;
  // Confetti-like: pulse the success icon
  document.querySelector('#bankConfirmed .success-icon')?.classList.add('pop');
}

function copyText(elId) {
  const text = document.getElementById(elId)?.textContent?.trim() || '';
  const btn  = document.querySelector(`.bi-copy[onclick*="${elId}"]`);
  const flash = () => { if (btn) { const o = btn.textContent; btn.textContent = '✓'; setTimeout(() => btn.textContent = o, 1500); } };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(flash).catch(() => {});
  }
}

// ===== HELPERS =====
function getD(offset) {
  const d = new Date(); d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}
function formatDate(s) {
  if (!s) return '';
  const d = new Date(s);
  return d.toLocaleDateString('vi-VN', { weekday:'short', day:'2-digit', month:'2-digit', year:'numeric' });
}
function formatPrice(n) {
  return new Intl.NumberFormat('vi-VN', { style:'currency', currency:'VND', maximumFractionDigits:0 }).format(n);
}
