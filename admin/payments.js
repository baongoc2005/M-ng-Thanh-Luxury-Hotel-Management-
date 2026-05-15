/* =====================================================
   payments.js — Quản lý thanh toán | Mường Thanh Admin
   ===================================================== */

const API_PAY = '../api/payments.php';
const API_PM  = '../api/payment_methods.php';

let currentPage   = 1;
let totalPages    = 1;
let editingId     = null;
let deletingId    = null;
let pmEditingId   = null;
let pmDeletingId  = null;
let allMethods    = [];   // [{id, code, name_vi, is_active, usage_count, ...}]

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  loadMethods().then(() => {
    populateMethodDropdowns();
    loadPayments();
  });

  // Transaction filters
  ['fStatus','fType','fFrom','fTo'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => { currentPage = 1; loadPayments(); });
  });
  document.getElementById('fMethod').addEventListener('change', () => { currentPage = 1; loadPayments(); });
  let searchTimer;
  document.getElementById('fSearch').addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { currentPage = 1; loadPayments(); }, 400);
  });
  document.getElementById('btnReset').addEventListener('click', resetFilters);
  document.getElementById('btnAddPayment').addEventListener('click', openAddModal);

  // Transaction modal
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('btnCancel').addEventListener('click',  closeModal);
  document.getElementById('payModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
  document.getElementById('payForm').addEventListener('submit', handleSubmit);

  // Delete transaction modal
  document.getElementById('deleteClose').addEventListener('click',     closeDeleteModal);
  document.getElementById('deleteCancelBtn').addEventListener('click', closeDeleteModal);
  document.getElementById('deleteOkBtn').addEventListener('click',     confirmDelete);
  document.getElementById('deleteModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeDeleteModal(); });

  // Payment method modal
  document.getElementById('pmModalClose').addEventListener('click', closePmModal);
  document.getElementById('pmCancelBtn').addEventListener('click',  closePmModal);
  document.getElementById('pmModal').addEventListener('click', e => { if (e.target === e.currentTarget) closePmModal(); });
  document.getElementById('pmForm').addEventListener('submit', handlePmSubmit);
  // Auto-format code field
  document.getElementById('pmCode').addEventListener('input', e => {
    e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  });

  // Delete method modal
  document.getElementById('pmDeleteClose').addEventListener('click',     closePmDeleteModal);
  document.getElementById('pmDeleteCancelBtn').addEventListener('click', closePmDeleteModal);
  document.getElementById('pmDeleteOkBtn').addEventListener('click',     confirmPmDelete);
  document.getElementById('pmDeleteModal').addEventListener('click', e => { if (e.target === e.currentTarget) closePmDeleteModal(); });
});

// ===== TABS =====
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
}

// ===== LOAD PAYMENT METHODS =====
async function loadMethods() {
  try {
    const res  = await fetch(API_PM);
    const data = await res.json();
    allMethods = data.methods || [];
    renderMethodsGrid();
  } catch (err) {
    document.getElementById('pmGrid').innerHTML =
      `<div style="padding:2rem;color:var(--red);font-size:0.8rem">Lỗi tải dữ liệu: ${err.message}</div>`;
  }
}

function renderMethodsGrid() {
  const grid = document.getElementById('pmGrid');
  const cards = allMethods.map(m => {
    const onCls   = m.is_active == 1 ? 'on' : '';
    const cardCls = m.is_active == 1 ? '' : 'inactive';
    return `
    <div class="pm-card ${cardCls}" id="pm-card-${m.id}">
      <div class="pm-card-top">
        <div>
          <div class="pm-code">${escHtml(m.code)}</div>
          <div class="pm-name">${escHtml(m.name_vi)}</div>
        </div>
        <label class="pm-toggle ${onCls}" id="pm-toggle-${m.id}" title="${m.is_active ? 'Đang bật — nhấn để tắt' : 'Đang tắt — nhấn để bật'}">
          <div class="toggle-switch"></div>
        </label>
      </div>
      ${m.description ? `<div class="pm-desc">${escHtml(m.description)}</div>` : ''}
      <div class="pm-stats">
        <span class="pm-stat">Giao dịch: <strong>${m.usage_count || 0}</strong></span>
        <span class="pm-stat">Đã TT: <strong>${fmtMoney(m.total_paid || 0)}</strong></span>
      </div>
      <div class="pm-card-actions">
        <button class="btn-edit" onclick="openPmEditModal(${m.id})">Sửa</button>
        <button class="btn-del"  onclick="askPmDelete(${m.id}, '${escAttr(m.name_vi)}')">Xóa</button>
      </div>
    </div>`;
  }).join('');

  grid.innerHTML = cards + `
    <button class="pm-add-btn" id="btnAddMethod" onclick="openPmAddModal()">
      <span style="font-size:1.2rem;line-height:1">+</span> Thêm phương thức
    </button>`;

  // Bind toggle clicks
  allMethods.forEach(m => {
    document.getElementById(`pm-toggle-${m.id}`).addEventListener('click', () => toggleMethod(m.id, m.is_active));
  });
}

// ===== POPULATE METHOD DROPDOWNS =====
function populateMethodDropdowns() {
  // Filter bar dropdown
  const fSel = document.getElementById('fMethod');
  fSel.innerHTML = '<option value="">Tất cả</option>' +
    allMethods.map(m => `<option value="${escAttr(m.code)}">${escHtml(m.name_vi)}</option>`).join('');

  // Transaction form dropdown (only active methods)
  const pSel = document.getElementById('fPayMethod');
  const active = allMethods.filter(m => m.is_active == 1);
  pSel.innerHTML = active.map(m => `<option value="${escAttr(m.code)}">${escHtml(m.name_vi)}</option>`).join('');
  if (!pSel.options.length) {
    pSel.innerHTML = allMethods.map(m => `<option value="${escAttr(m.code)}">${escHtml(m.name_vi)}</option>`).join('');
  }
}

// ===== TOGGLE METHOD ON/OFF =====
async function toggleMethod(id, currentActive) {
  const newVal = currentActive == 1 ? 0 : 1;
  try {
    await fetch(`${API_PM}?id=${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: newVal }),
    });
    await loadMethods();
    populateMethodDropdowns();
  } catch (err) { alert('Lỗi: ' + err.message); }
}

// ===== PAYMENT METHOD MODAL =====
function openPmAddModal() {
  pmEditingId = null;
  document.getElementById('pmModalTitle').textContent = 'Thêm Phương Thức Thanh Toán';
  document.getElementById('pmSaveBtn').textContent    = 'Thêm';
  document.getElementById('pmForm').reset();
  document.getElementById('pmId').value = '';
  document.getElementById('pmCode').disabled = false;
  document.getElementById('pmModal').classList.remove('hidden');
  document.getElementById('pmCode').focus();
}

function openPmEditModal(id) {
  const m = allMethods.find(x => x.id == id);
  if (!m) return;
  pmEditingId = id;
  document.getElementById('pmModalTitle').textContent = 'Chỉnh Sửa Phương Thức';
  document.getElementById('pmSaveBtn').textContent    = 'Cập nhật';
  document.getElementById('pmId').value     = m.id;
  document.getElementById('pmCode').value   = m.code;
  document.getElementById('pmCode').disabled = true;   // code is immutable after creation
  document.getElementById('pmName').value   = m.name_vi;
  document.getElementById('pmDesc').value   = m.description || '';
  document.getElementById('pmActive').value = m.is_active;
  document.getElementById('pmModal').classList.remove('hidden');
  document.getElementById('pmName').focus();
}

function closePmModal() {
  pmEditingId = null;
  document.getElementById('pmModal').classList.add('hidden');
  document.getElementById('pmCode').disabled = false;
  document.getElementById('pmForm').reset();
}

async function handlePmSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('pmName').value.trim();
  if (!name) { flash('pmName', 'Nhập tên hiển thị'); return; }

  const payload = {
    name_vi:     name,
    description: document.getElementById('pmDesc').value.trim(),
    is_active:   parseInt(document.getElementById('pmActive').value),
  };

  if (!pmEditingId) {
    const code = document.getElementById('pmCode').value.trim();
    if (!code) { flash('pmCode', 'Nhập mã code'); return; }
    payload.code = code;
  }

  const btn = document.getElementById('pmSaveBtn');
  btn.textContent = 'Đang lưu...'; btn.disabled = true;

  try {
    if (pmEditingId) {
      const res = await fetch(`${API_PM}?id=${pmEditingId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) { alert(data.error); return; }
    } else {
      const res = await fetch(API_PM, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) { alert(data.error); return; }
    }
    closePmModal();
    await loadMethods();
    populateMethodDropdowns();
  } catch (err) {
    alert('Lỗi: ' + err.message);
  } finally {
    btn.textContent = pmEditingId ? 'Cập nhật' : 'Thêm';
    btn.disabled = false;
  }
}

// ===== DELETE METHOD =====
function askPmDelete(id, name) {
  pmDeletingId = id;
  document.getElementById('pmDeleteName').textContent = name;
  document.getElementById('pmDeleteModal').classList.remove('hidden');
}
function closePmDeleteModal() {
  pmDeletingId = null;
  document.getElementById('pmDeleteModal').classList.add('hidden');
}
async function confirmPmDelete() {
  if (!pmDeletingId) return;
  try {
    const res  = await fetch(`${API_PM}?id=${pmDeletingId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.error) { alert(data.error); closePmDeleteModal(); return; }
    closePmDeleteModal();
    await loadMethods();
    populateMethodDropdowns();
  } catch (err) { alert('Lỗi: ' + err.message); }
}

// ===== LOAD TRANSACTIONS =====
async function loadPayments() {
  setLoading();
  try {
    const res  = await fetch(API_PAY + '?' + buildParams());
    const data = await res.json();
    renderStats(data.stats || {});
    renderTable(data.payments || []);
    totalPages = data.pages || 1;
    renderPagination(data.total || 0);
    updateResultsInfo(data.total || 0);
  } catch (err) {
    document.getElementById('tableBody').innerHTML =
      `<tr><td colspan="9" class="loading-row" style="color:var(--red)">${tAdm('common.error')}</td></tr>`;
  }
}

function buildParams() {
  const parts  = [`page=${currentPage}`];
  const status = document.getElementById('fStatus').value;
  const method = document.getElementById('fMethod').value;
  const type   = document.getElementById('fType').value;
  const search = document.getElementById('fSearch').value.trim();
  const from   = document.getElementById('fFrom').value;
  const to     = document.getElementById('fTo').value;
  if (status) parts.push(`status=${status}`);
  if (method) parts.push(`method=${encodeURIComponent(method)}`);
  if (type)   parts.push(`type=${type}`);
  if (search) parts.push(`search=${encodeURIComponent(search)}`);
  if (from)   parts.push(`from=${from}`);
  if (to)     parts.push(`to=${to}`);
  return parts.join('&');
}

// ===== RENDER STATS =====
function renderStats(s) {
  document.getElementById('statRevenue').textContent     = fmtMoney(s.revenue      || 0);
  document.getElementById('statPaidCount').textContent   = fmtNum(s.cnt_paid      || 0);
  document.getElementById('statPendingCount').textContent= fmtNum(s.cnt_pending   || 0);
  document.getElementById('statRefundCount').textContent = fmtNum(s.cnt_refunded  || 0);
}

// ===== RENDER TABLE =====
function renderTable(list) {
  if (!list.length) {
    document.getElementById('tableBody').innerHTML =
      `<tr><td colspan="9" class="loading-row">${tAdm('pay.no_data')}</td></tr>`;
    return;
  }
  document.getElementById('tableBody').innerHTML = list.map(p => {
    const isRefund  = p.type === 'refund';
    const methodName = (allMethods.find(m => m.code === p.method) || {}).name_vi || p.method;
    return `<tr>
      <td><span class="ref-code">${escHtml(p.ref_code)}</span></td>
      <td>${typeBadgeHtml(p.type)}</td>
      <td><span class="pay-amount${isRefund ? ' is-refund' : ''}">${isRefund ? '−' : ''}${fmtMoney(p.amount)}</span></td>
      <td><span class="pay-method-tag">${escHtml(methodName)}</span></td>
      <td>${statusBadgeHtml(p.status)}</td>
      <td><span class="pay-date">${fmtDate(p.created_at)}</span></td>
      <td><span class="pay-date">${p.paid_at ? fmtDate(p.paid_at) : '—'}</span></td>
      <td><span class="pay-note" title="${escAttr(p.note || '')}">${escHtml(p.note || '—')}</span></td>
      <td>
        <div class="action-btns">
          ${p.status === 'pending' ? `<button class="btn-mark-paid" onclick="markPaid(${p.id})">${tAdm('status.confirmed')}</button>` : ''}
          <button class="btn-edit" onclick="openEditModal(${p.id})">${tAdm('stf.edit')}</button>
          <button class="btn-del"  onclick="askDelete(${p.id}, '${escAttr(p.ref_code)}')">${tAdm('prm.delete')}</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ===== BADGES =====
function typeBadgeHtml(type) {
  const isVi = (localStorage.getItem('lang') || 'vi') === 'vi';
  const map = {
    deposit: ['type-deposit', isVi ? 'Đặt cọc'  : 'Deposit'],
    balance: ['type-balance', isVi ? 'Còn lại'  : 'Balance'],
    full:    ['type-full',    isVi ? 'Toàn bộ'  : 'Full'],
    refund:  ['type-refund',  tAdm('pay.stat_refund')],
    other:   ['type-other',   tAdm('stf.role_other')],
  };
  const [cls, lbl] = map[type] || ['type-other', type];
  return `<span class="pay-type-badge ${cls}">${lbl}</span>`;
}
function statusBadgeHtml(status) {
  const map = {
    paid:     ['status-paid',     tAdm('status.confirmed')],
    pending:  ['status-pending',  tAdm('status.pending')],
    refunded: ['status-refunded', tAdm('pay.stat_refund')],
    failed:   ['status-failed',   tAdm('common.failed')],
  };
  const [cls, lbl] = map[status] || ['status-failed', status];
  return `<span class="pay-status-badge ${cls}">${lbl}</span>`;
}

// ===== QUICK MARK PAID =====
async function markPaid(id) {
  try {
    await fetch(`${API_PAY}?id=${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'paid' }),
    });
    loadPayments();
  } catch (err) { alert('Lỗi: ' + err.message); }
}

// ===== TRANSACTION MODAL =====
function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Ghi Nhận Thanh Toán';
  document.getElementById('btnSave').textContent    = 'Lưu giao dịch';
  document.getElementById('payForm').reset();
  document.getElementById('payId').value = '';
  document.getElementById('payModal').classList.remove('hidden');
  document.getElementById('fRefCode').focus();
}

async function openEditModal(id) {
  try {
    const res  = await fetch(`${API_PAY}?page=1`);
    const data = await res.json();
    const p    = (data.payments || []).find(x => x.id == id);
    if (!p) { alert('Không tìm thấy giao dịch.'); return; }

    editingId = id;
    document.getElementById('modalTitle').textContent = 'Chỉnh Sửa Giao Dịch';
    document.getElementById('btnSave').textContent    = 'Cập nhật';
    document.getElementById('payId').value       = p.id;
    document.getElementById('fRefCode').value    = p.ref_code || '';
    document.getElementById('fBookingId').value  = p.booking_id || '';
    document.getElementById('fPayType').value    = p.type   || 'deposit';
    document.getElementById('fPayMethod').value  = p.method || '';
    document.getElementById('fAmount').value     = p.amount || '';
    document.getElementById('fPayStatus').value  = p.status || 'pending';
    document.getElementById('fNote').value       = p.note   || '';
    document.getElementById('fPaidAt').value     = p.paid_at ? p.paid_at.replace(' ', 'T').substring(0, 16) : '';
    document.getElementById('payModal').classList.remove('hidden');
  } catch (err) { alert('Lỗi: ' + err.message); }
}

function closeModal() {
  editingId = null;
  document.getElementById('payModal').classList.add('hidden');
  document.getElementById('payForm').reset();
}

async function handleSubmit(e) {
  e.preventDefault();
  const ref    = document.getElementById('fRefCode').value.trim();
  const amount = parseFloat(document.getElementById('fAmount').value);
  if (!ref)              { flash('fRefCode', 'Nhập mã tham chiếu'); return; }
  if (!amount || amount <= 0) { flash('fAmount', 'Nhập số tiền hợp lệ'); return; }

  const paidAt  = document.getElementById('fPaidAt').value;
  const payload = {
    ref_code:   ref,
    booking_id: document.getElementById('fBookingId').value || null,
    type:       document.getElementById('fPayType').value,
    method:     document.getElementById('fPayMethod').value,
    amount,
    status:     document.getElementById('fPayStatus').value,
    note:       document.getElementById('fNote').value.trim() || null,
    paid_at:    paidAt ? paidAt.replace('T', ' ') : null,
  };

  const btn = document.getElementById('btnSave');
  btn.textContent = 'Đang lưu...'; btn.disabled = true;

  try {
    const url = editingId ? `${API_PAY}?id=${editingId}` : API_PAY;
    const res  = await fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.error) { alert(data.error); return; }
    closeModal();
    loadPayments();
  } catch (err) {
    alert('Lỗi lưu dữ liệu: ' + err.message);
  } finally {
    btn.textContent = editingId ? 'Cập nhật' : 'Lưu giao dịch';
    btn.disabled = false;
  }
}

// ===== DELETE TRANSACTION =====
function askDelete(id, ref) {
  deletingId = id;
  document.getElementById('deleteRef').textContent = ref;
  document.getElementById('deleteModal').classList.remove('hidden');
}
function closeDeleteModal() {
  deletingId = null;
  document.getElementById('deleteModal').classList.add('hidden');
}
async function confirmDelete() {
  if (!deletingId) return;
  try { await fetch(`${API_PAY}?id=${deletingId}`, { method: 'DELETE' }); }
  catch (err) { alert('Lỗi: ' + err.message); }
  closeDeleteModal();
  loadPayments();
}

// ===== RESET FILTERS =====
function resetFilters() {
  ['fStatus','fMethod','fType','fSearch','fFrom','fTo'].forEach(id => { document.getElementById(id).value = ''; });
  currentPage = 1;
  loadPayments();
}

// ===== PAGINATION =====
function renderPagination(total) {
  const container = document.getElementById('pagination');
  container.innerHTML = '';
  if (totalPages <= 1) return;
  const makeBtn = (label, page, active = false, disabled = false) => {
    const btn = document.createElement('button');
    btn.className   = 'page-btn' + (active ? ' active' : '');
    btn.textContent = label;
    btn.disabled    = disabled;
    if (!disabled) btn.addEventListener('click', () => { currentPage = page; loadPayments(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    return btn;
  };
  container.appendChild(makeBtn('‹', currentPage - 1, false, currentPage === 1));
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= currentPage - 2 && p <= currentPage + 2)) {
      container.appendChild(makeBtn(p, p, p === currentPage));
    } else if (p === currentPage - 3 || p === currentPage + 3) {
      const d = document.createElement('span');
      d.textContent = '…'; d.style.cssText = 'color:var(--muted);padding:0 0.3rem;line-height:36px;';
      container.appendChild(d);
    }
  }
  container.appendChild(makeBtn('›', currentPage + 1, false, currentPage === totalPages));
}

function updateResultsInfo(total) {
  const perPage = 25;
  const from = Math.min((currentPage - 1) * perPage + 1, total);
  const to   = Math.min(currentPage * perPage, total);
  document.getElementById('resultsInfo').innerHTML =
    total > 0 ? `<strong>${from}–${to}</strong> / <strong>${total}</strong>` : tAdm('pay.no_data');
}

// ===== HELPERS =====
function setLoading() {
  document.getElementById('tableBody').innerHTML =
    `<tr><td colspan="9" class="loading-row">${tAdm('common.loading')}</td></tr>`;
}

function fmtMoney(n) {
  const v = parseFloat(n) || 0;
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + ' tỷ';
  if (v >= 1_000_000)     return (v / 1_000_000).toFixed(1) + ' tr';
  return v.toLocaleString('vi-VN') + ' đ';
}
function fmtNum(n) { return parseInt(n || 0).toLocaleString('vi-VN'); }
function fmtDate(s) {
  if (!s) return '—';
  const d = new Date(s);
  return isNaN(d) ? s : d.toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });
}
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
function escAttr(s) { return String(s).replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }
function flash(id, msg) {
  const el = document.getElementById(id);
  el.style.borderColor = 'var(--red)'; el.focus(); el.placeholder = msg;
  setTimeout(() => { el.style.borderColor = ''; }, 1800);
}
