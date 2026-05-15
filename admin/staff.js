/* ===================================================
   staff.js — Quản Lý Nhân Viên — Mường Thanh
   =================================================== */
const API_STAFF  = '../api/staff.php';
const API_HOTELS = '../api/hotels.php';

let allStaff    = [];
let allHotels   = [];
let editingId   = null;
let pendingDeactivateId = null;

function getRoleLabels() {
  return {
    manager:      tAdm('stf.role_manager'),
    receptionist: tAdm('stf.role_receptionist'),
    housekeeping: tAdm('stf.role_housekeeping'),
    concierge:    tAdm('stf.role_concierge'),
    security:     tAdm('stf.role_security'),
    other:        tAdm('stf.role_other'),
  };
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  Promise.all([loadHotels(), loadStaff()]);

  document.getElementById('btnAddStaff').addEventListener('click', openAddModal);
  document.getElementById('modalClose').addEventListener('click',  closeModal);
  document.getElementById('btnCancel').addEventListener('click',   closeModal);
  document.getElementById('staffForm').addEventListener('submit',  saveStaff);
  document.getElementById('staffModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  document.getElementById('confirmClose').addEventListener('click',     closeConfirmModal);
  document.getElementById('confirmCancelBtn').addEventListener('click', closeConfirmModal);
  document.getElementById('confirmOkBtn').addEventListener('click',     confirmDeactivate);
  document.getElementById('confirmModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeConfirmModal();
  });

  document.getElementById('fHotel').addEventListener('change',  renderTable);
  document.getElementById('fRole').addEventListener('change',   renderTable);
  document.getElementById('fStatus').addEventListener('change', renderTable);
  document.getElementById('fSearch').addEventListener('input',  renderTable);
  document.getElementById('btnReset').addEventListener('click', resetFilters);
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

function roleBadge(role) {
  const label = getRoleLabels()[role] || role || tAdm('stf.role_other');
  const cls   = `role-badge role-${role || 'other'}`;
  return `<span class="${cls}">${escHtml(label)}</span>`;
}

// ===== LOAD HOTELS =====
async function loadHotels() {
  try {
    const res  = await fetch(API_HOTELS + '?all=1');
    const data = await res.json();
    allHotels  = data.hotels || [];
  } catch {
    allHotels = [];
  }
  populateHotelSelects();
}

function populateHotelSelects() {
  // Filter bar
  const filterSel = document.getElementById('fHotel');
  const currentFilter = filterSel.value;
  filterSel.innerHTML = '<option value="">Tất cả khách sạn</option>';
  allHotels.forEach(h => {
    filterSel.innerHTML += `<option value="${h.id}"${h.id == currentFilter ? ' selected' : ''}>${escHtml(h.name)}</option>`;
  });

  // Modal hotel select
  const modalSel = document.getElementById('fHotelId');
  const currentModal = modalSel.value;
  modalSel.innerHTML = '<option value="">— Chọn khách sạn —</option>';
  allHotels.forEach(h => {
    modalSel.innerHTML += `<option value="${h.id}"${h.id == currentModal ? ' selected' : ''}>${escHtml(h.name)}</option>`;
  });
}

// ===== LOAD STAFF =====
async function loadStaff() {
  document.getElementById('tableBody').innerHTML =
    `<tr><td colspan="8" class="loading-row">${tAdm('common.loading')}</td></tr>`;
  try {
    const res  = await fetch(API_STAFF + '?all=1');
    const data = await res.json();
    allStaff   = data.staff || [];
  } catch {
    allStaff = [];
    document.getElementById('tableBody').innerHTML =
      `<tr><td colspan="8" class="loading-row" style="color:var(--red)">${tAdm('common.error')}</td></tr>`;
    return;
  }
  renderStats();
  renderTable();
}

// ===== STATS =====
function renderStats() {
  const active   = allStaff.filter(s => s.active == 1).length;
  const inactive = allStaff.filter(s => s.active == 0).length;
  const managers = allStaff.filter(s => s.role === 'manager').length;

  document.getElementById('statTotal').textContent    = allStaff.length;
  document.getElementById('statActive').textContent   = active;
  document.getElementById('statInactive').textContent = inactive;
  document.getElementById('statManagers').textContent = managers;
}

// ===== FILTER =====
function filtered() {
  const hotel  = document.getElementById('fHotel').value;
  const role   = document.getElementById('fRole').value;
  const status = document.getElementById('fStatus').value;
  const q      = document.getElementById('fSearch').value.toLowerCase().trim();

  return allStaff.filter(s => {
    if (hotel  && String(s.hotel_id) !== hotel)  return false;
    if (role   && s.role !== role)                return false;
    if (status !== '' && String(s.active) !== status) return false;
    if (q) {
      const hay = [s.full_name, s.email, s.phone, s.hotel_name].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

// ===== RENDER TABLE =====
function renderTable() {
  const list  = filtered();
  const tbody = document.getElementById('tableBody');

  document.getElementById('resultsInfo').innerHTML =
    `<strong>${list.length}</strong> / <strong>${allStaff.length}</strong>`;

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="loading-row">${tAdm('stf.no_data')}</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(s => {
    const rowCls    = s.active == 1 ? '' : ' row-inactive';
    const statusCls = s.active == 1 ? 'active' : 'inactive';
    const statusTxt = s.active == 1 ? tAdm('stf.stat_working') : tAdm('stf.stat_inactive');

    const actionBtns = s.active == 1
      ? `<button class="btn-edit"       data-id="${s.id}">${tAdm('stf.edit')}</button>
         <button class="btn-deactivate" data-id="${s.id}" data-name="${escHtml(s.full_name)}">${tAdm('stf.deactivate')}</button>`
      : `<button class="btn-edit"       data-id="${s.id}">${tAdm('stf.edit')}</button>
         <button class="btn-restore"    data-id="${s.id}">${tAdm('stf.restore')}</button>`;

    return `<tr class="${rowCls}">
      <td>
        <div class="staff-name">${escHtml(s.full_name || '—')}</div>
      </td>
      <td style="font-size:0.78rem">${escHtml(s.hotel_name || '—')}</td>
      <td>${roleBadge(s.role)}</td>
      <td style="font-size:0.75rem;color:var(--muted)">${escHtml(s.email || '—')}</td>
      <td style="font-size:0.78rem">${escHtml(s.phone || '—')}</td>
      <td style="font-size:0.75rem;color:var(--muted);white-space:nowrap">${formatDate(s.joined_date)}</td>
      <td><span class="status-dot ${statusCls}">${statusTxt}</span></td>
      <td>
        <div class="action-btns">${actionBtns}</div>
      </td>
    </tr>`;
  }).join('');

  // Attach events
  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.id)));
  });
  tbody.querySelectorAll('.btn-deactivate').forEach(btn => {
    btn.addEventListener('click', () => openConfirmModal(parseInt(btn.dataset.id), btn.dataset.name));
  });
  tbody.querySelectorAll('.btn-restore').forEach(btn => {
    btn.addEventListener('click', () => restoreStaff(parseInt(btn.dataset.id)));
  });
}

// ===== MODAL: ADD =====
function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Thêm Nhân Viên Mới';
  document.getElementById('staffId').value      = '';
  document.getElementById('fFullName').value    = '';
  document.getElementById('fHotelId').value     = '';
  document.getElementById('fRole').value        = 'receptionist';
  document.getElementById('fEmail').value       = '';
  document.getElementById('fPhone').value       = '';
  document.getElementById('fJoinedDate').value  = '';
  document.getElementById('fActive').value      = '1';
  document.getElementById('fNotes').value       = '';
  document.getElementById('staffModal').classList.remove('hidden');
  document.getElementById('fFullName').focus();
}

// ===== MODAL: EDIT =====
function openEditModal(id) {
  const s = allStaff.find(x => x.id == id);
  if (!s) return;
  editingId = id;

  document.getElementById('modalTitle').textContent   = 'Chỉnh Sửa Nhân Viên';
  document.getElementById('staffId').value             = s.id;
  document.getElementById('fFullName').value           = s.full_name || '';
  document.getElementById('fHotelId').value            = s.hotel_id || '';
  document.getElementById('fRole').value               = s.role || 'receptionist';
  document.getElementById('fEmail').value              = s.email || '';
  document.getElementById('fPhone').value              = s.phone || '';
  document.getElementById('fActive').value             = s.active == 1 ? '1' : '0';
  document.getElementById('fNotes').value              = s.notes || '';

  // Date format: API returns YYYY-MM-DD or datetime
  let jd = s.joined_date || '';
  if (jd && jd.includes(' ')) jd = jd.split(' ')[0]; // strip time part
  document.getElementById('fJoinedDate').value = jd;

  document.getElementById('staffModal').classList.remove('hidden');
  document.getElementById('fFullName').focus();
}

function closeModal() {
  document.getElementById('staffModal').classList.add('hidden');
  editingId = null;
}

// ===== SAVE STAFF =====
async function saveStaff(e) {
  e.preventDefault();

  const fullName = document.getElementById('fFullName').value.trim();
  if (!fullName) {
    document.getElementById('fFullName').focus();
    return;
  }

  const payload = {
    full_name:   fullName,
    hotel_id:    document.getElementById('fHotelId').value   || null,
    role:        document.getElementById('fRole').value       || 'receptionist',
    email:       document.getElementById('fEmail').value.trim(),
    phone:       document.getElementById('fPhone').value.trim(),
    joined_date: document.getElementById('fJoinedDate').value || null,
    active:      parseInt(document.getElementById('fActive').value),
    notes:       document.getElementById('fNotes').value.trim()
  };

  const btnSave = document.getElementById('btnSave');
  btnSave.textContent = 'Đang lưu...';
  btnSave.disabled    = true;

  try {
    let res, data;
    if (editingId) {
      res  = await fetch(`${API_STAFF}?id=${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      res  = await fetch(API_STAFF, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    data = await res.json();

    if (data.success || data.id) {
      closeModal();
      await loadStaff();
    } else {
      alert(tAdm('common.failed') + (data.error ? ': ' + data.error : ''));
    }
  } catch (err) {
    console.error(err);
    alert('Lỗi kết nối, vui lòng thử lại');
  }

  btnSave.textContent = 'Lưu nhân viên';
  btnSave.disabled    = false;
}

// ===== CONFIRM DEACTIVATE =====
function openConfirmModal(id, name) {
  pendingDeactivateId = id;
  document.getElementById('confirmName').textContent = name;
  document.getElementById('confirmModal').classList.remove('hidden');
}

function closeConfirmModal() {
  document.getElementById('confirmModal').classList.add('hidden');
  pendingDeactivateId = null;
}

async function confirmDeactivate() {
  if (!pendingDeactivateId) return;

  const btn = document.getElementById('confirmOkBtn');
  btn.textContent = 'Đang xử lý...';
  btn.disabled    = true;

  try {
    const res  = await fetch(`${API_STAFF}?id=${pendingDeactivateId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      closeConfirmModal();
      await loadStaff();
    } else {
      alert('Lỗi: ' + (data.error || 'Không thể cập nhật'));
    }
  } catch (err) {
    console.error(err);
    alert('Lỗi kết nối, vui lòng thử lại');
  }

  btn.textContent = 'Xác nhận nghỉ việc';
  btn.disabled    = false;
}

// ===== RESTORE STAFF =====
async function restoreStaff(id) {
  try {
    const res  = await fetch(`${API_STAFF}?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: 1 })
    });
    const data = await res.json();
    if (data.success) {
      await loadStaff();
    } else {
      alert('Lỗi: ' + (data.error || 'Không thể khôi phục'));
    }
  } catch (err) {
    console.error(err);
    alert('Lỗi kết nối, vui lòng thử lại');
  }
}

// ===== RESET FILTERS =====
function resetFilters() {
  document.getElementById('fHotel').value  = '';
  document.getElementById('fRole').value   = '';
  document.getElementById('fStatus').value = '1';
  document.getElementById('fSearch').value = '';
  renderTable();
}
