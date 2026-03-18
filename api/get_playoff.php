<?php
// API endpoint: get_playoff.php
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

try {
    $stmt = $pdo->query("SELECT bracket_data FROM playoff WHERE id = 1");
    $row = $stmt->fetch();
    // Pokud máme data, vypíšeme je, jinak pošleme prázdný JSON objekt
    echo $row ? $row['bracket_data'] : '{}';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Chyba databáze']);
}
?>
