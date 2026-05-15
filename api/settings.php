<?php
require_once __DIR__ . '/config.php';

match($_SERVER['REQUEST_METHOD']) {
    'GET' => handleGet(),
    'PUT' => handlePut(),
    default => respond(['error' => 'Method not allowed'], 405)
};

function handleGet(): void {
    $db = getDB();
    if (!empty($_GET['key'])) {
        $st = $db->prepare("SELECT value FROM settings WHERE `key` = ? LIMIT 1");
        $st->execute([$_GET['key']]);
        $row = $st->fetch();
        respond($row ? ['key' => $_GET['key'], 'value' => $row['value']] : ['error' => 'Not found'], $row ? 200 : 404);
    }
    $rows = $db->query("SELECT * FROM settings ORDER BY `key`")->fetchAll();
    $map  = [];
    foreach ($rows as $r) $map[$r['key']] = $r['value'];
    respond(['settings' => $rows, 'map' => $map]);
}

function handlePut(): void {
    $b = body(); $db = getDB();
    if (isset($b['key'], $b['value'])) {
        $db->prepare("UPDATE settings SET value=? WHERE `key`=?")->execute([$b['value'], $b['key']]);
        respond(['success' => true]);
    }
    // Bulk update: { settings: { key: value, ... } }
    if (!empty($b['settings']) && is_array($b['settings'])) {
        $st = $db->prepare("UPDATE settings SET value=? WHERE `key`=?");
        foreach ($b['settings'] as $key => $val) $st->execute([$val, $key]);
        respond(['success' => true]);
    }
    respond(['error' => 'Thiếu key/value'], 400);
}
