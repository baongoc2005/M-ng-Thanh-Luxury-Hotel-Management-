<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

match($method) {
    'GET'    => handleGet(),
    'POST'   => handlePost(),
    'PUT'    => handlePut(),
    'DELETE' => handleDelete(),
    default  => respond(['error' => 'Method not allowed'], 405),
};

function handleGet(): void {
    $db = getDB();
    // Optional: return only active methods
    $activeOnly = isset($_GET['active']) && $_GET['active'] == '1';
    $w = $activeOnly ? 'WHERE is_active = 1' : '';

    $st = $db->prepare("
        SELECT pm.*,
               COUNT(p.id) AS usage_count,
               COALESCE(SUM(CASE WHEN p.status='paid' THEN p.amount ELSE 0 END), 0) AS total_paid
        FROM payment_methods pm
        LEFT JOIN payments p ON p.method = pm.code
        $w
        GROUP BY pm.id
        ORDER BY pm.sort_order, pm.id
    ");
    $st->execute();
    respond(['methods' => $st->fetchAll()]);
}

function handlePost(): void {
    $b  = body(); $db = getDB();
    $code   = trim($b['code']    ?? '');
    $nameVi = trim($b['name_vi'] ?? '');
    if (!$code)   respond(['error' => 'Thiếu mã code'], 400);
    if (!$nameVi) respond(['error' => 'Thiếu tên hiển thị'], 400);
    // Sanitize code: lowercase, letters/digits/underscore only
    $code = preg_replace('/[^a-z0-9_]/', '_', strtolower($code));

    // Check duplicate
    $exists = $db->prepare("SELECT id FROM payment_methods WHERE code = ?");
    $exists->execute([$code]);
    if ($exists->fetch()) respond(['error' => 'Mã code đã tồn tại'], 409);

    $maxOrder = (int)$db->query("SELECT COALESCE(MAX(sort_order),0) FROM payment_methods")->fetchColumn();

    $db->prepare("
        INSERT INTO payment_methods (code, name_vi, description, is_active, sort_order)
        VALUES (?, ?, ?, ?, ?)
    ")->execute([
        $code, $nameVi,
        $b['description'] ?? '',
        isset($b['is_active']) ? (int)(bool)$b['is_active'] : 1,
        $maxOrder + 1,
    ]);
    respond(['success' => true, 'id' => (int)$db->lastInsertId()], 201);
}

function handlePut(): void {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Thiếu id'], 400);
    $b  = body(); $db = getDB();

    $allowed = ['name_vi','description','is_active','sort_order'];
    $sets = []; $params = [];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $b)) {
            $sets[]   = "$f = ?";
            $params[] = $f === 'is_active' ? (int)(bool)$b[$f] : ($b[$f] === '' ? null : $b[$f]);
        }
    }
    if (!$sets) respond(['error' => 'Không có gì cập nhật'], 400);
    $params[] = $id;
    $db->prepare("UPDATE payment_methods SET " . implode(', ', $sets) . " WHERE id = ?")->execute($params);
    respond(['success' => true]);
}

function handleDelete(): void {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Thiếu id'], 400);
    $db = getDB();
    // Check if method is in use
    $pm = $db->prepare("SELECT code FROM payment_methods WHERE id = ?");
    $pm->execute([$id]);
    $row = $pm->fetch();
    if (!$row) respond(['error' => 'Không tìm thấy'], 404);

    $used = $db->prepare("SELECT COUNT(*) FROM payments WHERE method = ?");
    $used->execute([$row['code']]);
    if ((int)$used->fetchColumn() > 0) {
        respond(['error' => 'Không thể xóa: phương thức đang có giao dịch sử dụng'], 409);
    }
    $db->prepare("DELETE FROM payment_methods WHERE id = ?")->execute([$id]);
    respond(['success' => true]);
}
