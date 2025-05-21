-- =======================================
-- 0. Eliminar y crear la base de datos
-- =======================================
DROP DATABASE IF EXISTS `foko`;
CREATE DATABASE `foko`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `foko`;

-- =======================================
-- 1. Roles (cada usuario tiene un único rol)
-- =======================================
CREATE TABLE `roles` (
  `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name`        VARCHAR(50) NOT NULL UNIQUE COMMENT 'Identificador interno del rol',
  `description` TEXT            COMMENT 'Descripción humana del rol',
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `roles` (`name`, `description`) VALUES
  ('user',  'Usuario básico con permisos estándar'),
  ('admin', 'Administrador con permisos completos');

-- =======================================
-- 2. Planes y funcionalidades
-- =======================================
CREATE TABLE `plans` (
  `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name`        VARCHAR(100) NOT NULL,
  `price`       DECIMAL(10,2) NOT NULL,
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `features` (
  `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name`        VARCHAR(100) NOT NULL,
  `description` TEXT,
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `plan_features` (
  `plan_id`     BIGINT NOT NULL,
  `feature_id`  BIGINT NOT NULL,
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`plan_id`, `feature_id`),
  FOREIGN KEY (`plan_id`)
    REFERENCES `plans`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`feature_id`)
    REFERENCES `features`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================
-- 3. Usuarios
-- =======================================
CREATE TABLE `users` (
  `id`                   BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name`                 VARCHAR(100) NOT NULL,
  `username`             VARCHAR(191) NOT NULL UNIQUE,
  `email`                VARCHAR(191) NOT NULL UNIQUE,
  `password`             VARCHAR(255) NOT NULL COMMENT 'Hash de la contraseña',
  `profile_image_url`  VARCHAR(2083),
  `status`               TINYINT(1)  NOT NULL DEFAULT 1,
  `plan_id`              BIGINT,
  `role_id`              BIGINT NOT NULL DEFAULT 1 COMMENT 'FK a roles.id',
  `created_at`           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`plan_id`)
    REFERENCES `plans`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  FOREIGN KEY (`role_id`)
    REFERENCES `roles`(`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================
-- 4. Hashtags
-- =======================================
CREATE TABLE `hashtags` (
  `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
  `tag`         VARCHAR(100) NOT NULL UNIQUE,
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================
-- 5. Publicaciones e Imágenes
-- =======================================
CREATE TABLE `publications` (
  `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id`     BIGINT NOT NULL,
  `title`       VARCHAR(255) NOT NULL,
  `description` TEXT,
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `images` (
  `id`              BIGINT AUTO_INCREMENT PRIMARY KEY,
  `publication_id`  BIGINT NOT NULL,
  `url`             VARCHAR(2083) NOT NULL,
  `created_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                      ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`publication_id`)
    REFERENCES `publications`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `publication_hashtags` (
  `publication_id`  BIGINT NOT NULL,
  `hashtag_id`      BIGINT NOT NULL,
  PRIMARY KEY (`publication_id`, `hashtag_id`),
  FOREIGN KEY (`publication_id`)
    REFERENCES `publications`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`hashtag_id`)
    REFERENCES `hashtags`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================
-- 6. Presets y venta de presets
-- =======================================
CREATE TABLE `presets` (
  `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name`        VARCHAR(100) NOT NULL,
  `description` TEXT,
  `price`       DECIMAL(10,2) NOT NULL,
  `user_id`     BIGINT NOT NULL,
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `preset_images` (
  `preset_id`   BIGINT NOT NULL,
  `image_id`    BIGINT NOT NULL,
  `role`        ENUM('before','after') NOT NULL,
  PRIMARY KEY (`preset_id`, `image_id`, `role`),
  FOREIGN KEY (`preset_id`)
    REFERENCES `presets`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`image_id`)
    REFERENCES `images`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `preset_hashtags` (
  `preset_id`    BIGINT NOT NULL,
  `hashtag_id`   BIGINT NOT NULL,
  PRIMARY KEY (`preset_id`, `hashtag_id`),
  FOREIGN KEY (`preset_id`)
    REFERENCES `presets`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`hashtag_id`)
    REFERENCES `hashtags`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `purchases` (
  `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id`     BIGINT NOT NULL,
  `preset_id`   BIGINT NOT NULL,
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`preset_id`)
    REFERENCES `presets`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================
-- 7. Seguidores
-- =======================================
CREATE TABLE `followers` (
  `follower_id`   BIGINT NOT NULL,
  `followed_id`   BIGINT NOT NULL,
  `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`follower_id`, `followed_id`),
  FOREIGN KEY (`follower_id`)
    REFERENCES `users`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`followed_id`)
    REFERENCES `users`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================
-- 8. Likes, Guardados y Comentarios
-- =======================================
CREATE TABLE `likes` (
  `id`              BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id`         BIGINT NOT NULL,
  `publication_id`  BIGINT NOT NULL,
  `created_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`publication_id`)
    REFERENCES `publications`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  UNIQUE KEY `ux_likes_user_publication` (`user_id`, `publication_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `saved_publications` (
  `id`              BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id`         BIGINT NOT NULL,
  `publication_id`  BIGINT NOT NULL,
  `saved_at`        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`publication_id`)
    REFERENCES `publications`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  UNIQUE KEY `ux_saved_user_publication` (`user_id`, `publication_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `comments` (
  `id`              BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id`         BIGINT NOT NULL,
  `publication_id`  BIGINT NOT NULL,
  `content`         TEXT    NOT NULL,
  `created_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`publication_id`)
    REFERENCES `publications`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================
-- 9. Chats y Mensajes
-- =======================================
CREATE TABLE `chats` (
  `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name`        VARCHAR(100),
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users_chats` (
  `chat_id`     BIGINT NOT NULL,
  `user_id`     BIGINT NOT NULL,
  `joined_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`chat_id`, `user_id`),
  FOREIGN KEY (`chat_id`)
    REFERENCES `chats`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `messages` (
  `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
  `sender_id`   BIGINT NOT NULL,
  `chat_id`     BIGINT NOT NULL,
  `content`     TEXT    NOT NULL,
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`)
    REFERENCES `users`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`chat_id`)
    REFERENCES `chats`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================
-- 10. Notificaciones y Reportes (unificado)
-- =======================================
CREATE TABLE `notifications` (
  `id`             BIGINT AUTO_INCREMENT PRIMARY KEY,
  `recipient_id`   BIGINT NOT NULL COMMENT 'Usuario que recibe la notificación o reporte',
  `actor_id`       BIGINT NOT NULL COMMENT 'Usuario que genera el evento o denuncia',
  `type`           ENUM(
                      'like',
                      'comment',
                      'follow',
                      'message',
                      'purchase',
                      'report'
                    ) NOT NULL COMMENT 'Tipo de notificación o reporte',
  `entity_type`    ENUM(
                      'publication',
                      'comment',
                      'user',
                      'preset'
                    ) NOT NULL COMMENT 'Tipo de objeto relacionado',
  `entity_id`      BIGINT NOT NULL COMMENT 'ID del objeto relacionado',
  `reason`         TEXT    NULL COMMENT 'Motivo de la denuncia (solo si type = report)',
  `status`         ENUM(
                      'pending',
                      'reviewed',
                      'resolved'
                    ) NOT NULL DEFAULT 'pending' COMMENT 'Estado del reporte (solo si type = report)',
  `created_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `read_at`        TIMESTAMP NULL DEFAULT NULL COMMENT 'Fecha en que la notificación fue leída',
  `updated_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                      ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_notifications_recipient` (`recipient_id`),
  FOREIGN KEY (`recipient_id`)
    REFERENCES `users`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`actor_id`)
    REFERENCES `users`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
