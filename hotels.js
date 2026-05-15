const HOTELS_DB = [
  {
    id: 1, slug: "luxury-ha-long",
    name: "Mường Thanh Luxury Hạ Long Centre",
    brand: "luxury", city: "Hạ Long", province: "Quảng Ninh", region: "north",
    stars: 5, price: 1850000, rating: 4.8, reviews: 1240,
    image: "img/halong.png",
    gallery: ["img/halong.png","img/room.png","img/hero.png"],
    lat: 20.9587, lng: 107.0428,
    amenities: ["pool","spa","gym","restaurant","bar","wifi","parking","beach","conference"],
    description: "Tọa lạc tại vị trí đắc địa ngay trung tâm thành phố Hạ Long, khách sạn mang đến tầm nhìn toàn cảnh vịnh Hạ Long huyền ảo. Với 289 phòng và suite được thiết kế tinh tế, cùng hệ thống tiện ích đẳng cấp 5 sao.",
    rooms: [
      {type:"Deluxe Bay View", price:1850000, size:42, beds:"King"},
      {type:"Premier Suite", price:3200000, size:68, beds:"King"},
      {type:"Penthouse Suite", price:6500000, size:120, beds:"King"}
    ]
  },
  {
    id: 2, slug: "grand-halong",
    name: "Mường Thanh Grand Hạ Long",
    brand: "grand", city: "Hạ Long", province: "Quảng Ninh", region: "north",
    stars: 4, price: 1200000, rating: 4.6, reviews: 980,
    image: "img/halong.png",
    gallery: ["img/halong.png","img/room.png"],
    lat: 20.9612, lng: 107.0452,
    amenities: ["pool","restaurant","bar","wifi","parking","conference"],
    description: "Khách sạn 4 sao sang trọng với vị trí trung tâm Hạ Long, gần các điểm tham quan và mua sắm nổi tiếng. Lý tưởng cho cả du lịch nghỉ dưỡng và hội nghị doanh nghiệp.",
    rooms: [
      {type:"Superior Room", price:1200000, size:35, beds:"Twin/King"},
      {type:"Deluxe Room", price:1550000, size:42, beds:"King"},
      {type:"Junior Suite", price:2400000, size:65, beds:"King"}
    ]
  },
  {
    id: 3, slug: "luxury-da-nang",
    name: "Mường Thanh Luxury Đà Nẵng",
    brand: "luxury", city: "Đà Nẵng", province: "Đà Nẵng", region: "central",
    stars: 5, price: 2100000, rating: 4.9, reviews: 1560,
    image: "img/danang.png",
    gallery: ["img/danang.png","img/room.png","img/hero.png"],
    lat: 16.0544, lng: 108.2022,
    amenities: ["pool","spa","gym","restaurant","bar","wifi","parking","beach"],
    description: "Nằm ngay trên bãi biển Mỹ Khê xanh trong, khách sạn 5 sao với infinity pool hướng biển, spa cao cấp và nhà hàng buffet hải sản tươi sống. Điểm nghỉ dưỡng hoàn hảo tại Đà Nẵng.",
    rooms: [
      {type:"Ocean View Room", price:2100000, size:45, beds:"King"},
      {type:"Beach Suite", price:3800000, size:75, beds:"King"},
      {type:"Presidential Suite", price:8500000, size:150, beds:"King"}
    ]
  },
  {
    id: 4, slug: "luxury-song-han",
    name: "Mường Thanh Luxury Sông Hàn",
    brand: "luxury", city: "Đà Nẵng", province: "Đà Nẵng", region: "central",
    stars: 5, price: 1750000, rating: 4.7, reviews: 870,
    image: "img/danang.png",
    gallery: ["img/danang.png","img/room.png"],
    lat: 16.0678, lng: 108.2268,
    amenities: ["pool","spa","restaurant","bar","wifi","parking"],
    description: "Nhìn ra dòng sông Hàn thơ mộng và cầu Rồng biểu tượng, khách sạn mang phong cách thiết kế hiện đại với không gian sang trọng và dịch vụ cá nhân hóa tinh tế.",
    rooms: [
      {type:"River View Room", price:1750000, size:40, beds:"King"},
      {type:"Dragon Bridge Suite", price:3100000, size:70, beds:"King"}
    ]
  },
  {
    id: 5, slug: "sapa",
    name: "Mường Thanh Sa Pa",
    brand: "muongthanh", city: "Sa Pa", province: "Lào Cai", region: "north",
    stars: 4, price: 980000, rating: 4.5, reviews: 720,
    image: "img/sapa.png",
    gallery: ["img/sapa.png","img/room.png","img/hero.png"],
    lat: 22.3364, lng: 103.8438,
    amenities: ["spa","restaurant","bar","wifi","parking"],
    description: "Tọa lạc giữa thiên nhiên hùng vĩ của Sa Pa, khách sạn là điểm dừng chân lý tưởng để khám phá ruộng bậc thang Mường Hoa, đỉnh Fansipan và văn hóa các dân tộc thiểu số.",
    rooms: [
      {type:"Mountain View Room", price:980000, size:32, beds:"Twin/King"},
      {type:"Deluxe Mountain Suite", price:1650000, size:55, beds:"King"}
    ]
  },
  {
    id: 6, slug: "grand-lao-cai",
    name: "Mường Thanh Grand Lào Cai",
    brand: "grand", city: "Lào Cai", province: "Lào Cai", region: "north",
    stars: 4, price: 850000, rating: 4.4, reviews: 540,
    image: "img/sapa.png",
    gallery: ["img/sapa.png","img/room.png"],
    lat: 22.4856, lng: 103.9755,
    amenities: ["pool","restaurant","wifi","parking","conference"],
    description: "Khách sạn 4 sao tại trung tâm thành phố Lào Cai, cổng vào Sa Pa và Fansipan. Không gian rộng rãi, sang trọng với đầy đủ tiện nghi phục vụ du khách và doanh nhân.",
    rooms: [
      {type:"Standard Room", price:850000, size:30, beds:"Twin/King"},
      {type:"Superior Room", price:1100000, size:38, beds:"King"},
      {type:"Suite", price:1800000, size:60, beds:"King"}
    ]
  },
  {
    id: 7, slug: "luxury-nha-trang",
    name: "Mường Thanh Luxury Nha Trang",
    brand: "luxury", city: "Nha Trang", province: "Khánh Hòa", region: "central",
    stars: 5, price: 1950000, rating: 4.8, reviews: 1100,
    image: "img/danang.png",
    gallery: ["img/danang.png","img/room.png","img/hero.png"],
    lat: 12.2388, lng: 109.1967,
    amenities: ["pool","spa","gym","restaurant","bar","wifi","parking","beach"],
    description: "Trực tiếp trên bãi biển Nha Trang xanh ngọc, khách sạn mang đến trải nghiệm nghỉ dưỡng 5 sao với bể bơi ngoài trời, spa thư giãn và ẩm thực Việt Nam cao cấp.",
    rooms: [
      {type:"Sea View Room", price:1950000, size:44, beds:"King"},
      {type:"Ocean Suite", price:3500000, size:80, beds:"King"},
      {type:"Luxury Villa", price:7000000, size:140, beds:"King"}
    ]
  },
  {
    id: 8, slug: "grand-nha-trang",
    name: "Mường Thanh Grand Nha Trang",
    brand: "grand", city: "Nha Trang", province: "Khánh Hòa", region: "central",
    stars: 4, price: 1150000, rating: 4.5, reviews: 760,
    image: "img/danang.png",
    gallery: ["img/danang.png","img/room.png"],
    lat: 12.2461, lng: 109.1985,
    amenities: ["pool","restaurant","bar","wifi","parking"],
    description: "Khách sạn 4 sao tại trung tâm Nha Trang, cách bãi biển 100m. Thiết kế hiện đại với phòng ốc thoáng đãng và dịch vụ thân thiện, phù hợp cho gia đình và cặp đôi.",
    rooms: [
      {type:"City View Room", price:1150000, size:35, beds:"Twin/King"},
      {type:"Sea View Deluxe", price:1650000, size:44, beds:"King"},
      {type:"Family Suite", price:2800000, size:90, beds:"Twin+King"}
    ]
  },
  {
    id: 9, slug: "grand-ha-noi-centre",
    name: "Mường Thanh Grand Hà Nội Centre",
    brand: "grand", city: "Hà Nội", province: "Hà Nội", region: "north",
    stars: 4, price: 1350000, rating: 4.6, reviews: 1890,
    image: "img/hero.png",
    gallery: ["img/hero.png","img/room.png"],
    lat: 21.0278, lng: 105.8342,
    amenities: ["pool","spa","gym","restaurant","bar","wifi","parking","conference"],
    description: "Ngay trung tâm thủ đô Hà Nội, khách sạn là điểm dừng chân lý tưởng để khám phá Hồ Gươm, phố cổ và các danh lam thắng cảnh nổi tiếng. Hội trường hiện đại phục vụ sự kiện lớn.",
    rooms: [
      {type:"Superior Room", price:1350000, size:36, beds:"Twin/King"},
      {type:"Deluxe Room", price:1700000, size:44, beds:"King"},
      {type:"Executive Suite", price:3200000, size:75, beds:"King"}
    ]
  },
  {
    id: 10, slug: "luxury-saigon",
    name: "Mường Thanh Luxury Sài Gòn",
    brand: "luxury", city: "Hồ Chí Minh", province: "Hồ Chí Minh", region: "south",
    stars: 5, price: 2300000, rating: 4.9, reviews: 2100,
    image: "img/room.png",
    gallery: ["img/room.png","img/hero.png","img/danang.png"],
    lat: 10.7769, lng: 106.7009,
    amenities: ["pool","spa","gym","restaurant","bar","wifi","parking","conference"],
    description: "Biểu tượng xa xỉ tại trung tâm TP.HCM, khách sạn sở hữu tầm nhìn panorama toàn thành phố từ tầng cao. Không gian sang trọng với dịch vụ butler cá nhân hóa 24/7.",
    rooms: [
      {type:"Deluxe City View", price:2300000, size:48, beds:"King"},
      {type:"Premier Suite", price:4500000, size:90, beds:"King"},
      {type:"Sky Penthouse", price:9500000, size:200, beds:"King"}
    ]
  },
  {
    id: 11, slug: "holiday-da-lat",
    name: "Mường Thanh Holiday Đà Lạt",
    brand: "holiday", city: "Đà Lạt", province: "Lâm Đồng", region: "central",
    stars: 4, price: 890000, rating: 4.4, reviews: 630,
    image: "img/sapa.png",
    gallery: ["img/sapa.png","img/room.png"],
    lat: 11.9404, lng: 108.4583,
    amenities: ["restaurant","bar","wifi","parking","spa"],
    description: "Giữa thành phố ngàn hoa Đà Lạt mộng mơ, khách sạn mang kiến trúc Pháp cổ điển với vườn hoa rực rỡ. Điểm nghỉ dưỡng lý tưởng trong khí hậu mát lành quanh năm.",
    rooms: [
      {type:"Garden View Room", price:890000, size:32, beds:"Twin/King"},
      {type:"Deluxe Room", price:1250000, size:42, beds:"King"},
      {type:"Romance Suite", price:2100000, size:65, beds:"King"}
    ]
  },
  {
    id: 12, slug: "luxury-phu-quoc",
    name: "Mường Thanh Luxury Phú Quốc",
    brand: "luxury", city: "Phú Quốc", province: "Kiên Giang", region: "south",
    stars: 5, price: 2650000, rating: 4.8, reviews: 980,
    image: "img/danang.png",
    gallery: ["img/danang.png","img/room.png","img/hero.png"],
    lat: 10.2899, lng: 103.9840,
    amenities: ["pool","spa","gym","restaurant","bar","wifi","parking","beach"],
    description: "Thiên đường nhiệt đới trên đảo ngọc Phú Quốc, khách sạn nằm ngay bãi biển hoang sơ với làn nước trong xanh. Lặn ngắm san hô, thưởng thức hải sản tươi và thư giãn tại spa.",
    rooms: [
      {type:"Beach View Room", price:2650000, size:50, beds:"King"},
      {type:"Pool Villa", price:5500000, size:110, beds:"King"},
      {type:"Overwater Bungalow", price:9800000, size:80, beds:"King"}
    ]
  },
  {
    id: 13, slug: "luxury-dien-bien",
    name: "Mường Thanh Luxury Điện Biên",
    brand: "luxury", city: "Điện Biên Phủ", province: "Điện Biên", region: "north",
    stars: 5, price: 1200000, rating: 4.6, reviews: 410,
    image: "img/sapa.png",
    gallery: ["img/sapa.png","img/room.png"],
    lat: 21.3860, lng: 103.0160,
    amenities: ["pool","spa","restaurant","wifi","parking"],
    description: "Khách sạn Luxury tại vùng đất lịch sử Điện Biên Phủ, kết hợp trải nghiệm văn hóa và nghỉ dưỡng sang trọng. Khám phá chiến địa huyền thoại và nét đặc sắc dân tộc Thái.",
    rooms: [
      {type:"Deluxe Room", price:1200000, size:40, beds:"King"},
      {type:"Heritage Suite", price:2100000, size:70, beds:"King"}
    ]
  },
  {
    id: 14, slug: "holiday-hoi-an",
    name: "Mường Thanh Holiday Hội An",
    brand: "holiday", city: "Hội An", province: "Quảng Nam", region: "central",
    stars: 4, price: 1050000, rating: 4.6, reviews: 890,
    image: "img/danang.png",
    gallery: ["img/danang.png","img/room.png","img/hero.png"],
    lat: 15.8801, lng: 108.3380,
    amenities: ["pool","spa","restaurant","bar","wifi","parking","beach"],
    description: "Kết hợp hoàn hảo giữa phố cổ Hội An di sản UNESCO và bãi biển An Bàng thơ mộng. Khách sạn thiết kế theo phong cách Hội An truyền thống với đèn lồng và gỗ cổ.",
    rooms: [
      {type:"Garden Room", price:1050000, size:36, beds:"Twin/King"},
      {type:"Pool Access Room", price:1680000, size:44, beds:"King"},
      {type:"Ancient Town Suite", price:2800000, size:75, beds:"King"}
    ]
  },
  {
    id: 15, slug: "grand-can-tho",
    name: "Mường Thanh Luxury Cần Thơ",
    brand: "luxury", city: "Cần Thơ", province: "Cần Thơ", region: "south",
    stars: 5, price: 1450000, rating: 4.7, reviews: 560,
    image: "img/hero.png",
    gallery: ["img/hero.png","img/room.png"],
    lat: 10.0341, lng: 105.7880,
    amenities: ["pool","spa","restaurant","bar","wifi","parking","conference"],
    description: "Soi bóng bên dòng sông Hậu thơ mộng, khách sạn là biểu tượng sang trọng của miền Tây. Thưởng thức chợ nổi Cái Răng và ẩm thực sông nước đặc trưng Nam Bộ.",
    rooms: [
      {type:"River View Room", price:1450000, size:42, beds:"King"},
      {type:"Riverside Suite", price:2600000, size:78, beds:"King"},
      {type:"Premium Suite", price:4200000, size:110, beds:"King"}
    ]
  },
  {
    id: 16, slug: "holiday-vung-tau",
    name: "Mường Thanh Holiday Vũng Tàu",
    brand: "holiday", city: "Vũng Tàu", province: "Bà Rịa - Vũng Tàu", region: "south",
    stars: 4, price: 1100000, rating: 4.5, reviews: 740,
    image: "img/danang.png",
    gallery: ["img/danang.png","img/room.png"],
    lat: 10.3460, lng: 107.0843,
    amenities: ["pool","restaurant","bar","wifi","parking","beach"],
    description: "Chỉ 2 giờ từ TP.HCM, khu nghỉ dưỡng Vũng Tàu là điểm đến cuối tuần lý tưởng với bãi biển sạch, hải sản tươi ngon và không khí trong lành của thành phố biển.",
    rooms: [
      {type:"Sea View Room", price:1100000, size:36, beds:"Twin/King"},
      {type:"Beach Suite", price:2000000, size:65, beds:"King"},
      {type:"Family Villa", price:3500000, size:120, beds:"Twin+King"}
    ]
  }
];

const PROVINCES = [...new Set(HOTELS_DB.map(h => h.province))].sort();
const CITIES = [...new Set(HOTELS_DB.map(h => h.city))].sort();
const BRANDS = ["luxury","grand","holiday","muongthanh"];
const REGIONS = {
  north: "Miền Bắc",
  central: "Miền Trung",
  south: "Miền Nam"
};
const AMENITY_LABELS = {
  pool:"Hồ bơi", spa:"Spa", gym:"Phòng tập", restaurant:"Nhà hàng",
  bar:"Bar", wifi:"WiFi miễn phí", parking:"Bãi đỗ xe",
  beach:"Bãi biển", conference:"Hội trường"
};
const BRAND_LABELS = {
  luxury:"Luxury", grand:"Grand", holiday:"Holiday", muongthanh:"Mường Thanh"
};
