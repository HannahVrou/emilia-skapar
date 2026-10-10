<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Hjälpfunktioner
function clean($value) {
    return htmlspecialchars(trim((string)$value), ENT_QUOTES, 'UTF-8');
}

function cleanSingleLine($value) {
    // Tar bort radbrytningar så att värdet kan användas säkert i mail-headers
    return trim(preg_replace('/[\r\n]+/', ' ', (string)$value));
}

// Hämta data från formuläret (matchar fälten i Order.jsx)
$namn = isset($_POST['namn']) ? cleanSingleLine($_POST['namn']) : '';
$mailRaw = isset($_POST['mail']) ? cleanSingleLine($_POST['mail']) : '';
$mail = filter_var($mailRaw, FILTER_VALIDATE_EMAIL);
$telefon = isset($_POST['telefon']) ? cleanSingleLine($_POST['telefon']) : '';
$beskrivning = isset($_POST['beskrivning']) ? trim($_POST['beskrivning']) : '';

$namnHtml = clean($namn);
$telefonHtml = clean($telefon);
$beskrivningHtml = clean($beskrivning);

// Läs in och avkoda produkterna
$produkterRaw = isset($_POST['produkter']) ? $_POST['produkter'] : '[]';
$produkter = json_decode($produkterRaw, true);
if (!is_array($produkter)) {
    $produkter = [];
}

// Validering
if (!$mail) {
    http_response_code(400);
    echo json_encode(['error' => 'E-post är obligatorisk']);
    exit;
}

if (count($produkter) === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Du måste välja minst en produkt']);
    exit;
}

// Bygg HTML för produktlistan
$thStyle = 'border: 1px solid #ddd; padding: 8px; text-align: left;';
$tdStyle = 'border: 1px solid #ddd; padding: 8px; vertical-align: top;';

$produkterHtml = '<table style="width: 100%; border-collapse: collapse;">';
$produkterHtml .= '<tr style="background-color: #f0f0f0;">';
$produkterHtml .= '<th style="' . $thStyle . '">Produkt</th>';
$produkterHtml .= '<th style="' . $thStyle . '">Antal</th>';
$produkterHtml .= '<th style="' . $thStyle . '">Teckensnitt</th>';
$produkterHtml .= '<th style="' . $thStyle . '">Färg produkt</th>';
$produkterHtml .= '<th style="' . $thStyle . '">Färg tråd</th>';
$produkterHtml .= '<th style="' . $thStyle . '">Storlek</th>';
$produkterHtml .= '<th style="' . $thStyle . '">Beskrivning</th>';
$produkterHtml .= '</tr>';

foreach ($produkter as $p) {
    if (!is_array($p)) {
        continue;
    }

    $name = clean($p['name'] ?? '');
    $quantity = max(1, (int)($p['quantity'] ?? 1));
    $font = clean($p['font'] ?? '') ?: '-';
    $colorProduct = clean($p['colorProduct'] ?? '') ?: '-';
    $colorThread = clean($p['colorThread'] ?? '') ?: '-';
    $size = clean($p['size'] ?? '') ?: '-';
    $idea = clean($p['idea'] ?? '') ?: '-';

    $produkterHtml .= '<tr>';
    $produkterHtml .= "<td style='{$tdStyle}'><strong>{$name}</strong></td>";
    $produkterHtml .= "<td style='{$tdStyle}'>{$quantity}</td>";
    $produkterHtml .= "<td style='{$tdStyle}'>{$font}</td>";
    $produkterHtml .= "<td style='{$tdStyle}'>{$colorProduct}</td>";
    $produkterHtml .= "<td style='{$tdStyle}'>{$colorThread}</td>";
    $produkterHtml .= "<td style='{$tdStyle}'>{$size}</td>";
    $produkterHtml .= "<td style='{$tdStyle}'>" . nl2br($idea) . "</td>";
    $produkterHtml .= '</tr>';
}
$produkterHtml .= '</table>';

// Hantera filuppladdning
$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$allowedMimeTypes = [
    'image/webp' => 'webp',
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/gif'  => 'gif',
];
$maxFileSize = 5 * 1024 * 1024; // 5 MB, samma som i Order.jsx

$fileCount = 0;
$uploadedFiles = [];
$finfo = new finfo(FILEINFO_MIME_TYPE);

foreach ($_FILES as $key => $file) {
    if (strpos($key, 'file_') !== 0 || $file['error'] !== UPLOAD_ERR_OK) {
        continue;
    }

    if ($file['size'] > $maxFileSize) {
        continue;
    }

    // Kontrollera riktig filtyp utifrån innehållet
    $mimeType = $finfo->file($file['tmp_name']);
    if (!isset($allowedMimeTypes[$mimeType])) {
        continue;
    }

    // Rensa filnamnet och sätt tillägg utifrån verklig filtyp
    $baseName = pathinfo($file['name'], PATHINFO_FILENAME);
    $baseName = preg_replace('/[^A-Za-z0-9_-]/', '_', $baseName);
    $baseName = substr($baseName, 0, 60);
    $filename = time() . '_' . $fileCount . '_' . $baseName . '.' . $allowedMimeTypes[$mimeType];
    $uploadPath = $uploadDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        $fileCount++;
        $uploadedFiles[] = $filename;
    }
}

// Email-inställningar
$to = 'info@barlindesign.se'; // ÄNDRA DENNA EMAIL
$from = 'noreply@emiliaskapar.se';
$subject = 'Ny beställningsförfrågan från ' . ($namn ?: 'Anonym');
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: " . $from . "\r\n";
$headers .= "Reply-To: " . $mail . "\r\n";

$mailHtml = clean($mail);

// Email till Emilia
$messageToEmilia = "
<html>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
<h2 style='color: #5e380f;'>Ny beställningsförfrågan</h2>

<h3>Kundinformation:</h3>
<p><strong>Namn:</strong> " . ($namnHtml ?: 'Inte angett') . "</p>
<p><strong>E-post:</strong> " . $mailHtml . "</p>
<p><strong>Telefon:</strong> " . ($telefonHtml ?: 'Inte angett') . "</p>

<h3>Beskrivning från kund:</h3>
<p>" . nl2br($beskrivningHtml ?: 'Ingen beskrivning') . "</p>

<h3>Valda produkter:</h3>
" . $produkterHtml . "

<h3>Bilagor:</h3>
<p><strong>Antal uppladdade bilder:</strong> " . $fileCount . "</p>
" . (count($uploadedFiles) > 0 ? '<p><strong>Filer:</strong> ' . clean(implode(', ', $uploadedFiles)) . '</p>' : '') . "

<hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
<p style='color: #999; font-size: 12px;'>Detta mail är automatiskt genererat från Emilia Skapars webbplats.</p>
</body>
</html>
";

// Skicka mail till Emilia
mail($to, $encodedSubject, $messageToEmilia, $headers);

// Bekräftelsemail till kunden
$confirmationHeaders = "MIME-Version: 1.0\r\n";
$confirmationHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
$confirmationHeaders .= "From: " . $from . "\r\n";

$confirmationMessage = "
<html>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
<h2 style='color: #5e380f;'>Tack för din beställningsförfrågan!</h2>

<p>Vi har mottagit din förfrågan och återkommer till dig snart med pris och nästa steg.</p>

<hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>

<h3>Sammanfattning av din förfrågan:</h3>

<h4>Dina uppgifter:</h4>
<p><strong>Namn:</strong> " . ($namnHtml ?: 'Inte angett') . "</p>
<p><strong>E-post:</strong> " . $mailHtml . "</p>
<p><strong>Telefon:</strong> " . ($telefonHtml ?: 'Inte angett') . "</p>

<h4>Din beskrivning:</h4>
<p>" . nl2br($beskrivningHtml ?: 'Ingen beskrivning') . "</p>

<h4>Dina valda produkter:</h4>
" . $produkterHtml . "

<h4>Bilagor:</h4>
<p><strong>Antal uppladdade bilder:</strong> " . $fileCount . "</p>

<hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>

<p style='color: #666;'>
Du kan kontakta oss på:<br>
Telefon: 072-505 00 66<br>
E-post: hej@emiliaskapar.se
</p>

<p style='color: #999; font-size: 12px;'>Vänliga hälsningar,<br>Emilia Skapar</p>
</body>
</html>
";

$confirmationSubject = '=?UTF-8?B?' . base64_encode('Vi har mottagit din beställningsförfrågan') . '?=';
mail($mail, $confirmationSubject, $confirmationMessage, $confirmationHeaders);

http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Beställningen skickad']);
?>