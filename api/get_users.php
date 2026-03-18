<?php
// API endpoint: get_users.php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

// Ochrana: Pouze admin může vidět seznam uživatelů
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Přístup odepřen. Tuto akci může provádět pouze administrátor.']);
    exit;
}

try {
    // Nevybíráme hesla (ani zahašovaná), pouze bezpečné údaje
    $stmt = $pdo->query("SELECT id, email, role, created_at FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll();
    echo json_encode($users);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Chyba databáze']);
}
?>
