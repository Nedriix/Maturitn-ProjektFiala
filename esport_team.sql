-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Počítač: innodb.endora.cz
-- Vytvořeno: Ned 29. bře 2026, 17:12
-- Verze serveru: 10.5.29-MariaDB-ubu2004-log
-- Verze PHP: 8.1.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databáze: `esport_team`
--

-- --------------------------------------------------------

--
-- Struktura tabulky `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vypisuji data pro tabulku `articles`
--

INSERT INTO `articles` (`id`, `title`, `content`, `image_url`, `created_at`) VALUES
(1, 'adsda', '<h1>dsadasffads</h1><p>\\<strong>jakubsd</strong> sdc</p>', 'uploads/69a94825628da_1170832.jpg', '2026-03-05 09:08:53'),
(4, 'Test 123', '<p>Kod</p>', 'uploads/article_332d3b1713df7a623eda9ac5092e3d07.png', '2026-03-29 14:05:37');

-- --------------------------------------------------------

--
-- Struktura tabulky `matches`
--

CREATE TABLE `matches` (
  `id` int(11) NOT NULL,
  `opponent` varchar(255) NOT NULL,
  `game` varchar(100) NOT NULL,
  `match_date` date NOT NULL,
  `match_time` time NOT NULL,
  `status` enum('upcoming','finished') DEFAULT 'upcoming',
  `score` varchar(50) DEFAULT NULL,
  `report` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vypisuji data pro tabulku `matches`
--

INSERT INTO `matches` (`id`, `opponent`, `game`, `match_date`, `match_time`, `status`, `score`, `report`, `created_at`) VALUES
(1, 'GTR Třebíč', 'CS2', '2026-02-26', '13:51:00', 'finished', '2:0', '', '2026-03-05 10:47:19'),
(2, 'VŠPJ', 'Fortnite', '2026-03-05', '18:33:00', 'upcoming', NULL, NULL, '2026-03-05 21:33:24'),
(3, 'dG', 'DD', '2026-03-27', '11:11:00', 'upcoming', NULL, NULL, '2026-03-26 11:36:53');

-- --------------------------------------------------------

--
-- Struktura tabulky `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vypisuji data pro tabulku `messages`
--

INSERT INTO `messages` (`id`, `name`, `email`, `message`, `created_at`) VALUES
(2, 'Jakub', 'fiala.jakub@volny.cz', 'SFSDGSDGSDGSDG', '2026-03-24 22:51:55');

-- --------------------------------------------------------

--
-- Struktura tabulky `players`
--

CREATE TABLE `players` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` varchar(100) NOT NULL,
  `game` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `twitch` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vypisuji data pro tabulku `players`
--

INSERT INTO `players` (`id`, `name`, `email`, `password_hash`, `role`, `game`, `description`, `photo_url`, `instagram`, `twitch`, `created_at`) VALUES
(5, 'František Pokorný', 'pokornyf.07@spst.eu', '$2y$12$BTLsdSavGogSgJNV68QRsuhS9VYMWiwM/BhwC2ZMr3StVUImsnY2a', 'Captain', 'CS:GO', '', NULL, 'instagram.com', 'twitch.com', '2026-03-29 13:24:33'),
(6, 'Filip Žatečka', 'zateckaf.08@spst.eu', '$2y$12$qcau3rL412jBDwLHI44M1.IpAvzKnAZg2A8lXZBZV3dSWXnfTNQjC', 'IGL', 'CS:GO', '', NULL, 'instagram.com', 'twitch.com', '2026-03-29 13:26:24'),
(7, 'Vojtěch Říha', 'rihav.08@spst.eu', '$2y$12$iOFAxJJ5FMYr5JvDqkIFyuYHhzOENELq6BunlxviFNvSiQ28lfi5a', 'Sniper', 'CS:GO', '', NULL, 'instagram.com', 'twitch.com', '2026-03-29 13:27:08'),
(8, 'Mikuláš Hanák', 'hanakm.06@spst.eu', '$2y$12$cCSQlHSgWlJBvrPFjWYVHeIcAYzujGgSg5Ujk0pbLe65X1bxQU4Om', 'Fragger', 'CS:GO', '', NULL, 'instagram.com', 'twitch.com', '2026-03-29 13:27:57'),
(9, 'Jakub Doležal', 'dolezalj.07@spst.eu', '$2y$12$cI7bYH5scgsBucRppbBgmu17LwmgG2HYpmspWBCO8OLryTIMkEnW.', 'Support', 'CS:GO', '', NULL, 'instagram.com', 'twitch.com', '2026-03-29 13:28:38'),
(10, 'Jan Drápela', 'drapelaj.07@spst.eu', '$2y$12$Wxt4c3sQ3aEtq4OgTxNhJuRYvCNg.mfVU4T/zVic7hzZhJIFJovq.', 'MId Laner', 'League of Legends', '', NULL, 'instagram.com', 'twitch.com', '2026-03-29 13:29:40'),
(11, 'Jakub Zahradníček', 'zahradnicekj.07@spst.eu', '$2y$12$Hanul3boDApr4U42q7SUZuZpxPQnUqFVfuH9lB2g89VRSQeKgpRIq', 'Support', 'League of Legends', '', NULL, 'instagram.com', 'twitch.com', '2026-03-29 13:31:13'),
(12, 'František Máca', 'macaf..08@spst.eu', '$2y$12$OEy0cEaveo/6v3HrbVBJpeCyKWiFFefJPQgxMFyZiFKoIBjvCA8X6', 'Top Laner', 'League of Legends', '', NULL, 'instagram.com', 'twitch.com', '2026-03-29 13:41:08'),
(13, 'Adam Kurtin', 'kurtina.09@spst.eu', '$2y$12$ASsoBf9bMfctJ2ZhRru7Decws3X52C7fWq1knVkPs3MDdCmz5gsS.', 'Jungler', 'League of Legends', '', NULL, 'instagram.com', 'twitch.com', '2026-03-29 13:46:03'),
(14, 'Filip Novotný', 'novotnyf.08@spst.eu', '$2y$12$4WvQn6mSxENZwQWW3wZMDO1rJrNdNQ2XGNN60i9UZyCopK2eCVV3e', 'Bot Laner', 'League of Legends', '', NULL, 'instagram.com', 'twitch.com', '2026-03-29 13:48:36');

-- --------------------------------------------------------

--
-- Struktura tabulky `playoff`
--

CREATE TABLE `playoff` (
  `id` int(11) NOT NULL,
  `bracket_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vypisuji data pro tabulku `playoff`
--

INSERT INTO `playoff` (`id`, `bracket_data`) VALUES
(1, '{\"m1_t1\":\"SPŠT\",\"m1_t2\":\"GTR\",\"m2_t1\":\"SS\",\"m2_t2\":\"SS\",\"m3_t1\":\"FF\",\"m3_t2\":\"FF\",\"m4_t1\":\"\",\"m4_t2\":\"\",\"m5_t1\":\"SPŠT\",\"m5_t2\":\"\",\"m6_t1\":\"SPSČT\",\"m6_t2\":\"\",\"m7_t1\":\"\",\"m7_t2\":\"\",\"m15_t1\":\"\",\"m15_t2\":\"\",\"champ_name\":\"\",\"m14_t1\":\"\",\"m14_t2\":\"\",\"m12_t1\":\"VUT\",\"m12_t2\":\"\",\"m13_t1\":\"\",\"m13_t2\":\"\",\"m8_t1\":\"VŠPJ\",\"m8_t2\":\"VUT\",\"m9_t1\":\"\",\"m9_t2\":\"\",\"m10_t1\":\"\",\"m10_t2\":\"\",\"m11_t1\":\"\",\"m11_t2\":\"\"}');

-- --------------------------------------------------------

--
-- Struktura tabulky `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','editor') DEFAULT 'editor',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vypisuji data pro tabulku `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'admin@spst.cz', '$2y$10$4xr8k6CzN2/2kVDJ0aO69u.4np.S0HStB6px.p3XlkyahWQ52Dyny', 'admin', '2026-03-05 08:09:23'),
(2, 'editor@spst.cz', '$2y$10$xL6SPoCTSMm7cp.sMYxxwukMMOThzhXESj8v.pK2.ZkYObX7fhUPy', 'editor', '2026-03-05 08:44:12');

--
-- Indexy pro exportované tabulky
--

--
-- Indexy pro tabulku `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`);

--
-- Indexy pro tabulku `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`id`);

--
-- Indexy pro tabulku `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexy pro tabulku `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexy pro tabulku `playoff`
--
ALTER TABLE `playoff`
  ADD PRIMARY KEY (`id`);

--
-- Indexy pro tabulku `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pro tabulky
--

--
-- AUTO_INCREMENT pro tabulku `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pro tabulku `matches`
--
ALTER TABLE `matches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pro tabulku `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pro tabulku `players`
--
ALTER TABLE `players`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pro tabulku `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
