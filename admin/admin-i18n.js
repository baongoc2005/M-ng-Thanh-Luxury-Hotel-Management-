// Admin i18n — shared across all admin pages
const ADM_I18N = {
  vi: {
    // NAV
    'nav.dashboard':'Dashboard','nav.bookings':'Đặt Phòng','nav.customers':'Khách Hàng',
    'nav.hotels':'Khách Sạn','nav.staff':'Nhân Viên','nav.reviews':'Đánh Giá',
    'nav.promotions':'Khuyến Mãi','nav.payments':'Thanh Toán','nav.emails':'Email',
    'nav.settings':'Cài Đặt',
    // USER BAR
    'user.logout':'Đăng xuất',
    'role.manager':'Quản lý','role.receptionist':'Lễ Tân','role.concierge':'Concierge',
    'role.housekeeping':'Housekeeping','role.security':'Bảo vệ','role.other':'Nhân viên',
    // DASHBOARD — sections
    'dash.today':'Tổng Quan Hôm Nay','dash.system':'Hệ Thống',
    'dash.status_title':'Trạng Thái Đặt Phòng',
    // DASHBOARD — stat cards
    'dash.total_bookings':'Tổng đặt phòng','dash.total_revenue':'Tổng doanh thu',
    'dash.customers':'Khách hàng','dash.customers_sub':'Đã đăng ký',
    'dash.pending':'Chờ xác nhận',
    'dash.hotels':'Khách sạn hoạt động','dash.staff':'Nhân viên',
    'dash.pending_reviews':'Review chờ duyệt','dash.promos':'Khuyến mãi đang chạy',
    'dash.manage':'Quản lý →','dash.view_list':'Xem danh sách →',
    'dash.approve':'Duyệt ngay →',
    // DASHBOARD — dynamic sub-labels
    'dash.today_suffix':'hôm nay','dash.confirmed_suffix':'đã xác nhận',
    // DASHBOARD — charts
    'dash.chart_revenue_title':'Doanh Thu & Đặt Phòng',
    'dash.chart_revenue_sub':'14 ngày gần nhất',
    'dash.chart_source_title':'Đặt Phòng Theo Nguồn',
    'dash.chart_source_sub':'Phân bổ kênh đặt phòng',
    'dash.legend_revenue':'Doanh thu (VNĐ)','dash.legend_bookings':'Số đặt phòng',
    'dash.legend_bookings_tooltip':'đặt phòng',
    // DASHBOARD — tables
    'dash.top_hotels':'Top Khách Sạn','dash.all':'Tất cả →',
    'dash.recent_bookings':'Đặt Phòng Gần Nhất','dash.view_all':'Xem tất cả →',
    'dash.th_hotel':'Khách sạn','dash.th_bookings':'Đặt phòng','dash.th_revenue':'Doanh thu',
    'dash.th_customer':'Khách hàng','dash.th_source':'Nguồn','dash.th_status':'Trạng thái',
    'dash.no_data':'Không có dữ liệu','dash.no_recent':'Không có đặt phòng gần đây',
    'dash.loading':'Đang tải...','dash.error':'Không thể tải dữ liệu. Vui lòng thử lại.',
    // STATUS labels
    'status.pending':'Chờ xác nhận','status.confirmed':'Đã xác nhận',
    'status.checked_in':'Đã nhận phòng','status.checked_out':'Đã trả phòng',
    'status.cancelled':'Đã huỷ','status.no_show':'Không đến',
    // BOOKINGS PAGE (index.html)
    'bk.title':'Quản Lý Đặt Phòng','bk.search_ph':'Tìm tên khách, email, mã đặt phòng...',
    'bk.filter_status':'Tất cả trạng thái','bk.filter_source':'Tất cả nguồn',
    'bk.filter_hotel':'Tất cả khách sạn','bk.btn_export':'Xuất CSV',
    'bk.th_ref':'Mã ĐP','bk.th_guest':'Khách','bk.th_hotel':'Khách sạn',
    'bk.th_dates':'Ngày','bk.th_nights':'Đêm','bk.th_total':'Tổng tiền',
    'bk.th_source':'Nguồn','bk.th_status':'Trạng thái','bk.th_action':'',
    'bk.detail':'Chi tiết','bk.no_data':'Không có đặt phòng nào phù hợp.',
    'bk.nights_unit':'đêm',
    // CUSTOMERS PAGE
    'cus.title':'Quản Lý Khách Hàng','cus.search_ph':'Tìm tên, email, SĐT...',
    'cus.th_name':'Họ tên','cus.th_email':'Email','cus.th_phone':'SĐT',
    'cus.th_nationality':'Quốc tịch','cus.th_bookings':'Đặt phòng',
    'cus.th_spent':'Chi tiêu','cus.th_registered':'Đăng ký','cus.th_action':'',
    'cus.view':'Xem','cus.no_data':'Không có khách hàng.',
    // HOTELS PAGE
    'htl.title':'Quản Lý Khách Sạn','htl.btn_add':'+ Thêm khách sạn',
    'htl.th_name':'Tên khách sạn','htl.th_city':'Thành phố','htl.th_brand':'Thương hiệu',
    'htl.th_stars':'Sao','htl.th_rooms':'Phòng','htl.th_status':'Trạng thái',
    'htl.th_action':'','htl.edit':'Sửa','htl.active':'Hoạt động','htl.inactive':'Tạm ngừng',
    'htl.no_data':'Không có khách sạn.',
    // STAFF PAGE
    'stf.title':'Quản Lý Nhân Viên','stf.btn_add':'+ Thêm nhân viên',
    'stf.th_name':'Họ tên','stf.th_email':'Email','stf.th_role':'Vai trò',
    'stf.th_status':'Trạng thái','stf.th_action':'',
    'stf.edit':'Sửa','stf.active':'Hoạt động','stf.inactive':'Nghỉ việc',
    'stf.no_data':'Không có nhân viên.',
    // REVIEWS PAGE
    'rv.title':'Quản Lý Đánh Giá','rv.filter_status':'Tất cả trạng thái',
    'rv.pending':'Chờ duyệt','rv.approved':'Đã duyệt','rv.rejected':'Từ chối',
    'rv.approve':'Duyệt','rv.reject':'Từ chối','rv.delete':'Xoá',
    'rv.th_guest':'Khách','rv.th_hotel':'Khách sạn','rv.th_rating':'Sao',
    'rv.th_comment':'Nội dung','rv.th_status':'Trạng thái','rv.th_action':'',
    'rv.no_data':'Không có đánh giá.',
    // PROMOTIONS PAGE
    'prm.title':'Quản Lý Khuyến Mãi','prm.btn_add':'+ Tạo mã mới',
    'prm.th_code':'Mã','prm.th_name':'Tên','prm.th_discount':'Giảm giá',
    'prm.th_used':'Đã dùng','prm.th_expires':'Hết hạn','prm.th_status':'Trạng thái',
    'prm.th_action':'','prm.edit':'Sửa','prm.delete':'Xoá',
    'prm.active':'Hoạt động','prm.expired':'Hết hạn','prm.no_data':'Không có mã khuyến mãi.',
    // PAYMENTS PAGE
    'pay.title':'Quản Lý Thanh Toán',
    'pay.th_ref':'Mã ĐP','pay.th_guest':'Khách','pay.th_amount':'Số tiền',
    'pay.th_method':'Phương thức','pay.th_status':'Trạng thái','pay.th_date':'Ngày',
    'pay.no_data':'Không có giao dịch.',
    // SETTINGS PAGE
    'set.title':'Cài Đặt Hệ Thống','set.save':'Lưu thay đổi',
    'set.section_general':'Cấu Hình Chung',
    'set.section_general_sub':'Phí dịch vụ, thông tin liên hệ, giới hạn bộ lọc',
    'set.section_extras':'Dịch Vụ Bổ Sung',
    'set.section_extras_sub':'Giá và trạng thái hiển thị trên trang đặt phòng',
    'set.th_service':'Dịch vụ','set.th_calc':'Cách tính giá','set.th_price':'Giá (đ)',
    'set.btn_save_settings':'Lưu cài đặt','set.btn_save_extra':'Lưu',
    // CUSTOMERS PAGE additional
    'cus.stat_total':'Tổng khách hàng','cus.stat_revenue':'Tổng doanh thu từ khách',
    'cus.th_stt':'STT','cus.th_last_booking':'Lần cuối',
    'cus.th_vip':'VIP','cus.th_notes':'Ghi chú',
    'cus.kpi_bookings':'Lần đặt phòng','cus.kpi_nights':'Tổng số đêm',
    'cus.kpi_spent':'Tổng chi tiêu','cus.kpi_tier':'Hạng thành viên',
    'cus.booking_history':'Lịch sử đặt phòng',
    'cus.no_bookings':'Chưa có đặt phòng nào',
    'cus.detail_title':'Chi Tiết Khách Hàng',
    'cus.vip_label':'VIP','cus.standard_label':'Thường',
    // HOTELS PAGE additional
    'htl.stat_total':'Tổng khách sạn','htl.stat_active':'Đang hoạt động',
    'htl.stat_rooms':'Tổng loại phòng','htl.stat_avg_price':'Giá trung bình',
    'htl.th_image':'Hình ảnh','htl.th_price':'Giá từ','htl.th_rating':'Đánh giá',
    // STAFF PAGE additional
    'stf.stat_total':'Tổng nhân viên','stf.stat_working':'Đang làm việc',
    'stf.stat_inactive':'Đã nghỉ việc','stf.stat_managers':'Quản lý',
    'stf.th_hotel':'Khách sạn','stf.th_phone':'Điện thoại','stf.th_joined':'Ngày vào',
    'stf.deactivate':'Nghỉ việc','stf.restore':'Phục hồi',
    'stf.role_manager':'Quản lý','stf.role_receptionist':'Lễ tân',
    'stf.role_housekeeping':'Buồng phòng','stf.role_concierge':'Concierge',
    'stf.role_security':'Bảo vệ','stf.role_other':'Khác',
    // REVIEWS PAGE additional
    'rv.stat_total':'Tổng reviews','rv.stat_pending':'Chờ duyệt',
    'rv.stat_approved':'Đã duyệt','rv.stat_rejected':'Đã từ chối','rv.stat_avg':'Điểm TB',
    'rv.th_title':'Tiêu đề','rv.th_date':'Ngày','rv.reply':'Phản hồi',
    'rv.btn_reply_save':'Lưu phản hồi',
    // PROMOTIONS PAGE additional
    'prm.stat_total':'Tổng mã','prm.stat_active':'Đang hoạt động',
    'prm.stat_used_month':'Đã dùng tháng này','prm.stat_expiring':'Hết hạn sắp tới',
    'prm.th_applies':'Áp dụng cho','prm.th_validity':'Hiệu lực',
    'prm.th_usage':'Đã dùng / Giới hạn',
    'prm.upcoming':'Chưa bắt đầu','prm.inactive':'Đã tắt','prm.unlimited':'Không giới hạn',
    // PAYMENTS PAGE additional
    'pay.stat_revenue':'Doanh thu (đã thanh toán)','pay.stat_paid':'Giao dịch thành công',
    'pay.stat_pending':'Chờ thanh toán','pay.stat_refund':'Đã hoàn tiền',
    'pay.tab_transactions':'Giao Dịch','pay.tab_methods':'Phương Thức Thanh Toán',
    'pay.th_type':'Loại','pay.th_created':'Ngày tạo','pay.th_paid_at':'Ngày thanh toán',
    'pay.th_notes':'Ghi chú','pay.th_action':'','pay.btn_add':'+ Ghi nhận thanh toán',
    // BOOKINGS PAGE additional
    'bk.nights_label':'đêm','bk.guests_label':'khách',
    'bk.no_bookings':'Không có đơn nào phù hợp.',
    'bk.btn_add_manual':'+ Thêm đơn thủ công',
    // EMAIL PAGE
    'email.select_template':'— Chọn template —',
    'email.active':'● Bật','email.inactive':'○ Tắt',
    'email.subject_label':'Tiêu đề','email.preview':'Xem trước email',
    'email.add_block':'Thêm:','email.btn_save':'Lưu template',
    'email.btn_test':'Gửi thử',
    'email.no_blocks':'Chưa có block nào. Thêm block bên dưới.',
    'email.edit_label':'Chỉnh sửa','email.saved':'Đã lưu ✓',
    'email.sent':'Đã gửi ✓','email.send_fail':'Gửi thất bại',
    'email.enter_email':'Nhập email thử nghiệm',
    // SETTINGS additional
    'set.calc_flat':'Cố định','set.calc_per_person':'× Số khách',
    'set.calc_per_night':'× Số đêm','set.calc_pp_pn':'× Khách × Đêm',
    'set.toggle_on':'● Bật','set.toggle_off':'○ Tắt',
    // COMMON
    'common.loading':'Đang tải...','common.error':'Lỗi tải dữ liệu.',
    'common.confirm_delete':'Bạn có chắc muốn xoá?',
    'common.saved':'Đã lưu!','common.failed':'Thất bại.',
  },
  en: {
    // NAV
    'nav.dashboard':'Dashboard','nav.bookings':'Bookings','nav.customers':'Customers',
    'nav.hotels':'Hotels','nav.staff':'Staff','nav.reviews':'Reviews',
    'nav.promotions':'Promotions','nav.payments':'Payments','nav.emails':'Emails',
    'nav.settings':'Settings',
    // USER BAR
    'user.logout':'Sign Out',
    'role.manager':'Manager','role.receptionist':'Receptionist','role.concierge':'Concierge',
    'role.housekeeping':'Housekeeping','role.security':'Security','role.other':'Staff',
    // DASHBOARD — sections
    'dash.today':'Today\'s Overview','dash.system':'System',
    'dash.status_title':'Booking Status',
    // DASHBOARD — stat cards
    'dash.total_bookings':'Total bookings','dash.total_revenue':'Total revenue',
    'dash.customers':'Customers','dash.customers_sub':'Registered',
    'dash.pending':'Pending approval',
    'dash.hotels':'Active hotels','dash.staff':'Staff members',
    'dash.pending_reviews':'Reviews pending','dash.promos':'Active promotions',
    'dash.manage':'Manage →','dash.view_list':'View list →',
    'dash.approve':'Approve now →',
    // DASHBOARD — dynamic sub-labels
    'dash.today_suffix':'today','dash.confirmed_suffix':'confirmed',
    // DASHBOARD — charts
    'dash.chart_revenue_title':'Revenue & Bookings',
    'dash.chart_revenue_sub':'Last 14 days',
    'dash.chart_source_title':'Bookings by Source',
    'dash.chart_source_sub':'Booking channel distribution',
    'dash.legend_revenue':'Revenue (VND)','dash.legend_bookings':'Bookings',
    'dash.legend_bookings_tooltip':'bookings',
    // DASHBOARD — tables
    'dash.top_hotels':'Top Hotels','dash.all':'All →',
    'dash.recent_bookings':'Recent Bookings','dash.view_all':'View all →',
    'dash.th_hotel':'Hotel','dash.th_bookings':'Bookings','dash.th_revenue':'Revenue',
    'dash.th_customer':'Guest','dash.th_source':'Source','dash.th_status':'Status',
    'dash.no_data':'No data available','dash.no_recent':'No recent bookings',
    'dash.loading':'Loading...','dash.error':'Unable to load data. Please try again.',
    // STATUS labels
    'status.pending':'Pending','status.confirmed':'Confirmed',
    'status.checked_in':'Checked In','status.checked_out':'Checked Out',
    'status.cancelled':'Cancelled','status.no_show':'No Show',
    // BOOKINGS PAGE
    'bk.title':'Booking Management','bk.search_ph':'Search guest name, email, booking ref...',
    'bk.filter_status':'All statuses','bk.filter_source':'All sources',
    'bk.filter_hotel':'All hotels','bk.btn_export':'Export CSV',
    'bk.th_ref':'Ref','bk.th_guest':'Guest','bk.th_hotel':'Hotel',
    'bk.th_dates':'Dates','bk.th_nights':'Nights','bk.th_total':'Total',
    'bk.th_source':'Source','bk.th_status':'Status','bk.th_action':'',
    'bk.detail':'Details','bk.no_data':'No bookings found.',
    'bk.nights_unit':'nights',
    // CUSTOMERS PAGE
    'cus.title':'Customer Management','cus.search_ph':'Search name, email, phone...',
    'cus.th_name':'Full name','cus.th_email':'Email','cus.th_phone':'Phone',
    'cus.th_nationality':'Nationality','cus.th_bookings':'Bookings',
    'cus.th_spent':'Total spent','cus.th_registered':'Registered','cus.th_action':'',
    'cus.view':'View','cus.no_data':'No customers found.',
    // HOTELS PAGE
    'htl.title':'Hotel Management','htl.btn_add':'+ Add hotel',
    'htl.th_name':'Hotel name','htl.th_city':'City','htl.th_brand':'Brand',
    'htl.th_stars':'Stars','htl.th_rooms':'Rooms','htl.th_status':'Status',
    'htl.th_action':'','htl.edit':'Edit','htl.active':'Active','htl.inactive':'Inactive',
    'htl.no_data':'No hotels found.',
    // STAFF PAGE
    'stf.title':'Staff Management','stf.btn_add':'+ Add staff',
    'stf.th_name':'Full name','stf.th_email':'Email','stf.th_role':'Role',
    'stf.th_status':'Status','stf.th_action':'',
    'stf.edit':'Edit','stf.active':'Active','stf.inactive':'Resigned',
    'stf.no_data':'No staff found.',
    // REVIEWS PAGE
    'rv.title':'Review Management','rv.filter_status':'All statuses',
    'rv.pending':'Pending','rv.approved':'Approved','rv.rejected':'Rejected',
    'rv.approve':'Approve','rv.reject':'Reject','rv.delete':'Delete',
    'rv.th_guest':'Guest','rv.th_hotel':'Hotel','rv.th_rating':'Rating',
    'rv.th_comment':'Comment','rv.th_status':'Status','rv.th_action':'',
    'rv.no_data':'No reviews found.',
    // PROMOTIONS PAGE
    'prm.title':'Promotion Management','prm.btn_add':'+ Create new code',
    'prm.th_code':'Code','prm.th_name':'Name','prm.th_discount':'Discount',
    'prm.th_used':'Used','prm.th_expires':'Expires','prm.th_status':'Status',
    'prm.th_action':'','prm.edit':'Edit','prm.delete':'Delete',
    'prm.active':'Active','prm.expired':'Expired','prm.no_data':'No promotions found.',
    // PAYMENTS PAGE
    'pay.title':'Payment Management',
    'pay.th_ref':'Ref','pay.th_guest':'Guest','pay.th_amount':'Amount',
    'pay.th_method':'Method','pay.th_status':'Status','pay.th_date':'Date',
    'pay.no_data':'No transactions found.',
    // SETTINGS PAGE
    'set.title':'System Settings','set.save':'Save changes',
    'set.section_general':'General Configuration',
    'set.section_general_sub':'Service fee, contact info, filter limits',
    'set.section_extras':'Extra Services',
    'set.section_extras_sub':'Prices and display status on booking page',
    'set.th_service':'Service','set.th_calc':'Pricing model','set.th_price':'Price (VND)',
    'set.btn_save_settings':'Save settings','set.btn_save_extra':'Save',
    // CUSTOMERS PAGE additional
    'cus.stat_total':'Total customers','cus.stat_revenue':'Revenue from customers',
    'cus.th_stt':'#','cus.th_last_booking':'Last booking',
    'cus.th_vip':'VIP','cus.th_notes':'Notes',
    'cus.kpi_bookings':'Bookings','cus.kpi_nights':'Total nights',
    'cus.kpi_spent':'Total spent','cus.kpi_tier':'Member tier',
    'cus.booking_history':'Booking history',
    'cus.no_bookings':'No bookings yet',
    'cus.detail_title':'Customer Details',
    'cus.vip_label':'VIP','cus.standard_label':'Standard',
    // HOTELS PAGE additional
    'htl.stat_total':'Total hotels','htl.stat_active':'Active',
    'htl.stat_rooms':'Total room types','htl.stat_avg_price':'Avg price',
    'htl.th_image':'Image','htl.th_price':'From','htl.th_rating':'Rating',
    // STAFF PAGE additional
    'stf.stat_total':'Total staff','stf.stat_working':'Active',
    'stf.stat_inactive':'Resigned','stf.stat_managers':'Managers',
    'stf.th_hotel':'Hotel','stf.th_phone':'Phone','stf.th_joined':'Joined',
    'stf.deactivate':'Deactivate','stf.restore':'Restore',
    'stf.role_manager':'Manager','stf.role_receptionist':'Receptionist',
    'stf.role_housekeeping':'Housekeeping','stf.role_concierge':'Concierge',
    'stf.role_security':'Security','stf.role_other':'Other',
    // REVIEWS PAGE additional
    'rv.stat_total':'Total reviews','rv.stat_pending':'Pending',
    'rv.stat_approved':'Approved','rv.stat_rejected':'Rejected','rv.stat_avg':'Avg rating',
    'rv.th_title':'Title','rv.th_date':'Date','rv.reply':'Reply',
    'rv.btn_reply_save':'Save reply',
    // PROMOTIONS PAGE additional
    'prm.stat_total':'Total codes','prm.stat_active':'Active',
    'prm.stat_used_month':'Used this month','prm.stat_expiring':'Expiring soon',
    'prm.th_applies':'Applies to','prm.th_validity':'Validity',
    'prm.th_usage':'Used / Limit',
    'prm.upcoming':'Upcoming','prm.inactive':'Disabled','prm.unlimited':'Unlimited',
    // PAYMENTS PAGE additional
    'pay.stat_revenue':'Revenue (paid)','pay.stat_paid':'Successful transactions',
    'pay.stat_pending':'Pending payment','pay.stat_refund':'Refunded',
    'pay.tab_transactions':'Transactions','pay.tab_methods':'Payment Methods',
    'pay.th_type':'Type','pay.th_created':'Created','pay.th_paid_at':'Paid at',
    'pay.th_notes':'Notes','pay.th_action':'','pay.btn_add':'+ Record payment',
    // BOOKINGS PAGE additional
    'bk.nights_label':'nights','bk.guests_label':'guests',
    'bk.no_bookings':'No bookings found.',
    'bk.btn_add_manual':'+ Add manual booking',
    // COMMON
    'common.loading':'Loading...','common.error':'Failed to load data.',
    'common.confirm_delete':'Are you sure you want to delete this?',
    'common.saved':'Saved!','common.failed':'Failed.',
  }
};

function getAdmLang() { return localStorage.getItem('lang') || 'vi'; }

function tAdm(key) {
  const lang = getAdmLang();
  return (ADM_I18N[lang] && ADM_I18N[lang][key]) ?? (ADM_I18N.vi[key]) ?? key;
}

function applyAdmTranslations() {
  const lang = getAdmLang();
  document.documentElement.lang = lang === 'en' ? 'en' : 'vi';
  document.querySelectorAll('[data-adm-i18n]').forEach(el => {
    const key = el.dataset.admI18n;
    const val = tAdm(key);
    if (val) el.innerHTML = val;
  });
  document.querySelectorAll('[data-adm-i18n-ph]').forEach(el => {
    const key = el.dataset.admI18nPh;
    const val = tAdm(key);
    if (val) el.placeholder = val;
  });
}

document.addEventListener('DOMContentLoaded', applyAdmTranslations);
