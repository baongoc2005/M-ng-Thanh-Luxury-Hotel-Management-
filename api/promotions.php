<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

match(true) {
    $method === 'GET' && $action === 'validate' => handleValidate(),
    $method === 'GET'    => handleGet(),
    $method === 'POST'   => handlePost(),
    $method === 'PUT'    => handlePut(),
    $method === 'DELETE' => handleDelete(),
    default => respond(['error' => 'Not found'], 404),
};

function handleGet(): void {
    $db     = getDB();
    $active = $_GET['active'] ?? '';
    $where  = $active !== '' ? 'WHERE active = ' . (int)$active : '';
    $rows   = $db->query("SELECT * FROM promotions $where ORDER BY created_at DESC")->fetchAll();
    respond(['promotions' => $rows, 'total' => count($rows)]);
}

function handleValidate(): void {
    $code = strtoupper(trim($_GET['code'] ?? ''));
    if (!$code) respond(['valid' => false, 'error' => 'Thiếu mã'], 400);
    $db = getDB();
    $st = $db->prepare("SELECT * FROM promotions WHERE code = ? AND active = 1");
    $st->execute([$code]);
    $p = $st->fetch();
    if (!$p) respond(['valid' => false, 'error' => 'Mã không tồn tại hoặc đã hết hạn']);
    if ($p['valid_to'] && $p['valid_to'] < date('Y-m-d')) respond(['valid' => false, 'error' => 'Mã đã hết hạn']);
    if ($p['valid_from'] && $p['valid_from'] > date('Y-m-d')) respond(['valid' => false, 'error' => 'Mã chưa có hiệu lực']);
    if ($p['usage_limit'] > 0 && $p['used_count'] >= $p['usage_limit']) respond(['valid' => false, 'error' => 'Mã đã hết lượt sử dụng']);
    respond(['valid' => true, 'promotion' => $p]);
}

function handlePost(): void {
    $b = body(); $db = getDB();
    if (empty($b['code']) || empty($b['name'])) respond(['error' => 'Thiếu code hoặc tên'], 400);
    $db->prepare("
        INSERT INTO promotions (code,name,discount_type,discount_value,min_nights,min_total,applies_to,valid_from,valid_to,usage_limit,active)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
    ")->execute([
        strtoupper(trim($b['code'])),
        $b['name'],
        $b['discount_type']  ?? 'percent',
        (float)($b['discount_value'] ?? 10),
        (int)($b['min_nights']  ?? 1),
        (float)($b['min_total'] ?? 0),
        $b['applies_to'] ?? 'all',
        $b['valid_from'] ?: null,
        $b['valid_to']   ?: null,
        (int)($b['usage_limit'] ?? 0),
        isset($b['active']) ? (int)$b['active'] : 1,
    ]);
    respond(['success' => true, 'id' => (int)$db->lastInsertId()], 201);
}

function handlePut(): void {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Thiếu id'], 400);
    $b  = body(); $db = getDB();
    $fields = ['name','discount_type','discount_value','min_nights','min_total','applies_to','valid_from','valid_to','usage_limit','active'];
    $sets = []; $params = [];
    foreach ($fields as $f) {
        if (array_key_exists($f, $b)) { $sets[] = "$f = ?"; $params[] = $b[$f] ?: null; }
    }
    if (!$sets) respond(['error' => 'Không có gì cập nhật'], 400);
    $params[] = $id;
    $db->prepare("UPDATE promotions SET " . implode(', ', $sets) . " WHERE id = ?")->execute($params);
    respond(['success' => true]);
}

function handleDelete(): void {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Thiếu id'], 400);
    getDB()->prepare("DELETE FROM promotions WHERE id = ?")->execute([$id]);
    respond(['success' => true]);
}
