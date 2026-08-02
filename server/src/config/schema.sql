CREATE DATABASE IF NOT EXISTS vibestay_db;
USE vibestay_db;

-- 1. טבלת משתמשים (כולל תפקידי Admin ו-User לדרישות הפרויקט)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. טבלת צימרים
CREATE TABLE IF NOT EXISTS cabins (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(150) NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. טבלת תמונות צימרים (תמיכה במורכבות גלרייה)
CREATE TABLE IF NOT EXISTS cabin_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cabin_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(550) NOT NULL,
    FOREIGN KEY (cabin_id) REFERENCES cabins(id) ON DELETE CASCADE
);

-- 4. טבלת הזמנות (חובה לתמיכה בתהליך Booking מלא!)
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cabin_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cabin_id) REFERENCES cabins(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. טבלת ביקורות
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

-- ----------------------------------------------------
-- הכנסת נתוני דוגמה עשירים באנגלית (מתאים ל-UI):
-- ----------------------------------------------------

-- הכנסת סוויטות
INSERT INTO cabins (id, name, location, price_per_night, description)
VALUES 
(
    'c1a2b3c4-1111-2222-3333-444455556666',
    'Piccolo Suite',
    'Amirim',
    850.00,
    'An intimate and charming boutique suite surrounded by high trees and quiet hiking paths. Features a private heated jacuzzi, king bed, and breathtaking Galileen views.'
),
(
    'c2b3c4d5-2222-3333-4444-555566667777',
    'Monroe Suite',
    'Amirim',
    950.00,
    'Luxury retro-styled suite combining elegance and comfort. Includes a private pool, indoor jacuzzi, smart TV with Netflix, and a fully equipped espresso bar.'
);

-- הכנסת תמונות לגלריה עבור הצימר הראשון (Piccolo)
INSERT INTO cabin_images (cabin_id, image_url) VALUES
('c1a2b3c4-1111-2222-3333-444455556666', 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800'),
('c1a2b3c4-1111-2222-3333-444455556666', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800'),
('c1a2b3c4-1111-2222-3333-444455556666', 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800'),
('c1a2b3c4-1111-2222-3333-444455556666', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800');

-- הכנסת תמונות לגלריה עבור הצימר השני (Monroe)
INSERT INTO cabin_images (cabin_id, image_url) VALUES
('c2b3c4d5-2222-3333-4444-555566667777', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'),
('c2b3c4d5-2222-3333-4444-555566667777', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800');