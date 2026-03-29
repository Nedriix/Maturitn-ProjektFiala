<?php
// API endpoint: check_auth.php
session_start();
header('Content-Type: application/json; charset=utf-8');

// Zjistíme, kdo je přihlášený
if (isset($_SESSION['user_id'])) {
    // Přihlášený je Admin nebo Editor
    echo json_encode(['logged_in' => true, 'type' => 'admin', 'role' => $_SESSION['role']]);
} elseif (isset($_SESSION['player_id'])) {
    // Přihlášený je Hráč
    echo json_encode(['logged_in' => true, 'type' => 'player']);
} else {
    // Nikdo není přihlášený
    http_response_code(401);
    echo json_encode(['logged_in' => false]);
}
?>
