<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Hämta formulärdata
$namn = isset($_POST['namn']) ? htmlspecialchars($_POST['namn']) : '';
$telefon = isset($_POST['telefon']) ? htmlspecialchars($_POST['telefon']) : '';
$mail = isset($_POST['mail']) ? filter_var($_POST['mail'], FILTER_VALIDATE_EMAIL) : '';
$beskrivning = isset($_POST['beskrivning']) ? htmlspecialchars($_POST['beskrivning']) : '';

// Validera mail
if (!$mail) {
    http_response_code(400);
    echo json_encode(['error' => 'E-post är obligatorisk och måste vara giltig']);
    exit;
}

// Hantera filuppladdning
$attachmentPath = null;
$attachmentName = null;

if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $allowedTypes = ['image/webp', 'image/jpeg', 'image/png', 'image/gif'];
    $maxSize = 5 * 1024 * 1024; // 5MB

    if (!in_array($_FILES['file']['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Endast WebP, JPEG, PNG och GIF är tillåtna']);
        exit;
    }

    if ($_FILES['file']['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(['error' => 'Filen är för stor (max 5MB)']);
        exit;
    }

    // Skapa uploads-mapp om den inte finns
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $filename = time() . '_' . basename($_FILES['file']['name']);
    $uploadPath = $uploadDir . $filename;

    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadPath)) {
        $attachmentPath = $uploadPath;
        $attachmentName = $_FILES['file']['name'];
    }
}

// E-postinställningar från One.com
$to = 'emiliajonsson@live.com';
$from = 'noreply@emiliaskapar.se';

// E-post till Emilia
$subject = 'Ny beställning från ' . ($namn ?: 'okänd');

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: " . $from . "\r\n";
$headers .= "Reply-To: " . $mail . "\r\n";

$messageToEmilia = "
<html>
<body style='font-family: Arial, sans-serif;'>
<h2>Ny beställning mottagen!</h2>
<p><strong>Namn:</strong> " . ($namn ?: 'Inte angett') . "</p>
<p><strong>Telefon:</strong> " . ($telefon ?: 'Inte angett') . "</p>
<p><strong>E-post:</strong> " . $mail . "</p>
<p><strong>Beskrivning:</strong> " . nl2br($beskrivning ?: 'Ingen beskrivning') . "</p>
" . ($attachmentName ? "<p><strong>Bildfil:</strong> " . $attachmentName . "</p>" : "") . "
</body>
</html>
";

// Skicka e-post till Emilia
$mailToEmilia = mail($to, $subject, $messageToEmilia, $headers);

// E-post till kunden (bekräftelse)
$confirmationSubject = 'Vi mottog din beställning!';
$confirmationMessage = "
<html>
<body style='font-family: Arial, sans-serif;'>
<h2>Tack för din beställning!</h2>
<p>Vi har mottagit din beställning och återkommer till dig så snart som möjligt.</p>
<p>Vänliga hälsningar,<br>Emilia Skapar</p>
</body>
</html>
";

$confirmationHeaders = "MIME-Version: 1.0\r\n";
$confirmationHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
$confirmationHeaders .= "From: " . $from . "\r\n";

mail($mail, $confirmationSubject, $confirmationMessage, $confirmationHeaders);

// Svar till frontend
if ($mailToEmilia) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Beställning skickad']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Kunde inte skicka beställning']);
}
?>