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
    $db       = getDB();
    $hotelId  = (int)($_GET['hotel_id'] ?? 0);
    $role     = $_GET['role'] ?? '';
    $all      = ($_GET['all'] ?? '') === '1';

    $where = []; $params = [];
    if (!$all) { $where[] = 's.active = 1'; }
    if ($hotelId) { $where[] = 's.hotel_id = ?'; $params[] = $hotelId; }
    if ($role)    { $where[] = 's.role = ?';     $params[] = $role; }
    $w = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    $st = $db->prepare("
        SELECT s.*, h.name AS hotel_name
        FROM staff s
        LEFT JOIN hotels h ON h.id = s.hotel_id
        $w
        ORDER BY h.name, s.full_name
    ");
    $st->execute($params);
    respond(['staff' => $st->fetchAll()]);
}

function handlePost(): void {
    $b  = body(); $db = getDB();
    $db->prepare("
        INSERT INTO staff (hotel_id,full_name,email,phone,role,joined_date,notes)
        VALUES (?,?,?,?,?,?,?)
    ")->execute([
        $b['hotel_id']   ?? null,
        $b['full_name']  ?? '',
        $b['email']      ?? '',
        $b['phone']      ?? '',
        $b['role']       ?? 'receptionist',
        $b['joined_date'] ? $b['joined_date'] : null,
        $b['notes']      ?? '',
    ]);
    respond(['success' => true, 'id' => (int)$db->lastInsertId()], 201);
}

function handlePut(): void {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Thiếu id'], 400);
    $b  = body(); $db = getDB();

    $fields = ['hotel_id','full_name','email','phone','role','joined_date','notes','active'];
    $sets = []; $params = [];
    foreach ($fields as $f) {
        if (array_key_exists($f, $b)) { $sets[] = "$f = ?"; $params[] = $b[$f]; }
    }
    if (!$sets) respond(['error' => 'Không có gì cập nhật'], 400);
    $params[] = $id;
    $db->prepare("UPDATE staff SET " . implode(', ', $sets) . " WHERE id = ?")->execute($params);
    respond(['success' => true]);
}

function handleDelete(): void {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Thiếu id'], 400);
    getDB()->prepare("UPDATE staff SET active = 0 WHERE id = ?")->execute([$id]);
    respond(['success' => true]);
}
