<?php
require_once __DIR__ . '/config.php';
if ($_SERVER['REQUEST_METHOD'] !== 'GET') respond(['error' => 'GET only'], 405);

$db = getDB();

// Tổng quan
$totals = $db->query("
  SELECT
    COUNT(*) AS total_bookings,
    COALESCE(SUM(grand_total),0) AS total_revenue,
    COUNT(CASE WHEN status='pending' THEN 1 END) AS pending,
    COUNT(CASE WHEN status='confirmed' THEN 1 END) AS confirmed,
    COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) AS today_bookings,
    COALESCE(SUM(CASE WHEN DATE(created_at) = CURDATE() THEN grand_total ELSE 0 END),0) AS today_revenue
  FROM bookings
")->fetch();

// Bookings theo nguồn
$bySource = $db->query("
  SELECT source, COUNT(*) AS cnt, COALESCE(SUM(grand_total),0) AS revenue
  FROM bookings GROUP BY source ORDER BY cnt DESC
")->fetchAll();

// Doanh thu 14 ngày gần nhất
$revenue14 = $db->query("
  SELECT DATE(created_at) AS day, COUNT(*) AS bookings, COALESCE(SUM(grand_total),0) AS revenue
  FROM bookings
  WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 13 DAY)
  GROUP BY DATE(created_at)
  ORDER BY day ASC
")->fetchAll();

// Khách sạn top doanh thu
$topHotels = $db->query("
  SELECT hotel_name, COUNT(*) AS bookings, COALESCE(SUM(grand_total),0) AS revenue
  FROM bookings WHERE hotel_name != ''
  GROUP BY hotel_name ORDER BY revenue DESC LIMIT 5
")->fetchAll();

// Thống kê phụ
$extra = $db->query("
  SELECT
    (SELECT COUNT(*) FROM customers) AS customers,
    (SELECT COUNT(*) FROM hotels WHERE active=1) AS hotels,
    (SELECT COUNT(*) FROM staff WHERE active=1) AS staff,
    (SELECT COUNT(*) FROM reviews WHERE status='pending') AS pending_reviews,
    (SELECT COUNT(*) FROM promotions WHERE active=1) AS active_promos
")->fetch();

// Bookings theo trạng thái
$byStatus = $db->query("
  SELECT status, COUNT(*) AS cnt FROM bookings GROUP BY status
")->fetchAll();

respond([
    'totals'     => $totals,
    'bySource'   => $bySource,
    'revenue14'  => $revenue14,
    'topHotels'  => $topHotels,
    'extra'      => $extra,
    'byStatus'   => $byStatus,
]);
