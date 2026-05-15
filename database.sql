-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for osx10.10 (x86_64)
--
-- Host: localhost    Database: booking_mt
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_code` varchar(50) NOT NULL,
  `source` enum('website','booking_com','traveloka','agoda','hotline','zalo','facebook','other') NOT NULL DEFAULT 'website',
  `external_id` varchar(100) DEFAULT NULL COMMENT 'ID từ OTA (Booking.com, Beds24...)',
  `hotel_slug` varchar(100) NOT NULL,
  `hotel_name` varchar(200) NOT NULL,
  `room_type` varchar(100) NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `nights` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `guests` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `last_name` varchar(100) NOT NULL DEFAULT '',
  `first_name` varchar(100) NOT NULL DEFAULT '',
  `email` varchar(200) NOT NULL DEFAULT '',
  `phone` varchar(50) NOT NULL DEFAULT '',
  `nationality` varchar(10) NOT NULL DEFAULT 'VN',
  `special_requests` text DEFAULT NULL,
  `extra_breakfast` tinyint(1) NOT NULL DEFAULT 0,
  `extra_airport` tinyint(1) NOT NULL DEFAULT 0,
  `extra_flowers` tinyint(1) NOT NULL DEFAULT 0,
  `extra_spa` tinyint(1) NOT NULL DEFAULT 0,
  `payment_method` varchar(50) NOT NULL DEFAULT 'card',
  `price_per_night` decimal(15,0) NOT NULL DEFAULT 0,
  `base_total` decimal(15,0) NOT NULL DEFAULT 0,
  `extras_total` decimal(15,0) NOT NULL DEFAULT 0,
  `service_fee` decimal(15,0) NOT NULL DEFAULT 0,
  `grand_total` decimal(15,0) NOT NULL DEFAULT 0,
  `status` enum('pending','confirmed','cancelled','checked_in','checked_out') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ref_code` (`ref_code`),
  KEY `idx_source` (`source`),
  KEY `idx_status` (`status`),
  KEY `idx_check_in` (`check_in`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'MT-TEXGY4E7D6','website',NULL,'luxury-saigon','Mường Thanh Luxury Sài Gòn','Deluxe City View','2026-05-13','2026-05-14',1,1,'Do','Toan','jaisgj@gmail.com','2190839','VN','',0,0,0,0,'transfer',2300000,2300000,0,115000,2415000,'pending',NULL,'2026-05-12 14:15:41','2026-05-12 14:16:06'),(2,'MT-TEXIA60D2A','website',NULL,'luxury-da-nang','Mường Thanh Luxury Đà Nẵng','Ocean View Room','2026-05-13','2026-05-14',1,1,'Toan','do','jsahd@gmail.com','211231','VN','',1,0,0,0,'transfer',2100000,2100000,200000,115000,2415000,'pending',NULL,'2026-05-12 14:44:30','2026-05-12 14:44:30'),(3,'MT-BOO-TEXL15811C','booking_com','BDC-553838','luxury-saigon','Mường Thanh Grand Hạ Long','Mountain View Room','2026-05-14','2026-05-16',2,2,'Lê','Thị Lan','guest9983@gmail.com','0962840409','VN','Đặt qua Booking.com',0,0,0,0,'ota',1150000,9000000,0,0,9000000,'confirmed','Đơn tự động từ BOOKING COM','2026-05-12 15:43:54','2026-05-12 15:43:54'),(4,'MT-BOO-TEZB8F7CA8','booking_com','BDC-396571','luxury-phu-quoc','Mường Thanh Holiday Đà Lạt','Beach View Room','2026-05-15','2026-05-17',2,2,'Phạm','Thu Hương','guest6543@gmail.com','0914408202','VN','Đặt qua Booking.com',0,0,0,0,'ota',1200000,14000000,0,0,14000000,'confirmed','Đơn tự động từ BOOKING COM','2026-05-13 14:07:27','2026-05-13 14:07:27'),(5,'MT-TRA-TEZB8G78D8','traveloka','TVL-357949','grand-ha-noi-centre','Mường Thanh Grand Hà Nội Centre','Superior Room','2026-05-16','2026-05-18',2,3,'Đỗ','Thị Lan','customer2678@gmail.com','0922342753','VN','Đặt qua Traveloka App',0,0,0,0,'ota',1350000,2700000,0,0,2700000,'confirmed','Đơn tự động từ TRAVELOKA','2026-05-13 14:07:28','2026-05-13 14:07:28'),(6,'MT-AGO-TEZB8GEA46','agoda','AGD-883790','luxury-phu-quoc','Mường Thanh Luxury Phú Quốc','Overwater Bungalow','2026-05-14','2026-05-16',2,1,'Hoàng','Thị Mai','agoda37@gmail.com','0960796969','KR','Booked via Agoda',0,0,0,0,'ota',9800000,19600000,0,0,19600000,'confirmed','Đơn tự động từ AGODA','2026-05-13 14:07:28','2026-05-13 14:07:28'),(7,'MT-TEZB8H5498','hotline',NULL,'grand-lao-cai','Mường Thanh Grand Lào Cai','Standard Room','2026-05-18','2026-05-20',2,2,'Bùi','Minh Tuấn','','0938876486','VN','',0,0,0,0,'cash',850000,0,0,0,1700000,'confirmed','Nhận qua hotline — nhân viên: Nguyễn Thị Mai','2026-05-13 14:07:29','2026-05-13 14:07:29'),(8,'MT-TEZB8HEB23','zalo',NULL,'luxury-dien-bien','Mường Thanh Luxury Điện Biên','Deluxe Room','2026-05-16','2026-05-18',2,2,'Phạm','Minh Tuấn','','0969263212','VN','',0,0,0,0,'transfer',1200000,0,0,0,2400000,'pending','Đặt qua Zalo OA','2026-05-13 14:07:29','2026-05-13 14:07:29'),(9,'MT-TEZB8I01A0','facebook',NULL,'holiday-vung-tau','Mường Thanh Holiday Vũng Tàu','Sea View Room','2026-05-20','2026-05-22',2,2,'Trần','Ngọc Linh','','0926286560','VN','',0,0,0,0,'cash',1100000,0,0,0,2200000,'pending','Đặt qua Facebook Messenger','2026-05-13 14:07:30','2026-05-13 14:07:30'),(10,'MT-BOO-TEZB9J021D','booking_com','BDC-670225','grand-lao-cai','Mường Thanh Grand Lào Cai','Deluxe Room','2026-05-15','2026-05-17',2,2,'Lê','Minh Tuấn','guest1981@gmail.com','0987970376','VN','Đặt qua Booking.com',0,0,0,0,'ota',3100000,2400000,0,0,2400000,'confirmed','Đơn tự động từ BOOKING COM','2026-05-13 14:08:07','2026-05-13 14:08:07'),(11,'MT-BOO-TEZB9KC23D','booking_com','BDC-146979','luxury-phu-quoc','Mường Thanh Grand Nha Trang','Garden Room','2026-05-15','2026-05-17',2,2,'Hoàng','Hữu Đức','guest4202@gmail.com','0915930444','VN','Đặt qua Booking.com',0,0,0,0,'ota',1050000,5600000,0,0,5600000,'confirmed','Đơn tự động từ BOOKING COM','2026-05-13 14:08:08','2026-05-13 14:08:08'),(12,'MT-BOO-TEZB9K5091','booking_com','BDC-712852','luxury-dien-bien','Mường Thanh Holiday Vũng Tàu','Deluxe Mountain Suite','2026-05-15','2026-05-17',2,2,'Đỗ','Thu Hương','guest6831@gmail.com','0925020498','VN','Đặt qua Booking.com',0,0,0,0,'ota',1650000,3100000,0,0,3100000,'confirmed','Đơn tự động từ BOOKING COM','2026-05-13 14:08:08','2026-05-13 14:08:08'),(13,'MT-BOO-TEZB9K010B','booking_com','BDC-530821','holiday-da-lat','Mường Thanh Luxury Nha Trang','Sea View Deluxe','2026-05-15','2026-05-17',2,2,'Đặng','Thị Mai','guest2962@gmail.com','0972208141','VN','Đặt qua Booking.com',0,0,0,0,'ota',3200000,13000000,0,0,13000000,'confirmed','Đơn tự động từ BOOKING COM','2026-05-13 14:08:08','2026-05-13 14:08:08'),(14,'MT-BOO-TEZB9LEAF7','booking_com','BDC-828638','luxury-song-han','Mường Thanh Grand Lào Cai','Penthouse Suite','2026-05-15','2026-05-17',2,2,'Đỗ','Hữu Đức','guest8063@gmail.com','0978685242','VN','Đặt qua Booking.com',0,0,0,0,'ota',5500000,2400000,0,0,2400000,'confirmed','Đơn tự động từ BOOKING COM','2026-05-13 14:08:09','2026-05-13 14:08:09'),(15,'MT-BOO-TEZB9L4E84','booking_com','BDC-644513','luxury-dien-bien','Mường Thanh Luxury Cần Thơ','Family Suite','2026-05-15','2026-05-17',2,2,'Phạm','Minh Tuấn','guest2176@gmail.com','0958301188','VN','Đặt qua Booking.com',0,0,0,0,'ota',3500000,19600000,0,0,19600000,'confirmed','Đơn tự động từ BOOKING COM','2026-05-13 14:08:09','2026-05-13 14:08:09'),(16,'MT-BOO-TEZB9LBE27','booking_com','BDC-688163','grand-nha-trang','Mường Thanh Sa Pa','Heritage Suite','2026-05-15','2026-05-17',2,2,'Phạm','Văn An','guest9892@gmail.com','0957689833','VN','Đặt qua Booking.com',0,0,0,0,'ota',890000,13000000,0,0,13000000,'confirmed','Đơn tự động từ BOOKING COM','2026-05-13 14:08:09','2026-05-13 14:08:09'),(17,'MT-BOO-TEZB9M53A0','booking_com','BDC-491739','luxury-da-nang','Mường Thanh Luxury Nha Trang','Romance Suite','2026-05-15','2026-05-17',2,2,'Hoàng','Thị Mai','guest7499@gmail.com','0911111470','VN','Đặt qua Booking.com',0,0,0,0,'ota',1200000,3360000,0,0,3360000,'confirmed','Đơn tự động từ BOOKING COM','2026-05-13 14:08:10','2026-05-13 14:08:10'),(18,'MT-BOO-TEZBBSF32C','booking_com','BDC-253387','luxury-ha-long','Mường Thanh Luxury Sài Gòn','Superior Room','2026-05-15','2026-05-17',2,2,'Nguyễn','Hữu Đức','guest731@gmail.com','0985790896','VN','Đặt qua Booking.com',0,0,0,0,'ota',980000,7000000,0,0,7000000,'confirmed','Đơn tự động từ BOOKING COM','2026-05-13 14:09:28','2026-05-13 14:09:28'),(19,'MT-TRA-TEZBC3214A','traveloka','TVL-797015','grand-can-tho','Mường Thanh Luxury Cần Thơ','River View Room','2026-05-16','2026-05-18',2,3,'Hồ','Thị Lan','customer3704@gmail.com','0934605865','VN','Đặt qua Traveloka App',0,0,0,0,'ota',1450000,2900000,0,0,2900000,'confirmed','Đơn tự động từ TRAVELOKA','2026-05-13 14:09:40','2026-05-13 14:09:40'),(20,'MT-AGO-TEZBCA6C74','agoda','AGD-385578','grand-halong','Mường Thanh Grand Hạ Long','Junior Suite','2026-05-14','2026-05-16',2,1,'Hồ','Văn An','agoda7411@gmail.com','0994766399','KR','Booked via Agoda',0,0,0,0,'ota',2400000,4800000,0,0,4800000,'confirmed','Đơn tự động từ AGODA','2026-05-13 14:09:46','2026-05-13 14:09:46');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(200) NOT NULL,
  `last_name` varchar(100) NOT NULL DEFAULT '',
  `first_name` varchar(100) NOT NULL DEFAULT '',
  `phone` varchar(30) DEFAULT '',
  `nationality` varchar(10) DEFAULT 'VN',
  `vip` tinyint(1) DEFAULT 0,
  `notes` text DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'jaisgj@gmail.com','Do','Toan','2190839','VN',0,NULL,NULL,'2026-05-13 18:22:25'),(2,'jsahd@gmail.com','Toan','do','211231','VN',0,NULL,NULL,'2026-05-13 18:22:25'),(3,'guest9983@gmail.com','Lê','Thị Lan','0962840409','VN',0,NULL,NULL,'2026-05-13 18:22:25'),(4,'guest6543@gmail.com','Phạm','Thu Hương','0914408202','VN',0,NULL,NULL,'2026-05-13 18:22:25'),(5,'customer2678@gmail.com','Đỗ','Thị Lan','0922342753','VN',0,NULL,NULL,'2026-05-13 18:22:25'),(6,'agoda37@gmail.com','Hoàng','Thị Mai','0960796969','KR',0,NULL,NULL,'2026-05-13 18:22:25'),(7,'guest1981@gmail.com','Lê','Minh Tuấn','0987970376','VN',0,NULL,NULL,'2026-05-13 18:22:25'),(8,'guest4202@gmail.com','Hoàng','Hữu Đức','0915930444','VN',0,NULL,NULL,'2026-05-13 18:22:25'),(9,'guest6831@gmail.com','Đỗ','Thu Hương','0925020498','VN',0,NULL,NULL,'2026-05-13 18:22:25'),(10,'guest2962@gmail.com','Đặng','Thị Mai','0972208141','VN',0,NULL,NULL,'2026-05-13 18:22:25'),(11,'guest8063@gmail.com','Đỗ','Hữu Đức','0978685242','VN',0,NULL,NULL,'2026-05-13 18:22:25'),(12,'guest2176@gmail.com','Phạm','Minh Tuấn','0958301188','VN',0,NULL,NULL,'2026-05-13 18:22:25'),(13,'guest9892@gmail.com','Phạm','Văn An','0957689833','VN',0,NULL,NULL,'2026-05-13 18:22:25'),(14,'guest7499@gmail.com','Hoàng','Thị Mai','0911111470','VN',0,NULL,NULL,'2026-05-13 18:22:25'),(15,'guest731@gmail.com','Nguyễn','Hữu Đức','0985790896','VN',0,NULL,NULL,'2026-05-13 18:22:25'),(16,'customer3704@gmail.com','Hồ','Thị Lan','0934605865','VN',0,NULL,NULL,'2026-05-13 18:22:25'),(17,'agoda7411@gmail.com','Hồ','Văn An','0994766399','KR',0,NULL,NULL,'2026-05-13 18:22:25'),(33,'toandep04@gmail.com','Đỗ','Tiến Toàn','098472876','VN',0,NULL,'$2y$10$gDIHgZTKyd/zxdfyH1smc.Vbb4rcq13Sx4f5ID.26ngQ2.eYeagrS','2026-05-14 04:22:39');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotel_rooms`
--

DROP TABLE IF EXISTS `hotel_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hotel_rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hotel_id` int(11) NOT NULL,
  `type_name` varchar(100) NOT NULL,
  `price` decimal(15,0) NOT NULL DEFAULT 0,
  `size` int(11) NOT NULL DEFAULT 30 COMMENT 'm²',
  `beds` varchar(50) NOT NULL DEFAULT 'King',
  PRIMARY KEY (`id`),
  KEY `hotel_id` (`hotel_id`),
  CONSTRAINT `hotel_rooms_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel_rooms`
--

LOCK TABLES `hotel_rooms` WRITE;
/*!40000 ALTER TABLE `hotel_rooms` DISABLE KEYS */;
INSERT INTO `hotel_rooms` VALUES (1,1,'Deluxe Bay View',1850000,42,'King'),(2,1,'Premier Suite',3200000,68,'King'),(3,1,'Penthouse Suite',6500000,120,'King'),(4,2,'Superior Room',1200000,35,'Twin/King'),(5,2,'Deluxe Room',1550000,42,'King'),(6,2,'Junior Suite',2400000,65,'King'),(7,3,'Ocean View Room',2100000,45,'King'),(8,3,'Beach Suite',3800000,75,'King'),(9,3,'Presidential Suite',8500000,150,'King'),(10,4,'River View Room',1750000,40,'King'),(11,4,'Dragon Bridge Suite',3100000,70,'King'),(12,5,'Mountain View Room',980000,32,'Twin/King'),(13,5,'Deluxe Mountain Suite',1650000,55,'King'),(14,6,'Standard Room',850000,30,'Twin/King'),(15,6,'Superior Room',1100000,38,'King'),(16,6,'Suite',1800000,60,'King'),(17,7,'Sea View Room',1950000,44,'King'),(18,7,'Ocean Suite',3500000,80,'King'),(19,7,'Luxury Villa',7000000,140,'King'),(20,8,'City View Room',1150000,35,'Twin/King'),(21,8,'Sea View Deluxe',1650000,44,'King'),(22,8,'Family Suite',2800000,90,'Twin+King'),(23,9,'Superior Room',1350000,36,'Twin/King'),(24,9,'Deluxe Room',1700000,44,'King'),(25,9,'Executive Suite',3200000,75,'King'),(26,10,'Deluxe City View',2300000,48,'King'),(27,10,'Premier Suite',4500000,90,'King'),(28,10,'Sky Penthouse',9500000,200,'King'),(29,11,'Garden View Room',890000,32,'Twin/King'),(30,11,'Deluxe Room',1250000,42,'King'),(31,11,'Romance Suite',2100000,65,'King'),(32,12,'Beach View Room',2650000,50,'King'),(33,12,'Pool Villa',5500000,110,'King'),(34,12,'Overwater Bungalow',9800000,80,'King'),(35,13,'Deluxe Room',1200000,40,'King'),(36,13,'Heritage Suite',2100000,70,'King'),(37,14,'Garden Room',1050000,36,'Twin/King'),(38,14,'Pool Access Room',1680000,44,'King'),(39,14,'Ancient Town Suite',2800000,75,'King'),(40,15,'River View Room',1450000,42,'King'),(41,15,'Riverside Suite',2600000,78,'King'),(42,15,'Premium Suite',4200000,110,'King'),(43,16,'Sea View Room',1100000,36,'Twin/King'),(44,16,'Beach Suite',2000000,65,'King'),(45,16,'Family Villa',3500000,120,'Twin+King');
/*!40000 ALTER TABLE `hotel_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotels`
--

DROP TABLE IF EXISTS `hotels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hotels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(100) NOT NULL,
  `name` varchar(200) NOT NULL,
  `brand` enum('luxury','grand','holiday','muongthanh') NOT NULL DEFAULT 'luxury',
  `city` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `region` enum('north','central','south') NOT NULL DEFAULT 'north',
  `stars` tinyint(4) NOT NULL DEFAULT 4,
  `price` decimal(15,0) NOT NULL DEFAULT 0 COMMENT 'Giá phòng thấp nhất',
  `rating` decimal(3,1) NOT NULL DEFAULT 4.0,
  `reviews` int(11) NOT NULL DEFAULT 0,
  `image` varchar(200) NOT NULL DEFAULT 'img/hero.png',
  `gallery` text NOT NULL DEFAULT '' COMMENT 'comma-separated image paths',
  `amenities` varchar(500) NOT NULL DEFAULT '' COMMENT 'pool,spa,gym,...',
  `description` text DEFAULT NULL,
  `lat` decimal(10,6) DEFAULT NULL,
  `lng` decimal(10,6) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_brand` (`brand`),
  KEY `idx_city` (`city`),
  KEY `idx_region` (`region`),
  KEY `idx_active` (`active`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels`
--

LOCK TABLES `hotels` WRITE;
/*!40000 ALTER TABLE `hotels` DISABLE KEYS */;
INSERT INTO `hotels` VALUES (1,'luxury-ha-long','Mường Thanh Luxury Hạ Long Centre','luxury','Hạ Long','Quảng Ninh','north',5,1850000,4.8,1240,'img/halong.png','','pool,spa,gym,restaurant,bar,wifi,parking,beach,conference','Tọa lạc tại vị trí đắc địa ngay trung tâm thành phố Hạ Long, khách sạn mang đến tầm nhìn toàn cảnh vịnh Hạ Long huyền ảo. Với 289 phòng và suite được thiết kế tinh tế, cùng hệ thống tiện ích đẳng cấp 5 sao.',20.958700,107.042800,1,'2026-05-13 14:45:55','2026-05-13 14:45:55'),(2,'grand-halong','Mường Thanh Grand Hạ Long','grand','Hạ Long','Quảng Ninh','north',4,1200000,4.6,980,'img/halong.png','','pool,restaurant,bar,wifi,parking,conference','Khách sạn 4 sao sang trọng với vị trí trung tâm Hạ Long, gần các điểm tham quan và mua sắm nổi tiếng. Lý tưởng cho cả du lịch nghỉ dưỡng và hội nghị doanh nghiệp.',20.961200,107.045200,1,'2026-05-13 14:45:55','2026-05-13 14:45:55'),(3,'luxury-da-nang','Mường Thanh Luxury Đà Nẵng','luxury','Đà Nẵng','Đà Nẵng','central',5,2100000,4.9,1560,'img/danang.png','','pool,spa,gym,restaurant,bar,wifi,parking,beach','Nằm ngay trên bãi biển Mỹ Khê xanh trong, khách sạn 5 sao với infinity pool hướng biển, spa cao cấp và nhà hàng buffet hải sản tươi sống.',16.054400,108.202200,1,'2026-05-13 14:45:55','2026-05-13 14:45:55'),(4,'luxury-song-han','Mường Thanh Luxury Sông Hàn','luxury','Đà Nẵng','Đà Nẵng','central',5,1750000,4.7,870,'img/danang.png','','pool,spa,restaurant,bar,wifi,parking','Nhìn ra dòng sông Hàn thơ mộng và cầu Rồng biểu tượng, khách sạn mang phong cách thiết kế hiện đại với không gian sang trọng.',16.067800,108.226800,1,'2026-05-13 14:45:55','2026-05-13 14:45:55'),(5,'sapa','Mường Thanh Sa Pa','muongthanh','Sa Pa','Lào Cai','north',4,980000,4.5,720,'img/sapa.png','','spa,restaurant,bar,wifi,parking','Tọa lạc giữa thiên nhiên hùng vĩ của Sa Pa, khách sạn là điểm dừng chân lý tưởng để khám phá ruộng bậc thang Mường Hoa, đỉnh Fansipan.',22.336400,103.843800,1,'2026-05-13 14:45:55','2026-05-13 14:45:55'),(6,'grand-lao-cai','Mường Thanh Grand Lào Cai','grand','Lào Cai','Lào Cai','north',4,850000,4.4,540,'img/sapa.png','','pool,restaurant,wifi,parking,conference','Khách sạn 4 sao tại trung tâm thành phố Lào Cai, cổng vào Sa Pa và Fansipan. Không gian rộng rãi, sang trọng.',22.485600,103.975500,1,'2026-05-13 14:45:55','2026-05-13 14:45:55'),(7,'luxury-nha-trang','Mường Thanh Luxury Nha Trang','luxury','Nha Trang','Khánh Hòa','central',5,1950000,4.8,1100,'img/danang.png','','pool,spa,gym,restaurant,bar,wifi,parking,beach','Trực tiếp trên bãi biển Nha Trang xanh ngọc, khách sạn mang đến trải nghiệm nghỉ dưỡng 5 sao với bể bơi ngoài trời, spa thư giãn.',12.238800,109.196700,1,'2026-05-13 14:45:55','2026-05-13 14:45:55'),(8,'grand-nha-trang','Mường Thanh Grand Nha Trang','grand','Nha Trang','Khánh Hòa','central',4,1150000,4.5,760,'img/danang.png','','pool,restaurant,bar,wifi,parking','Khách sạn 4 sao tại trung tâm Nha Trang, cách bãi biển 100m. Thiết kế hiện đại với phòng ốc thoáng đãng.',12.246100,109.198500,1,'2026-05-13 14:45:55','2026-05-13 14:45:55'),(9,'grand-ha-noi-centre','Mường Thanh Grand Hà Nội Centre','grand','Hà Nội','Hà Nội','north',4,1350000,4.6,1890,'img/hero.png','','pool,spa,gym,restaurant,bar,wifi,parking,conference','Ngay trung tâm thủ đô Hà Nội, khách sạn là điểm dừng chân lý tưởng để khám phá Hồ Gươm, phố cổ và các danh lam thắng cảnh.',21.027800,105.834200,1,'2026-05-13 14:45:55','2026-05-13 14:45:55'),(10,'luxury-saigon','Mường Thanh Luxury Sài Gòn','luxury','Hồ Chí Minh','Hồ Chí Minh','south',5,2300000,4.9,2100,'img/room.png','','pool,spa,gym,restaurant,bar,wifi,parking,conference','Biểu tượng xa xỉ tại trung tâm TP.HCM, khách sạn sở hữu tầm nhìn panorama toàn thành phố từ tầng cao. Dịch vụ butler cá nhân hóa 24/7.',10.776900,106.700900,1,'2026-05-13 14:45:55','2026-05-13 14:45:55'),(11,'holiday-da-lat','Mường Thanh Holiday Đà Lạt','holiday','Đà Lạt','Lâm Đồng','central',4,890000,4.4,630,'img/sapa.png','','restaurant,bar,wifi,parking,spa','Giữa thành phố ngàn hoa Đà Lạt mộng mơ, khách sạn mang kiến trúc Pháp cổ điển với vườn hoa rực rỡ.',11.940400,108.458300,1,'2026-05-13 14:45:55','2026-05-13 14:45:55'),(12,'luxury-phu-quoc','Mường Thanh Luxury Phú Quốc','luxury','Phú Quốc','Kiên Giang','south',5,2650000,4.8,980,'img/danang.png','','pool,spa,gym,restaurant,bar,wifi,parking,beach','Thiên đường nhiệt đới trên đảo ngọc Phú Quốc, khách sạn nằm ngay bãi biển hoang sơ với làn nước trong xanh.',10.289900,103.984000,1,'2026-05-13 14:45:55','2026-05-13 14:45:55'),(13,'luxury-dien-bien','Mường Thanh Luxury Điện Biên','luxury','Điện Biên Phủ','Điện Biên','north',5,1200000,4.6,410,'img/sapa.png','','pool,spa,restaurant,wifi,parking','Khách sạn Luxury tại vùng đất lịch sử Điện Biên Phủ, kết hợp trải nghiệm văn hóa và nghỉ dưỡng sang trọng.',21.386000,103.016000,1,'2026-05-13 14:45:55','2026-05-13 14:45:55'),(14,'holiday-hoi-an','Mường Thanh Holiday Hội An','holiday','Hội An','Quảng Nam','central',4,1050000,4.6,890,'img/danang.png','','pool,spa,restaurant,bar,wifi,parking,beach','Kết hợp hoàn hảo giữa phố cổ Hội An di sản UNESCO và bãi biển An Bàng thơ mộng.',15.880100,108.338000,1,'2026-05-13 14:45:55','2026-05-13 14:45:55'),(15,'grand-can-tho','Mường Thanh Luxury Cần Thơ','luxury','Cần Thơ','Cần Thơ','south',5,1450000,4.7,560,'img/hero.png','','pool,spa,restaurant,bar,wifi,parking,conference','Soi bóng bên dòng sông Hậu thơ mộng, khách sạn là biểu tượng sang trọng của miền Tây.',10.034100,105.788000,1,'2026-05-13 14:45:55','2026-05-13 14:45:55'),(16,'holiday-vung-tau','Mường Thanh Holiday Vũng Tàu','holiday','Vũng Tàu','Bà Rịa - Vũng Tàu','south',4,1100000,4.5,740,'img/danang.png','','pool,restaurant,bar,wifi,parking,beach','Chỉ 2 giờ từ TP.HCM, khu nghỉ dưỡng Vũng Tàu là điểm đến cuối tuần lý tưởng với bãi biển sạch.',10.346000,107.084300,1,'2026-05-13 14:45:55','2026-05-13 14:45:55');
/*!40000 ALTER TABLE `hotels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `promotions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(200) NOT NULL,
  `discount_type` enum('percent','fixed') DEFAULT 'percent',
  `discount_value` decimal(10,2) NOT NULL DEFAULT 10.00,
  `min_nights` int(11) DEFAULT 1,
  `min_total` decimal(15,0) DEFAULT 0,
  `applies_to` enum('all','luxury','grand','holiday','muongthanh') DEFAULT 'all',
  `valid_from` date DEFAULT NULL,
  `valid_to` date DEFAULT NULL,
  `usage_limit` int(11) DEFAULT 0 COMMENT '0=unlimited',
  `used_count` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES (1,'WELCOME10','Chào mừng khách mới','percent',10.00,1,0,'all','2026-01-01','2026-12-31',0,0,1,'2026-05-13 18:22:25'),(2,'SUMMER20','Ưu đãi hè 2026','percent',20.00,2,0,'all','2026-06-01','2026-08-31',0,0,1,'2026-05-13 18:22:25'),(3,'LUXURY500K','Giảm 500K khách sạn Luxury','fixed',500000.00,3,0,'all','2026-01-01','2026-12-31',0,0,1,'2026-05-13 18:22:25'),(4,'WEEKEND15','Cuối tuần giảm 15%','percent',15.00,2,0,'all','2026-01-01','2026-12-31',0,0,1,'2026-05-13 18:22:25');
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hotel_id` int(11) NOT NULL,
  `booking_ref` varchar(50) DEFAULT '',
  `customer_name` varchar(200) DEFAULT '',
  `customer_email` varchar(200) DEFAULT '',
  `rating` tinyint(4) NOT NULL DEFAULT 5,
  `title` varchar(300) DEFAULT '',
  `comment` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `reply` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_hotel` (`hotel_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,3,'','Nguyễn Văn An','an.nguyen@gmail.com',5,'Tuyệt vời!','Phòng rộng, view biển đẹp. Nhân viên thân thiện và chuyên nghiệp. Sẽ quay lại!','approved',NULL,'2026-05-13 18:22:25'),(2,3,'','Trần Thị Bích','bich.tran@gmail.com',4,'Rất hài lòng','Vị trí đắc địa, bãi biển sạch. Bữa sáng buffet phong phú.','approved',NULL,'2026-05-13 18:22:25'),(3,2,'','Lê Văn Cường','cuong.le@gmail.com',3,'Tạm được','Phòng ổn nhưng wifi chập chờn. Nhân viên check-in hơi chậm.','pending',NULL,'2026-05-13 18:22:25'),(4,12,'','Phạm Minh Đức','duc.pham@gmail.com',5,'Hoàn hảo','Kỳ nghỉ tuyệt vời cùng gia đình. Hồ bơi rất đẹp.','approved',NULL,'2026-05-13 18:22:25'),(5,5,'','Vũ Thị Lan','lan.vu@gmail.com',2,'Thất vọng','Phòng không khớp ảnh quảng cáo, điều hòa bị lỗi.','pending',NULL,'2026-05-13 18:22:25');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hotel_id` int(11) DEFAULT NULL,
  `full_name` varchar(200) NOT NULL,
  `email` varchar(200) DEFAULT '',
  `phone` varchar(30) DEFAULT '',
  `role` enum('manager','receptionist','housekeeping','concierge','security','other') DEFAULT 'receptionist',
  `active` tinyint(1) DEFAULT 1,
  `joined_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `hotel_id` (`hotel_id`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,3,'Nguyễn Thị Lan','lan.nguyen@muongthanh.vn','0901234567','manager',1,'2023-01-15',NULL,'2026-05-13 18:22:25'),(2,3,'Trần Minh Khoa','khoa.tran@muongthanh.vn','0912345678','receptionist',1,'2024-03-01',NULL,'2026-05-13 18:22:25'),(3,3,'Hoàng Thị Mai','mai.hoang@muongthanh.vn','0934567890','housekeeping',1,'2023-08-20',NULL,'2026-05-13 18:22:25'),(4,2,'Phạm Văn Hùng','hung.pham@muongthanh.vn','0923456789','manager',1,'2022-05-10',NULL,'2026-05-13 18:22:25'),(5,2,'Lê Thị Thu','thu.le@muongthanh.vn','0945678901','receptionist',1,'2024-01-08',NULL,'2026-05-13 18:22:25'),(6,10,'Đỗ Văn Nam','nam.do@muongthanh.vn','0956789012','manager',1,'2021-11-03',NULL,'2026-05-13 18:22:25'),(7,10,'Bùi Thị Hoa','hoa.bui@muongthanh.vn','0967890123','concierge',1,'2023-04-15',NULL,'2026-05-13 18:22:25'),(8,12,'Ngô Minh Tuấn','tuan.ngo@muongthanh.vn','0978901234','manager',1,'2022-09-01',NULL,'2026-05-13 18:22:25');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-14 23:33:09
