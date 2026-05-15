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
    $db     = getDB();
    $page   = max(1, (int)($_GET['page'] ?? 1));
    $limit  = 25; $offset = ($page - 1) * $limit;

    $status = $_GET['status'] ?? '';
    $method = $_GET['method'] ?? '';
    $type   = $_GET['type']   ?? '';
    $search = trim($_GET['search'] ?? '');
    $from   = $_GET['from'] ?? '';
    $to     = $_GET['to']   ?? '';

    $where  = []; $params = [];

    if ($status) { $where[] = 'p.status = ?';       $params[] = $status; }
    if ($method) { $where[] = 'p.method = ?';       $params[] = $method; }
    if ($type)   { $where[] = 'p.type = ?';         $params[] = $type;   }
    if ($search) { $where[] = 'p.ref_code LIKE ?';  $params[] = "%$search%"; }
    if ($from)   { $where[] = 'DATE(p.created_at) >= ?'; $params[] = $from; }
    if ($to)     { $where[] = 'DATE(p.created_at) <= ?'; $params[] = $to;   }

    $w = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    $cnt = $db->prepare("SELECT COUNT(*) FROM payments p $w");
    $cnt->execute($params);
    $total = (int)$cnt->fetchColumn();

    // Stats (on filtered set)
    $stStats = $db->prepare("
        SELECT
          COALESCE(SUM(CASE WHEN p.status = 'paid' THEN p.amount ELSE 0 END), 0)    AS revenue,
          COALESCE(SUM(CASE WHEN p.status = 'pending' THEN p.amount ELSE 0 END), 0) AS pending_amt,
          SUM(CASE WHEN p.status = 'paid'     THEN 1 ELSE 0 END) AS cnt_paid,
          SUM(CASE WHEN p.status = 'pending'  THEN 1 ELSE 0 END) AS cnt_pending,
          SUM(CASE WHEN p.status = 'refunded' THEN 1 ELSE 0 END) AS cnt_refunded,
          COALESCE(SUM(CASE WHEN p.status = 'refunded' THEN p.amount ELSE 0 END), 0) AS refunded_amt
        FROM payments p $w
    ");
    $stStats->execute($params);
    $stats = $stStats->fetch();

    $st = $db->prepare("
        SELECT p.*
        FROM payments p
        $w
        ORDER BY p.created_at DESC
        LIMIT $limit OFFSET $offset
    ");
    $st->execute($params);
    $payments = $st->fetchAll();

    respond([
        'payments' => $payments,
        'total'    => $total,
        'pages'    => max(1, (int)ceil($total / $limit)),
        'stats'    => $stats,
    ]);
}

function handlePost(): void {
    $b  = body(); $db = getDB();
    $ref = trim($b['ref_code'] ?? '');
    if (!$ref) respond(['error' => 'Thiếu mã tham chiếu'], 400);

    $amount = (float)($b['amount'] ?? 0);
    if ($amount <= 0) respond(['error' => 'Số tiền không hợp lệ'], 400);

    $paidAt = null;
    if (!empty($b['paid_at'])) $paidAt = $b['paid_at'];
    elseif (($b['status'] ?? 'pending') === 'paid') $paidAt = date('Y-m-d H:i:s');

    $db->prepare("
        INSERT INTO payments (ref_code, booking_id, type, amount, method, status, note, paid_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ")->execute([
        $ref,
        ($b['booking_id'] ?? null) ?: null,
        $b['type']   ?? 'deposit',
        $amount,
        $b['method'] ?? 'cash',
        $b['status'] ?? 'pending',
        $b['note']   ?? null,
        $paidAt,
    ]);
    respond(['success' => true, 'id' => (int)$db->lastInsertId()], 201);
}

function handlePut(): void {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Thiếu id'], 400);
    $b  = body(); $db = getDB();

    $allowed = ['ref_code','booking_id','type','amount','method','status','note','paid_at'];
    $sets = []; $params = [];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $b)) {
            $sets[]   = "$f = ?";
            $params[] = $b[$f] === '' ? null : $b[$f];
        }
    }
    // Auto-set paid_at when marking as paid
    if (isset($b['status']) && $b['status'] === 'paid' && !isset($b['paid_at'])) {
        $sets[]   = 'paid_at = ?';
        $params[] = date('Y-m-d H:i:s');
    }
    if (!$sets) respond(['error' => 'Không có gì cập nhật'], 400);
    $params[] = $id;
    $db->prepare("UPDATE payments SET " . implode(', ', $sets) . " WHERE id = ?")->execute($params);
    respond(['success' => true]);
}

function handleDelete(): void {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Thiếu id'], 400);
    getDB()->prepare("DELETE FROM payments WHERE id = ?")->execute([$id]);
    respond(['success' => true]);
}
