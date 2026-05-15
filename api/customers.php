<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = (int)($_GET['id'] ?? 0);

match($method) {
    'GET'    => handleGet(),
    'PUT'    => handlePut(),
    'DELETE' => handleDelete(),
    default  => respond(['error' => 'Method not allowed'], 405),
};

function handleGet(): void {
    $db = getDB();
    $id = (int)($_GET['id'] ?? 0);

    if ($id) {
        $st = $db->prepare("SELECT * FROM customers WHERE id = ?");
        $st->execute([$id]);
        $c = $st->fetch();
        if (!$c) respond(['error' => 'Not found'], 404);

        $bookings = $db->prepare("SELECT * FROM bookings WHERE email = ? ORDER BY created_at DESC");
        $bookings->execute([$c['email']]);
        $c['bookings'] = $bookings->fetchAll();
        respond(['customer' => $c]);
    }

    $search = $_GET['search'] ?? '';
    $vip    = $_GET['vip']    ?? '';
    $page   = max(1, (int)($_GET['page'] ?? 1));
    $limit  = 20;
    $offset = ($page - 1) * $limit;

    // Stats toàn cục — không phụ thuộc filter
    $globalStats = $db->query("
        SELECT
            COUNT(DISTINCT c.id)             AS total_all,
            SUM(c.vip)                       AS vip_count,
            COALESCE(SUM(b.grand_total), 0)  AS total_revenue
        FROM customers c
        LEFT JOIN bookings b ON b.email = c.email
    ")->fetch();

    // Filter cho danh sách phân trang
    $conds = []; $params = [];
    if ($search) {
        $conds[] = "(c.email LIKE ? OR c.last_name LIKE ? OR c.first_name LIKE ? OR c.phone LIKE ?)";
        $params  = array_merge($params, ["%$search%", "%$search%", "%$search%", "%$search%"]);
    }
    if ($vip !== '') {
        $conds[] = "c.vip = ?";
        $params[] = (int)$vip;
    }
    $where = $conds ? 'WHERE ' . implode(' AND ', $conds) : '';

    $countSt = $db->prepare("SELECT COUNT(*) FROM customers c $where");
    $countSt->execute($params);
    $totalCount = (int)$countSt->fetchColumn();

    $st = $db->prepare("
        SELECT c.*,
          COUNT(b.id)                    AS total_bookings,
          COALESCE(SUM(b.grand_total),0) AS total_spent,
          MAX(b.created_at)              AS last_booking
        FROM customers c
        LEFT JOIN bookings b ON b.email = c.email
        $where
        GROUP BY c.id
        ORDER BY total_spent DESC
        LIMIT $limit OFFSET $offset
    ");
    $st->execute($params);

    respond([
        'customers'   => $st->fetchAll(),
        'total'       => $totalCount,
        'page'        => $page,
        'pages'       => (int)ceil($totalCount / $limit),
        'globalStats' => $globalStats,
    ]);
}

function handlePut(): void {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Thiếu id'], 400);
    $b  = body();
    $db = getDB();

    $fields = ['last_name','first_name','phone','nationality','vip','notes'];
    $sets = []; $params = [];
    foreach ($fields as $f) {
        if (array_key_exists($f, $b)) { $sets[] = "$f = ?"; $params[] = $b[$f]; }
    }
    if (!$sets) respond(['error' => 'Không có gì cập nhật'], 400);
    $params[] = $id;
    $db->prepare("UPDATE customers SET " . implode(', ', $sets) . " WHERE id = ?")->execute($params);
    respond(['success' => true]);
}

function handleDelete(): void {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Thiếu id'], 400);
    getDB()->prepare("DELETE FROM customers WHERE id = ?")->execute([$id]);
    respond(['success' => true]);
}
