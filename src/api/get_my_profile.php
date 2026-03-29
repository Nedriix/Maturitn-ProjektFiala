<?php
// API endpoint: get_my_profile.php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

// Zkontrolujeme, zda je přihlášený hráč
if (!isset($_SESSION['player_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Neautorizovaný přístup.']);
    exit;
}

try {
    // Vytáhneme z databáze pouze údaje přihlášeného hráče
    $stmt = $pdo->prepare("SELECT name, description, instagram, twitch, photo_url FROM players WHERE id = ?");
    $stmt->execute([$_SESSION['player_id']]);
    $player = $stmt->fetch();

    if ($player) {
        echo json_encode($player);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Hráč nebyl nalezen.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Chyba databáze.']);
}
?>
