<?php
session_name('mt_admin');
session_start();
require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') { http_response_code(204); exit; }

// Quyền truy cập theo role
const ROLE_PAGES = [
    'manager'      => ['dashboard','index','customers','hotels','staff','reviews','promotions','payments','emails','settings'],
    'receptionist' => ['dashboard','index','customers','reviews'],
    'concierge'    => ['dashboard','index','customers','reviews'],
    'housekeeping' => ['dashboard','index'],
    'security'     => ['dashboard'],
    'other'        => ['dashboard'],
];

match($action) {
    'login'  => handleLogin(),
    'logout' => handleLogout(),
    'me'     => handleMe(),
    default  => respond(['error' => 'Unknown action'], 404),
};

function handleLogin(): void {
    $b      = body();
    $email  = trim(strtolower($b['email'] ?? ''));
    $pass   = $b['password'] ?? '';

    if (!$email || !$pass) respond(['error' => 'Thiếu thông tin'], 400);

    $st = getDB()->prepare("SELECT * FROM staff WHERE email = ? AND active = 1 LIMIT 1");
    $st->execute([$email]);
    $staff = $st->fetch();

    if (!$staff || !$staff['password_hash'] || !password_verify($pass, $staff['password_hash']))
        respond(['error' => 'Email hoặc mật khẩu không đúng'], 401);

    session_regenerate_id(true);
    $_SESSION['staff_id']   = $staff['id'];
    $_SESSION['staff_role'] = $staff['role'];

    respond(['success' => true, 'staff' => safeStaff($staff)]);
}

function handleLogout(): void {
    session_destroy();
    respond(['success' => true]);
}

function handleMe(): void {
    if (empty($_SESSION['staff_id'])) {
        respond(['authenticated' => false]);
    }
    $st = getDB()->prepare("SELECT * FROM staff WHERE id = ? AND active = 1 LIMIT 1");
    $st->execute([$_SESSION['staff_id']]);
    $staff = $st->fetch();
    if (!$staff) { session_destroy(); respond(['authenticated' => false]); }

    $role  = $staff['role'];
    $pages = ROLE_PAGES[$role] ?? ['dashboard'];
    respond([
        'authenticated' => true,
        'staff'         => safeStaff($staff),
        'pages'         => $pages,
    ]);
}

function safeStaff(array $s): array {
    unset($s['password_hash']);
    return $s;
}
