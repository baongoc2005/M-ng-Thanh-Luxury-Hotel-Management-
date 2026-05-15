<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/mailer.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'OPTIONS') { http_response_code(204); exit; }

if ($action === 'preview') {
    $code = $_GET['code'] ?? '';
    $st   = getDB()->prepare("SELECT * FROM email_templates WHERE code = ? LIMIT 1");
    $st->execute([$code]);
    $tpl  = $st->fetch();
    if (!$tpl) { http_response_code(404); echo 'Template not found'; exit; }
    $blocks = json_decode($tpl['blocks'], true) ?? [];
    $vars   = ['ho_ten' => 'Nguyễn Văn A', 'email' => 'khach@example.com',
                'ref_code' => 'MT-XXXXXXXX', 'ho_ten_day_du' => 'Nguyễn Văn A'];
    header('Content-Type: text/html; charset=UTF-8');
    echo renderEmailHtml($blocks, $vars);
    exit;
}

if ($action === 'send_test') {
    if ($method !== 'POST') respond(['error' => 'POST required'], 405);
    $b    = body();
    $code = $b['code'] ?? '';
    $to   = $b['email'] ?? '';
    if (!$code || !$to) respond(['error' => 'Missing code or email'], 400);
    $ok   = sendTemplateEmail($code, $to, 'Test User', ['ho_ten' => 'Test User', 'email' => $to, 'ref_code' => 'MT-TEST0001']);
    respond(['success' => $ok, 'message' => $ok ? 'Đã gửi email thử nghiệm' : 'Gửi thất bại — kiểm tra cài đặt SMTP']);
}

if ($method === 'GET') {
    $code = $_GET['code'] ?? '';
    $db   = getDB();
    if ($code) {
        $st = $db->prepare("SELECT * FROM email_templates WHERE code = ? LIMIT 1");
        $st->execute([$code]);
        $t  = $st->fetch();
        if (!$t) respond(['error' => 'Not found'], 404);
        $t['blocks'] = json_decode($t['blocks'], true);
        respond(['template' => $t]);
    }
    $all = $db->query("SELECT id, code, name, subject, is_active, updated_at FROM email_templates ORDER BY id")->fetchAll();
    respond(['templates' => $all]);
}

if ($method === 'PUT') {
    $code = $_GET['code'] ?? '';
    if (!$code) respond(['error' => 'Missing code'], 400);
    $b  = body();
    $db = getDB();
    $sets = []; $params = [];
    if (array_key_exists('name',      $b)) { $sets[] = 'name = ?';      $params[] = $b['name']; }
    if (array_key_exists('subject',   $b)) { $sets[] = 'subject = ?';   $params[] = $b['subject']; }
    if (array_key_exists('blocks',    $b)) { $sets[] = 'blocks = ?';    $params[] = json_encode($b['blocks'], JSON_UNESCAPED_UNICODE); }
    if (array_key_exists('is_active', $b)) { $sets[] = 'is_active = ?'; $params[] = (int)$b['is_active']; }
    if (!$sets) respond(['error' => 'Nothing to update'], 400);
    $params[] = $code;
    $db->prepare("UPDATE email_templates SET " . implode(', ', $sets) . " WHERE code = ?")->execute($params);
    respond(['success' => true]);
}

respond(['error' => 'Method not allowed'], 405);
