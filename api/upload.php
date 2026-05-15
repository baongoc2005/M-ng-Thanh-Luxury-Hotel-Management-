<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['error' => 'POST only'], 405);
}

if (empty($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    $code = $_FILES['image']['error'] ?? -1;
    respond(['error' => 'Upload thất bại', 'code' => $code], 400);
}

$allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
$finfo   = finfo_open(FILEINFO_MIME_TYPE);
$mime    = finfo_file($finfo, $_FILES['image']['tmp_name']);
finfo_close($finfo);

if (!in_array($mime, $allowed)) {
    respond(['error' => 'Chỉ chấp nhận JPEG, PNG, WebP'], 415);
}

if ($_FILES['image']['size'] > 5 * 1024 * 1024) {
    respond(['error' => 'Ảnh quá lớn (tối đa 5 MB)'], 413);
}

$ext      = match($mime) {
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
    default      => 'jpg',
};
$filename = uniqid('hotel_', true) . '.' . $ext;
$dest     = __DIR__ . '/../img/hotels/' . $filename;

if (!move_uploaded_file($_FILES['image']['tmp_name'], $dest)) {
    respond(['error' => 'Không thể lưu file'], 500);
}

respond(['path' => 'img/hotels/' . $filename]);
