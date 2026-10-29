<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ---------------------------------------------------------------
// Hjälpfunktioner
// ---------------------------------------------------------------
function clean($value)
{
    return htmlspecialchars(trim((string) $value), ENT_QUOTES, 'UTF-8');
}

function headerSafe($value)
{
    // Tar bort radbrytningar så att inget kan injiceras i mail-headers
    return trim(preg_replace('/[\r\n]+/', ' ', strip_tags((string) $value)));
}

function encodeSubject($subject)
{
    return '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

function fail($code, $message)
{
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

/**
 * Skickar ett HTML-mail, med bilagor om sådana finns.
 * $attachments: array av ['tmp' => sökväg, 'name' => filnamn, 'mime' => typ]
 */
function sendHtmlMail($to, $from, $replyTo, $subject, $html, $attachments = [])
{
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "From: " . $from . "\r\n";
    if ($replyTo) {
        $headers .= "Reply-To: " . $replyTo . "\r\n";
    }

    if (count($attachments) > 0) {
        $boundary = md5(uniqid((string) time(), true));
        $headers .= "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"\r\n";

        $body  = "--" . $boundary . "\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($html)) . "\r\n";

        foreach ($attachments as $att) {
            $content = file_get_contents($att['tmp']);
            $body .= "--" . $boundary . "\r\n";
            $body .= "Content-Type: " . $att['mime'] . "; name=\"" . $att['name'] . "\"\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n";
            $body .= "Content-Disposition: attachment; filename=\"" . $att['name'] . "\"\r\n\r\n";
            $body .= chunk_split(base64_encode($content)) . "\r\n";
        }

        $body .= "--" . $boundary . "--";
    } else {
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body = $html;
    }

    return mail($to, encodeSubject($subject), $body, $headers);
}

// ---------------------------------------------------------------
// Inställningar
// ---------------------------------------------------------------
$to   = 'hej@emiliaskapar.se';
$from = 'noreply@emiliaskapar.se';

// Vilket formulär kommer anropet från?
// "bestallning" = företagsbeställning, "foretagskund" = bli företagskund
$formtyp = isset($_POST['formtyp']) ? $_POST['formtyp'] : 'bestallning';

// ---------------------------------------------------------------
// Gemensamma fält
// ---------------------------------------------------------------
$foretagRaw = isset($_POST['foretag']) ? $_POST['foretag'] : '';
$foretag    = clean($foretagRaw);
$telefon    = isset($_POST['telefon']) ? clean($_POST['telefon']) : '';
$mail       = isset($_POST['mail']) ? filter_var(trim($_POST['mail']), FILTER_VALIDATE_EMAIL) : false;

if ($foretag === '') {
    fail(400, 'Företag är obligatoriskt');
}

if (!$mail) {
    fail(400, 'E-post är obligatorisk och måste vara giltig');
}

$mailSafe = htmlspecialchars($mail, ENT_QUOTES, 'UTF-8');

// ===============================================================
// FORMULÄR 1: BLI FÖRETAGSKUND
// ===============================================================
if ($formtyp === 'foretagskund') {
    $fornamn    = isset($_POST['fornamn']) ? clean($_POST['fornamn']) : '';
    $efternamn  = isset($_POST['efternamn']) ? clean($_POST['efternamn']) : '';
    $meddelande = isset($_POST['meddelande']) ? clean($_POST['meddelande']) : '';

    if ($fornamn === '') {
        fail(400, 'Förnamn på kontaktperson är obligatoriskt');
    }

    $kontakt = trim($fornamn . ' ' . $efternamn);

    $subject = 'Ny förfrågan om att bli företagskund: ' . (headerSafe($foretagRaw) ?: 'okänt företag');

    $messageToEmilia = "
<html>
<body style='font-family: Arial, sans-serif;'>
<h2>Ny förfrågan om att bli företagskund</h2>
<p><strong>Företag:</strong> " . $foretag . "</p>
<p><strong>Kontaktperson:</strong> " . $kontakt . "</p>
<p><strong>E-post:</strong> " . $mailSafe . "</p>
<p><strong>Telefon:</strong> " . ($telefon ?: 'Inte angett') . "</p>
<p><strong>Meddelande:</strong> " . nl2br($meddelande ?: 'Inget meddelande') . "</p>
</body>
</html>
";

    $sent = sendHtmlMail($to, $from, $mail, $subject, $messageToEmilia);

    // Bekräftelse till kunden
    $confirmationMessage = "
<html>
<body style='font-family: Arial, sans-serif;'>
<h2>Tack för din förfrågan!</h2>
<p>Hej " . $fornamn . ",</p>
<p>Vi har tagit emot er förfrågan om att bli företagskund hos oss och återkommer så snart vi har möjlighet.</p>
<p>Vänliga hälsningar,<br>Emilia Skapar</p>
</body>
</html>
";

    sendHtmlMail($mail, $from, null, 'Vi mottog din förfrågan!', $confirmationMessage);

    if ($sent) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Förfrågan skickad']);
    } else {
        fail(500, 'Kunde inte skicka förfrågan');
    }
    exit;
}

// ===============================================================
// FORMULÄR 2: FÖRETAGSBESTÄLLNING
// ===============================================================
$kontaktRaw    = isset($_POST['kontaktperson']) ? $_POST['kontaktperson'] : '';
$kontaktperson = clean($kontaktRaw);
$text          = isset($_POST['text']) ? clean($_POST['text']) : '';
$beskrivning   = isset($_POST['beskrivning']) ? clean($_POST['beskrivning']) : '';

if ($kontaktperson === '') {
    fail(400, 'Kontaktperson är obligatorisk');
}

// Hantera filuppladdningar (file_0, file_1, ...)
$allowedTypes = [
    'image/webp' => 'webp',
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/gif'  => 'gif',
];
$maxSize      = 5 * 1024 * 1024;   // 5 MB per fil
$maxFiles     = 10;
$maxTotalSize = 20 * 1024 * 1024;  // 20 MB totalt

$attachments = [];
$totalSize   = 0;
$finfo       = new finfo(FILEINFO_MIME_TYPE);

foreach ($_FILES as $key => $file) {
    if (strpos($key, 'file_') !== 0) {
        continue;
    }

    if ($file['error'] === UPLOAD_ERR_NO_FILE) {
        continue;
    }

    if ($file['error'] !== UPLOAD_ERR_OK) {
        fail(400, 'Filen ' . basename($file['name']) . ' kunde inte laddas upp');
    }

    if (count($attachments) >= $maxFiles) {
        fail(400, 'Max ' . $maxFiles . ' bilder kan skickas åt gången');
    }

    // Kontrollera riktig filtyp från innehållet, inte bara det webbläsaren uppger
    $mime = $finfo->file($file['tmp_name']);
    if (!isset($allowedTypes[$mime])) {
        fail(400, 'Endast WebP, JPEG, PNG och GIF är tillåtna');
    }

    if ($file['size'] > $maxSize) {
        fail(400, basename($file['name']) . ' är för stor (max 5MB)');
    }

    $totalSize += $file['size'];
    if ($totalSize > $maxTotalSize) {
        fail(400, 'Bilderna är för stora tillsammans (max 20MB)');
    }

    $safeName = preg_replace('/[^A-Za-z0-9._-]/', '_', basename($file['name']));
    if ($safeName === '' || $safeName === '.' || $safeName === '..') {
        $safeName = 'bild_' . count($attachments) . '.' . $allowedTypes[$mime];
    }

    $attachments[] = [
        'tmp'  => $file['tmp_name'],
        'name' => $safeName,
        'mime' => $mime,
    ];
}

// E-post till Emilia
$subject = 'Ny företagsbeställning från ' . (headerSafe($foretagRaw) ?: 'okänt företag');

$attachmentList = '';
if (count($attachments) > 0) {
    $names = array_map(function ($a) {
        return htmlspecialchars($a['name'], ENT_QUOTES, 'UTF-8');
    }, $attachments);
    $attachmentList = '<p><strong>Bifogade bilder (' . count($attachments) . '):</strong><br>'
        . implode('<br>', $names) . '</p>';
}

$messageToEmilia = "
<html>
<body style='font-family: Arial, sans-serif;'>
<h2>Ny företagsbeställning mottagen</h2>
<p><strong>Företag:</strong> " . $foretag . "</p>
<p><strong>Kontaktperson:</strong> " . $kontaktperson . "</p>
<p><strong>E-post:</strong> " . $mailSafe . "</p>
<p><strong>Telefon:</strong> " . ($telefon ?: 'Inte angett') . "</p>
<p><strong>Önskad text:</strong> " . ($text ?: 'Inte angett') . "</p>
<p><strong>Beskrivning:</strong> " . nl2br($beskrivning ?: 'Ingen beskrivning') . "</p>
" . $attachmentList . "
</body>
</html>
";

$sent = sendHtmlMail($to, $from, $mail, $subject, $messageToEmilia, $attachments);

// Bekräftelse till kunden
$confirmationMessage = "
<html>
<body style='font-family: Arial, sans-serif;'>
<h2>Tack för din beställning!</h2>
<p>Hej " . $kontaktperson . ",</p>
<p>Vi har mottagit er beställning från " . $foretag . " och återkommer till er så snart vi har möjlighet.</p>
<p>Vänliga hälsningar,<br>Emilia Skapar</p>
</body>
</html>
";

sendHtmlMail($mail, $from, null, 'Vi mottog din beställning!', $confirmationMessage);

// Svar till frontend
if ($sent) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Beställning skickad']);
} else {
    fail(500, 'Kunde inte skicka beställning');
}
?>