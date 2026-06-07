-- ============================================================
-- MOXIE ADVENTURES - Complete MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS moxie_adventures CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE moxie_adventures;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(15),
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- ============================================================
-- ADMINS
-- ============================================================
CREATE TABLE admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin', 'editor') DEFAULT 'editor',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
CREATE TABLE team_members (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  bio TEXT,
  photo VARCHAR(255),
  instagram VARCHAR(255),
  linkedin VARCHAR(255),
  facebook VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TREKS
-- ============================================================
CREATE TABLE treks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(200) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  tagline VARCHAR(300),
  category ENUM('trekking','camping','stargazing','yatra','expedition','event') NOT NULL,
  zone ENUM('north','west','south','east','central') DEFAULT 'north',
  difficulty ENUM('easy','moderate','difficult','extreme') DEFAULT 'moderate',
  duration_days INT NOT NULL,
  max_altitude INT COMMENT 'in meters',
  best_season VARCHAR(100),
  min_group_size INT DEFAULT 2,
  max_group_size INT DEFAULT 20,
  price_per_person DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  overview TEXT,
  highlights JSON,
  inclusions JSON,
  exclusions JSON,
  things_to_carry JSON,
  cover_image VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0.00,
  reviews_count INT DEFAULT 0,
  bookings_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_category (category),
  INDEX idx_difficulty (difficulty),
  INDEX idx_featured (is_featured)
);

-- ============================================================
-- TREK IMAGES
-- ============================================================
CREATE TABLE trek_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  trek_id INT UNSIGNED NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  caption VARCHAR(255),
  sort_order INT DEFAULT 0,
  FOREIGN KEY (trek_id) REFERENCES treks(id) ON DELETE CASCADE,
  INDEX idx_trek (trek_id)
);

-- ============================================================
-- TREK ITINERARY
-- ============================================================
CREATE TABLE trek_itineraries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  trek_id INT UNSIGNED NOT NULL,
  day_number INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  altitude INT COMMENT 'in meters',
  distance DECIMAL(5,2) COMMENT 'in km',
  stay VARCHAR(100),
  meals VARCHAR(100),
  FOREIGN KEY (trek_id) REFERENCES treks(id) ON DELETE CASCADE,
  INDEX idx_trek (trek_id)
);

-- ============================================================
-- TREK BOOKINGS
-- ============================================================
CREATE TABLE trek_bookings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_ref VARCHAR(20) NOT NULL UNIQUE,
  user_id INT UNSIGNED NULL,
  trek_id INT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  participants INT NOT NULL DEFAULT 1,
  trek_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  status ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  payment_status ENUM('unpaid','partial','paid','refunded') DEFAULT 'unpaid',
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (trek_id) REFERENCES treks(id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_booking_ref (booking_ref),
  INDEX idx_status (status),
  INDEX idx_trek_date (trek_date)
);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE events (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(200) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  tagline VARCHAR(300),
  category ENUM('trekking','camping','stargazing','yatra','expedition','event') DEFAULT 'event',
  description TEXT,
  highlights JSON,
  cover_image VARCHAR(255),
  location VARCHAR(200) NOT NULL,
  event_date DATE NOT NULL,
  end_date DATE,
  time_start TIME,
  time_end TIME,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_participants INT DEFAULT 50,
  registered_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_date (event_date)
);

-- ============================================================
-- EVENT REGISTRATIONS
-- ============================================================
CREATE TABLE event_registrations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  registration_ref VARCHAR(20) NOT NULL UNIQUE,
  event_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  participants INT DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  payment_status ENUM('unpaid','paid','refunded') DEFAULT 'unpaid',
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_event (event_id)
);

-- ============================================================
-- GALLERY
-- ============================================================
CREATE TABLE gallery (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200),
  image_url VARCHAR(255) NOT NULL,
  category ENUM('fireflies','camping','western_ghats','north_india','treks','stargazing','events') NOT NULL,
  location VARCHAR(100),
  captured_by VARCHAR(100),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category)
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE reviews (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  trek_id INT UNSIGNED NULL,
  event_id INT UNSIGNED NULL,
  reviewer_name VARCHAR(100) NOT NULL,
  reviewer_email VARCHAR(150),
  reviewer_avatar VARCHAR(255),
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(200),
  body TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (trek_id) REFERENCES treks(id) ON DELETE SET NULL,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
  INDEX idx_trek (trek_id),
  INDEX idx_approved (is_approved)
);

-- ============================================================
-- CAREERS
-- ============================================================
CREATE TABLE careers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  department VARCHAR(100),
  location VARCHAR(100) DEFAULT 'Remote',
  type ENUM('full_time','part_time','internship','volunteer') DEFAULT 'full_time',
  description TEXT NOT NULL,
  requirements TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- CAREER APPLICATIONS
-- ============================================================
CREATE TABLE career_applications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  career_id INT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(15),
  resume_url VARCHAR(255),
  cover_letter TEXT,
  status ENUM('new','reviewing','shortlisted','rejected','hired') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (career_id) REFERENCES careers(id),
  INDEX idx_career (career_id),
  INDEX idx_status (status)
);

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
CREATE TABLE contact_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(15),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  replied_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_read (is_read)
);

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
CREATE TABLE newsletter_subscribers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  name VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_active (is_active)
);

-- ============================================================
-- SITE STATS (cached counters)
-- ============================================================
CREATE TABLE site_stats (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  stat_key VARCHAR(50) NOT NULL UNIQUE,
  stat_value INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Default super admin (password: Admin@123)
INSERT INTO admins (name, email, password_hash, role) VALUES
('Admin', 'admin@moxieadventures.com', '$2b$10$rQZ9uKpuQGXKJVJvJvJvJeKJvJvJvJvJvJvJvJvJvJvJvJvJvJv', 'super_admin');

-- Team members
INSERT INTO team_members (name, designation, bio, sort_order) VALUES
('Krishna Khushwaha', 'Founder', 'Krishna is a passionate adventurer and entrepreneur who founded Moxie Adventures to share his love for the outdoors with the world. With over a decade of trekking experience across the Himalayas and Western Ghats, he brings deep expertise and genuine passion to every expedition.', 1),
('Hiral Sampat', 'Managing Director', 'Hiral brings her sharp business acumen and love for travel to Moxie Adventures. As Managing Director, she oversees operations, partnerships, and community building, ensuring every adventure is seamless, safe, and unforgettable.', 2);

-- Sample treks
INSERT INTO treks (slug, name, tagline, category, zone, difficulty, duration_days, max_altitude, best_season, price_per_person, original_price, overview, highlights, inclusions, exclusions, cover_image, is_featured) VALUES
('sandakphu-trek', 'Sandakphu Trek', 'The Roof of West Bengal', 'trekking', 'north', 'moderate', 6, 3636, 'October–December, March–May', 8999.00, 11999.00,
 'Sandakphu is the highest point in West Bengal at 3636 metres and offers one of the most spectacular Himalayan panoramas in the world. On a clear day, you can see four of the five highest peaks in the world – Everest, Kanchenjunga, Lhotse, and Makalu.',
 '["Views of 4 of the 5 tallest peaks in the world", "Walk through the Singalila National Park", "Unique flora including rhododendrons and magnolias", "Sunrise over the Himalayas", "Cultural village homestays"]',
 '["Trek Leader", "All meals (breakfast, lunch, dinner)", "Accommodation in tents/homestays", "Permits and entry fees", "First aid and medical kit", "Transportation from base camp"]',
 '["Flights and trains", "Personal expenses", "Tips and gratuities", "Travel insurance", "Any emergency evacuation costs"]',
 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200', TRUE),
('brahmatal-trek', 'Brahmatal Trek', 'Walk among frozen lakes and oak forests', 'trekking', 'north', 'moderate', 6, 3867, 'December–February', 7999.00, 9999.00,
 'Brahmatal Trek is a high-altitude winter trek in Uttarakhand offering stunning views of Mt. Trishul and Mt. Nanda Ghunti. The trail passes through beautiful oak and rhododendron forests and frozen lakes.',
 '["Frozen Brahmatal lake", "360° views of Trishul and Nanda Ghunti", "Snow-covered oak forests", "Clear winter skies perfect for stargazing", "Perfect beginner winter trek"]',
 '["Trek Leader", "All meals", "Camping equipment", "Permits", "First aid kit"]',
 '["Flights and trains", "Personal gear", "Travel insurance", "Porter charges"]',
 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200', TRUE),
('harishchandragad-trek', 'Harishchandragad Trek', 'Ancient fortress meets dramatic cliffs', 'trekking', 'west', 'difficult', 2, 1424, 'October–February', 3499.00, 4999.00,
 'Harishchandragad is one of the most iconic treks in the Western Ghats. Known for the dramatic Konkan Kada cliff, the ancient Harishchandreshwar temple, and the mysterious Kedareshwar cave, this trek is a perfect blend of adventure and spirituality.',
 '["Dramatic Konkan Kada cliff edge", "Ancient Harishchandreshwar temple", "Kedareshwar cave with Shivlinga", "Sunrise over Sahyadri ranges", "Historical fort exploration"]',
 '["Trek guide", "All meals", "Tents", "Basic first aid"]',
 '["Transport", "Personal gear", "Insurance"]',
 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200', TRUE),
('rajmachi-camping', 'Rajmachi Night Camp', 'Stars above ancient forts', 'camping', 'west', 'easy', 2, 900, 'October–May', 2499.00, 3499.00,
 'Spend a magical night under a canopy of stars at the base of Rajmachi Fort in the Sahyadri mountains. Enjoy bonfire, barbecue, night trekking, and a sunrise view that will stay with you forever.',
 '["Bonfire under the stars", "Night trek to fort", "Stargazing session", "Sunrise photography", "Barbecue dinner"]',
 '["Stay in tents", "Dinner and breakfast", "Bonfire", "Stargazing guide"]',
 '["Transport", "Lunch", "Personal gear"]',
 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200', FALSE),
('kedarnath-yatra', 'Kedarnath Yatra', 'A journey to the abode of Lord Shiva', 'yatra', 'north', 'moderate', 5, 3583, 'May–June, September–November', 12999.00, 15999.00,
 'The Kedarnath Yatra is one of the most sacred pilgrimages in India. Located in the Garhwal Himalayas at an altitude of 3583 metres, the Kedarnath temple is dedicated to Lord Shiva and is part of the Char Dham Yatra.',
 '["Darshan at sacred Kedarnath temple", "Scenic helicopter option available", "Walk through breathtaking Mandakini valley", "Gaurikund hot springs", "Spiritual evening aarti"]',
 '["Hotel accommodation (3-star)", "All meals", "Helicopter booking assistance", "Local guide", "Permits"]',
 '["Flights", "Helicopter charges (if opted)", "Personal expenses", "Pooja items"]',
 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200', TRUE),
('milky-way-stargazing', 'Milky Way Stargazing', 'Chase the cosmos in pristine dark skies', 'stargazing', 'west', 'easy', 2, 600, 'October–March', 1999.00, 2999.00,
 'Escape the city lights and witness the Milky Way in all its glory. Our stargazing camps are set in areas with minimal light pollution, paired with expert astronomers and professional telescope setups.',
 '["Milky Way photography session", "Professional telescope viewing", "Expert astronomer guide", "Night sky storytelling", "Astrophotography tips"]',
 '["Tent accommodation", "Dinner and breakfast", "Telescope access", "Expert guide"]',
 '["Transport", "Camera gear", "Personal expenses"]',
 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200', FALSE);

-- Trek itineraries for Sandakphu
INSERT INTO trek_itineraries (trek_id, day_number, title, description, altitude, distance, stay, meals) VALUES
(1, 1, 'Manebhanjyang to Meghma', 'The trek begins at Manebhanjyang, a small border town between India and Nepal. After a briefing, we head through forests and small villages to reach Meghma.', 2440, 12.0, 'Guesthouse', 'Lunch, Dinner'),
(1, 2, 'Meghma to Kalpokhari', 'Today we trek through the Singalila Ridge with stunning views of Kangchenjunga appearing through the clouds. We pass through Gairibans and reach Kalpokhari.', 2700, 10.0, 'Guesthouse', 'Breakfast, Lunch, Dinner'),
(1, 3, 'Kalpokhari to Sandakphu', 'The most dramatic day of the trek. We ascend steadily to reach Sandakphu, the highest point of our journey with panoramic views of Everest, Makalu, Lhotse, and Kangchenjunga.', 3636, 14.0, 'Guesthouse', 'Breakfast, Lunch, Dinner'),
(1, 4, 'Sandakphu to Phalut', 'We walk along the ridge towards Phalut with constant Himalayan views. This is one of the most scenic days of the trek.', 3600, 21.0, 'Guesthouse', 'Breakfast, Lunch, Dinner'),
(1, 5, 'Phalut to Gorkhey', 'Descend from the ridge into lush rhododendron forests and settle into the charming village of Gorkhey.', 2380, 15.0, 'Homestay', 'Breakfast, Lunch, Dinner'),
(1, 6, 'Gorkhey to Rimbick (Drive out)', 'Last day of trekking to Rimbick followed by a drive to Darjeeling or NJP.', 2286, 8.0, 'Hotel', 'Breakfast, Lunch');

-- Sample events
INSERT INTO events (slug, name, tagline, category, description, cover_image, location, event_date, end_date, price, max_participants, is_featured) VALUES
('firefly-night-2025', 'Firefly Night Camp', 'A magical evening in the bioluminescent forest', 'camping', 'Experience the magical firefly season in the forests near Pune. An evening of wonder, photography, and connection with nature.', 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=1200', 'Bhimashankar, Maharashtra', '2025-07-05', '2025-07-06', 2499.00, 30, TRUE),
('milky-way-camp-july', 'Milky Way Night', 'Stargaze from 0% light pollution zones', 'stargazing', 'Join us for an unforgettable night under the stars. Professional telescopes, astronomer guide, and astrophotography workshop included.', 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=1200', 'Pawna Lake, Maharashtra', '2025-07-12', '2025-07-13', 1999.00, 40, TRUE),
('monsoon-trek-harishchandragad', 'Monsoon Trek – Harishchandragad', 'The waterfalls are alive!', 'trekking', 'Experience Harishchandragad in the dramatic monsoon season. Mist, waterfalls, and lush green valleys make this one of the most beautiful treks of the year.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200', 'Ahmednagar, Maharashtra', '2025-07-19', '2025-07-20', 3499.00, 25, FALSE),
('sandakphu-oct-batch', 'Sandakphu Trek – Oct Batch', 'Golden rhododendrons and Himalayan views', 'trekking', 'Join our October batch for the iconic Sandakphu trek. October is one of the best months with clear skies and stunning autumn colours.', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200', 'Darjeeling, West Bengal', '2025-10-15', '2025-10-20', 8999.00, 20, TRUE),
('kedarnath-sept', 'Kedarnath Yatra – Sept Batch', 'Last batch before temple closes', 'yatra', 'Join our final September batch for the Kedarnath Yatra before the temple closes for winter. Limited seats available.', 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200', 'Kedarnath, Uttarakhand', '2025-09-20', '2025-09-25', 12999.00, 15, FALSE);

-- Gallery images
INSERT INTO gallery (title, image_url, category, location) VALUES
('Firefly Forest Magic', 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=800', 'fireflies', 'Bhimashankar'),
('Firefly Night', 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800', 'fireflies', 'Kothaligad'),
('Riverside Camp', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800', 'camping', 'Kolad'),
('Mountain Camp', 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=800', 'camping', 'Sandakphu'),
('Bonfire Night', 'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?w=800', 'camping', 'Rajmachi'),
('Sahyadri Sunset', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800', 'western_ghats', 'Lonavala'),
('Waterfall Trail', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', 'western_ghats', 'Harishchandragad'),
('Konkan Kada', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', 'western_ghats', 'Harishchandragad'),
('Himalayan Dawn', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', 'north_india', 'Sandakphu'),
('Snowy Peaks', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'north_india', 'Brahmatal'),
('Temple in Snow', 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800', 'north_india', 'Kedarnath'),
('Ridge Walk', 'https://images.unsplash.com/photo-1485728395791-9842d456c0e5?w=800', 'treks', 'Sandakphu'),
('Forest Path', 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', 'treks', 'Western Ghats'),
('Summit View', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800', 'treks', 'Himalaya'),
('Milky Way', 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800', 'stargazing', 'Pawna Lake'),
('Star Trail', 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800', 'stargazing', 'Igatpuri');

-- Reviews (featured)
INSERT INTO reviews (reviewer_name, trek_id, rating, title, body, is_approved, is_featured) VALUES
('Priya Sharma', 1, 5, 'Life-changing experience!', 'The Sandakphu trek with Moxie Adventures was absolutely magical. Seeing four of the world''s highest peaks at sunrise was something I''ll never forget. The guides were incredibly knowledgeable and the food was surprisingly delicious! Highly recommend.', TRUE, TRUE),
('Rahul Verma', 2, 5, 'Perfect winter trek', 'Brahmatal exceeded all my expectations. The frozen lake, the snow-covered forests, the incredible views of Trishul — it was like walking in a dream. Moxie Adventures took care of everything perfectly.', TRUE, TRUE),
('Sneha Patil', 3, 5, 'Adventure and spirituality combined', 'Harishchandragad was intense but totally worth it. The Konkan Kada cliff edge literally took my breath away. The ancient temple at the top added a spiritual dimension to the whole experience. Will be back for more!', TRUE, TRUE),
('Arjun Mehta', 5, 5, 'Most spiritual journey of my life', 'The Kedarnath Yatra organized by Moxie Adventures was impeccably organized. From the helicopter booking to the puja arrangements, everything was seamless. A deeply transformative experience.', TRUE, TRUE),
('Kavya Nair', 4, 5, 'Magical stargazing night', 'The Milky Way stargazing camp was surreal. Away from city lights, the night sky was simply breathtaking. The astronomer guide made it even more special with stories and explanations. Booked my second trip already!', TRUE, FALSE),
('Vikram Singh', 1, 4, 'Incredible views, amazing team', 'The Moxie team was exceptional throughout the trek. Very safety-conscious and the camaraderie among trekkers was wonderful. The views from Sandakphu are unmatched anywhere in the world.', TRUE, FALSE);

-- Careers
INSERT INTO careers (title, department, location, type, description, requirements) VALUES
('Trek Leader', 'Operations', 'Field (Pan India)', 'full_time', 'Lead trekking groups across India and ensure safe, memorable adventures for our guests. You will be responsible for route planning, safety protocols, and creating an exceptional experience for our community.', 'Minimum 3 years of trekking experience, Wilderness First Aid certification, excellent communication skills, knowledge of multiple trek routes'),
('Social Media Manager', 'Marketing', 'Remote', 'full_time', 'Manage and grow Moxie Adventures'' social media presence across Instagram, YouTube, and Facebook. Create compelling content that captures the spirit of adventure.', 'Experience in social media management, photography/videography skills, content creation, knowledge of analytics tools'),
('Adventure Photographer', 'Creative', 'Field (Pan India)', 'full_time', 'Document our expeditions through stunning photography and videography. Your work will inspire thousands to take their first adventure.', 'Professional photography portfolio, experience in outdoor/adventure photography, drone flying license preferred'),
('Customer Experience Executive', 'Customer Success', 'Mumbai/Remote', 'full_time', 'Be the first point of contact for our adventure community. Help customers plan their perfect adventure, handle bookings, and ensure complete satisfaction.', 'Excellent communication skills, passion for travel and adventure, CRM experience');

-- Site stats
INSERT INTO site_stats (stat_key, stat_value) VALUES
('treks_completed', 500),
('happy_adventurers', 8000),
('events_conducted', 120),
('years_of_experience', 5);

-- Update admin password (bcrypt hash of 'Admin@123')
UPDATE admins SET password_hash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh' WHERE email = 'admin@moxieadventures.com';
