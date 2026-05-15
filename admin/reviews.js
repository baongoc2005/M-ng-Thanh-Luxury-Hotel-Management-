/* ===================================================
   reviews.js — Quản lý reviews | Mường Thanh Admin
   =================================================== */

const API_REVIEWS = '../api/reviews.php';
const API_HOTELS  = '../api/hotels.php';

let currentPage    = 1;
let totalPages     = 1;
let allReviews     = [];   // full list for stats (fetched once without pagination)
let replyingId     = null;
let deletingId     = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadHotels();
  loadReviews();

  // Filters
  document.getElementById('fHotel').addEventListener('change',  () => { currentPage = 1; loadReviews(); });
  document.getElementById('fStatus').addEventListener('change', () => { currentPage = 1; loadReviews(); });
  document.getElementById('fRating').addEventListener('change', () => { currentPage = 1; loadReviews(); });
  document.getElementById('btnReset').addEventListener('click',  resetFilters);

  // Reply modal
  document.getElementById('replyModalClose').addEventListener('click', closeReplyModal);
  document.getElementById('replyCancel').addEventListener('click',     closeReplyModal);
  document.getElementById('replySave').addEventListener('click',       saveReply);

  // Delete modal
  document.getElementById('deleteModalClose').addEventListener('click', closeDeleteModal);
  document.getElementById('deleteCancelBtn').addEventListener('click',  closeDeleteModal);
  document.getElementById('deleteConfirmBtn').addEventListener('click', confirmDelete);

  // Close modals on overlay click
  document.getElementById('replyModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeReplyModal();
  });
  document.getElementById('deleteModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDeleteModal();
  });
});

// ===== LOAD HOTELS (for filter dropdown) =====
async function loadHotels() {
  try {
    const res  = await fetch(API_HOTELS + '?all=1');
    const data = await res.json();
    const hotels = data.hotels || [];
    const sel    = document.getElementById('fHotel');
    hotels.forEach(h => {
      const opt  = document.createElement('option');
      opt.value  = h.id;
      opt.textContent = h.name;
      sel.appendChild(opt);
    });
  } catch (_) { /* fail silently */ }
}

// ===== LOAD REVIEWS =====
async function loadReviews() {
  setTableLoading();
  try {
    const params = buildParams();
    const res    = await fetch(`${API_REVIEWS}?${params}`);
    const data   = await res.json();
    const list   = data.reviews || [];
    totalPages   = data.pages   || 1;

    // Fetch all for stats (no page param) only when filters change
    await refreshStats();

    renderTable(list);
    renderPagination(data.total || list.length);
    updateResultsInfo(data.total || list.length);
  } catch (err) {
    document.getElementById('tableBody').innerHTML =
      `<tr><td colspan="8" class="loading-row" style="color:var(--red)">Lỗi tải dữ liệu: ${err.message}</td></tr>`;
  }
}

function buildParams() {
  const hotel  = document.getElementById('fHotel').value;
  const status = document.getElementById('fStatus').value;
  const rating = document.getElementById('fRating').value;
  const parts  = [`page=${currentPage}`];
  if (hotel)  parts.push(`hotel_id=${hotel}`);
  if (status) parts.push(`status=${status}`);
  if (rating) parts.push(`rating=${rating}`);
  return parts.join('&');
}

async function refreshStats() {
  try {
    const res  = await fetch(`${API_REVIEWS}?page=1&limit=9999`);
    const data = await res.json();
    allReviews = data.reviews || [];
    renderStats(allReviews);
  } catch (_) { /* keep existing stats */ }
}

function setTableLoading() {
  document.getElementById('tableBody').innerHTML =
    `<tr><td colspan="8" class="loading-row">${tAdm('common.loading')}</td></tr>`;
}

// ===== RENDER STATS =====
function renderStats(reviews) {
  const total    = reviews.length;
  const pending  = reviews.filter(r => r.status === 'pending').length;
  const approved = reviews.filter(r => r.status === 'approved').length;
  const rejected = reviews.filter(r => r.status === 'rejected').length;
  const ratings  = reviews.filter(r => r.status === 'approved' && r.rating > 0).map(r => parseFloat(r.rating));
  const avg      = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '—';

  document.getElementById('statTotal').textContent    = total;
  document.getElementById('statPending').textContent  = pending;
  document.getElementById('statApproved').textContent = approved;
  document.getElementById('statRejected').textContent = rejected;
  document.getElementById('statAvgRating').textContent = avg !== '—' ? avg + ' ★' : '—';
}

// ===== RENDER TABLE =====
function renderTable(list) {
  if (!list.length) {
    document.getElementById('tableBody').innerHTML =
      `<tr><td colspan="8" class="loading-row">${tAdm('rv.no_data')}</td></tr>`;
    return;
  }

  document.getElementById('tableBody').innerHTML = list.map(r => {
    const stars     = renderStars(parseInt(r.rating) || 0);
    const badge     = statusBadge(r.status);
    const comment   = escHtml(r.comment || '').substring(0, 100) + (r.comment && r.comment.length > 100 ? '…' : '');
    const title     = escHtml(r.title || '—');
    const hotelName = escHtml(r.hotel_name || '—');
    const guestName = escHtml(r.customer_name || 'Khách vãng lai');
    const guestEmail= escHtml(r.customer_email || '');
    const dateStr   = r.created_at ? formatDate(r.created_at) : '—';
    const hasReply  = r.reply && r.reply.trim().length > 0;
    const replyDot  = hasReply ? `<span class="has-reply-dot" title="Đã có phản hồi"></span>` : '';

    const canApprove = r.status !== 'approved';
    const canReject  = r.status !== 'rejected';

    return `<tr>
      <td>
        <div class="hotel-name">${hotelName}</div>
      </td>
      <td>
        <div class="guest-name">${guestName}</div>
        ${guestEmail ? `<div class="guest-contact">${guestEmail}</div>` : ''}
      </td>
      <td>
        <div class="stars-display">${stars}</div>
        <span class="rating-num">${r.rating || 0}</span>
      </td>
      <td>
        <div class="review-title">${title}${replyDot}</div>
      </td>
      <td>
        <div class="comment-cell" title="${escAttr(r.comment || '')}">${comment}</div>
      </td>
      <td>
        <div class="date-main">${dateStr}</div>
      </td>
      <td>${badge}</td>
      <td>
        <div class="action-btns">
          ${canApprove ? `<button class="btn-approve" onclick="approveReview(${r.id})">${tAdm('rv.approve')}</button>` : ''}
          ${canReject  ? `<button class="btn-reject"  onclick="rejectReview(${r.id})">${tAdm('rv.reject')}</button>` : ''}
          <button class="btn-reply"      onclick="openReplyModal(${r.id})">${tAdm('rv.reply')}</button>
          <button class="btn-del-review" onclick="askDeleteReview(${r.id})">${tAdm('rv.delete')}</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ===== STAR RATING DISPLAY =====
function renderStars(n) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="${i <= n ? 'star-filled' : 'star-empty'}">★</span>`;
  }
  return html;
}

// ===== STATUS BADGE =====
function statusBadge(status) {
  const map = {
    pending:  ['badge-pending',  tAdm('rv.pending')],
    approved: ['badge-approved', tAdm('rv.approved')],
    rejected: ['badge-rejected', tAdm('rv.rejected')],
  };
  const [cls, label] = map[status] || ['badge-pending', status];
  return `<span class="badge-status ${cls}">${label}</span>`;
}

// ===== APPROVE / REJECT =====
async function approveReview(id) {
  await putReview(id, { status: 'approved' });
  loadReviews();
}

async function rejectReview(id) {
  await putReview(id, { status: 'rejected' });
  loadReviews();
}

async function putReview(id, payload) {
  try {
    await fetch(`${API_REVIEWS}?id=${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
  } catch (err) {
    alert('Lỗi cập nhật: ' + err.message);
  }
}

// ===== DELETE =====
function askDeleteReview(id) {
  deletingId = id;
  document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
  deletingId = null;
  document.getElementById('deleteModal').classList.add('hidden');
}

async function confirmDelete() {
  if (!deletingId) return;
  try {
    await fetch(`${API_REVIEWS}?id=${deletingId}`, { method: 'DELETE' });
  } catch (err) {
    alert('Lỗi xóa: ' + err.message);
  }
  closeDeleteModal();
  loadReviews();
}

// ===== REPLY MODAL =====
function openReplyModal(id) {
  const review = allReviews.find(r => r.id == id);
  if (!review) {
    // Fetch from API if not in cache
    fetch(`${API_REVIEWS}?page=1&limit=9999`)
      .then(r => r.json())
      .then(data => {
        const found = (data.reviews || []).find(r => r.id == id);
        if (found) {
          allReviews = data.reviews;
          populateReplyModal(found);
        }
      });
    return;
  }
  populateReplyModal(review);
}

function populateReplyModal(review) {
  replyingId = review.id;

  // Build detail card
  const stars = renderStars(parseInt(review.rating) || 0);
  const existingReply = review.reply && review.reply.trim()
    ? `<div class="rdc-existing-reply">
         <strong>Phản hồi hiện tại</strong>
         ${escHtml(review.reply)}
       </div>`
    : '';

  document.getElementById('replyReviewDetail').innerHTML = `
    <div class="rdc-hotel">${escHtml(review.hotel_name || 'Khách sạn')}</div>
    <div class="rdc-customer">${escHtml(review.customer_name || 'Khách vãng lai')}</div>
    <div class="rdc-meta">${escHtml(review.customer_email || '')} · ${formatDate(review.created_at)} · <span class="stars-display">${stars}</span></div>
    <div class="rdc-title">${escHtml(review.title || '')}</div>
    <div class="rdc-comment">${escHtml(review.comment || '')}</div>
    ${existingReply}
  `;

  // Pre-fill textarea with existing reply if any
  document.getElementById('replyText').value = review.reply || '';
  document.getElementById('replyModal').classList.remove('hidden');
  document.getElementById('replyText').focus();
}

function closeReplyModal() {
  replyingId = null;
  document.getElementById('replyModal').classList.add('hidden');
  document.getElementById('replyText').value = '';
}

async function saveReply() {
  if (!replyingId) return;
  const text = document.getElementById('replyText').value.trim();
  if (!text) {
    document.getElementById('replyText').style.borderColor = 'var(--red)';
    setTimeout(() => { document.getElementById('replyText').style.borderColor = ''; }, 1500);
    return;
  }

  const btn = document.getElementById('replySave');
  btn.textContent = 'Đang lưu...';
  btn.disabled    = true;

  try {
    await putReview(replyingId, { reply: text });
    closeReplyModal();
    loadReviews();
  } finally {
    btn.textContent = 'Lưu phản hồi';
    btn.disabled    = false;
  }
}

// ===== PAGINATION =====
function renderPagination(total) {
  const container = document.getElementById('pagination');
  container.innerHTML = '';
  if (totalPages <= 1) return;

  const makeBtn = (label, page, active = false, disabled = false) => {
    const btn = document.createElement('button');
    btn.className  = 'page-btn' + (active ? ' active' : '');
    btn.textContent = label;
    btn.disabled   = disabled;
    if (!disabled) {
      btn.addEventListener('click', () => {
        currentPage = page;
        loadReviews();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    return btn;
  };

  container.appendChild(makeBtn('‹', currentPage - 1, false, currentPage === 1));

  for (let p = 1; p <= totalPages; p++) {
    if (
      p === 1 || p === totalPages ||
      (p >= currentPage - 2 && p <= currentPage + 2)
    ) {
      container.appendChild(makeBtn(p, p, p === currentPage));
    } else if (
      p === currentPage - 3 || p === currentPage + 3
    ) {
      const dots = document.createElement('span');
      dots.textContent = '…';
      dots.style.cssText = 'color:var(--muted);padding:0 0.3rem;line-height:36px;';
      container.appendChild(dots);
    }
  }

  container.appendChild(makeBtn('›', currentPage + 1, false, currentPage === totalPages));
}

function updateResultsInfo(total) {
  const perPage = 20;
  const from = Math.min((currentPage - 1) * perPage + 1, total);
  const to   = Math.min(currentPage * perPage, total);
  document.getElementById('resultsInfo').innerHTML =
    total > 0
      ? `Hiển thị <strong>${from}–${to}</strong> / <strong>${total}</strong> reviews`
      : 'Không tìm thấy review nào.';
}

// ===== RESET FILTERS =====
function resetFilters() {
  document.getElementById('fHotel').value  = '';
  document.getElementById('fStatus').value = '';
  document.getElementById('fRating').value = '';
  currentPage = 1;
  loadReviews();
}

// ===== HELPERS =====
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escAttr(str) {
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
