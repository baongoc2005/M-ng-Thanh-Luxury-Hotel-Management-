<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

match($method) {
    'GET'  => handleGet(),
    'POST' => handlePost(),
    'PUT'  => handlePut(),
    default => respond(['error' => 'Method not allowed'], 405)
};

// ===== GET — Danh sách đơn (hoặc tra cứu theo ref_code) =====
function handleGet(): void {
    // Tra cứu 1 booking theo ref_code (dùng cho polling thanh toán)
    if (!empty($_GET['ref'])) {
        $db = getDB();
        $st = $db->prepare("SELECT ref_code, status, payment_method, grand_total, last_name, first_name FROM bookings WHERE ref_code = ? LIMIT 1");
        $st->execute([strtoupper(trim($_GET['ref']))]);
        $row = $st->fetch();
        if (!$row) respond(['error' => 'Không tìm thấy đơn'], 404);
        respond($row);
    }

    $db = getDB();
    $where = []; $params = [];

    if (!empty($_GET['source'])) {
        $where[] = 'source = ?'; $params[] = $_GET['source'];
    }
    if (!empty($_GET['status'])) {
        $where[] = 'status = ?'; $params[] = $_GET['status'];
    }
    if (!empty($_GET['search'])) {
        $s = '%' . $_GET['search'] . '%';
        $where[] = '(last_name LIKE ? OR first_name LIKE ? OR email LIKE ? OR ref_code LIKE ? OR hotel_name LIKE ?)';
        array_push($params, $s, $s, $s, $s, $s);
    }
    if (!empty($_GET['date_from'])) {
        $where[] = 'check_in >= ?'; $params[] = $_GET['date_from'];
    }
    if (!empty($_GET['date_to'])) {
        $where[] = 'check_in <= ?'; $params[] = $_GET['date_to'];
    }

    $sql  = 'SELECT * FROM bookings';
    $csql = 'SELECT COUNT(*) as n FROM bookings';
    if ($where) { $w = ' WHERE ' . implode(' AND ', $where); $sql .= $w; $csql .= $w; }
    $sql .= ' ORDER BY created_at DESC';

    // Đếm tổng
    $st = $db->prepare($csql); $st->execute($params);
    $total = (int) $st->fetch()['n'];

    // Phân trang
    $page    = max(1, (int)($_GET['page'] ?? 1));
    $perPage = min(100, max(1, (int)($_GET['per_page'] ?? 30)));
    $offset  = ($page - 1) * $perPage;
    $sql    .= " LIMIT $perPage OFFSET $offset";

    $st = $db->prepare($sql); $st->execute($params);
    $bookings = $st->fetchAll();

    // Thống kê tổng thể
    $stats = $db->query("
        SELECT
            COUNT(*)                                                      AS total,
            COALESCE(SUM(grand_total),0)                                  AS revenue,
            SUM(status='pending')                                         AS pending,
            SUM(status='confirmed')                                       AS confirmed,
            SUM(status='cancelled')                                       AS cancelled,
            SUM(source='website')                                         AS src_website,
            SUM(source='booking_com')                                     AS src_booking,
            SUM(source='traveloka')                                       AS src_traveloka,
            SUM(source='agoda')                                           AS src_agoda,
            SUM(source='hotline')                                         AS src_hotline,
            SUM(source='zalo')                                            AS src_zalo,
            SUM(source='facebook')                                        AS src_facebook,
            SUM(source='other')                                           AS src_other
        FROM bookings
    ")->fetch();

    respond([
        'bookings'    => $bookings,
        'total'       => $total,
        'page'        => $page,
        'per_page'    => $perPage,
        'total_pages' => (int) ceil($total / $perPage),
        'stats'       => $stats,
    ]);
}

// ===== POST — Tạo đơn mới =====
function handlePost(): void {
    $b  = body();
    $db = getDB();
    $ref = generateRef();

    $promoCode      = strtoupper(trim($b['promo_code'] ?? ''));
    $discountAmount = (float)($b['discount_amount'] ?? 0);

    // Nếu có mã promo, tăng used_count
    if ($promoCode) {
        $db->prepare("UPDATE promotions SET used_count = used_count + 1 WHERE code = ? AND active = 1")
           ->execute([$promoCode]);
    }

    $db->prepare("
        INSERT INTO bookings
            (ref_code, source, external_id, hotel_slug, hotel_name, room_type,
             check_in, check_out, nights, guests,
             last_name, first_name, email, phone, nationality, special_requests,
             extra_breakfast, extra_airport, extra_flowers, extra_spa,
             payment_method, promo_code, discount_amount,
             price_per_night, base_total, extras_total, service_fee, grand_total,
             status, notes)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ")->execute([
        $ref,
        $b['source']          ?? 'website',
        $b['external_id']     ?? null,
        $b['hotel_slug']      ?? '',
        $b['hotel_name']      ?? '',
        $b['room_type']       ?? '',
        $b['check_in']        ?? date('Y-m-d'),
        $b['check_out']       ?? date('Y-m-d', strtotime('+1 day')),
        (int)($b['nights']    ?? 1),
        (int)($b['guests']    ?? 1),
        $b['last_name']       ?? '',
        $b['first_name']      ?? '',
        $b['email']           ?? '',
        $b['phone']           ?? '',
        $b['nationality']     ?? 'VN',
        $b['special_requests'] ?? '',
        (int)($b['extra_breakfast'] ?? 0),
        (int)($b['extra_airport']   ?? 0),
        (int)($b['extra_flowers']   ?? 0),
        (int)($b['extra_spa']       ?? 0),
        $b['payment_method']  ?? 'card',
        $promoCode ?: null,
        $discountAmount,
        (float)($b['price_per_night'] ?? 0),
        (float)($b['base_total']      ?? 0),
        (float)($b['extras_total']    ?? 0),
        (float)($b['service_fee']     ?? 0),
        (float)($b['grand_total']     ?? 0),
        $b['status']  ?? 'pending',
        $b['notes']   ?? null,
    ]);

    respond(['success' => true, 'ref_code' => $ref, 'id' => (int)$db->lastInsertId()], 201);
}

// ===== PUT — Cập nhật trạng thái / ghi chú =====
function handlePut(): void {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Thiếu id'], 400);

    $b = body();
    $db = getDB();

    $allowed = ['status', 'notes'];
    $sets = []; $params = [];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $b)) { $sets[] = "$f = ?"; $params[] = $b[$f]; }
    }
    if (!$sets) respond(['error' => 'Không có gì để cập nhật'], 400);

    $params[] = $id;
    $db->prepare("UPDATE bookings SET " . implode(', ', $sets) . " WHERE id = ?")
       ->execute($params);

    respond(['success' => true]);
}
