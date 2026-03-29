<?php
// API endpoint: send_contact.php
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

// Získáme data odeslaná z JavaScriptu ve formátu JSON
$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$message = $data['message'] ?? '';

// backendová kontrola
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Vyplňte prosím všechna pole.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Neplatný formát e-mailu.']);
    exit;
}

try {
    // Uložení zprávy do databáze
    $stmt = $pdo->prepare("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $message]);
    
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Došlo k chybě na straně serveru. Zkuste to prosím později.']);
}
?>
