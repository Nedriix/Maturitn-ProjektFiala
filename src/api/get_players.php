<?php
// API endpoint: get_players.php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

try {
    $isPrivileged = in_array($_SESSION['role'] ?? '', ['admin', 'editor'], true);

    if ($isPrivileged) {
        $stmt = $pdo->query('SELECT id, name, email, role, game, description, photo_url, instagram, twitch, created_at FROM players ORDER BY game, name');
    } else {
        $stmt = $pdo->query('SELECT id, name, role, game, description, photo_url, instagram, twitch, created_at FROM players ORDER BY game, name');
    }

    $players = $stmt->fetchAll();
    echo json_encode($players);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Chyba databaze']);
}
?>
