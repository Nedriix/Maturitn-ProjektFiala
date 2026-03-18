<?php

function save_uploaded_image(array $file, string $prefix = 'img_', int $maxBytes = 5242880): string
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Nahrani souboru selhalo.');
    }

    $tmpName = (string)($file['tmp_name'] ?? '');
    $fileSize = (int)($file['size'] ?? 0);

    if ($tmpName === '' || !is_uploaded_file($tmpName)) {
        throw new RuntimeException('Neplatny upload souboru.');
    }

    if ($fileSize <= 0 || $fileSize > $maxBytes) {
        throw new RuntimeException('Soubor je prazdny nebo prekrocil povolenou velikost 5 MB.');
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = (string)$finfo->file($tmpName);
    $allowedMimes = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/gif' => 'gif'
    ];

    if (!isset($allowedMimes[$mimeType])) {
        throw new RuntimeException('Povoleny jsou pouze obrazky JPG, PNG, WEBP nebo GIF.');
    }

    if (@getimagesize($tmpName) === false) {
        throw new RuntimeException('Nahrany soubor neni validni obrazek.');
    }

    $uploadDir = dirname(__DIR__) . '/uploads';
    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
        throw new RuntimeException('Nepodarilo se pripravit cilovou slozku pro upload.');
    }

    $random = bin2hex(random_bytes(16));
    $fileName = $prefix . $random . '.' . $allowedMimes[$mimeType];
    $targetPath = $uploadDir . '/' . $fileName;

    if (!move_uploaded_file($tmpName, $targetPath)) {
        throw new RuntimeException('Nepodarilo se ulozit nahrany soubor.');
    }

    return 'uploads/' . $fileName;
}

function delete_uploaded_image(?string $publicPath): void
{
    if (!$publicPath || strpos($publicPath, 'uploads/') !== 0) {
        return;
    }

    $uploadsBase = realpath(dirname(__DIR__) . '/uploads');
    if ($uploadsBase === false) {
        return;
    }

    $relativePath = substr($publicPath, strlen('uploads/'));
    if ($relativePath === false || $relativePath === '') {
        return;
    }

    $absolutePath = realpath($uploadsBase . '/' . $relativePath);
    if ($absolutePath && strpos($absolutePath, $uploadsBase) === 0 && is_file($absolutePath)) {
        @unlink($absolutePath);
    }
}
