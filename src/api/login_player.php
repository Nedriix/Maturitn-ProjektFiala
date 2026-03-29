<?php
// API endpoint: login_player.php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

try {
    $stmt = $pdo->prepare("SELECT * FROM players WHERE email = ?");
    $stmt->execute([$email]);
    $player = $stmt->fetch();

    if ($player && password_verify($password, $player['password_hash'])) {
        // Hráč má oddělenou session od administrátora
        $_SESSION['player_id'] = $player['id'];
        echo json_encode(['success' => true]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Nesprávný e-mail nebo heslo']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Chyba serveru']);
}
?>
