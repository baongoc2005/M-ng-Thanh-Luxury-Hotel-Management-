<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$isLocal = in_array($_SERVER['SERVER_NAME'] ?? '', ['localhost', '127.0.0.1']);
define('DB_HOST',    'localhost');
define('DB_NAME',    $isLocal ? 'booking_mt'        : 'muongtha_booking');
define('DB_USER',    $isLocal ? 'root'               : 'muongtha_booking');
define('DB_PASS',    $isLocal ? ''                   : '06032004');
define('DB_CHARSET', 'utf8mb4');

// ===== CẤU HÌNH THANH TOÁN CHUYỂN KHOẢN (SePay) =====
// Điền thông tin tài khoản ngân hàng của khách sạn vào đây
define('BANK_ACCOUNT_NUMBER', '96247F1ENS');   // SePay Virtual Account
define('BANK_ACCOUNT_NAME',   'DO TIEN TOAN');
define('BANK_NAME',           'BIDV');
define('BANK_BIN',            '970418');   // BIDV BIN cho VietQR
define('SEPAY_API_TOKEN',     'mt_sepay_hook_2024_xK9mP3qR');  // Phải khớp với API Key bạn điền trong SePay

function getDB(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
            DB_USER, DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
        );
    } catch (PDOException $e) {
        respond(['error' => 'Không kết nối được database. Kiểm tra XAMPP MySQL và chạy setup.sql.'], 500);
    }
    return $pdo;
}

function respond(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function generateRef(string $prefix = 'MT'): string {
    return $prefix . '-' . strtoupper(base_convert(time(), 10, 36))
         . strtoupper(substr(md5(uniqid('', true)), 0, 4));
}

function body(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? $_POST;
}
