<?php
// API endpoint: add_user.php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

// Ochrana: Pouze admin může vytvářet nové účty
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Přístup odepřen. Tuto akci může provádět pouze administrátor.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'editor';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'E-mail a heslo jsou povinné.']);
    exit;
}

// Zašifrování hesla
$hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)");
    $stmt->execute([$email, $hash, $role]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    // 23000 je SQL kód pro porušení unikátnosti (uživatel už existuje)
    if ($e->getCode() == 23000) { 
        http_response_code(400);
        echo json_encode(['error' => 'Uživatel s tímto e-mailem již existuje.']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Chyba při ukládání do databáze.']);
    }
}
?>
