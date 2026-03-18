<?php
// API endpoint: get_players.php
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

try {
    $stmt = $pdo->query('SELECT id, name, role, game, description, photo_url, instagram, twitch, created_at FROM players ORDER BY game, name');
    $players = $stmt->fetchAll();
    echo json_encode($players);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Chyba databaze']);
}
?>
