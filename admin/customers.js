/* ===================================================
   customers.js — Quản Lý Khách Hàng — Mường Thanh
   =================================================== */
const API = '../api/customers.php';

let currentPage   = 1;
let totalPages    = 1;
let totalCustomers = 0;
let totalVip      = 0;
let totalRevenue  = 0;
let searchTimer   = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadCustomers();

  document.getElementById('fSearch').addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { currentPage = 1; loadCustomers(); }, 380);
  });
  document.getElementById('fVip').addEventListener('change', () => {
    currentPage = 1; loadCustomers();
  });
  document.getElementById('btnReset').addEventListener('click', resetFilters);
  document.getElementById('detailClose').addEventListener('click', closeDetailModal);
  document.getElementById('detailModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDetailModal();
  });
});

// ===== HELPERS =====
function formatPrice(n) {
  if (!n && n !== 0) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

function formatDate(str) {
  if (!str) return '—';
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function escHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function initials(first, last) {
  const f = (first || '').trim();
  const l = (last  || '').trim();
  const src = (l + ' ' + f).trim();
  const parts = src.split(' ').filter(Boolean);
  if (!parts.length) return '?';
  return parts[parts.length - 1].charAt(0).toUpperCase();
}

function statusLabel(s) {
  const map = {
    pending: tAdm('status.pending'), confirmed: tAdm('status.confirmed'),
    cancelled: tAdm('status.cancelled'), checked_in: tAdm('status.checked_in'),
    checked_out: tAdm('status.checked_out')
  };
  return map[s] || s;
}

// ===== LOAD CUSTOMERS =====
async function loadCustomers() {
  const search = document.getElementById('fSearch').value.trim();
  const vip    = document.getElementById('fVip').value;

  document.getElementById('tableBody').innerHTML =
    `<tr><td colspan="10" class="loading-row">${tAdm('common.loading')}</td></tr>`;

  let url = `${API}?page=${currentPage}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (vip !== '') url += `&vip=${vip}`;

  try {
    const res  = await fetch(url);
    const data = await res.json();

    totalCustomers = data.total || 0;
    totalPages     = data.pages || 1;

    renderStats(data.globalStats || {});
    renderTable(data.customers || []);
    renderPagination();

  } catch (err) {
    console.error(err);
    document.getElementById('tableBody').innerHTML =
      `<tr><td colspan="10" class="loading-row" style="color:var(--red)">${tAdm('common.error')}</td></tr>`;
  }
}

// ===== RENDER STATS =====
function renderStats(g) {
  document.getElementById('statTotal').textContent   = g.total_all   || totalCustomers || 0;
  document.getElementById('statVip').textContent     = g.vip_count   || 0;
  document.getElementById('statRevenue').textContent = formatPrice(g.total_revenue || 0);
}

// ===== RENDER TABLE =====
function renderTable(customers) {
  const tbody = document.getElementById('tableBody');
  const offset = (currentPage - 1) * 20;

  document.getElementById('resultsInfo').innerHTML =
    `<strong>${customers.length}</strong> / <strong>${totalCustomers}</strong>`;

  if (!customers.length) {
    tbody.innerHTML = `<tr><td colspan="10" class="loading-row">${tAdm('cus.no_data')}</td></tr>`;
    return;
  }

  tbody.innerHTML = customers.map((c, i) => {
    const fullName  = [c.last_name, c.first_name].filter(Boolean).join(' ') || '—';
    const vipClass  = c.vip == 1 ? '' : ' off';
    const vipTitle  = c.vip == 1 ? 'Bỏ VIP' : 'Đặt VIP';
    const lastBook  = c.last_booking ? formatDate(c.last_booking) : '—';
    const notesVal  = escHtml(c.notes || '');

    return `<tr>
      <td style="color:var(--muted);font-size:0.75rem">${offset + i + 1}</td>
      <td class="name-cell" data-id="${c.id}" title="Xem lịch sử đặt phòng">
        <div class="cust-name">${escHtml(fullName)}</div>
      </td>
      <td style="font-size:0.78rem">${escHtml(c.email || '—')}</td>
      <td style="font-size:0.78rem">${escHtml(c.phone || '—')}</td>
      <td style="font-size:0.78rem">${escHtml(c.nationality || '—')}</td>
      <td style="font-size:0.85rem;text-align:center">${c.total_bookings || 0}</td>
      <td class="price-cell" style="font-size:0.9rem">${formatPrice(c.total_spent)}</td>
      <td style="font-size:0.75rem;color:var(--muted);white-space:nowrap">${lastBook}</td>
      <td style="text-align:center">
        <span class="vip-star${vipClass}" data-id="${c.id}" data-vip="${c.vip == 1 ? 1 : 0}" title="${vipTitle}">★</span>
      </td>
      <td>
        <input class="notes-inline" type="text" data-id="${c.id}"
          value="${notesVal}" placeholder="Thêm ghi chú..."/>
      </td>
    </tr>`;
  }).join('');

  // Attach events: row click → detail modal
  tbody.querySelectorAll('.name-cell').forEach(cell => {
    cell.addEventListener('click', () => openDetailModal(cell.dataset.id));
  });

  // VIP toggle
  tbody.querySelectorAll('.vip-star').forEach(star => {
    star.addEventListener('click', e => {
      e.stopPropagation();
      toggleVip(star);
    });
  });

  // Notes save on blur / enter
  tbody.querySelectorAll('.notes-inline').forEach(inp => {
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') { inp.blur(); }
    });
    inp.addEventListener('blur', () => saveNotes(inp));
  });
}

// ===== TOGGLE VIP =====
async function toggleVip(starEl) {
  const id    = starEl.dataset.id;
  const isVip = starEl.dataset.vip === '1';
  const newVip = isVip ? 0 : 1;

  starEl.style.opacity = '0.4';
  try {
    const res = await fetch(`${API}?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vip: newVip })
    });
    const data = await res.json();
    if (data.success) {
      starEl.dataset.vip = newVip;
      if (newVip === 1) {
        starEl.classList.remove('off');
        starEl.title = 'Bỏ VIP';
      } else {
        starEl.classList.add('off');
        starEl.title = 'Đặt VIP';
      }
    }
  } catch (err) {
    console.error('VIP update failed:', err);
  }
  starEl.style.opacity = '';
}

// ===== SAVE NOTES =====
async function saveNotes(inp) {
  const id    = inp.dataset.id;
  const notes = inp.value;
  const orig  = inp.getAttribute('data-orig');
  if (orig === notes) return; // no change

  inp.setAttribute('data-orig', notes);
  try {
    await fetch(`${API}?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });
  } catch (err) {
    console.error('Notes save failed:', err);
  }
}

// Track original notes value on focus
document.addEventListener('focusin', e => {
  if (e.target.classList.contains('notes-inline')) {
    e.target.setAttribute('data-orig', e.target.value);
  }
});

// ===== DETAIL MODAL =====
async function openDetailModal(id) {
  document.getElementById('detailModal').classList.remove('hidden');
  document.getElementById('detailContent').innerHTML =
    `<div class="detail-loading">${tAdm('common.loading')}</div>`;

  try {
    const res  = await fetch(`${API}?id=${id}`);
    const data = await res.json();
    const c    = data.customer;
    if (!c) throw new Error('No data');
    renderDetailContent(c);
  } catch (err) {
    document.getElementById('detailContent').innerHTML =
      `<div class="detail-loading" style="color:var(--red)">${tAdm('common.error')}</div>`;
  }
}

function renderDetailContent(c) {
  const fullName   = [c.last_name, c.first_name].filter(Boolean).join(' ') || '—';
  const bookings   = c.bookings || [];
  const totalSpent = bookings.reduce((s, b) => s + parseFloat(b.grand_total || 0), 0);
  const totalNights = bookings.reduce((s, b) => {
    if (b.check_in && b.check_out) {
      const n = Math.round((new Date(b.check_out) - new Date(b.check_in)) / 86400000);
      return s + (n > 0 ? n : 0);
    }
    return s;
  }, 0);

  document.getElementById('detailModalTitle').textContent = tAdm('cus.detail_title');

  const vipBadge = c.vip == 1
    ? '<span style="color:var(--gold);font-size:1.1rem" title="Khách VIP">★</span>'
    : '';

  const bookingRows = bookings.length ? bookings.map(b => {
    const nights = (b.check_in && b.check_out)
      ? Math.round((new Date(b.check_out) - new Date(b.check_in)) / 86400000)
      : 0;
    const sCls = `cb-status s-${b.status || 'pending'}`;
    return `<div class="cust-booking-item">
      <div>
        <div class="cb-hotel">${escHtml(b.hotel_name || '—')}</div>
        <div class="cb-room">${escHtml(b.room_type || '')}</div>
      </div>
      <div class="cb-dates">
        ${formatDate(b.check_in)} → ${formatDate(b.check_out)}
        ${nights ? `<span style="color:var(--gold)"> · ${nights} ${tAdm('bk.nights_label')}</span>` : ''}
      </div>
      <div class="cb-price">${formatPrice(b.grand_total)}</div>
      <div><span class="${sCls}">${statusLabel(b.status)}</span></div>
      <div class="cb-ref">${escHtml(b.ref_code || b.id || '')}</div>
    </div>`;
  }).join('') : `<div class="cust-no-bookings">${tAdm('cus.no_bookings')}</div>`;

  document.getElementById('detailContent').innerHTML = `
    <div class="cust-detail-header">
      <div class="cust-avatar">${initials(c.first_name, c.last_name)}</div>
      <div class="cust-detail-info">
        <div class="cust-detail-name">${escHtml(fullName)} ${vipBadge}</div>
        <div class="cust-detail-meta">
          <span>${escHtml(c.email || '—')}</span>
          ${c.phone ? `<span>📞 ${escHtml(c.phone)}</span>` : ''}
          ${c.nationality ? `<span>🌏 ${escHtml(c.nationality)}</span>` : ''}
          ${c.notes ? `<span style="font-style:italic">"${escHtml(c.notes)}"</span>` : ''}
        </div>
      </div>
    </div>
    <div class="cust-kpi-row">
      <div class="cust-kpi">
        <div class="cust-kpi-val">${bookings.length}</div>
        <div class="cust-kpi-lbl">${tAdm('cus.kpi_bookings')}</div>
      </div>
      <div class="cust-kpi">
        <div class="cust-kpi-val">${totalNights}</div>
        <div class="cust-kpi-lbl">${tAdm('cus.kpi_nights')}</div>
      </div>
      <div class="cust-kpi">
        <div class="cust-kpi-val" style="font-size:1rem">${formatPrice(totalSpent)}</div>
        <div class="cust-kpi-lbl">${tAdm('cus.kpi_spent')}</div>
      </div>
      <div class="cust-kpi">
        <div class="cust-kpi-val" style="color:${c.vip==1?'var(--gold)':'var(--muted)'}">${c.vip==1?'★ ' + tAdm('cus.vip_label') : tAdm('cus.standard_label')}</div>
        <div class="cust-kpi-lbl">${tAdm('cus.kpi_tier')}</div>
      </div>
    </div>
    <div class="cust-bookings-wrap">
      <div class="cust-bookings-title">${tAdm('cus.booking_history')}</div>
      ${bookingRows}
    </div>
  `;
}

function closeDetailModal() {
  document.getElementById('detailModal').classList.add('hidden');
}

// ===== PAGINATION =====
function renderPagination() {
  const pg = document.getElementById('pagination');
  if (totalPages <= 1) { pg.innerHTML = ''; return; }

  let html = '';
  if (currentPage > 1) {
    html += `<button class="page-btn" data-page="${currentPage - 1}">‹</button>`;
  }

  const range = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      range.push(i);
    } else if (range[range.length - 1] !== '…') {
      range.push('…');
    }
  }

  range.forEach(p => {
    if (p === '…') {
      html += `<button class="page-btn" disabled style="cursor:default;opacity:0.4">…</button>`;
    } else {
      html += `<button class="page-btn${p === currentPage ? ' active' : ''}" data-page="${p}">${p}</button>`;
    }
  });

  if (currentPage < totalPages) {
    html += `<button class="page-btn" data-page="${currentPage + 1}">›</button>`;
  }

  pg.innerHTML = html;
  pg.querySelectorAll('.page-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page);
      loadCustomers();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// ===== RESET FILTERS =====
function resetFilters() {
  document.getElementById('fSearch').value = '';
  document.getElementById('fVip').value    = '';
  currentPage = 1;
  loadCustomers();
}
