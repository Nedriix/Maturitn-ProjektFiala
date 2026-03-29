<?php
// API endpoint: logout.php
session_start();
session_destroy(); // Zničí všechna data relace
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['success' => true]);
?>
