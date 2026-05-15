<?php
/**
 * Webhook receiver — nhận đơn tự động từ Beds24 / OTA
 *
 * Cấu hình trong Beds24:
 *   Dashboard → Settings → Notifications → Booking Notification URL
 *   → http://yourdomain/booking.mt/api/webhook.php
 */
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['error' => 'POST only'], 405);

$data = json_decode(file_get_contents('php://input'), true) ?? [];

// Map tên kênh về enum hợp lệ
$srcMap = [
    'booking.com' => 'booking_com', 'bookingcom' => 'booking_com', 'booking' => 'booking_com',
    'traveloka'   => 'traveloka',   'agoda'       => 'agoda',
    'beds24'      => 'booking_com', 'expedia'     => 'other',      'airbnb' => 'other',
];
$rawSrc = strtolower($data['referer'] ?? $data['source'] ?? $data['channel'] ?? 'other');
$validSources = ['booking_com','traveloka','agoda','hotline','zalo','facebook','website','other'];
$source = $srcMap[$rawSrc] ?? (in_array($rawSrc, $validSources) ? $rawSrc : 'other');

// Chuẩn hóa ngày & số đêm
$checkIn  = $data['arrival']   ?? $data['check_in']  ?? date('Y-m-d');
$checkOut = $data['departure'] ?? $data['check_out'] ?? date('Y-m-d', strtotime('+1 day'));
$nights   = (int)($data['nights'] ?? max(1, round((strtotime($checkOut) - strtotime($checkIn)) / 86400)));
$guests   = max(1, (int)(($data['numadult'] ?? 0) + ($data['numchild'] ?? 0)) ?: (int)($data['guests'] ?? 1));

$db  = getDB();
$ref = generateRef('MT-' . strtoupper(substr($source, 0, 3)));

// Bỏ qua nếu OTA gửi trùng
$extId = $data['bookid'] ?? $data['external_id'] ?? null;
if ($extId) {
    $check = $db->prepare("SELECT id FROM bookings WHERE external_id = ? AND source = ?");
    $check->execute([$extId, $source]);
    if ($check->fetch()) respond(['success' => true, 'note' => 'duplicate_skipped']);
}

$db->prepare("
    INSERT INTO bookings
        (ref_code, source, external_id, hotel_slug, hotel_name, room_type,
         check_in, check_out, nights, guests,
         last_name, first_name, email, phone, nationality, special_requests,
         payment_method, price_per_night, base_total, extras_total, service_fee, grand_total,
         status, notes)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
")->execute([
    $ref, $source, $extId,
    $data['propid']         ?? $data['hotel_slug']      ?? 'unknown',
    $data['propname']       ?? $data['hotel_name']      ?? 'Mường Thanh',
    $data['roomname']       ?? $data['room_type']       ?? 'Standard Room',
    $checkIn, $checkOut, $nights, $guests,
    $data['guestname']      ?? $data['last_name']       ?? '',
    $data['guestfirstname'] ?? $data['first_name']      ?? '',
    $data['guestemail']     ?? $data['email']           ?? '',
    $data['guestphone']     ?? $data['phone']           ?? '',
    $data['guestcountry']   ?? $data['nationality']     ?? 'VN',
    $data['remarks']        ?? $data['special_requests']?? '',
    $data['payment_method'] ?? 'ota',
    (float)($data['price_per_night'] ?? 0),
    (float)($data['price']           ?? $data['base_total']  ?? 0),
    0, 0,
    (float)($data['price']           ?? $data['grand_total'] ?? 0),
    'confirmed',
    'Đơn tự động từ ' . strtoupper(str_replace('_', ' ', $source)),
]);

respond(['success' => true, 'ref_code' => $ref]);
