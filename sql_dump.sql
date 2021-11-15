-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Июл 17 2020 г., 03:45
-- Версия сервера: 5.7.23-24
-- Версия PHP: 7.1.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `u1102051_default`
--

-- --------------------------------------------------------

--
-- Структура таблицы `Products`
--

CREATE TABLE `Products` (
  `id` int(10) UNSIGNED NOT NULL,
  `ProductName` varchar(300) NOT NULL,
  `ProductImg` varchar(300) NOT NULL,
  `ProductAvgRank` tinyint(3) UNSIGNED NOT NULL,
  `ProductDescription` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Список продуктов';

-- --------------------------------------------------------

--
-- Структура таблицы `Ranks`
--

CREATE TABLE `Ranks` (
  `id` int(10) UNSIGNED NOT NULL,
  `AddedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ProductId` int(10) UNSIGNED NOT NULL,
  `UserId` int(10) UNSIGNED NOT NULL,
  `Rank` int(10) UNSIGNED NOT NULL,
  `RankMessage` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `Users`
--

CREATE TABLE `Users` (
  `id` int(10) UNSIGNED NOT NULL,
  `AddedData` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UserLogin` varchar(300) NOT NULL,
  `UserEmail` varchar(300) NOT NULL,
  `UserPassword` varchar(300) NOT NULL,
  `UserSession` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Список пользователей';

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `Products`
--
ALTER TABLE `Products`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `Ranks`
--
ALTER TABLE `Ranks`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `Products`
--
ALTER TABLE `Products`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `Ranks`
--
ALTER TABLE `Ranks`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
