-- ====================================================
-- USERS
-- ====================================================
INSERT INTO "User" (username, password, role) VALUES
('noemie', 'password123', 'admin'),
('alice', 'alicepass', 'user'),
('marc', 'marcpass', 'user'),
('sara', 'sarapass', 'user'),
('john', 'johnpass', 'user');

-- ====================================================
-- ARTISTS
-- ====================================================
INSERT INTO Artist (name, genre, age, country, url) VALUES
('Imagine Dragons', 'Rock', 35, 'USA', 'https://imaginedragonsmusic.com'),
('Dua Lipa', 'Pop', 28, 'UK', 'https://dualipa.com'),
('Daft Punk', 'Electronic', 45, 'France', 'https://daftpunk.com'),
('Kendrick Lamar', 'Hip-Hop', 36, 'USA', 'https://kendricklamar.com'),
('Angèle', 'Pop', 28, 'Belgium', 'https://angele.com');

-- ====================================================
-- ALBUMS
-- ====================================================
INSERT INTO Album (title, year, song, artistId) VALUES
('Evolve', 2017, 12, 1),
('Night Visions', 2012, 11, 1),

('Future Nostalgia', 2020, 11, 2),
('Dua Lipa', 2017, 12, 2),

('Random Access Memories', 2013, 13, 3),
('Discovery', 2001, 14, 3),

('DAMN.', 2017, 14, 4),
('good kid, m.A.A.d city', 2012, 12, 4),

('Brol', 2018, 12, 5),
('Nonante-Cinq', 2021, 13, 5);

-- ====================================================
-- CONCERTS
-- ====================================================
INSERT INTO Concert (location, date, place, artistId) VALUES
('Paris - Accor Arena', '2025-06-20 20:00:00', 20000, 1),
('Londres - O2 Arena', '2025-09-10 20:00:00', 15000, 1),

('Bruxelles - Palais 12', '2025-08-15 20:00:00', 14000, 2),
('New York - Madison Square Garden', '2025-11-05 20:00:00', 18000, 2),

('Paris - Bercy', '2025-07-03 20:00:00', 17000, 3),

('Los Angeles - Staples Center', '2025-10-22 20:00:00', 19000, 4),

('Bruxelles - Forest National', '2025-05-14 20:00:00', 9000, 5);

-- ====================================================
-- USER / ARTIST FAVORITES
-- ====================================================
INSERT INTO UserArtistFav (userId, artistId) VALUES
(1, 3), -- Noemie aime Daft Punk
(1, 5), -- Noemie aime Angèle

(2, 1),
(2, 2),

(3, 4),

(4, 1),

(5, 3),
(5, 2);
