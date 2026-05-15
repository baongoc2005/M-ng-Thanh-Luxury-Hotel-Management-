// Shared admin authentication — included in every admin page
// Checks session, redirects to login if not authenticated, hides nav items by role

const PAGE_MAP = {
  'dashboard.html' : 'dashboard',
  'index.html'     : 'index',
  'customers.html' : 'customers',
  'hotels.html'    : 'hotels',
  'staff.html'     : 'staff',
  'reviews.html'   : 'reviews',
  'promotions.html': 'promotions',
  'payments.html'  : 'payments',
  'emails.html'    : 'emails',
  'settings.html'  : 'settings',
};

const PAGE_LINKS = {
  'dashboard' : 'dashboard.html',
  'index'     : 'index.html',
  'customers' : 'customers.html',
  'hotels'    : 'hotels.html',
  'staff'     : 'staff.html',
  'reviews'   : 'reviews.html',
  'promotions': 'promotions.html',
  'payments'  : 'payments.html',
  'emails'    : 'emails.html',
  'settings'  : 'settings.html',
};

(async function initAdminAuth() {
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  const currentPage = PAGE_MAP[currentFile];

  let res, data;
  try {
    res  = await fetch('../api/admin_auth.php?action=me', { credentials: 'include' });
    data = await res.json();
  } catch (e) {
    location.replace('admin-login.html');
    return;
  }

  if (!data.authenticated) {
    location.replace('admin-login.html');
    return;
  }

  const { staff, pages } = data;

  // Kiểm tra quyền trang hiện tại
  if (currentPage && !pages.includes(currentPage)) {
    location.replace(pages[0] ? PAGE_LINKS[pages[0]] : 'admin-login.html');
    return;
  }

  // Thêm thông tin user vào header
  const header = document.querySelector('.adm-header');
  if (header) {
    const roleLabelVi = {
      manager: 'Quản lý', receptionist: 'Lễ Tân',
      concierge: 'Concierge', housekeeping: 'Housekeeping',
      security: 'Bảo vệ', other: 'Nhân viên',
    };
    const roleLabelEn = {
      manager: 'Manager', receptionist: 'Receptionist',
      concierge: 'Concierge', housekeeping: 'Housekeeping',
      security: 'Security', other: 'Staff',
    };
    const lang = localStorage.getItem('lang') || 'vi';
    const roleLabel = (lang === 'en' ? roleLabelEn : roleLabelVi)[staff.role] || staff.role;
    const logoutText = lang === 'en' ? 'Sign Out' : 'Đăng xuất';

    const userEl = document.createElement('div');
    userEl.className = 'adm-user';
    userEl.innerHTML = `
      <span class="adm-user-name">${staff.full_name}</span>
      <span class="adm-user-role">${roleLabel}</span>
      <button class="adm-logout" onclick="adminLogout()">${logoutText}</button>`;

    // Lang switcher — inject nếu chưa có trong HTML
    if (!header.querySelector('.adm-lang-switcher')) {
      const langEl = document.createElement('div');
      langEl.className = 'adm-lang-switcher';
      langEl.innerHTML = `
        <button class="adm-lang-btn${lang === 'vi' ? ' active' : ''}" onclick="localStorage.setItem('lang','vi');location.reload()">VI</button>
        <span class="adm-lang-sep">|</span>
        <button class="adm-lang-btn${lang === 'en' ? ' active' : ''}" onclick="localStorage.setItem('lang','en');location.reload()">EN</button>`;
      userEl.appendChild(langEl);
    }

    header.appendChild(userEl);
  }

  // Dịch nav links
  const navLabelsVi = {
    'dashboard.html':'Dashboard','index.html':'Đặt Phòng','customers.html':'Khách Hàng',
    'hotels.html':'Khách Sạn','staff.html':'Nhân Viên','reviews.html':'Đánh Giá',
    'promotions.html':'Khuyến Mãi','payments.html':'Thanh Toán','emails.html':'Email','settings.html':'Cài Đặt',
  };
  const navLabelsEn = {
    'dashboard.html':'Dashboard','index.html':'Bookings','customers.html':'Customers',
    'hotels.html':'Hotels','staff.html':'Staff','reviews.html':'Reviews',
    'promotions.html':'Promotions','payments.html':'Payments','emails.html':'Emails','settings.html':'Settings',
  };
  const navLabels = (localStorage.getItem('lang') === 'en') ? navLabelsEn : navLabelsVi;
  document.querySelectorAll('.adm-nav-link').forEach(link => {
    const file = (link.getAttribute('href') || '').split('/').pop();
    if (navLabels[file]) link.textContent = navLabels[file];
  });

  // Áp dụng translations sau khi DOM đã sẵn sàng
  if (typeof applyAdmTranslations === 'function') applyAdmTranslations();

  // Ẩn nav links không có quyền
  document.querySelectorAll('.adm-nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const file = href.split('/').pop();
    const page = PAGE_MAP[file];
    if (page && !pages.includes(page)) {
      link.style.display = 'none';
    }
  });

  window.adminUser = staff;
})();

async function adminLogout() {
  await fetch('../api/admin_auth.php?action=logout', { method: 'POST', credentials: 'include' });
  location.replace('admin-login.html');
}
