<?php
// API endpoint: setup_admin.php
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

$allowSetup = getenv('APP_ALLOW_SETUP_ADMIN') === '1';
if (!$allowSetup) {
    http_response_code(403);
    echo json_encode(['error' => 'Setup admin endpoint je zakazan. Pro jednorazove povoleni nastavte APP_ALLOW_SETUP_ADMIN=1.']);
    exit;
}

$email = trim((string)(getenv('APP_SETUP_ADMIN_EMAIL') ?: ''));
$password = (string)(getenv('APP_SETUP_ADMIN_PASSWORD') ?: '');
$role = 'admin';

if ($email === '' || $password === '') {
    http_response_code(500);
    echo json_encode(['error' => 'Chybi APP_SETUP_ADMIN_EMAIL nebo APP_SETUP_ADMIN_PASSWORD.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Neplatny format admin e-mailu.']);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)');
    $stmt->execute([$email, $hash, $role]);
    echo json_encode(['success' => true, 'message' => 'Vychozi administrator byl vytvoren.']);
} catch (PDOException $e) {
    if ((string)$e->getCode() === '23000') {
        http_response_code(409);
        echo json_encode(['error' => 'Administrator s timto e-mailem jiz existuje.']);
        exit;
    }

    http_response_code(500);
    echo json_encode(['error' => 'Chyba pri vytvareni administratora.']);
}
