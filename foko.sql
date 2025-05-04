-- Create plans table
CREATE TABLE plans (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

-- Create users table
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  plan_id BIGINT,
  profile_picture_url VARCHAR(2083),
  password TEXT NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- Create followers table
CREATE TABLE followers (
  follower_id BIGINT NOT NULL,
  followed_id BIGINT NOT NULL,
  PRIMARY KEY (follower_id, followed_id),
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create publications table
CREATE TABLE publications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  preset_id BIGINT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (preset_id) REFERENCES presets(id)
);

-- Create images table
CREATE TABLE images (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  publication_id BIGINT,
  url VARCHAR(2083) NOT NULL,
  FOREIGN KEY (publication_id) REFERENCES publications(id)
);

-- Create features table
CREATE TABLE features (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- Relationship between plans and features
CREATE TABLE plan_features (
  plan_id BIGINT,
  feature_id BIGINT,
  PRIMARY KEY (plan_id, feature_id),
  FOREIGN KEY (plan_id) REFERENCES plans(id),
  FOREIGN KEY (feature_id) REFERENCES features(id)
);

-- Create chats table
CREATE TABLE chats (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100)
);

-- Create messages table
CREATE TABLE messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  sender_id BIGINT,
  content TEXT NOT NULL,
  send_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  chat_id BIGINT,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (chat_id) REFERENCES chats(id)
);

-- Create presets table
CREATE TABLE presets (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  before_image_id BIGINT,
  after_image_id BIGINT,
  user_id BIGINT,
  FOREIGN KEY (before_image_id) REFERENCES images(id),
  FOREIGN KEY (after_image_id) REFERENCES images(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create purchases table
CREATE TABLE purchases (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  preset_id BIGINT,
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (preset_id) REFERENCES presets(id)
);

-- Relationship between users and chats
CREATE TABLE users_chats (
  chat_id BIGINT,
  user_id BIGINT,
  PRIMARY KEY (chat_id, user_id),
  FOREIGN KEY (chat_id) REFERENCES chats(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create tags table
CREATE TABLE tags (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Relationship between presets and tags
CREATE TABLE presets_tags (
  preset_id BIGINT,
  tag_id BIGINT,
  PRIMARY KEY (preset_id, tag_id),
  FOREIGN KEY (preset_id) REFERENCES presets(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- Relationship between pubications and tags
CREATE TABLE publications_tags (
  publication_id BIGINT,
  tag_id BIGINT,
  PRIMARY KEY (publication_id, tag_id),
  FOREIGN KEY (publication_id) REFERENCES publications(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- Create likes table
CREATE TABLE likes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  publication_id BIGINT NOT NULL,
  like_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (publication_id) REFERENCES publications(id),
  UNIQUE (user_id, publication_id)
);

-- Create saved posts table
CREATE TABLE saved_posts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  publication_id BIGINT NOT NULL,
  saved_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (publication_id) REFERENCES publications(id),
  UNIQUE (user_id, publication_id)
);

-- Comments on publications
CREATE TABLE comments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  publication_id BIGINT NOT NULL,
  content TEXT NOT NULL,
  comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (publication_id) REFERENCES publications(id)
);

-- Reports system (for users or publications)
CREATE TABLE reports (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  reporter_id BIGINT NOT NULL,
  target_type ENUM('user', 'publication') NOT NULL,
  target_id BIGINT NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending',
  report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(id)
);

-- Notifications
CREATE TABLE notifications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
