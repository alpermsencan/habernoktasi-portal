-- SQL Schema for Hostinger MySQL / MariaDB / PostgreSQL
-- Table: news_articles

CREATE TABLE IF NOT EXISTS `news_articles` (
  `id` VARCHAR(64) NOT NULL,
  `guid` VARCHAR(255) NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `slug` VARCHAR(500) NOT NULL,
  `summary` TEXT NULL,
  `content` LONGTEXT NULL,
  `source_link` VARCHAR(750) NOT NULL,
  `source_name` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'Gündem',
  `image_url` VARCHAR(500) NOT NULL DEFAULT '/placeholder.webp',
  `published_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_guid` (`guid`),
  UNIQUE KEY `uk_source_link` (`source_link`(255)),
  KEY `idx_category_published` (`category`, `published_at` DESC),
  KEY `idx_published_at` (`published_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
