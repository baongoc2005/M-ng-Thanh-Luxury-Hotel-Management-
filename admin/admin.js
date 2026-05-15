const API = '../api/bookings.php';

// ===== STATE =====
let state = { source: '', status: '', dateFrom: '', dateTo: '', search: '', page: 1 };
let searchTimer;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  populateHotelSelect();
  attachFilters();
  attachModal();
  fetchBookings();
});

// ===== FETCH =====
function buildQuery() {
  const q = new URLSearchParams({ page: state.page, per_page: 30 });
  if (state.source)   q.set('source',    state.source);
  if (state.status)   q.set('status',    state.status);
  if (state.dateFrom) q.set('date_from', state.dateFrom);
  if (state.dateTo)   q.set('date_to',   state.dateTo);
  if (state.search)   q.set('search',    state.search);
  return q.toString();
}

async function fetchBookings() {
  document.getElementById('resultsInfo').textContent = tAdm('common.loading');
  document.getElementById('tableBody').innerHTML =
    `<tr><td colspan="9" class="loading-row">${tAdm('common.loading')}</td></tr>`;

  try {
    const res  = await fetch(API + '?' + buildQuery());
    const data = await res.json();
    renderStats(data.stats);
    renderTable(data.bookings);
    renderPagination(data.total_pages, data.total, data.page, data.bookings.length);
  } catch (e) {
    document.getElementById('tableBody').innerHTML =
      `<tr><td colspan="9" class="loading-row">⚠️ ${tAdm('common.error')}</td></tr>`;
  }
}

// ===== RENDER STATS =====
function renderStats(s) {
  if (!s) return;
  document.getElementById('statTotal').textContent     = fNum(s.total);
  document.getElementById('statRevenue').textContent   = fPrice(s.revenue);
  document.getElementById('statPending').textContent   = fNum(s.pending);
  document.getElementById('statConfirmed').textContent = fNum(s.confirmed);

  const srcData = [
    { key: 'website',     label: 'Web',      color: '#c9a96e', val: s.src_website   },
    { key: 'booking_com', label: 'Booking',  color: '#5b9cf6', val: s.src_booking   },
    { key: 'traveloka',   label: 'Traveloka',color: '#f0924a', val: s.src_traveloka },
    { key: 'agoda',       label: 'Agoda',    color: '#e05555', val: s.src_agoda     },
    { key: 'hotline',     label: 'Hotline',  color: '#4caf7d', val: s.src_hotline   },
    { key: 'zalo',        label: 'Zalo',     color: '#00b8d4', val: s.src_zalo      },
    { key: 'facebook',    label: 'Facebook', color: '#7b9de0', val: s.src_facebook  },
    { key: 'other',       label: 'Khác',     color: '#888',    val: s.src_other     },
  ];
  document.getElementById('statSources').innerHTML = srcData
    .filter(x => parseInt(x.val) > 0)
    .map(x => `
      <div class="src-pill">
        <span class="src-dot" style="background:${x.color}"></span>
        <span>${x.label}: <strong style="color:${x.color}">${x.val}</strong></span>
      </div>`)
    .join('');
}

// ===== RENDER TABLE =====
function renderTable(bookings) {
  if (!bookings.length) {
    document.getElementById('tableBody').innerHTML =
      `<tr><td colspan="9" class="loading-row">${tAdm('bk.no_bookings')}</td></tr>`;
    return;
  }
  document.getElementById('tableBody').innerHTML = bookings.map(b => `
    <tr>
      <td><span class="ref-code">${b.ref_code}</span></td>
      <td><span class="badge-src src-${b.source}">${srcLabel(b.source)}</span></td>
      <td>
        <div class="guest-name">${esc(b.last_name)} ${esc(b.first_name)}</div>
        <div class="guest-contact">${esc(b.phone)} · ${esc(b.email)}</div>
      </td>
      <td>
        <div class="hotel-name">${esc(b.hotel_name)}</div>
        <div class="room-name">${esc(b.room_type)}</div>
      </td>
      <td>
        <div class="date-main">${fDate(b.check_in)}</div>
      </td>
      <td>
        <div class="date-main">${fDate(b.check_out)}</div>
        <div class="date-nights">${b.nights} ${tAdm('bk.nights_label')} · ${b.guests} ${tAdm('bk.guests_label')}</div>
      </td>
      <td><span class="price-cell">${fPrice(b.grand_total)}</span></td>
      <td>
        <select class="status-select s-${b.status}" data-id="${b.id}" onchange="updateStatus(this)">
          <option value="pending"     ${b.status==='pending'     ?'selected':''}>${tAdm('status.pending')}</option>
          <option value="confirmed"   ${b.status==='confirmed'   ?'selected':''}>${tAdm('status.confirmed')}</option>
          <option value="cancelled"   ${b.status==='cancelled'   ?'selected':''}>${tAdm('status.cancelled')}</option>
          <option value="checked_in"  ${b.status==='checked_in'  ?'selected':''}>${tAdm('status.checked_in')}</option>
          <option value="checked_out" ${b.status==='checked_out' ?'selected':''}>${tAdm('status.checked_out')}</option>
        </select>
      </td>
      <td><span class="notes-cell" title="${esc(b.notes||'')}">${esc(b.notes||'—')}</span></td>
    </tr>
  `).join('');
}

// ===== UPDATE STATUS =====
async function updateStatus(sel) {
  const id     = sel.dataset.id;
  const status = sel.value;
  sel.className = `status-select s-${status}`;
  try {
    await fetch(`${API}?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  } catch (e) {
    alert(tAdm('common.failed'));
  }
}

// ===== PAGINATION =====
function renderPagination(totalPages, total, page, shown) {
  document.getElementById('resultsInfo').innerHTML =
    `<strong>${shown}</strong> / <strong>${total}</strong> · ${page}/${totalPages || 1}`;

  const cont = document.getElementById('pagination');
  if (totalPages <= 1) { cont.innerHTML = ''; return; }
  cont.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1)
    .map(p => `<button class="page-btn${p===page?' active':''}" onclick="goPage(${p})">${p}</button>`)
    .join('');
}
function goPage(p) { state.page = p; fetchBookings(); window.scrollTo({ top: 0, behavior: 'smooth' }); }

// ===== FILTERS =====
function attachFilters() {
  document.getElementById('fSource').addEventListener('change',  e => { state.source   = e.target.value; state.page = 1; fetchBookings(); });
  document.getElementById('fStatus').addEventListener('change',  e => { state.status   = e.target.value; state.page = 1; fetchBookings(); });
  document.getElementById('fDateFrom').addEventListener('change',e => { state.dateFrom = e.target.value; state.page = 1; fetchBookings(); });
  document.getElementById('fDateTo').addEventListener('change',  e => { state.dateTo   = e.target.value; state.page = 1; fetchBookings(); });
  document.getElementById('fSearch').addEventListener('input',   e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.search = e.target.value; state.page = 1; fetchBookings(); }, 400);
  });
  document.getElementById('btnReset').addEventListener('click', () => {
    state = { source: '', status: '', dateFrom: '', dateTo: '', search: '', page: 1 };
    ['fSource','fStatus','fDateFrom','fDateTo'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('fSearch').value = '';
    fetchBookings();
  });
}

// ===== MODAL =====
function attachModal() {
  const overlay   = document.getElementById('modalOverlay');
  const form      = document.getElementById('manualForm');
  const mCheckIn  = document.getElementById('mCheckIn');
  const mCheckOut = document.getElementById('mCheckOut');
  const mNights   = document.getElementById('mNights');
  const mPrice    = document.getElementById('mPriceNight');
  const mTotal    = document.getElementById('mGrandTotal');

  document.getElementById('btnAddManual').addEventListener('click', () => overlay.classList.remove('hidden'));
  document.getElementById('modalClose').addEventListener('click',   () => overlay.classList.add('hidden'));
  document.getElementById('btnCancel').addEventListener('click',    () => overlay.classList.add('hidden'));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.add('hidden'); });

  // Tự tính số đêm khi thay ngày
  function recalc() {
    if (mCheckIn.value && mCheckOut.value) {
      const n = Math.max(1, Math.round((new Date(mCheckOut.value) - new Date(mCheckIn.value)) / 86400000));
      mNights.value = n;
      if (mPrice.value) mTotal.value = parseInt(mPrice.value) * n;
    }
  }
  mCheckIn.addEventListener('change', recalc);
  mCheckOut.addEventListener('change', recalc);
  mPrice.addEventListener('input', () => { if (mNights.value) mTotal.value = parseInt(mPrice.value||0) * parseInt(mNights.value); });

  // Thay phòng theo khách sạn
  document.getElementById('mHotelSlug').addEventListener('change', function() {
    const hotel = HOTELS_DB.find(h => h.slug === this.value);
    const roomSel = document.getElementById('mRoomType');
    roomSel.innerHTML = hotel
      ? hotel.rooms.map(r => `<option value="${r.type}">${r.type} — ${fPrice(r.price)}/đêm</option>`).join('')
      : '<option>—</option>';
    if (hotel) { mPrice.value = hotel.rooms[0]?.price || 0; recalc(); }
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());
    const hotel = HOTELS_DB.find(h => h.slug === body.hotel_slug);
    body.hotel_name = hotel?.name ?? body.hotel_slug;
    body.base_total = body.grand_total;
    body.extras_total = 0;
    body.service_fee  = 0;
    body.email = body.email || '';
    body.nationality = 'VN';

    try {
      const res  = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) {
        overlay.classList.add('hidden');
        form.reset();
        fetchBookings();
        alert(`✅ Đã lưu đơn ${data.ref_code}`);
      }
    } catch (e) {
      alert('Lỗi khi lưu đơn!');
    }
  });
}

// ===== POPULATE HOTEL SELECT =====
function populateHotelSelect() {
  const sel = document.getElementById('mHotelSlug');
  if (!window.HOTELS_DB) return;
  sel.innerHTML = HOTELS_DB.map(h =>
    `<option value="${h.slug}">${h.name}</option>`
  ).join('');
  // Trigger để load phòng đầu tiên
  sel.dispatchEvent(new Event('change'));
}

// ===== HELPERS =====
function srcLabel(src) {
  const map = { website:'Web', booking_com:'Booking', traveloka:'Traveloka',
    agoda:'Agoda', hotline:'Hotline', zalo:'Zalo', facebook:'Facebook', other:'Khác' };
  return map[src] ?? src;
}
function fPrice(n) {
  return new Intl.NumberFormat('vi-VN', { style:'currency', currency:'VND', maximumFractionDigits:0 }).format(n||0);
}
function fNum(n) { return Number(n||0).toLocaleString('vi-VN'); }
function fDate(s) {
  if (!s) return '—';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });
}
function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
