<?php
// API endpoint: get_matches.php
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

try {
    // Seřadíme zápasy: nejprve ty, co se teprve budou hrát (od nejbližšího), pak ty odehrané
    $stmt = $pdo->query("SELECT * FROM matches ORDER BY status DESC, match_date ASC, match_time ASC");
    $matches = $stmt->fetchAll();
    echo json_encode($matches);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Chyba databáze']);
}
?>
