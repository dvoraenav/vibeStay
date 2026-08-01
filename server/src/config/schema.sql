CREATE DATABASE IF NOT EXISTS vibestay_db;
USE vibestay_db;

-- 1. טבלת משתמשים
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. טבלת צימרים (עם UUID)
CREATE TABLE IF NOT EXISTS cabins (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(150) NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. טבלת תמונות צימרים
CREATE TABLE IF NOT EXISTS cabin_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cabin_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(550) NOT NULL,
    FOREIGN KEY (cabin_id) REFERENCES cabins(id) ON DELETE CASCADE
);

-- 4. טבלת ביקורות
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cabin_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cabin_id) REFERENCES cabins(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------
-- הכנסת נתוני דוגמה לבדיקה ב-React:
-- ------------------------------------

-- צימר לדוגמה
INSERT INTO cabins (id, name, location, price_per_night, description)
VALUES (
    'c1a2b3c4-1111-2222-3333-444455556666',
    'צימר נוף כנרת',
    'אמירים',
    850.00,
    'צימר עץ קסום עם נוף פנורמי לכנרת, ג ג'קוזי פרטי וגינה ירוקה.'
);

-- תמונה לצימר
INSERT INTO cabin_images (cabin_id, image_url)
VALUES (
    'c1a2b3c4-1111-2222-3333-444455556666',
    'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80'
);