<?php
session_start();
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/mailer.php';

// Allow credentials for session cookies
header('Access-Control-Allow-Credentials: true');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'OPTIONS') { http_response_code(204); exit; }

match($action) {
    'register'        => handleRegister(),
    'login'           => handleLogin(),
    'google'          => handleGoogleLogin(),
    'logout'          => handleLogout(),
    'me'              => handleMe(),
    'update'          => handleUpdate(),
    'change_password' => handleChangePassword(),
    default           => respond(['error' => 'Unknown action'], 404),
};

// ===== HELPERS =====
function me(): ?array {
    if (empty($_SESSION['customer_id'])) return null;
    $st = getDB()->prepare("SELECT * FROM customers WHERE id = ?");
    $st->execute([$_SESSION['customer_id']]);
    return $st->fetch() ?: null;
}

function safe(array $c): array {
    unset($c['password_hash']);
    return $c;
}

// ===== REGISTER =====
function handleRegister(): void {
    $b  = body();
    $db = getDB();

    $email = trim(strtolower($b['email'] ?? ''));
    $pass  = $b['password'] ?? '';

    if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL))
        respond(['error' => 'Email không hợp lệ'], 400);
    if (strlen($pass) < 6)
        respond(['error' => 'Mật khẩu phải ít nhất 6 ký tự'], 400);
    if (empty($b['last_name']) && empty($b['first_name']))
        respond(['error' => 'Vui lòng nhập họ tên'], 400);

    $check = $db->prepare("SELECT id, password_hash FROM customers WHERE email = ?");
    $check->execute([$email]);
    $existing = $check->fetch();

    if ($existing && $existing['password_hash'])
        respond(['error' => 'Email này đã có tài khoản, vui lòng đăng nhập'], 409);

    $hash = password_hash($pass, PASSWORD_BCRYPT);

    if ($existing) {
        // Khách đã đặt phòng trước, chỉ thêm password
        $db->prepare("UPDATE customers SET last_name=?, first_name=?, phone=?, password_hash=? WHERE id=?")
           ->execute([$b['last_name'] ?? '', $b['first_name'] ?? '', $b['phone'] ?? '', $hash, $existing['id']]);
        $id = $existing['id'];
    } else {
        $db->prepare("INSERT INTO customers (email,last_name,first_name,phone,nationality,password_hash) VALUES (?,?,?,?,?,?)")
           ->execute([$email, $b['last_name'] ?? '', $b['first_name'] ?? '', $b['phone'] ?? '', $b['nationality'] ?? 'VN', $hash]);
        $id = (int)$db->lastInsertId();
    }

    session_regenerate_id(true);
    $_SESSION['customer_id'] = $id;

    $st = $db->prepare("SELECT * FROM customers WHERE id = ?");
    $st->execute([$id]);
    $customer = $st->fetch();

    // Send welcome email (non-blocking)
    $fullName = trim(($b['last_name'] ?? '') . ' ' . ($b['first_name'] ?? ''));
    sendTemplateEmail('welcome', $email, $fullName, [
        'ho_ten'       => $fullName,
        'ho_ten_day_du'=> $fullName,
        'email'        => $email,
    ]);

    respond(['success' => true, 'customer' => safe($customer)]);
}

// ===== LOGIN =====
function handleLogin(): void {
    $b  = body();
    $db = getDB();

    $email = trim(strtolower($b['email'] ?? ''));
    $pass  = $b['password'] ?? '';

    $st = $db->prepare("SELECT * FROM customers WHERE email = ?");
    $st->execute([$email]);
    $c = $st->fetch();

    if (!$c || !$c['password_hash'] || !password_verify($pass, $c['password_hash']))
        respond(['error' => 'Email hoặc mật khẩu không đúng'], 401);

    session_regenerate_id(true);
    $_SESSION['customer_id'] = $c['id'];
    respond(['success' => true, 'customer' => safe($c)]);
}

// ===== LOGOUT =====
function handleLogout(): void {
    session_destroy();
    respond(['success' => true]);
}

// ===== ME =====
function handleMe(): void {
    $c = me();
    if (!$c) respond(['authenticated' => false], 200);

    $db = getDB();

    $bSt = $db->prepare("SELECT * FROM bookings WHERE email = ? ORDER BY created_at DESC");
    $bSt->execute([$c['email']]);

    $promos = $db->query("
        SELECT * FROM promotions
        WHERE active = 1
          AND (valid_from IS NULL OR valid_from <= CURDATE())
          AND (valid_to   IS NULL OR valid_to   >= CURDATE())
        ORDER BY discount_value DESC
    ")->fetchAll();

    respond([
        'authenticated' => true,
        'customer'      => safe($c),
        'bookings'      => $bSt->fetchAll(),
        'promotions'    => $promos,
    ]);
}

// ===== UPDATE PROFILE =====
function handleUpdate(): void {
    $c = me();
    if (!$c) respond(['error' => 'Chưa đăng nhập'], 401);

    $b = body(); $db = getDB();
    $fields = ['last_name','first_name','phone','nationality'];
    $sets = []; $params = [];
    foreach ($fields as $f) {
        if (array_key_exists($f, $b)) { $sets[] = "$f = ?"; $params[] = $b[$f]; }
    }
    if (!$sets) respond(['error' => 'Không có gì cập nhật'], 400);
    $params[] = $c['id'];
    $db->prepare("UPDATE customers SET " . implode(', ', $sets) . " WHERE id = ?")->execute($params);
    respond(['success' => true]);
}

// ===== GOOGLE LOGIN =====
function handleGoogleLogin(): void {
    $b          = body();
    $credential = $b['credential'] ?? '';
    if (!$credential) respond(['error' => 'Missing credential'], 400);

    $ctx = stream_context_create(['http' => ['timeout' => 10]]);
    $raw = @file_get_contents(
        'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($credential),
        false, $ctx
    );
    if (!$raw) respond(['error' => 'Không xác thực được với Google'], 500);

    $payload = json_decode($raw, true);
    if (!empty($payload['error_description']))
        respond(['error' => 'Token không hợp lệ'], 401);

    $clientId = '765685078350-kuenk0lifub85qjv49bpcmgq02hoveb9.apps.googleusercontent.com';
    if (($payload['aud'] ?? '') !== $clientId)
        respond(['error' => 'Client không hợp lệ'], 401);

    $googleId  = $payload['sub'];
    $email     = strtolower($payload['email'] ?? '');
    $firstName = $payload['given_name'] ?? '';
    $lastName  = $payload['family_name'] ?? '';
    $avatar    = $payload['picture'] ?? '';

    if (!$email) respond(['error' => 'Không lấy được email từ Google'], 400);

    $db = getDB();
    $st = $db->prepare("SELECT * FROM customers WHERE google_id = ? OR email = ? LIMIT 1");
    $st->execute([$googleId, $email]);
    $c = $st->fetch();

    if ($c) {
        $db->prepare("UPDATE customers SET google_id = ?, avatar = ? WHERE id = ?")
           ->execute([$googleId, $avatar, $c['id']]);
        $id = $c['id'];
    } else {
        $db->prepare("INSERT INTO customers (email, last_name, first_name, google_id, avatar) VALUES (?,?,?,?,?)")
           ->execute([$email, $lastName, $firstName, $googleId, $avatar]);
        $id = (int)$db->lastInsertId();
    }

    session_regenerate_id(true);
    $_SESSION['customer_id'] = $id;

    $st = $db->prepare("SELECT * FROM customers WHERE id = ?");
    $st->execute([$id]);
    respond(['success' => true, 'customer' => safe($st->fetch())]);
}

// ===== CHANGE PASSWORD =====
function handleChangePassword(): void {
    $c = me();
    if (!$c) respond(['error' => 'Chưa đăng nhập'], 401);

    $b   = body();
    $old = $b['old_password'] ?? '';
    $new = $b['new_password'] ?? '';

    if (!$c['password_hash'] || !password_verify($old, $c['password_hash']))
        respond(['error' => 'Mật khẩu hiện tại không đúng'], 400);
    if (strlen($new) < 6)
        respond(['error' => 'Mật khẩu mới phải ít nhất 6 ký tự'], 400);

    getDB()->prepare("UPDATE customers SET password_hash = ? WHERE id = ?")
           ->execute([password_hash($new, PASSWORD_BCRYPT), $c['id']]);
    respond(['success' => true]);
}
