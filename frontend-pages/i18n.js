// i18n.js — Language system for Mường Thanh
// Usage: t('key') | setLang('en') | getLang()
// HTML: data-i18n="key" | data-i18n-ph="key" (placeholder)

const I18N = {
  vi: {
    // NAV
    'nav.destinations':'Điểm đến','nav.brands':'Thương hiệu','nav.rooms':'Phòng','nav.offers':'Ưu đãi',
    'nav.book':'Đặt Phòng','nav.login':'Đăng nhập','nav.logout':'Đăng xuất',
    'nav.search':'Tìm Khách Sạn','nav.back_home':'← Trang chủ',
    'nav.back_search':'← Trang tìm kiếm','nav.back_hotel':'← Quay lại khách sạn',
    // HERO (index)
    'hero.label':'KHÁCH SẠN TƯ NHÂN LỚN NHẤT ĐÔNG DƯƠNG',
    'hero.line1':'Nghỉ Dưỡng','hero.line2':'Đẳng Cấp','hero.line3':'Việt Nam',
    'hero.sub':'Hơn 63 khách sạn trải dài khắp Việt Nam và Lào — nơi mỗi hành trình bắt đầu từ sự sang trọng.',
    'hero.cta1':'Khám Phá Ngay','hero.cta2':'Xem Điểm Đến',
    'hero.stat1':'Khách sạn','hero.stat2':'Tỉnh thành','hero.stat3':'Năm kinh nghiệm',
    // BOOKING BAR (index)
    'bar.title':'Đặt Phòng','bar.dest':'Điểm đến','bar.dest_ph':'Chọn điểm đến',
    'bar.checkin':'Nhận phòng','bar.checkout':'Trả phòng','bar.guests':'Khách','bar.search':'Tìm Phòng',
    // DESTINATIONS (index)
    'dest.label':'ĐIỂM ĐẾN NỔI BẬT','dest.title1':'Khám Phá','dest.title2':'Việt Nam',
    'dest.explore':'Khám phá →','dest.hotels_unit':'Khách sạn',
    // BRANDS (index)
    'brands.label':'HỆ THỐNG THƯƠNG HIỆU','brands.title1':'Bốn Đẳng Cấp','brands.title2':'Một Trải Nghiệm',
    'brands.more':'Tìm hiểu thêm →','brands.learn_more':'Tìm hiểu thêm →',
    'brand.luxury.desc':'Tiêu chuẩn 5 sao quốc tế, vị trí đắc địa, dịch vụ cá nhân hóa tuyệt đỉnh.',
    'brand.grand.desc':'Không gian rộng lớn, sang trọng, phù hợp cho cả doanh nhân và gia đình.',
    'brand.holiday.desc':'Điểm nghỉ dưỡng lý tưởng cho kỳ nghỉ gia đình tại các bãi biển đẹp nhất.',
    'brand.mt.desc':'Bản sắc văn hóa Việt, ấm áp và thân thiện như chính ngôi nhà của bạn.',
    // ROOMS (index)
    'rooms.label':'PHÒNG & SUITE','rooms.title1':'Không Gian','rooms.title2':'Hoàn Hảo',
    'rooms.desc':'Mỗi căn phòng là một tuyệt tác thiết kế — nơi tiện nghi hiện đại hòa quyện cùng hơi thở văn hóa Việt Nam.',
    'rooms.cta':'Xem Tất Cả Phòng',
    'rooms.feat1':'Nội thất cao cấp nhập khẩu','rooms.feat2':'Tầm nhìn panorama tuyệt đẹp',
    'rooms.feat3':'Dịch vụ 24/7 tận tâm','rooms.feat4':'Minibar & Spa cao cấp',
    // OFFERS (index)
    'offers.label':'ƯU ĐÃI ĐẶC BIỆT','offers.title1':'Khám Phá','offers.title2':'Ưu Đãi',
    'offer1.title':'Mùa Hè Vàng','offer1.desc':'Giảm đến <strong>40%</strong> cho kỳ nghỉ từ 3 đêm tại các khách sạn biển.','offer1.expiry':'Đến 31/08/2025',
    'offer2.title':'Đặt Sớm — Giá Tốt','offer2.desc':'Đặt trước 30 ngày, tiết kiệm <strong>25%</strong> và nhận bữa sáng miễn phí.','offer2.expiry':'Áp dụng quanh năm',
    'offer3.title':'Thành Viên Hoa Ban','offer3.desc':'Tích điểm, nâng hạng và nhận <strong>ưu đãi độc quyền</strong> dành riêng hội viên.','offer3.expiry':'Đăng ký miễn phí','offer3.btn':'Tham gia',
    'offer.book_now':'Đặt ngay',
    // TESTIMONIALS (index)
    'testi.label':'CẢM NHẬN KHÁCH HÀNG',
    'testi.q1':'"Dịch vụ tuyệt vời, phòng rộng rãi và sạch sẽ. View Hạ Long từ ban công cực kỳ ấn tượng. Chắc chắn sẽ quay lại!"',
    'testi.q2':'"Mường Thanh Grand Đà Nẵng là lựa chọn hoàn hảo. Bãi biển ngay trước cửa, nhân viên nhiệt tình, giá cực hợp lý."',
    'testi.q3':'"Kỳ nghỉ Sa Pa đáng nhớ nhất trong cuộc đời. Khung cảnh núi non hùng vĩ, phòng ấm áp, ẩm thực địa phương đặc sắc."',
    // FOOTER
    'footer.home':'← Trang chủ','footer.search':'← Về trang tìm kiếm',
    'footer.tagline':'Chuỗi khách sạn tư nhân lớn nhất Đông Dương — Hơn 25 năm kiến tạo những trải nghiệm lưu trú đẳng cấp.',
    'footer.col_brands':'Thương Hiệu','footer.col_dest':'Điểm Đến','footer.col_support':'Hỗ Trợ',
    'footer.contact':'Liên hệ','footer.policy':'Chính sách','footer.terms':'Điều khoản chung',
    'footer.copyright':'© 2026 Mường Thanh Hospitality. All rights reserved.',
    'footer.made_in':'Thiết kế với ♥ tại Việt Nam',
    // SEARCH PAGE
    'search.hero_label':'TÌM KIẾM KHÁCH SẠN','search.hero_title':'Khám Phá <em>Hơn 63</em> Khách Sạn',
    'search.dest':'Điểm đến','search.dest_ph':'Tất cả điểm đến',
    'search.checkin':'Nhận phòng','search.checkout':'Trả phòng','search.guests_label':'Khách',
    'search.btn':'Tìm →',
    'search.filters':'Bộ Lọc','search.clear':'Xóa tất cả',
    'search.region':'Khu vực','search.all':'Tất cả',
    'search.north':'Miền Bắc','search.central':'Miền Trung','search.south':'Miền Nam',
    'search.brand_lbl':'Thương hiệu',
    'search.stars_lbl':'Hạng sao','search.stars5':'★★★★★ 5 sao','search.stars4':'★★★★ 4 sao',
    'search.price_lbl':'Giá mỗi đêm',
    'search.amenity_lbl':'Tiện nghi',
    'search.pool':'Hồ bơi','search.spa':'Spa','search.beach':'Bãi biển',
    'search.gym':'Phòng tập','search.conf':'Hội trường','search.rest':'Nhà hàng',
    'search.loading':'Đang tải...','search.mobile_filter':'Bộ lọc',
    'search.sort_rating':'Đánh giá cao nhất','search.sort_price_asc':'Giá thấp → cao',
    'search.sort_price_desc':'Giá cao → thấp','search.sort_name':'Tên A → Z',
    'search.empty_h':'Không tìm thấy khách sạn',
    'search.empty_p':'Vui lòng điều chỉnh bộ lọc hoặc thử tìm kiếm khác',
    'search.empty_btn':'Xóa bộ lọc',
    // JS dynamic (search)
    'search.found':'Tìm thấy <strong>{0}</strong> khách sạn','search.excellent':'Xuất sắc',
    'search.reviews_suffix':'đánh giá','search.view':'Xem chi tiết →',
    'search.reviews_lbl':'đánh giá','search.from':'Từ','search.night':'đêm',
    'search.view_detail':'Xem chi tiết →','search.stars_unit':'sao',
    'search.all_dest':'Tất cả điểm đến','search.wifi':'WiFi','search.parking':'Bãi đỗ xe',
    'price.from':'Từ','price.night':'/đêm','price.star':'sao',
    'region.north':'Miền Bắc','region.central':'Miền Trung','region.south':'Miền Nam',
    // HOTEL PAGE tabs
    'tab.overview':'Tổng quan','tab.rooms':'Phòng & Giá','tab.amenities':'Tiện nghi',
    'tab.location':'Vị trí','tab.reviews':'Đánh Giá',
    // HOTEL PAGE sections
    'hotel.intro_lbl':'GIỚI THIỆU','hotel.intro_t1':'Trải Nghiệm','hotel.intro_t2':'Đặc Biệt',
    'hotel.rating_lbl':'Đánh giá','hotel.reviews_lbl':'Lượt đánh giá','hotel.stars_lbl':'Hạng sao',
    'hotel.rooms_lbl':'PHÒNG & SUITE','hotel.rooms_t1':'Chọn Phòng','hotel.rooms_t2':'Phù Hợp',
    'hotel.checkin':'Nhận phòng','hotel.checkout':'Trả phòng','hotel.guests':'Số khách',
    'hotel.amenity_lbl':'TIỆN NGHI & DỊCH VỤ','hotel.amenity_t1':'Tất Cả','hotel.amenity_t2':'Tiện Ích',
    'hotel.map_lbl':'VỊ TRÍ','hotel.map_t1':'Tìm Chúng','hotel.map_t2':'Tôi',
    'hotel.rv_lbl':'ĐÁNH GIÁ','hotel.rv_t1':'Khách Hàng','hotel.rv_t2':'Nói Gì',
    'hotel.sim_lbl':'KHÁCH SẠN TƯƠNG TỰ','hotel.sim_t1':'Cũng Có Thể','hotel.sim_t2':'Thích',
    'hotel.back':'← Quay lại tìm kiếm','hotel.book_btn':'Đặt Phòng','hotel.select':'Chọn Phòng',
    // JS dynamic (hotel rooms)
    'room.price_per_night':'Giá mỗi đêm','room.total_nights':'Tổng {0} đêm:','room.book':'Đặt Phòng Này',
    'room.max_guests':'Tối đa {0} khách','room.include1':'Bữa sáng miễn phí',
    'room.include2':'WiFi tốc độ cao','room.include3':'Minibar',
    'hotel.price_per_night':'Giá mỗi đêm','hotel.total_nights':'Tổng {0} đêm','hotel.book_room_btn':'Đặt Phòng Này',
    'hotel.max_guests':'Tối đa {0} khách',
    'hotel.incl_breakfast':'Bữa sáng miễn phí','hotel.incl_wifi':'WiFi tốc độ cao',
    'hotel.incl_room_service':'Dịch vụ phòng 24/7','hotel.incl_cancel':'Miễn phí hủy phòng',
    'hotel.am_pool_name':'Hồ bơi ngoài trời','hotel.am_pool_sub':'Mở cửa 6:00 - 22:00',
    'hotel.am_spa_name':'Spa & Wellness','hotel.am_spa_sub':'Massage, xông hơi, chăm sóc da',
    'hotel.am_gym_name':'Phòng gym hiện đại','hotel.am_gym_sub':'Thiết bị cao cấp 24/7',
    'hotel.am_rest_name':'Nhà hàng đa ẩm thực','hotel.am_rest_sub':'Bữa sáng buffet, ẩm thực Á-Âu',
    'hotel.am_bar_name':'Sky Bar & Lounge','hotel.am_bar_sub':'Cocktail, rượu vang, đặc sản địa phương',
    'hotel.am_wifi_name':'WiFi miễn phí','hotel.am_wifi_sub':'Tốc độ cao toàn khu vực',
    'hotel.am_park_name':'Bãi đỗ xe miễn phí','hotel.am_park_sub':'An ninh 24/7',
    'hotel.am_beach_name':'Bãi biển riêng','hotel.am_beach_sub':'Ghế tắm nắng & ô che miễn phí',
    'hotel.am_conf_name':'Hội trường sự kiện','hotel.am_conf_sub':'Sức chứa 500+ khách',
    // JS dynamic (reviews)
    'rv.no_reviews':'Chưa có đánh giá nào. Hãy là người đầu tiên!',
    'rv.count':'{0} đánh giá','rv.login_cta':'Đăng nhập để viết đánh giá',
    'rv.form_title':'Viết đánh giá của bạn','rv.title_ph':'Tiêu đề (tùy chọn)',
    'rv.comment_ph':'Chia sẻ trải nghiệm của bạn...','rv.submit':'Gửi Đánh Giá',
    'rv.submitting':'Đang gửi...','rv.success':'Đánh giá đã được gửi, đang chờ kiểm duyệt!',
    'hotel.rv_count_lbl':'đánh giá','hotel.rv_empty':'Chưa có đánh giá nào. Hãy là người đầu tiên!',
    'hotel.rv_anon':'Khách ẩn danh','hotel.rv_reply_label':'Phản hồi từ khách sạn:',
    'hotel.rv_login_cta':'Đăng nhập để viết đánh giá',
    'hotel.rv_form_title':'Viết đánh giá của bạn','hotel.rv_title_ph':'Tiêu đề (tùy chọn)',
    'hotel.rv_comment_ph':'Chia sẻ trải nghiệm của bạn...','hotel.rv_submit':'Gửi Đánh Giá',
    'hotel.rv_sending':'Đang gửi...','hotel.rv_success':'Đánh giá đã được gửi, đang chờ kiểm duyệt!',
    'hotel.rv_err_empty':'Vui lòng nhập nội dung đánh giá.','hotel.rv_fail':'Gửi thất bại.',
    'hotel.rv_conn_err':'Lỗi kết nối.',
    'rv.err_empty':'Vui lòng nhập nội dung đánh giá.','rv.err_conn':'Lỗi kết nối.',
    'rv.hotel_reply':'Phản hồi từ khách sạn:','rv.anonymous':'Khách ẩn danh',
    // LOGIN
    'login.back':'Trang chủ','login.tagline':'Chuỗi khách sạn tư nhân lớn nhất Đông Dương',
    'login.divider':'hoặc tiếp tục với email',
    'login.tab_in':'Đăng nhập','login.tab_reg':'Đăng ký',
    'login.email':'Email','login.password':'Mật khẩu','login.remember':'Ghi nhớ đăng nhập',
    'login.btn_in':'Đăng Nhập',
    'login.lastname':'Họ','login.firstname':'Tên','login.phone':'Số điện thoại',
    'login.nationality':'Quốc tịch','login.confirm':'Xác nhận mật khẩu','login.btn_reg':'Tạo Tài Khoản',
    // PROFILE
    'profile.home':'Trang chủ','profile.book_link':'Đặt phòng',
    'profile.info':'Thông tin cá nhân','profile.bookings':'Lịch sử đặt phòng',
    'profile.promos':'Khuyến mãi','profile.password':'Đổi mật khẩu',
    'profile.save':'Lưu thay đổi','profile.logout':'Đăng xuất',
    // BOOKING JS
    'bk.guests_unit':' khách','bk.nights_unit':' đêm',
    'bk.extras':'Dịch vụ bổ sung','bk.checkin':'Nhận phòng','bk.checkout':'Trả phòng',
    'bk.nights':'Số đêm','bk.guests':'Số khách','bk.total':'Tổng thanh toán',
    'bk.person_unit':' người',
    'booking.guests_unit':'khách','booking.nights_unit':'đêm',
    'booking.extra_services':'Dịch vụ bổ sung','booking.service_fee':'Phí dịch vụ',
    'booking.discount':'Giảm giá','booking.processing':'Đang xử lý...',
    'booking.confirm_btn':'Xác Nhận & Đặt Phòng','booking.ref_label':'Mã đặt phòng: ',
    'booking.rv_guest':'Khách hàng','booking.rv_email':'Email','booking.rv_phone':'Điện thoại',
    'booking.rv_hotel':'Khách sạn','booking.rv_room':'Loại phòng',
    'booking.rv_checkin':'Nhận phòng','booking.rv_checkout':'Trả phòng',
    'booking.rv_nights':'Số đêm','booking.rv_guests':'Số khách',
    'booking.rv_payment':'Phương thức','booking.rv_promo':'Mã giảm giá',
    'booking.rv_total':'Tổng thanh toán',
    'booking.voucher_off':'Giảm','booking.voucher_exp':'HSD',
    'booking.voucher_remove':'Hủy','booking.voucher_select':'Chọn',
    'booking.promo_not_yet':'Chưa có hiệu lực','booking.promo_expired':'Đã hết hạn',
    'booking.promo_used_up':'Đã hết lượt',
    'booking.promo_min_nights':'Cần tối thiểu {0} đêm',
    'booking.promo_min_total':'Đơn tối thiểu {0}',
    'booking.promo_brand_only':'Chỉ hạng {0}',
    'booking.promo_applied':'Đã áp dụng "{0}" · Giảm {1}',
    'booking.promo_check_err':'Không thể kiểm tra mã. Thử lại sau.',
    'booking.promo_apply_btn':'Áp dụng',
  },

  en: {
    // NAV
    'nav.destinations':'Destinations','nav.brands':'Brands','nav.rooms':'Rooms','nav.offers':'Offers',
    'nav.book':'Book Now','nav.login':'Sign In','nav.logout':'Sign Out',
    'nav.search':'Find Hotels','nav.back_home':'← Home',
    'nav.back_search':'← Back to Search','nav.back_hotel':'← Back to Hotel',
    // HERO
    'hero.label':"INDOCHINA'S LARGEST PRIVATE HOTEL CHAIN",
    'hero.line1':'Luxury','hero.line2':'Stays','hero.line3':'Vietnam',
    'hero.sub':'Over 63 hotels across Vietnam and Laos — where every journey begins in elegance.',
    'hero.cta1':'Explore Now','hero.cta2':'See Destinations',
    'hero.stat1':'Hotels','hero.stat2':'Provinces','hero.stat3':'Years of experience',
    // BOOKING BAR
    'bar.title':'Book a Room','bar.dest':'Destination','bar.dest_ph':'Select destination',
    'bar.checkin':'Check-in','bar.checkout':'Check-out','bar.guests':'Guests','bar.search':'Search',
    // DESTINATIONS
    'dest.label':'FEATURED DESTINATIONS','dest.title1':'Discover','dest.title2':'Vietnam',
    'dest.explore':'Explore →','dest.hotels_unit':'Hotels',
    // BRANDS
    'brands.label':'BRAND PORTFOLIO','brands.title1':'Four Tiers','brands.title2':'One Experience',
    'brands.more':'Learn more →','brands.learn_more':'Learn more →',
    'brand.luxury.desc':'International 5-star standards, prime locations, and impeccable personalized service.',
    'brand.grand.desc':'Spacious, luxurious spaces suited for both business travelers and families.',
    'brand.holiday.desc':'The ideal resort destination for family holidays at Vietnam\'s most beautiful beaches.',
    'brand.mt.desc':'Vietnamese cultural identity — warm and welcoming, just like home.',
    // ROOMS
    'rooms.label':'ROOMS & SUITES','rooms.title1':'Perfect','rooms.title2':'Spaces',
    'rooms.desc':'Each room is a design masterpiece — where modern comfort blends with Vietnam\'s cultural soul.',
    'rooms.cta':'View All Rooms',
    'rooms.feat1':'Premium imported furnishings','rooms.feat2':'Stunning panoramic views',
    'rooms.feat3':'24/7 attentive service','rooms.feat4':'Minibar & Premium Spa',
    // OFFERS
    'offers.label':'SPECIAL OFFERS','offers.title1':'Discover','offers.title2':'Our Deals',
    'offer1.title':'Golden Summer','offer1.desc':'Up to <strong>40%</strong> off for stays of 3+ nights at beachside hotels.','offer1.expiry':'Until 31/08/2025',
    'offer2.title':'Early Bird','offer2.desc':'Book 30 days ahead, save <strong>25%</strong> and get free breakfast.','offer2.expiry':'Year-round',
    'offer3.title':'Hoa Ban Member','offer3.desc':'Earn points, upgrade tiers and receive <strong>exclusive perks</strong> for members.','offer3.expiry':'Free to join','offer3.btn':'Join Now',
    'offer.book_now':'Book Now',
    // TESTIMONIALS
    'testi.label':'GUEST REVIEWS',
    'testi.q1':'"Excellent service, spacious and clean rooms. The Ha Long view from the balcony was absolutely stunning. Will definitely return!"',
    'testi.q2':'"Muong Thanh Grand Da Nang is the perfect choice. Beach right at the door, friendly staff, and very reasonable prices."',
    'testi.q3':'"The most memorable Sa Pa holiday of my life. Majestic mountain scenery, warm rooms, and exceptional local cuisine."',
    // FOOTER
    'footer.home':'← Home','footer.search':'← Back to search',
    'footer.tagline':'Indochina\'s largest private hotel chain — 25+ years crafting exceptional stays.',
    'footer.col_brands':'Brands','footer.col_dest':'Destinations','footer.col_support':'Support',
    'footer.contact':'Contact us','footer.policy':'Privacy policy','footer.terms':'Terms & Conditions',
    'footer.copyright':'© 2026 Mường Thanh Hospitality. All rights reserved.',
    'footer.made_in':'Made with ♥ in Vietnam',
    // SEARCH PAGE
    'search.hero_label':'SEARCH HOTELS','search.hero_title':'Explore <em>Over 63</em> Hotels',
    'search.dest':'Destination','search.dest_ph':'All destinations',
    'search.checkin':'Check-in','search.checkout':'Check-out','search.guests_label':'Guests',
    'search.btn':'Search →',
    'search.filters':'Filters','search.clear':'Clear all',
    'search.region':'Region','search.all':'All',
    'search.north':'Northern','search.central':'Central','search.south':'Southern',
    'search.brand_lbl':'Brand',
    'search.stars_lbl':'Star rating','search.stars5':'★★★★★ 5 stars','search.stars4':'★★★★ 4 stars',
    'search.price_lbl':'Price per night',
    'search.amenity_lbl':'Amenities',
    'search.pool':'Swimming pool','search.spa':'Spa','search.beach':'Beach',
    'search.gym':'Gym','search.conf':'Conference hall','search.rest':'Restaurant',
    'search.loading':'Loading...','search.mobile_filter':'Filters',
    'search.sort_rating':'Highest rated','search.sort_price_asc':'Price: Low → High',
    'search.sort_price_desc':'Price: High → Low','search.sort_name':'Name A → Z',
    'search.empty_h':'No hotels found',
    'search.empty_p':'Please adjust your filters or try a different search',
    'search.empty_btn':'Clear filters',
    // JS dynamic (search)
    'search.found':'Found <strong>{0}</strong> hotels','search.excellent':'Excellent',
    'search.reviews_suffix':'reviews','search.view':'View details →',
    'search.reviews_lbl':'reviews','search.from':'From','search.night':'night',
    'search.view_detail':'View details →','search.stars_unit':'stars',
    'search.all_dest':'All destinations','search.wifi':'WiFi','search.parking':'Parking',
    'price.from':'From','price.night':'/night','price.star':'stars',
    'region.north':'Northern','region.central':'Central','region.south':'Southern',
    // HOTEL PAGE tabs
    'tab.overview':'Overview','tab.rooms':'Rooms & Pricing','tab.amenities':'Amenities',
    'tab.location':'Location','tab.reviews':'Reviews',
    // HOTEL PAGE sections
    'hotel.intro_lbl':'ABOUT','hotel.intro_t1':'A Special','hotel.intro_t2':'Experience',
    'hotel.rating_lbl':'Rating','hotel.reviews_lbl':'Reviews','hotel.stars_lbl':'Star class',
    'hotel.rooms_lbl':'ROOMS & SUITES','hotel.rooms_t1':'Choose Your','hotel.rooms_t2':'Room',
    'hotel.checkin':'Check-in','hotel.checkout':'Check-out','hotel.guests':'Guests',
    'hotel.amenity_lbl':'AMENITIES & SERVICES','hotel.amenity_t1':'All','hotel.amenity_t2':'Facilities',
    'hotel.map_lbl':'LOCATION','hotel.map_t1':'Find','hotel.map_t2':'Us',
    'hotel.rv_lbl':'REVIEWS','hotel.rv_t1':'What Our','hotel.rv_t2':'Guests Say',
    'hotel.sim_lbl':'SIMILAR HOTELS','hotel.sim_t1':'You Might','hotel.sim_t2':'Also Like',
    'hotel.back':'← Back to search','hotel.book_btn':'Book Now','hotel.select':'Select Room',
    // JS dynamic (hotel rooms)
    'room.price_per_night':'Price per night','room.total_nights':'Total {0} nights:','room.book':'Book This Room',
    'room.max_guests':'Max {0} guests','room.include1':'Free breakfast',
    'room.include2':'High-speed WiFi','room.include3':'Minibar',
    'hotel.price_per_night':'Price per night','hotel.total_nights':'Total {0} nights','hotel.book_room_btn':'Book This Room',
    'hotel.max_guests':'Max {0} guests',
    'hotel.incl_breakfast':'Free breakfast','hotel.incl_wifi':'High-speed WiFi',
    'hotel.incl_room_service':'24/7 Room service','hotel.incl_cancel':'Free cancellation',
    'hotel.am_pool_name':'Outdoor swimming pool','hotel.am_pool_sub':'Open 6:00 AM - 10:00 PM',
    'hotel.am_spa_name':'Spa & Wellness','hotel.am_spa_sub':'Massage, sauna, skincare',
    'hotel.am_gym_name':'Modern fitness center','hotel.am_gym_sub':'Premium equipment 24/7',
    'hotel.am_rest_name':'Multi-cuisine restaurant','hotel.am_rest_sub':'Breakfast buffet, Asian & Western',
    'hotel.am_bar_name':'Sky Bar & Lounge','hotel.am_bar_sub':'Cocktails, wines, local specialties',
    'hotel.am_wifi_name':'Free WiFi','hotel.am_wifi_sub':'High-speed throughout the property',
    'hotel.am_park_name':'Free parking','hotel.am_park_sub':'24/7 security',
    'hotel.am_beach_name':'Private beach','hotel.am_beach_sub':'Sun loungers & umbrellas included',
    'hotel.am_conf_name':'Event conference hall','hotel.am_conf_sub':'Capacity 500+ guests',
    // JS dynamic (reviews)
    'rv.no_reviews':'No reviews yet. Be the first!',
    'rv.count':'{0} reviews','rv.login_cta':'Sign in to write a review',
    'rv.form_title':'Write your review','rv.title_ph':'Title (optional)',
    'rv.comment_ph':'Share your experience...','rv.submit':'Submit Review',
    'rv.submitting':'Submitting...','rv.success':'Review submitted, pending approval!',
    'rv.err_empty':'Please enter your review.','rv.err_conn':'Connection error.',
    'rv.hotel_reply':'Hotel reply:','rv.anonymous':'Anonymous guest',
    'hotel.rv_count_lbl':'reviews','hotel.rv_empty':'No reviews yet. Be the first!',
    'hotel.rv_anon':'Anonymous guest','hotel.rv_reply_label':'Hotel reply:',
    'hotel.rv_login_cta':'Sign in to write a review',
    'hotel.rv_form_title':'Write your review','hotel.rv_title_ph':'Title (optional)',
    'hotel.rv_comment_ph':'Share your experience...','hotel.rv_submit':'Submit Review',
    'hotel.rv_sending':'Submitting...','hotel.rv_success':'Review submitted, pending approval!',
    'hotel.rv_err_empty':'Please enter your review.','hotel.rv_fail':'Submission failed.',
    'hotel.rv_conn_err':'Connection error.',
    // LOGIN
    'login.back':'Home','login.tagline':"Indochina's largest private hotel chain",
    'login.divider':'or continue with email',
    'login.tab_in':'Sign In','login.tab_reg':'Create Account',
    'login.email':'Email','login.password':'Password','login.remember':'Remember me',
    'login.btn_in':'Sign In',
    'login.lastname':'Last Name','login.firstname':'First Name','login.phone':'Phone Number',
    'login.nationality':'Nationality','login.confirm':'Confirm Password','login.btn_reg':'Create Account',
    // PROFILE
    'profile.home':'Home','profile.book_link':'Book a room',
    'profile.info':'Personal Information','profile.bookings':'Booking History',
    'profile.promos':'Promotions','profile.password':'Change Password',
    'profile.save':'Save Changes','profile.logout':'Sign Out',
    // BOOKING JS
    'bk.guests_unit':' guests','bk.nights_unit':' nights',
    'bk.extras':'Additional services','bk.checkin':'Check-in','bk.checkout':'Check-out',
    'bk.nights':'Nights','bk.guests':'Guests','bk.total':'Total amount',
    'bk.person_unit':' guests',
    'booking.guests_unit':'guests','booking.nights_unit':'nights',
    'booking.extra_services':'Additional services','booking.service_fee':'Service fee',
    'booking.discount':'Discount','booking.processing':'Processing...',
    'booking.confirm_btn':'Confirm & Book','booking.ref_label':'Booking reference: ',
    'booking.rv_guest':'Guest','booking.rv_email':'Email','booking.rv_phone':'Phone',
    'booking.rv_hotel':'Hotel','booking.rv_room':'Room type',
    'booking.rv_checkin':'Check-in','booking.rv_checkout':'Check-out',
    'booking.rv_nights':'Nights','booking.rv_guests':'Guests',
    'booking.rv_payment':'Payment method','booking.rv_promo':'Promo code',
    'booking.rv_total':'Total amount',
    'booking.voucher_off':'Off','booking.voucher_exp':'Expires',
    'booking.voucher_remove':'Remove','booking.voucher_select':'Select',
    'booking.promo_not_yet':'Not yet active','booking.promo_expired':'Expired',
    'booking.promo_used_up':'Usage limit reached',
    'booking.promo_min_nights':'Minimum {0} nights required',
    'booking.promo_min_total':'Minimum order {0}',
    'booking.promo_brand_only':'{0} tier only',
    'booking.promo_applied':'Applied "{0}" · {1} off',
    'booking.promo_check_err':'Unable to verify code. Try again later.',
    'booking.promo_apply_btn':'Apply',
  }
};

function getLang() { return localStorage.getItem('lang') || 'vi'; }

function setLang(lang) { localStorage.setItem('lang', lang); location.reload(); }

function t(key, ...args) {
  const lang = getLang();
  let str = (I18N[lang] && I18N[lang][key]) ?? (I18N.vi[key]) ?? key;
  args.forEach((a, i) => { str = str.replace(`{${i}}`, a); });
  return str;
}

function applyTranslations() {
  const lang = getLang();
  document.documentElement.lang = lang === 'en' ? 'en' : 'vi';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = (I18N[lang] && I18N[lang][key]) ?? (I18N.vi && I18N.vi[key]);
    if (val !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
      else el.innerHTML = val;
    }
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    const val = (I18N[lang] && I18N[lang][key]) ?? (I18N.vi && I18N.vi[key]);
    if (val !== undefined) el.placeholder = val;
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

document.addEventListener('DOMContentLoaded', applyTranslations);
