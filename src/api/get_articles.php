<?php
// API endpoint: get_articles.php
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

try {
    $stmt = $pdo->query("SELECT * FROM articles ORDER BY created_at DESC");
    $articles = $stmt->fetchAll();
    echo json_encode($articles);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Chyba databáze']);
}
?>
