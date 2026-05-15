<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

match(true) {
    $method === 'GET'    && empty($action)          => handleGet(),
    $method === 'POST'   && empty($action)          => handlePost(),
    $method === 'PUT'    && empty($action)          => handlePut(),
    $method === 'DELETE' && empty($action)          => handleDelete(),
    $method === 'POST'   && $action === 'add_room'  => handleAddRoom(),
    $method === 'DELETE' && $action === 'del_room'  => handleDelRoom(),
    default => respond(['error' => 'Not found'], 404)
};

// ===== GET =====
function handleGet(): void {
    $db = getDB();

    // Single by slug
    if (!empty($_GET['slug'])) {
        $st = $db->prepare("SELECT * FROM hotels WHERE slug = ? AND active = 1");
        $st->execute([$_GET['slug']]);
        $hotel = $st->fetch();
        if (!$hotel) respond(['error' => 'Not found'], 404);
        $hotel['rooms']     = getRooms($db, $hotel['id']);
        $hotel['amenities'] = $hotel['amenities'] ? explode(',', $hotel['amenities']) : [];
        $hotel['gallery']   = !empty($hotel['gallery']) ? explode(',', $hotel['gallery']) : [$hotel['image']];
        respond(['hotel' => $hotel]);
    }

    // Single by id
    if (!empty($_GET['id'])) {
        $st = $db->prepare("SELECT * FROM hotels WHERE id = ?");
        $st->execute([(int)$_GET['id']]);
        $hotel = $st->fetch();
        if (!$hotel) respond(['error' => 'Not found'], 404);
        $hotel['rooms']     = getRooms($db, $hotel['id']);
        $hotel['amenities'] = $hotel['amenities'] ? explode(',', $hotel['amenities']) : [];
        respond(['hotel' => $hotel]);
    }

    // List all
    $onlyActive = ($_GET['all'] ?? '') !== '1';
    $sql = "SELECT h.*, (SELECT COUNT(*) FROM hotel_rooms r WHERE r.hotel_id = h.id) AS room_count
            FROM hotels h" . ($onlyActive ? " WHERE h.active = 1" : "") . "
            ORDER BY h.region, h.city, h.name";
    $hotels = $db->query($sql)->fetchAll();

    foreach ($hotels as &$h) {
        $h['rooms']     = getRooms($db, $h['id']);
        $h['amenities'] = $h['amenities'] ? explode(',', $h['amenities']) : [];
        $h['gallery']   = !empty($h['gallery']) ? explode(',', $h['gallery']) : [$h['image']];
    }
    respond(['hotels' => $hotels, 'total' => count($hotels)]);
}

function getRooms(PDO $db, int $hotelId): array {
    $st = $db->prepare("SELECT * FROM hotel_rooms WHERE hotel_id = ? ORDER BY price ASC");
    $st->execute([$hotelId]);
    return array_map(function($r) {
        return ['type' => $r['type_name'], 'price' => (int)$r['price'], 'size' => (int)$r['size'], 'beds' => $r['beds'], 'id' => (int)$r['id']];
    }, $st->fetchAll());
}

// ===== POST — Tạo khách sạn mới =====
function handlePost(): void {
    $b  = body();
    $db = getDB();

    // Tạo slug từ tên nếu không có
    if (empty($b['slug'])) {
        $b['slug'] = makeSlug($b['name'] ?? '');
    }

    $galleryStr = isset($b['gallery'])
        ? (is_array($b['gallery']) ? implode(',', $b['gallery']) : $b['gallery'])
        : ($b['image'] ?? '');

    $db->prepare("
        INSERT INTO hotels (slug,name,brand,city,province,region,stars,price,rating,reviews,image,gallery,amenities,description,lat,lng)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ")->execute([
        $b['slug'],
        $b['name']        ?? '',
        $b['brand']       ?? 'luxury',
        $b['city']        ?? '',
        $b['province']    ?? '',
        $b['region']      ?? 'north',
        (int)($b['stars'] ?? 4),
        (float)($b['price']   ?? 0),
        (float)($b['rating']  ?? 4.0),
        (int)($b['reviews']   ?? 0),
        $b['image']       ?? 'img/hero.png',
        $galleryStr,
        is_array($b['amenities'] ?? null) ? implode(',', $b['amenities']) : ($b['amenities'] ?? ''),
        $b['description'] ?? '',
        $b['lat']         ?? null,
        $b['lng']         ?? null,
    ]);
    $hotelId = (int)$db->lastInsertId();

    // Thêm phòng nếu có
    if (!empty($b['rooms']) && is_array($b['rooms'])) {
        foreach ($b['rooms'] as $r) {
            addRoom($db, $hotelId, $r);
        }
    }

    respond(['success' => true, 'id' => $hotelId, 'slug' => $b['slug']], 201);
}

// ===== PUT — Cập nhật khách sạn =====
function handlePut(): void {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Thiếu id'], 400);

    $b  = body();
    $db = getDB();

    $fields = ['name','brand','city','province','region','stars','price','rating','reviews','image','description','lat','lng','active'];
    $sets = []; $params = [];
    foreach ($fields as $f) {
        if (array_key_exists($f, $b)) { $sets[] = "$f = ?"; $params[] = $b[$f]; }
    }
    if (isset($b['amenities'])) {
        $sets[] = "amenities = ?";
        $params[] = is_array($b['amenities']) ? implode(',', $b['amenities']) : $b['amenities'];
    }
    if (isset($b['gallery'])) {
        $sets[] = "gallery = ?";
        $params[] = is_array($b['gallery']) ? implode(',', $b['gallery']) : $b['gallery'];
    }
    if (!$sets) respond(['error' => 'Không có gì để cập nhật'], 400);

    $params[] = $id;
    $db->prepare("UPDATE hotels SET " . implode(', ', $sets) . " WHERE id = ?")->execute($params);
    respond(['success' => true]);
}

// ===== DELETE — Ẩn khách sạn =====
function handleDelete(): void {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Thiếu id'], 400);
    getDB()->prepare("UPDATE hotels SET active = 0 WHERE id = ?")->execute([$id]);
    respond(['success' => true]);
}

// ===== ADD ROOM =====
function handleAddRoom(): void {
    $hotelId = (int)($_GET['hotel_id'] ?? 0);
    if (!$hotelId) respond(['error' => 'Thiếu hotel_id'], 400);
    $b  = body();
    $db = getDB();
    $roomId = addRoom($db, $hotelId, $b);
    respond(['success' => true, 'id' => $roomId], 201);
}

function addRoom(PDO $db, int $hotelId, array $r): int {
    $db->prepare("INSERT INTO hotel_rooms (hotel_id,type_name,price,size,beds) VALUES (?,?,?,?,?)")
       ->execute([$hotelId, $r['type_name'] ?? $r['type'] ?? '', (float)($r['price'] ?? 0), (int)($r['size'] ?? 30), $r['beds'] ?? 'King']);
    return (int)$db->lastInsertId();
}

// ===== DELETE ROOM =====
function handleDelRoom(): void {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Thiếu id'], 400);
    getDB()->prepare("DELETE FROM hotel_rooms WHERE id = ?")->execute([$id]);
    respond(['success' => true]);
}

// ===== HELPERS =====
function makeSlug(string $name): string {
    $map = ['à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a','ă'=>'a','ắ'=>'a','ặ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a','â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a','è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e','ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e','ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i','ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o','ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o','ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o','ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u','ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u','ý'=>'y','ỳ'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y','đ'=>'d','Đ'=>'d','À'=>'a','Á'=>'a','Â'=>'a','Ă'=>'a','È'=>'e','É'=>'e','Ê'=>'e','Ì'=>'i','Í'=>'i','Ò'=>'o','Ó'=>'o','Ô'=>'o','Ơ'=>'o','Ù'=>'u','Ú'=>'u','Ư'=>'u','Ý'=>'y','Ắ'=>'a','Ặ'=>'a','Ằ'=>'a','Ẳ'=>'a','Ẵ'=>'a','Ấ'=>'a','Ầ'=>'a','Ẩ'=>'a','Ẫ'=>'a','Ậ'=>'a','Ế'=>'e','Ề'=>'e','Ể'=>'e','Ễ'=>'e','Ệ'=>'e','Ố'=>'o','Ồ'=>'o','Ổ'=>'o','Ỗ'=>'o','Ộ'=>'o','Ớ'=>'o','Ờ'=>'o','Ở'=>'o','Ỡ'=>'o','Ợ'=>'o','Ứ'=>'u','Ừ'=>'u','Ử'=>'u','Ữ'=>'u','Ự'=>'u'];
    $s = strtr($name, $map);
    $s = strtolower($s);
    $s = preg_replace('/[^a-z0-9\s-]/', '', $s);
    $s = preg_replace('/[\s-]+/', '-', trim($s));
    return $s . '-' . substr(md5(uniqid()), 0, 4);
}
