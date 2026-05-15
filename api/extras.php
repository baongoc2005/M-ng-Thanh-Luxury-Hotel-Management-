<?php
require_once __DIR__ . '/config.php';

match($_SERVER['REQUEST_METHOD']) {
    'GET'    => handleGet(),
    'POST'   => handlePost(),
    'PUT'    => handlePut(),
    'DELETE' => handleDelete(),
    default  => respond(['error' => 'Method not allowed'], 405)
};

function handleGet(): void {
    $db = getDB();
    $onlyActive = !isset($_GET['all']);
    $sql = 'SELECT * FROM extras' . ($onlyActive ? ' WHERE is_active = 1' : '') . ' ORDER BY sort_order, id';
    respond(['extras' => $db->query($sql)->fetchAll()]);
}

function handlePost(): void {
    $b = body(); $db = getDB();
    $db->prepare("INSERT INTO extras (code,name_vi,icon,price,calc_type,note,is_active,sort_order) VALUES (?,?,?,?,?,?,?,?)")
       ->execute([$b['code'],$b['name_vi'],$b['icon']??'',(int)$b['price'],$b['calc_type']??'flat',$b['note']??'',(int)($b['is_active']??1),(int)($b['sort_order']??0)]);
    respond(['success'=>true,'id'=>(int)getDB()->lastInsertId()],201);
}

function handlePut(): void {
    $id = (int)($_GET['id']??0);
    if (!$id) respond(['error'=>'Thiếu id'],400);
    $b = body(); $db = getDB();
    $allowed = ['name_vi','icon','price','calc_type','note','is_active','sort_order'];
    $sets=[]; $params=[];
    foreach ($allowed as $f) { if (array_key_exists($f,$b)) { $sets[]="$f=?"; $params[]=$b[$f]; } }
    if (!$sets) respond(['error'=>'Không có gì cập nhật'],400);
    $params[]=$id;
    $db->prepare("UPDATE extras SET ".implode(',',$sets)." WHERE id=?")->execute($params);
    respond(['success'=>true]);
}

function handleDelete(): void {
    $id=(int)($_GET['id']??0);
    if (!$id) respond(['error'=>'Thiếu id'],400);
    getDB()->prepare("DELETE FROM extras WHERE id=?")->execute([$id]);
    respond(['success'=>true]);
}
