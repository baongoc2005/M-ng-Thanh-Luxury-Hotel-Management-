<?php
session_start();
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
    $db      = getDB();
    $hotelId = (int)($_GET['hotel_id'] ?? 0);
    $isPublic = !empty($_GET['public']);
    $status  = $isPublic ? 'approved' : ($_GET['status'] ?? '');
    $page    = max(1, (int)($_GET['page'] ?? 1));
    $limit   = $isPublic ? 50 : 20;
    $offset  = ($page - 1) * $limit;

    $where = []; $params = [];
    if ($hotelId) { $where[] = 'r.hotel_id = ?'; $params[] = $hotelId; }
    if ($status)  { $where[] = 'r.status = ?';   $params[] = $status; }
    $w = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    $total = $db->prepare("SELECT COUNT(*) FROM reviews r $w");
    $total->execute($params);
    $totalCount = (int)$total->fetchColumn();

    $st = $db->prepare("
        SELECT r.*, h.name AS hotel_name
        FROM reviews r
        LEFT JOIN hotels h ON h.id = r.hotel_id
        $w ORDER BY r.created_at DESC
        LIMIT $limit OFFSET $offset
    ");
    $st->execute($params);
    respond(['reviews' => $st->fetchAll(), 'total' => $totalCount, 'pages' => ceil($totalCount / $limit)]);
}

function handlePost(): void {
    $b = body(); $db = getDB();
    $hotelId = (int)($b['hotel_id'] ?? 0);
    if (!$hotelId) respond(['error' => 'Thiếu hotel_id'], 400);

    // Lấy thông tin khách từ session nếu đang đăng nhập
    $customerName  = $b['customer_name']  ?? '';
    $customerEmail = $b['customer_email'] ?? '';
    $customerId    = null;
    if (!empty($_SESSION['customer_id'])) {
        $st = $db->prepare("SELECT id, first_name, last_name, email FROM customers WHERE id = ? LIMIT 1");
        $st->execute([$_SESSION['customer_id']]);
        $c = $st->fetch();
        if ($c) {
            $customerId    = $c['id'];
            $customerName  = trim($c['last_name'] . ' ' . $c['first_name']);
            $customerEmail = $c['email'];
        }
    }
    if (!$customerName && !$customerEmail) respond(['error' => 'Vui lòng đăng nhập để gửi đánh giá'], 401);

    $db->prepare("
        INSERT INTO reviews (hotel_id,booking_ref,customer_name,customer_email,customer_id,rating,title,comment,status)
        VALUES (?,?,?,?,?,?,?,?,'pending')
    ")->execute([
        $hotelId,
        $b['booking_ref'] ?? '',
        $customerName,
        $customerEmail,
        $customerId,
        min(5, max(1, (int)($b['rating'] ?? 5))),
        trim($b['title']   ?? ''),
        trim($b['comment'] ?? ''),
    ]);
    respond(['success' => true, 'id' => (int)$db->lastInsertId()], 201);
}

function handlePut(): void {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Thiếu id'], 400);
    $b  = body(); $db = getDB();

    $fields = ['status','reply','rating','title','comment'];
    $sets = []; $params = [];
    foreach ($fields as $f) {
        if (array_key_exists($f, $b)) { $sets[] = "$f = ?"; $params[] = $b[$f]; }
    }
    if (!$sets) respond(['error' => 'Không có gì cập nhật'], 400);
    $params[] = $id;
    $db->prepare("UPDATE reviews SET " . implode(', ', $sets) . " WHERE id = ?")->execute($params);

    // Cập nhật rating trung bình của khách sạn
    if (isset($b['status']) && $b['status'] === 'approved') {
        $db->prepare("
            UPDATE hotels h SET
              rating  = (SELECT ROUND(AVG(r.rating),1) FROM reviews r WHERE r.hotel_id = h.id AND r.status='approved'),
              reviews = (SELECT COUNT(*) FROM reviews r WHERE r.hotel_id = h.id AND r.status='approved')
            WHERE h.id = (SELECT hotel_id FROM reviews WHERE id = ?)
        ")->execute([$id]);
    }
    respond(['success' => true]);
}

function handleDelete(): void {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Thiếu id'], 400);
    getDB()->prepare("DELETE FROM reviews WHERE id = ?")->execute([$id]);
    respond(['success' => true]);
}
