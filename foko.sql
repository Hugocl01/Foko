CREATE TABLE plans (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(320) NOT NULL UNIQUE,
  plan_id BIGINT,
  password_hash TEXT NOT NULL,
  profile_link VARCHAR(2083),
  profile_description TEXT,
  FOREIGN KEY (plan_id) REFERENCES plans (id)
);

CREATE TABLE posts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  preset_id BIGINT,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (preset_id) REFERENCES presets (id)
);

CREATE TABLE images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  post_id BIGINT,
  url VARCHAR(2083) NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts (id)
);

CREATE TABLE features (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE plan_features (
  plan_id BIGINT,
  feature_id BIGINT,
  PRIMARY KEY (plan_id, feature_id),
  FOREIGN KEY (plan_id) REFERENCES plans (id),
  FOREIGN KEY (feature_id) REFERENCES features (id)
);

CREATE TABLE chats (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  type VARCHAR(50) NOT NULL
);

CREATE TABLE messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  sender_id BIGINT,
  content TEXT NOT NULL,
  send_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  chat_id BIGINT,
  FOREIGN KEY (sender_id) REFERENCES users (id),
  FOREIGN KEY (chat_id) REFERENCES chats (id)
);

CREATE TABLE presets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  before_image_id BIGINT,
  after_image_id BIGINT,
  user_id BIGINT,
  FOREIGN KEY (before_image_id) REFERENCES images (id),
  FOREIGN KEY (after_image_id) REFERENCES images (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE purchases (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  preset_id BIGINT,
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (preset_id) REFERENCES presets (id)
);

CREATE TABLE users_chats (
  chat_id BIGINT,
  user_id BIGINT,
  PRIMARY KEY (chat_id, user_id),
  FOREIGN KEY (chat_id) REFERENCES chats (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE tags (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE presets_tags (
  preset_id BIGINT,
  tag_id BIGINT,
  PRIMARY KEY (preset_id, tag_id),
  FOREIGN KEY (preset_id) REFERENCES presets (id),
  FOREIGN KEY (tag_id) REFERENCES tags (id)
);

CREATE TABLE images_tags (
  media_id BIGINT,
  tag_id BIGINT,
  PRIMARY KEY (media_id, tag_id),
  FOREIGN KEY (media_id) REFERENCES images (id),
  FOREIGN KEY (tag_id) REFERENCES tags (id)
);

CREATE TABLE profiles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNIQUE,
  profile_picture_url VARCHAR(2083),
  description TEXT,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE likes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  post_id BIGINT NOT NULL,
  like_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (post_id) REFERENCES posts (id),
  UNIQUE (user_id, post_id)
);

CREATE TABLE saved (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  post_id BIGINT NOT NULL,
  saved_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (post_id) REFERENCES posts (id),
  UNIQUE (user_id, post_id)
);
