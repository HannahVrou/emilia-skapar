<?php
// ⬇️ ÄNDRA DENNA EMAIL ADRESS ⬇️
$receiver_email = "hannabarlin@gmail.com"; // Email här!

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $namn = sanitize_input($_POST['namn'] ?? '');
    $mail = sanitize_input($_POST['mail'] ?? '');
    $telefon = sanitize_input($_POST['telefon'] ?? '');
    $meddelande = sanitize_input($_POST['meddelande'] ?? '');

    if (empty($mail)) {
        http_response_code(400);
        echo json_encode(['error' => 'E-post är obligatorisk']);
        exit;
    }

    $subject = "Nytt meddelande från $namn - Emilia Skapar";
    
    $body = "Namn: $namn\n";
    $body .= "E-post: $mail\n";
    $body .= "Telefon: $telefon\n\n";
    $body .= "Meddelande:\n$meddelande";

    $headers = "From: $mail\r\n";
    $headers .= "Reply-To: $mail\r\n";

    if (mail($receiver_email, $subject, $body, $headers)) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Meddelande skickat']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Kunde inte skicka meddelande']);
    }
}

function sanitize_input($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}
?>