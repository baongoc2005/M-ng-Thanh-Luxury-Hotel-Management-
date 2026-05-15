const API = '../api/hotels.php';

let allHotels     = [];
let editingId     = null;
let pendingDeleteId = null;
let newRoomCounter  = 0;
let galleryPaths  = [];   // tất cả đường dẫn ảnh đã upload
let mainImagePath = '';   // luôn = galleryPaths[0]
let dragSrcIndex  = -1;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadHotels();

  document.getElementById('btnAddHotel').addEventListener('click', openAddModal);
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('btnCancel').addEventListener('click', closeModal);
  document.getElementById('hotelForm').addEventListener('submit', saveHotel);
  document.getElementById('btnAddRoom').addEventListener('click', addNewRoomRow);
  document.getElementById('fImageFile').addEventListener('change', handleFilesSelected);

  document.getElementById('deleteClose').addEventListener('click', closeDeleteModal);
  document.getElementById('deleteCancelBtn').addEventListener('click', closeDeleteModal);
  document.getElementById('deleteConfirmBtn').addEventListener('click', confirmDelete);

  document.getElementById('fBrand').addEventListener('change', renderTable);
  document.getElementById('fRegion').addEventListener('change', renderTable);
  document.getElementById('fStatus').addEventListener('change', renderTable);
  document.getElementById('fSearch').addEventListener('input', renderTable);
  document.getElementById('btnReset').addEventListener('click', resetFilters);
});

// ===== LOAD =====
async function loadHotels() {
  try {
    const res = await fetch(API + '?all=1');
    const data = await res.json();
    allHotels = data.hotels || [];
  } catch {
    allHotels = [];
  }
  renderStats();
  renderTable();
}

// ===== STATS =====
function renderStats() {
  const active = allHotels.filter(h => h.active == 1).length;
  const totalRooms = allHotels.reduce((s, h) => s + (h.rooms ? h.rooms.length : 0), 0);
  const prices = allHotels.filter(h => h.price > 0).map(h => parseInt(h.price));
  const avgPrice = prices.length ? Math.round(prices.reduce((a,b)=>a+b,0)/prices.length) : 0;

  document.getElementById('statTotal').textContent = allHotels.length;
  document.getElementById('statActive').textContent = active;
  document.getElementById('statRooms').textContent = totalRooms;
  document.getElementById('statAvgPrice').textContent = avgPrice ? formatPrice(avgPrice) : '—';
}

// ===== FILTER & RENDER TABLE =====
function filtered() {
  const brand  = document.getElementById('fBrand').value;
  const region = document.getElementById('fRegion').value;
  const status = document.getElementById('fStatus').value;
  const search = document.getElementById('fSearch').value.toLowerCase();

  return allHotels.filter(h => {
    if (brand  && h.brand  !== brand)  return false;
    if (region && h.region !== region) return false;
    if (status !== '' && String(h.active) !== status) return false;
    if (search) {
      const hay = (h.name + ' ' + h.city + ' ' + h.province).toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });
}

function renderTable() {
  const list = filtered();
  document.getElementById('resultsInfo').innerHTML = `<strong>${list.length}</strong> / ${allHotels.length}`;

  const BRAND_LABEL = { luxury:'Luxury', grand:'Grand', holiday:'Holiday', muongthanh:'Mường Thanh' };
  const REGION_LABEL = { north:'Miền Bắc', central:'Miền Trung', south:'Miền Nam' };

  const rows = list.map(h => {
    const stars = '★'.repeat(parseInt(h.stars) || 4);
    const brand = h.brand || 'luxury';
    const roomCount = h.rooms ? h.rooms.length : 0;
    const isActive = h.active == 1;

    return `<tr>
      <td><img class="hotel-thumb" src="../${h.image || 'img/hero.png'}" alt="" onerror="this.src='../img/hero.png'"/></td>
      <td>
        <div class="hotel-name">${h.name}</div>
        <div class="room-name">${h.slug}</div>
      </td>
      <td><span class="brand-badge brand-${brand}">${BRAND_LABEL[brand]||brand}</span></td>
      <td>
        <div>${h.city}</div>
        <div class="room-name">${REGION_LABEL[h.region]||h.region}</div>
      </td>
      <td><span class="stars-cell">${stars}</span></td>
      <td class="price-cell">${h.price > 0 ? formatPrice(h.price) : '—'}</td>
      <td>${h.rating ? h.rating + ' ★' : '—'}</td>
      <td>${roomCount}</td>
      <td><span class="status-pill ${isActive ? 'status-active' : 'status-inactive'}">${isActive ? tAdm('htl.active') : tAdm('htl.inactive')}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-edit" onclick="openEditModal(${h.id})">${tAdm('htl.edit')}</button>
          ${isActive
            ? `<button class="btn-hide" onclick="askDelete(${h.id}, '${h.name.replace(/'/g,"\\'")}')">—</button>`
            : `<button class="btn-restore" onclick="restoreHotel(${h.id})">${tAdm('stf.restore')}</button>`
          }
        </div>
      </td>
    </tr>`;
  }).join('');

  document.getElementById('tableBody').innerHTML = rows || `<tr><td colspan="10" class="loading-row">${tAdm('htl.no_data')}</td></tr>`;
}

function resetFilters() {
  document.getElementById('fBrand').value = '';
  document.getElementById('fRegion').value = '';
  document.getElementById('fStatus').value = '';
  document.getElementById('fSearch').value = '';
  renderTable();
}

// ===== MODAL OPEN/CLOSE =====
function openAddModal() {
  editingId = null;
  newRoomCounter = 0;
  document.getElementById('modalTitle').textContent = 'Thêm Khách Sạn Mới';
  document.getElementById('hotelForm').reset();
  document.getElementById('hotelId').value = '';
  document.getElementById('roomsList').innerHTML = '';
  initGallery([], '');
  uncheckAllAmenities();
  addNewRoomRow();
  document.getElementById('hotelModal').classList.remove('hidden');
}

function openEditModal(id) {
  const hotel = allHotels.find(h => h.id == id);
  if (!hotel) return;
  editingId = id;
  newRoomCounter = 0;

  document.getElementById('modalTitle').textContent = 'Chỉnh Sửa Khách Sạn';
  document.getElementById('hotelId').value = id;
  document.getElementById('fName').value = hotel.name || '';
  document.getElementById('fBrandF').value = hotel.brand || 'luxury';
  document.getElementById('fStars').value = hotel.stars || 4;
  document.getElementById('fCity').value = hotel.city || '';
  document.getElementById('fProvince').value = hotel.province || '';
  document.getElementById('fRegionF').value = hotel.region || 'north';
  document.getElementById('fPrice').value = hotel.price || '';
  document.getElementById('fDesc').value = hotel.description || '';

  // Gallery: ưu tiên field gallery từ API, fallback về ảnh chính
  const gal = Array.isArray(hotel.gallery) && hotel.gallery.length
    ? hotel.gallery
    : (hotel.image ? [hotel.image] : []);
  initGallery(gal, hotel.image || gal[0] || '');

  // Amenities
  uncheckAllAmenities();
  const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : (hotel.amenities ? hotel.amenities.split(',') : []);
  amenities.forEach(a => {
    const cb = document.querySelector(`input[name="amenities"][value="${a.trim()}"]`);
    if (cb) cb.checked = true;
  });

  // Rooms
  renderExistingRooms(hotel.rooms || []);

  document.getElementById('hotelModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('hotelModal').classList.add('hidden');
}

function uncheckAllAmenities() {
  document.querySelectorAll('input[name="amenities"]').forEach(cb => cb.checked = false);
}

// ===== GALLERY =====
function initGallery(paths, main) {
  galleryPaths  = [...paths];
  mainImagePath = main || paths[0] || '';
  document.getElementById('fImageFile').value = '';
  setStatus('', '');
  renderGallery();
}

function renderGallery() {
  mainImagePath = galleryPaths[0] || '';
  document.getElementById('fImagePath').value    = mainImagePath;
  document.getElementById('fGalleryPaths').value = galleryPaths.join(',');

  const grid = document.getElementById('imgGallery');
  grid.innerHTML = '';

  galleryPaths.forEach((p, i) => {
    const item = document.createElement('div');
    item.className = 'gal-item' + (i === 0 ? ' is-main' : '');
    item.draggable = true;
    item.innerHTML = `<img src="../${p}" onerror="this.src='../img/hero.png'"/>
      <div class="gal-badge">★ Ảnh chính</div>
      <button type="button" class="gal-remove">✕</button>`;

    item.querySelector('.gal-remove').addEventListener('click', e => {
      e.stopPropagation();
      removeGalleryItem(p);
    });

    item.addEventListener('dragstart', e => {
      dragSrcIndex = i;
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => item.classList.add('dragging'), 0);
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      grid.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    });
    item.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      grid.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
      if (i !== dragSrcIndex) item.classList.add('drag-over');
    });
    item.addEventListener('drop', e => {
      e.preventDefault();
      if (dragSrcIndex === -1 || dragSrcIndex === i) return;
      const [moved] = galleryPaths.splice(dragSrcIndex, 1);
      galleryPaths.splice(i, 0, moved);
      renderGallery();
    });

    grid.appendChild(item);
  });
}

function removeGalleryItem(path) {
  galleryPaths = galleryPaths.filter(p => p !== path);
  if (mainImagePath === path) {
    mainImagePath = galleryPaths[0] || '';
  }
  renderGallery();
}

async function handleFilesSelected(e) {
  const files = [...e.target.files];
  if (!files.length) return;

  setStatus(`Đang tải lên ${files.length} ảnh...`, 'uploading');

  let ok = 0, fail = 0;
  for (const file of files) {
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res  = await fetch('../api/upload.php', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.path) {
        galleryPaths.push(data.path);
        if (!mainImagePath) mainImagePath = data.path;
        ok++;
      } else { fail++; }
    } catch { fail++; }
  }

  document.getElementById('fImageFile').value = '';
  renderGallery();
  if (fail === 0) setStatus(`Đã tải lên ${ok} ảnh`, 'ok');
  else setStatus(`${ok} ảnh thành công, ${fail} thất bại`, 'err');
}

function setStatus(msg, type) {
  const el = document.getElementById('uploadStatus');
  el.textContent = msg;
  el.className = 'upload-status' + (msg ? ' ' + type : ' hidden');
}

// ===== ROOMS =====
function renderExistingRooms(rooms) {
  const list = document.getElementById('roomsList');
  list.innerHTML = rooms.map(r => `
    <div class="room-row-form" data-room-id="${r.id}">
      <div class="cell"><input type="text" name="room_type" value="${r.type}" placeholder="Deluxe Room"/></div>
      <div class="cell"><input type="number" name="room_price" value="${r.price}" placeholder="1850000" min="0"/></div>
      <div class="cell"><input type="number" name="room_size" value="${r.size}" placeholder="42" min="1"/></div>
      <div class="cell">
        <select name="room_beds">
          <option ${r.beds==='King'?'selected':''}>King</option>
          <option ${r.beds==='Twin/King'?'selected':''}>Twin/King</option>
          <option ${r.beds==='Twin'?'selected':''}>Twin</option>
          <option ${r.beds==='Twin+King'?'selected':''}>Twin+King</option>
          <option ${r.beds==='Queen'?'selected':''}>Queen</option>
        </select>
      </div>
      <button type="button" class="btn-del-room" onclick="removeRoomRow(this, ${r.id})">✕</button>
    </div>
  `).join('');
}

function addNewRoomRow() {
  newRoomCounter++;
  const list = document.getElementById('roomsList');
  const div = document.createElement('div');
  div.className = 'room-row-form';
  div.dataset.roomId = 'new-' + newRoomCounter;
  div.innerHTML = `
    <div class="cell"><input type="text" name="room_type" placeholder="Deluxe Room"/></div>
    <div class="cell"><input type="number" name="room_price" placeholder="1850000" min="0"/></div>
    <div class="cell"><input type="number" name="room_size" placeholder="42" min="1"/></div>
    <div class="cell">
      <select name="room_beds">
        <option>King</option>
        <option>Twin/King</option>
        <option>Twin</option>
        <option>Twin+King</option>
        <option>Queen</option>
      </select>
    </div>
    <button type="button" class="btn-del-room" onclick="removeRoomRow(this, null)">✕</button>
  `;
  list.appendChild(div);
}

function removeRoomRow(btn, roomId) {
  const row = btn.closest('.room-row-form');
  if (roomId && editingId) {
    fetch(`${API}?action=del_room&id=${roomId}`, { method: 'DELETE' });
  }
  row.remove();
}

// ===== SAVE HOTEL =====
async function saveHotel(e) {
  e.preventDefault();
  const btn = document.getElementById('btnSave');
  btn.textContent = 'Đang lưu...';
  btn.disabled = true;

  const amenities = [...document.querySelectorAll('input[name="amenities"]:checked')].map(cb => cb.value);

  const payload = {
    name:        document.getElementById('fName').value.trim(),
    brand:       document.getElementById('fBrandF').value,
    stars:       parseInt(document.getElementById('fStars').value),
    city:        document.getElementById('fCity').value.trim(),
    province:    document.getElementById('fProvince').value.trim(),
    region:      document.getElementById('fRegionF').value,
    price:       parseFloat(document.getElementById('fPrice').value) || 0,
    image:       mainImagePath || 'img/hero.png',
    gallery:     galleryPaths,
    description: document.getElementById('fDesc').value.trim(),
    amenities:   amenities,
  };

  try {
    let hotelId = editingId;

    if (editingId) {
      await fetch(`${API}?id=${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      hotelId = data.id;
    }

    // Save new rooms
    const rows = document.querySelectorAll('#roomsList .room-row-form');
    for (const row of rows) {
      const rid = row.dataset.roomId;
      if (!rid || rid.startsWith('new-')) {
        const type  = row.querySelector('[name="room_type"]').value.trim();
        const price = parseFloat(row.querySelector('[name="room_price"]').value) || 0;
        const size  = parseInt(row.querySelector('[name="room_size"]').value) || 30;
        const beds  = row.querySelector('[name="room_beds"]').value;
        if (!type) continue;
        await fetch(`${API}?action=add_room&hotel_id=${hotelId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type_name: type, price, size, beds }),
        });
      } else if (editingId) {
        // Update existing room (delete + re-add is simplest)
        const type  = row.querySelector('[name="room_type"]').value.trim();
        const price = parseFloat(row.querySelector('[name="room_price"]').value) || 0;
        const size  = parseInt(row.querySelector('[name="room_size"]').value) || 30;
        const beds  = row.querySelector('[name="room_beds"]').value;
        // Delete old then re-add with updated values
        await fetch(`${API}?action=del_room&id=${rid}`, { method: 'DELETE' });
        await fetch(`${API}?action=add_room&hotel_id=${hotelId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type_name: type, price, size, beds }),
        });
      }
    }

    closeModal();
    await loadHotels();
  } catch (err) {
    alert('Lỗi khi lưu: ' + err.message);
  } finally {
    btn.textContent = 'Lưu khách sạn';
    btn.disabled = false;
  }
}

// ===== DELETE / RESTORE =====
function askDelete(id, name) {
  pendingDeleteId = id;
  document.getElementById('deleteHotelName').textContent = name;
  document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
  pendingDeleteId = null;
  document.getElementById('deleteModal').classList.add('hidden');
}

async function confirmDelete() {
  if (!pendingDeleteId) return;
  await fetch(`${API}?id=${pendingDeleteId}`, { method: 'DELETE' });
  closeDeleteModal();
  await loadHotels();
}

async function restoreHotel(id) {
  await fetch(`${API}?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active: 1 }),
  });
  await loadHotels();
}

// ===== HELPERS =====
function formatPrice(n) {
  return new Intl.NumberFormat('vi-VN', { style:'currency', currency:'VND', maximumFractionDigits:0 }).format(n);
}
