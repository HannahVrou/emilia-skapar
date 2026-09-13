<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$företag = isset($_POST['företag']) ? htmlspecialchars($_POST['företag']) : '';
$kontaktperson = isset($_POST['kontaktperson']) ? htmlspecialchars($_POST['kontaktperson']) : '';
$mail = isset($_POST['mail']) ? filter_var($_POST['mail'], FILTER_VALIDATE_EMAIL) : '';
$telefon = isset($_POST['telefon']) ? htmlspecialchars($_POST['telefon']) : '';
$beskrivning = isset($_POST['beskrivning']) ? htmlspecialchars($_POST['beskrivning']) : '';

// Läs in och avkoda produkterna
$produkterRaw = isset($_POST['produkter']) ? $_POST['produkter'] : '[]';
$produkter = json_decode($produkterRaw, true);
if (!is_array($produkter)) {
    $produkter = [];
}

// Bygg HTML för produktlistan
$produkterHtml = '';
if (count($produkter) > 0) {
    $produkterHtml .= '<ul>';
    foreach ($produkter as $p) {
        $name = htmlspecialchars($p['name'] ?? '');
        $quantity = htmlspecialchars($p['quantity'] ?? '');
        $font = htmlspecialchars($p['font'] ?? '');
        $color = htmlspecialchars($p['color'] ?? '');
        $idea = htmlspecialchars($p['idea'] ?? '');

        $produkterHtml .= "<li style='margin-bottom: 12px;'>";
        $produkterHtml .= "<strong>{$name}</strong> — Antal: {$quantity}<br>";
        if ($font) $produkterHtml .= "Teckensnitt: {$font}<br>";
        if ($color) $produkterHtml .= "Färg: {$color}<br>";
        if ($idea) $produkterHtml .= "Bildidé: " . nl2br($idea) . "<br>";
        $produkterHtml .= "</li>";
    }
    $produkterHtml .= '</ul>';
} else {
    $produkterHtml = '<p>Inga produkter valda</p>';
}

if (!$mail) {
    http_response_code(400);
    echo json_encode(['error' => 'E-post är obligatorisk']);
    exit;
}

$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$fileCount = 0;

foreach ($_FILES as $key => $file) {
    if (strpos($key, 'file_') === 0 && $file['error'] === UPLOAD_ERR_OK) {
        $allowedTypes = ['image/webp', 'image/jpeg', 'image/png', 'image/gif'];
        
        if (!in_array($file['type'], $allowedTypes)) {
            continue;
        }

        $filename = time() . '_' . $fileCount . '_' . basename($file['name']);
        $uploadPath = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            $fileCount++;
        }
    }
}

$to = 'emiliajonsson@live.com';
$from = 'noreply@emiliaskapar.se';
$subject = 'Ny företagsbeställning från ' . $företag;

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: " . $from . "\r\n";
$headers .= "Reply-To: " . $mail . "\r\n";

$messageToEmilia = "
<html>
<body style='font-family: Arial, sans-serif;'>
<h2>Ny företagsbeställning!</h2>
<p><strong>Företag:</strong> " . $företag . "</p>
<p><strong>Kontaktperson:</strong> " . ($kontaktperson ?: 'Inte angett') . "</p>
<p><strong>E-post:</strong> " . $mail . "</p>
<p><strong>Telefon:</strong> " . ($telefon ?: 'Inte angett') . "</p>
<p><strong>Beskrivning:</strong> " . nl2br($beskrivning ?: 'Ingen beskrivning') . "</p>
<p><strong>Valda produkter:</strong></p>
" . $produkterHtml . "
<p><strong>Antal bilder:</strong> " . $fileCount . "</p>
</body>
</html>
";

mail($to, $subject, $messageToEmilia, $headers);

$confirmationMessage = "
<html>
<body style='font-family: Arial, sans-serif;'>
<h2>Tack för er beställningsförfrågan!</h2>
<p>Vi har mottagit er beställning och återkommer till er snart.</p>

<hr>

<h3>Sammanfattning av er beställning:</h3>
<p><strong>Företag:</strong> " . $företag . "</p>
<p><strong>Kontaktperson:</strong> " . ($kontaktperson ?: 'Inte angett') . "</p>
<p><strong>E-post:</strong> " . $mail . "</p>
<p><strong>Telefon:</strong> " . ($telefon ?: 'Inte angett') . "</p>
<p><strong>Beskrivning:</strong> " . nl2br($beskrivning ?: 'Ingen beskrivning') . "</p>
<p><strong>Valda produkter:</strong></p>
" . $produkterHtml . "
<p><strong>Antal bilder:</strong> " . $fileCount . "</p>

<hr>

<p>Vänliga hälsningar,<br>Emilia Skapar</p>
</body>
</html>
";

$confirmationHeaders = "MIME-Version: 1.0\r\n";
$confirmationHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
$confirmationHeaders .= "From: " . $from . "\r\n";

mail($mail, 'Vi mottog er företagsförfrågan!', $confirmationMessage, $confirmationHeaders);

http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Företagsbeställning skickad']);
?>