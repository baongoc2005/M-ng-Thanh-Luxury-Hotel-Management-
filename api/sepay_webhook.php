<?php
/**
 * SePay Payment Webhook
 * ---------------------------------------------------
 * Cấu hình trong SePay:
 *   Webhook → Thêm webhook → URL nhận webhook:
 *   https://yourdomain.com/booking.mt/api/sepay_webhook.php
 *
 *   Loại giao dịch: Tiền vào
 *   Định dạng: JSON
 *
 * Để test local dùng ngrok:
 *   ngrok http 80  →  https://xxxx.ngrok.io/booking.mt/api/sepay_webhook.php
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'message' => 'POST only'], 405);
}

// ===== XÁC THỰC TOKEN =====
if (SEPAY_API_TOKEN !== '') {
    // Apache/XAMPP thường không truyền Authorization vào $_SERVER, dùng fallback
    $authHeader = $_SERVER['HTTP_AUTHORIZATION']
               ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
               ?? '';
    if ($authHeader === '' && function_exists('apache_request_headers')) {
        $hdrs = apache_request_headers();
        $authHeader = $hdrs['Authorization'] ?? $hdrs['authorization'] ?? '';
    }
    $token = trim(str_replace('Apikey', '', $authHeader));
    if ($token !== SEPAY_API_TOKEN) {
        respond(['success' => false, 'message' => 'Unauthorized'], 200);
    }
}

$payload = json_decode(file_get_contents('php://input'), true);
if (!$payload) respond(['success' => false, 'message' => 'Invalid JSON'], 200);

// ===== CHỈ XỬ LÝ TIỀN VÀO =====
if (($payload['transferType'] ?? '') !== 'in') {
    respond(['success' => true, 'message' => 'Skipped: not incoming']);
}

$content       = strtoupper($payload['content']     ?? '');
$code          = strtoupper($payload['code']        ?? '');   // SePay auto-extract
$amountIn      = (float)($payload['transferAmount'] ?? 0);
$gateway       = $payload['gateway']        ?? '';
$transDate     = $payload['transactionDate']?? date('Y-m-d H:i:s');
$referenceCode = $payload['referenceCode']  ?? null;

// ===== TÌM MÃ ĐẶT PHÒNG TRONG NỘI DUNG CHUYỂN KHOẢN =====
// Ưu tiên code đã được SePay tách, fallback tìm pattern MT-XXXX hoặc MTXXXX trong content
// (một số app ngân hàng bỏ dấu gạch ngang khi chuyển)
$refCode = '';
if ($code) {
    $normalized = strtoupper(preg_replace('/^MT([A-Z0-9]+)$/i', 'MT-$1', $code));
    if (preg_match('/^MT-[A-Z0-9]+$/', $normalized)) $refCode = $normalized;
}
if (!$refCode) {
    // Khớp cả MT-XXXX và MTXXXX
    if (preg_match('/\bMT-?([A-Z0-9]+)\b/i', $content, $m)) {
        $refCode = 'MT-' . strtoupper($m[1]);
    }
}

if (!$refCode) {
    // Không tìm được mã — ghi log và bỏ qua
    logWebhook($payload, 'NO_REF_CODE');
    respond(['success' => true, 'message' => 'No ref_code found in content']);
}

$db = getDB();

// ===== TÌM BOOKING =====
$st = $db->prepare("SELECT * FROM bookings WHERE ref_code = ? LIMIT 1");
$st->execute([$refCode]);
$booking = $st->fetch();

if (!$booking) {
    logWebhook($payload, 'BOOKING_NOT_FOUND', $refCode);
    respond(['success' => true, 'message' => 'Booking not found']);
}

// ===== KIỂM TRA ĐÃ THANH TOÁN CHƯA =====
if ($booking['status'] === 'confirmed' || $booking['status'] === 'checked_in') {
    respond(['success' => true, 'message' => 'Already confirmed']);
}

// ===== KIỂM TRA SỐ TIỀN (cho phép lệch ±1000đ) =====
$expectedAmount = (float)$booking['grand_total'];
$diff           = abs($amountIn - $expectedAmount);
$amountMatched  = ($diff <= 1000) || ($amountIn >= $expectedAmount * 0.95);

// ===== CẬP NHẬT BOOKING =====
$db->prepare("
    UPDATE bookings
    SET status = 'confirmed',
        notes  = CONCAT(COALESCE(notes,''), '\n[SePay] Thanh toán ', FORMAT(?, 0), 'đ qua ', ?, ' lúc ', ?)
    WHERE ref_code = ?
")->execute([$amountIn, $gateway, $transDate, $refCode]);

// ===== GHI PAYMENT RECORD =====
$db->prepare("
    INSERT INTO payments (ref_code, booking_id, type, amount, method, status, note, paid_at)
    VALUES (?, ?, 'full', ?, 'bank_transfer', 'paid', ?, NOW())
")->execute([
    $refCode,
    $booking['id'],
    $amountIn,
    "SePay · {$gateway} · {$referenceCode}" . ($amountMatched ? '' : " · LỆCH SỐ TIỀN: expected {$expectedAmount}"),
]);

// ===== GỬI EMAIL XÁC NHẬN THANH TOÁN =====
$hoTen = trim($booking['last_name'] . ' ' . $booking['first_name']);
sendTemplateEmail('payment_confirmed', $booking['email'], $hoTen, [
    'ho_ten'     => $hoTen,
    'ref_code'   => $refCode,
    'hotel_name' => $booking['hotel_name'],
    'check_in'   => $booking['check_in'],
    'check_out'  => $booking['check_out'],
    'guests'     => $booking['guests'],
    'grand_total'=> number_format((float)$booking['grand_total'], 0, ',', '.'),
]);

logWebhook($payload, $amountMatched ? 'SUCCESS' : 'SUCCESS_AMOUNT_MISMATCH', $refCode);
respond(['success' => true, 'message' => 'Payment confirmed', 'ref_code' => $refCode]);

// ===== HELPERS =====
function logWebhook(array $payload, string $status, string $ref = ''): void {
    $logDir  = __DIR__ . '/../logs';
    if (!is_dir($logDir)) @mkdir($logDir, 0755, true);
    $line = date('Y-m-d H:i:s') . " [$status] ref=$ref amount=" . ($payload['transferAmount'] ?? 0)
          . " content=" . substr($payload['content'] ?? '', 0, 80) . "\n";
    @file_put_contents($logDir . '/sepay.log', $line, FILE_APPEND);
}
