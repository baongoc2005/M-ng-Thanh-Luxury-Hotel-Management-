<?php
// Email helper — included by other API files, not a standalone endpoint

function smtpSend(
    string $host, int $port,
    string $user, string $pass,
    string $fromEmail, string $fromName,
    string $toEmail, string $toName,
    string $subject, string $html
): bool {
    $prefix = ($port === 465) ? 'ssl://' : '';
    $sock   = @fsockopen($prefix . $host, $port, $errno, $errstr, 15);
    if (!$sock) return false;
    stream_set_timeout($sock, 15);

    $read = function () use ($sock): string {
        $buf = '';
        while ($line = fgets($sock, 512)) {
            $buf .= $line;
            if (isset($line[3]) && $line[3] === ' ') break;
        }
        return $buf;
    };
    $cmd = function (string $c) use ($sock, $read): string {
        fwrite($sock, $c . "\r\n");
        return $read();
    };

    $read(); // greeting
    $cmd('EHLO muongthanh.online');

    if ($port === 587) {
        $cmd('STARTTLS');
        stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT);
        $cmd('EHLO muongthanh.online');
    }

    $cmd('AUTH LOGIN');
    $cmd(base64_encode($user));
    $authResp = $cmd(base64_encode($pass));
    if (!str_starts_with($authResp, '235')) { fclose($sock); return false; }

    $cmd("MAIL FROM: <{$fromEmail}>");
    $cmd("RCPT TO: <{$toEmail}>");
    $cmd('DATA');

    $enc  = fn($s) => '=?UTF-8?B?' . base64_encode($s) . '?=';
    $body = "Date: " . date('r') . "\r\n"
          . "From: " . $enc($fromName) . " <{$fromEmail}>\r\n"
          . "To: " . $enc($toName) . " <{$toEmail}>\r\n"
          . "Subject: " . $enc($subject) . "\r\n"
          . "MIME-Version: 1.0\r\n"
          . "Content-Type: text/html; charset=UTF-8\r\n"
          . "Content-Transfer-Encoding: base64\r\n\r\n"
          . chunk_split(base64_encode($html))
          . "\r\n.";

    $resp = $cmd($body);
    $cmd('QUIT');
    fclose($sock);
    return str_starts_with(trim($resp), '2');
}

function renderBlock(array $b): string {
    $type = $b['type'] ?? '';
    switch ($type) {
        case 'header':
            $logo = e($b['logo'] ?? 'Mường Thanh');
            $t    = e($b['title'] ?? '');
            $s    = e($b['subtitle'] ?? '');
            return '<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;">
              <tr><td style="padding:40px 40px 30px;text-align:center;">
                <div style="font-family:Georgia,serif;font-size:24px;font-weight:300;letter-spacing:10px;color:#c9a96e;text-transform:uppercase;">' . $logo . '</div>'
              . ($t ? '<div style="font-family:Arial,sans-serif;font-size:20px;font-weight:300;color:#f5f0ea;margin-top:18px;line-height:1.4;">' . $t . '</div>' : '')
              . ($s ? '<div style="font-family:Arial,sans-serif;font-size:13px;color:rgba(245,240,234,0.5);margin-top:8px;letter-spacing:1px;">' . $s . '</div>' : '')
              . '</td></tr></table>';

        case 'text':
            return '<table width="100%" cellpadding="0" cellspacing="0" style="background:#161616;">
              <tr><td style="padding:28px 40px;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;color:rgba(245,240,234,0.85);">'
              . nl2br(e($b['content'] ?? ''))
              . '</td></tr></table>';

        case 'button':
            $url   = e($b['url']   ?? 'https://muongthanh.online');
            $text  = e($b['text']  ?? 'Xem ngay');
            $color = e($b['color'] ?? '#c9a96e');
            return '<table width="100%" cellpadding="0" cellspacing="0" style="background:#161616;">
              <tr><td style="padding:16px 40px 36px;text-align:center;">
                <a href="' . $url . '" style="display:inline-block;background:' . $color . ';color:#080808;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 44px;">' . $text . '</a>
              </td></tr></table>';

        case 'divider':
            return '<table width="100%" cellpadding="0" cellspacing="0" style="background:#161616;">
              <tr><td style="padding:8px 40px;"><div style="height:1px;background:rgba(255,255,255,0.08);"></div></td></tr></table>';

        case 'highlight':
            $title = e($b['title'] ?? '');
            $rows  = $b['rows'] ?? [];
            $rHtml = '';
            foreach ($rows as $row) {
                $rHtml .= '<tr>
                  <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:rgba(245,240,234,0.5);width:45%;vertical-align:top;">' . e($row['label'] ?? '') . '</td>
                  <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#f5f0ea;font-weight:600;">' . e($row['value'] ?? '') . '</td>
                </tr>';
            }
            return '<table width="100%" cellpadding="0" cellspacing="0" style="background:#161616;">
              <tr><td style="padding:8px 40px 28px;">
                <table width="100%" cellpadding="16" cellspacing="0" style="border:1px solid rgba(201,169,110,0.25);background:rgba(201,169,110,0.06);">
                  ' . ($title ? '<tr><td colspan="2" style="padding-bottom:12px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#c9a96e;">' . $title . '</td></tr>' : '')
                  . $rHtml . '
                </table>
              </td></tr></table>';

        case 'footer':
            return '<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;">
              <tr><td style="padding:28px 40px;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:rgba(245,240,234,0.3);text-align:center;">'
              . nl2br(e($b['content'] ?? ''))
              . '</td></tr></table>';
    }
    return '';
}

function e(string $s): string { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }

function renderEmailHtml(array $blocks, array $vars = []): string {
    $rows = '';
    foreach ($blocks as $block) {
        $h = renderBlock($block);
        if ($h) $rows .= '<tr><td>' . $h . '</td></tr>';
    }
    $html = '<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080808;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;">
<tr><td align="center" style="padding:32px 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">'
. $rows .
'</table></td></tr></table></body></html>';

    foreach ($vars as $k => $v) {
        $html = str_replace('{{' . $k . '}}', htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8'), $html);
    }
    return $html;
}

function sendEmail(string $to, string $toName, string $subject, string $html): bool {
    try {
        $rows = getDB()->query("SELECT `key`, value FROM settings WHERE `key` LIKE 'smtp_%'")->fetchAll();
        $smtp = [];
        foreach ($rows as $r) $smtp[$r['key']] = $r['value'];
    } catch (\Throwable $e) { $smtp = []; }

    $host      = $smtp['smtp_host']       ?? '';
    $port      = (int)($smtp['smtp_port'] ?? 587);
    $user      = $smtp['smtp_user']       ?? '';
    $pass      = $smtp['smtp_pass']       ?? '';
    $fromEmail = $smtp['smtp_from_email'] ?? 'noreply@muongthanh.online';
    $fromName  = $smtp['smtp_from_name']  ?? 'Mường Thanh';

    if ($host && $user && $pass) {
        return smtpSend($host, $port, $user, $pass, $fromEmail, $fromName, $to, $toName, $subject, $html);
    }

    // Fallback: PHP mail()
    $enc = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $hdr = "From: {$fromName} <{$fromEmail}>\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64";
    return mail($to, $enc, chunk_split(base64_encode($html)), $hdr);
}

function sendTemplateEmail(string $code, string $to, string $toName, array $vars = []): bool {
    try {
        $st = getDB()->prepare("SELECT * FROM email_templates WHERE code = ? AND is_active = 1 LIMIT 1");
        $st->execute([$code]);
        $tpl = $st->fetch();
        if (!$tpl) return false;

        $blocks  = json_decode($tpl['blocks'], true) ?? [];
        $subject = $tpl['subject'];
        foreach ($vars as $k => $v) $subject = str_replace('{{' . $k . '}}', $v, $subject);

        return sendEmail($to, $toName, $subject, renderEmailHtml($blocks, $vars));
    } catch (\Throwable $e) { return false; }
}
