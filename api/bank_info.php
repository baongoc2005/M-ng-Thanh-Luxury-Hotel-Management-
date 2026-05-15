<?php
require_once __DIR__ . '/config.php';

respond([
    'bank_name'      => BANK_NAME,
    'bank_bin'       => BANK_BIN,
    'account_number' => BANK_ACCOUNT_NUMBER,
    'account_name'   => BANK_ACCOUNT_NAME,
]);
