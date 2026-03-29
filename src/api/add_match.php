<?php
// API endpoint: add_match.php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Neautorizovaný přístup.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['opponent']) || empty($data['game']) || empty($data['match_date']) || empty($data['match_time'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Vyplňte všechny povinné údaje.']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO matches (opponent, game, match_date, match_time) VALUES (?, ?, ?, ?)");
    $stmt->execute([$data['opponent'], $data['game'], $data['match_date'], $data['match_time']]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Chyba při ukládání.']);
}
?>
