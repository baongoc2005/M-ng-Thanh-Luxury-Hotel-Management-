/* ===================================================
   promotions.js — Quản lý khuyến mãi | Mường Thanh Admin
   =================================================== */

const API_PROMOS = '../api/promotions.php';

let allPromos   = [];
let editingId   = null;
let deletingId  = null;

const TODAY = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadPromotions();

  // Header button
  document.getElementById('btnAddPromo').addEventListener('click', openAddModal);

  // Filter listeners
  document.getElementById('fStatus').addEventListener('change',  renderFiltered);
  document.getElementById('fApplies').addEventListener('change', renderFiltered);
  document.getElementById('fType').addEventListener('change',    renderFiltered);
  document.getElementById('fSearch').addEventListener('input',   renderFiltered);
  document.getElementById('btnReset').addEventListener('click',  resetFilters);

  // Modal controls
  document.getElementById('modalClose').addEventListener('click',  closeModal);
  document.getElementById('btnCancel').addEventListener('click',   closeModal);
  document.getElementById('promoForm').addEventListener('submit',  savePromo);

  // Delete modal controls
  document.getElementById('deleteModalClose').addEventListener('click', closeDeleteModal);
  document.getElementById('deleteCancelBtn').addEventListener('click',  closeDeleteModal);
  document.getElementById('deleteConfirmBtn').addEventListener('click', confirmDelete);

  // Overlay click to close
  document.getElementById('promoModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.getElementById('deleteModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDeleteModal();
  });

  // Auto-uppercase code input
  document.getElementById('fCode').addEventListener('input', function () {
    const pos   = this.selectionStart;
    this.value  = this.value.toUpperCase();
    this.setSelectionRange(pos, pos);
  });

  // Toggle active text
  document.getElementById('fActive').addEventListener('change', function () {
    const txt = document.getElementById('activeStatusText');
    txt.textContent = this.checked ? tAdm('prm.active') : tAdm('prm.inactive');
    txt.className   = 'toggle-status-text' + (this.checked ? ' on' : '');
  });
});

// ===== LOAD PROMOTIONS =====
async function loadPromotions() {
  try {
    const res  = await fetch(API_PROMOS);
    const data = await res.json();
    allPromos  = data.promotions || [];
  } catch (err) {
    allPromos  = [];
    document.getElementById('tableBody').innerHTML =
      `<tr><td colspan="8" class="loading-row" style="color:var(--red)">${tAdm('common.error')}</td></tr>`;
    return;
  }
  renderStats();
  renderFiltered();
}

// ===== STATS =====
function renderStats() {
  const total  = allPromos.length;
  const active = allPromos.filter(p => p.active == 1 && promoStatus(p) === 'active').length;

  // Sum used_count for active promos
  const usedMonth = allPromos
    .filter(p => p.active == 1)
    .reduce((sum, p) => sum + (parseInt(p.used_count) || 0), 0);

  // Expiring within 7 days
  const soon = new Date(TODAY);
  soon.setDate(soon.getDate() + 7);
  const expiringSoon = allPromos.filter(p => {
    if (!p.valid_to || p.active != 1) return false;
    const vt = new Date(p.valid_to);
    return vt >= new Date(TODAY) && vt <= soon;
  }).length;

  document.getElementById('statTotal').textContent       = total;
  document.getElementById('statActive').textContent      = active;
  document.getElementById('statUsedMonth').textContent   = usedMonth;
  document.getElementById('statExpiringSoon').textContent = expiringSoon;
}

// ===== FILTER + RENDER =====
function getFiltered() {
  const status  = document.getElementById('fStatus').value;
  const applies = document.getElementById('fApplies').value;
  const type    = document.getElementById('fType').value;
  const search  = document.getElementById('fSearch').value.toLowerCase().trim();

  return allPromos.filter(p => {
    const ps = promoStatus(p);

    if (status) {
      if (status === 'active'   && ps !== 'active')   return false;
      if (status === 'inactive' && ps !== 'inactive') return false;
      if (status === 'expired'  && ps !== 'expired')  return false;
      if (status === 'upcoming' && ps !== 'upcoming') return false;
    }

    if (applies && p.applies_to !== applies) return false;
    if (type    && p.discount_type !== type) return false;

    if (search) {
      const hay = ((p.code || '') + ' ' + (p.name || '')).toLowerCase();
      if (!hay.includes(search)) return false;
    }

    return true;
  });
}

function renderFiltered() {
  const list = getFiltered();
  document.getElementById('resultsInfo').innerHTML =
    `<strong>${list.length}</strong> / ${allPromos.length}`;
  renderTable(list);
}

// ===== RENDER TABLE =====
function renderTable(list) {
  if (!list.length) {
    document.getElementById('tableBody').innerHTML =
      `<tr><td colspan="8" class="loading-row">${tAdm('prm.no_data')}</td></tr>`;
    return;
  }

  document.getElementById('tableBody').innerHTML = list.map(p => {
    const status  = promoStatus(p);
    const badge   = promoStatusBadge(p, status);
    const disc    = discountDisplay(p);
    const applies = appliesBadge(p.applies_to);
    const validity = validityDisplay(p);
    const usage    = usageDisplay(p);
    const isActive = p.active == 1;

    return `<tr>
      <td><span class="promo-code">${escHtml(p.code)}</span></td>
      <td>
        <div style="font-weight:500;font-size:0.85rem">${escHtml(p.name)}</div>
        ${p.min_nights > 1 ? `<div class="min-nights-cell">Tối thiểu ${p.min_nights} đêm</div>` : ''}
      </td>
      <td>${disc}</td>
      <td>${applies}</td>
      <td>${validity}</td>
      <td>${usage}</td>
      <td>${badge}</td>
      <td>
        <div class="action-btns">
          <button class="btn-edit-promo" onclick="openEditModal(${p.id})">${tAdm('prm.edit')}</button>
          <button class="btn-toggle-promo ${isActive ? 'is-active' : ''}"
                  onclick="togglePromo(${p.id}, ${isActive ? 0 : 1})">
            ${isActive ? tAdm('prm.inactive') : tAdm('prm.active')}
          </button>
          <button class="btn-del-promo" onclick="askDelete(${p.id}, '${escAttr(p.code)}')">${tAdm('prm.delete')}</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ===== PROMO STATUS LOGIC =====
function promoStatus(p) {
  if (!p.active || p.active == 0) return 'inactive';
  if (p.valid_to   && p.valid_to   < TODAY) return 'expired';
  if (p.valid_from && p.valid_from > TODAY) return 'upcoming';
  return 'active';
}

function promoStatusBadge(p, status) {
  const map = {
    active:   ['badge-active',   tAdm('prm.active')],
    inactive: ['badge-inactive', tAdm('prm.inactive')],
    expired:  ['badge-expired',  tAdm('prm.expired')],
    upcoming: ['badge-upcoming', tAdm('prm.upcoming')],
  };
  const [cls, label] = map[status] || ['badge-inactive', status];
  return `<span class="badge-promo ${cls}">${label}</span>`;
}

// ===== DISCOUNT DISPLAY =====
function discountDisplay(p) {
  const isPercent = p.discount_type === 'percent';
  const val = isPercent
    ? `${parseFloat(p.discount_value)}%`
    : formatPrice(p.discount_value);
  return `<div class="discount-val">${val}</div>
          <div class="discount-type-label">${isPercent ? 'Phần trăm' : 'Số tiền cố định'}</div>`;
}

// ===== APPLIES BADGE =====
function appliesBadge(val) {
  const map = {
    all:        ['applies-all',        'Tất cả'],
    luxury:     ['applies-luxury',     'Luxury'],
    grand:      ['applies-grand',      'Grand'],
    holiday:    ['applies-holiday',    'Holiday'],
    muongthanh: ['applies-muongthanh', 'Mường Thanh'],
  };
  const [cls, label] = map[val] || ['applies-all', val || 'Tất cả'];
  return `<span class="applies-badge ${cls}">${label}</span>`;
}

// ===== VALIDITY DISPLAY =====
function validityDisplay(p) {
  const from = p.valid_from ? formatDate(p.valid_from) : null;
  const to   = p.valid_to   ? formatDate(p.valid_to)   : null;

  if (!from && !to) return `<span style="color:var(--muted);font-size:0.78rem">${tAdm('prm.unlimited')}</span>`;
  if (from && to)  return `<div class="validity-range">${from}<span class="date-sep">→</span>${to}</div>`;
  if (from)        return `<div class="validity-range">Từ ${from}</div>`;
  return `<div class="validity-range">Đến ${to}</div>`;
}

// ===== USAGE DISPLAY =====
function usageDisplay(p) {
  const used  = parseInt(p.used_count)  || 0;
  const limit = parseInt(p.usage_limit) || 0;

  if (limit === 0) {
    return `<div class="usage-wrap">
      <div class="usage-text">${used} lần</div>
      <div class="usage-unlimited">${tAdm('prm.unlimited')}</div>
    </div>`;
  }

  const pct  = Math.min(100, Math.round((used / limit) * 100));
  const color = pct >= 90 ? 'var(--red)' : pct >= 70 ? 'var(--orange)' : 'var(--gold)';
  return `<div class="usage-wrap">
    <div class="usage-text">${used} / ${limit}</div>
    <div class="usage-bar-bg">
      <div class="usage-bar-fill" style="width:${pct}%;background:${color}"></div>
    </div>
  </div>`;
}

// ===== MODAL: ADD =====
function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Tạo Mã Khuyến Mãi';
  document.getElementById('promoForm').reset();
  document.getElementById('promoId').value = '';
  document.getElementById('fCode').value  = '';
  document.getElementById('fMinNights').value = 1;
  document.getElementById('fUsageLimit').value = 0;
  document.getElementById('fActive').checked = true;
  document.getElementById('activeStatusText').textContent = 'Đang hoạt động';
  document.getElementById('activeStatusText').className   = 'toggle-status-text on';
  document.getElementById('promoModal').classList.remove('hidden');
  setTimeout(() => document.getElementById('fCode').focus(), 100);
}

// ===== MODAL: EDIT =====
function openEditModal(id) {
  const p = allPromos.find(x => x.id == id);
  if (!p) return;
  editingId = id;

  document.getElementById('modalTitle').textContent = 'Chỉnh Sửa Khuyến Mãi';
  document.getElementById('promoId').value          = id;
  document.getElementById('fCode').value            = p.code  || '';
  document.getElementById('fName').value            = p.name  || '';
  document.getElementById('fDiscountType').value    = p.discount_type  || 'percent';
  document.getElementById('fDiscountValue').value   = p.discount_value || '';
  document.getElementById('fMinNights').value       = p.min_nights     || 1;
  document.getElementById('fAppliesTo').value       = p.applies_to     || 'all';
  document.getElementById('fValidFrom').value       = p.valid_from     || '';
  document.getElementById('fValidTo').value         = p.valid_to       || '';
  document.getElementById('fUsageLimit').value      = p.usage_limit    || 0;

  const isActive = p.active == 1;
  document.getElementById('fActive').checked = isActive;
  document.getElementById('activeStatusText').textContent = isActive ? 'Đang hoạt động' : 'Đã tắt';
  document.getElementById('activeStatusText').className   = 'toggle-status-text' + (isActive ? ' on' : '');

  document.getElementById('promoModal').classList.remove('hidden');
}

function closeModal() {
  editingId = null;
  document.getElementById('promoModal').classList.add('hidden');
}

// ===== SAVE =====
async function savePromo(e) {
  e.preventDefault();

  const code = document.getElementById('fCode').value.trim().toUpperCase();
  if (!code) {
    flashInvalid('fCode', 'Vui lòng nhập mã khuyến mãi');
    return;
  }

  const name = document.getElementById('fName').value.trim();
  if (!name) {
    flashInvalid('fName', 'Vui lòng nhập tên khuyến mãi');
    return;
  }

  const discVal = parseFloat(document.getElementById('fDiscountValue').value);
  if (!discVal || discVal <= 0) {
    flashInvalid('fDiscountValue', 'Vui lòng nhập giá trị giảm hợp lệ');
    return;
  }

  const payload = {
    name,
    discount_type:  document.getElementById('fDiscountType').value,
    discount_value: discVal,
    min_nights:     parseInt(document.getElementById('fMinNights').value)  || 1,
    applies_to:     document.getElementById('fAppliesTo').value,
    valid_from:     document.getElementById('fValidFrom').value || null,
    valid_to:       document.getElementById('fValidTo').value   || null,
    usage_limit:    parseInt(document.getElementById('fUsageLimit').value) || 0,
    active:         document.getElementById('fActive').checked ? 1 : 0,
  };

  // Only include code for new promos (code is immutable after creation for data integrity)
  if (!editingId) payload.code = code;

  const btn       = document.getElementById('btnSave');
  btn.textContent = 'Đang lưu...';
  btn.disabled    = true;

  try {
    if (editingId) {
      const res = await fetch(`${API_PROMOS}?id=${editingId}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Cập nhật thất bại');
    } else {
      const res = await fetch(API_PROMOS, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Tạo mã thất bại');
      }
    }
    closeModal();
    await loadPromotions();
  } catch (err) {
    alert('Lỗi: ' + err.message);
  } finally {
    btn.textContent = 'Lưu mã';
    btn.disabled    = false;
  }
}

// ===== TOGGLE ACTIVE =====
async function togglePromo(id, newActive) {
  try {
    await fetch(`${API_PROMOS}?id=${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ active: newActive }),
    });
    await loadPromotions();
  } catch (err) {
    alert('Lỗi cập nhật: ' + err.message);
  }
}

// ===== DELETE =====
function askDelete(id, code) {
  deletingId = id;
  document.getElementById('deletePromoCode').textContent = code;
  document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
  deletingId = null;
  document.getElementById('deleteModal').classList.add('hidden');
}

async function confirmDelete() {
  if (!deletingId) return;
  try {
    await fetch(`${API_PROMOS}?id=${deletingId}`, { method: 'DELETE' });
  } catch (err) {
    alert('Lỗi xóa: ' + err.message);
  }
  closeDeleteModal();
  await loadPromotions();
}

// ===== RESET FILTERS =====
function resetFilters() {
  document.getElementById('fStatus').value  = '';
  document.getElementById('fApplies').value = '';
  document.getElementById('fType').value    = '';
  document.getElementById('fSearch').value  = '';
  renderFiltered();
}

// ===== HELPERS =====
function formatPrice(n) {
  const num = parseFloat(n) || 0;
  return new Intl.NumberFormat('vi-VN', {
    style:               'currency',
    currency:            'VND',
    maximumFractionDigits: 0,
  }).format(num);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  // dateStr is YYYY-MM-DD from DB
  const [y, m, d] = dateStr.split('-');
  if (!y || !m || !d) return dateStr;
  return `${d}/${m}/${y}`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}

function escAttr(str) {
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function flashInvalid(fieldId, msg) {
  const el = document.getElementById(fieldId);
  if (!el) return;
  el.style.borderBottomColor = 'var(--red)';
  el.focus();
  if (msg) {
    const tip = document.createElement('div');
    tip.textContent = msg;
    tip.style.cssText = 'font-size:0.65rem;color:var(--red);margin-top:0.2rem;';
    el.parentNode.appendChild(tip);
    setTimeout(() => { tip.remove(); el.style.borderBottomColor = ''; }, 2500);
  }
}
