-- First delete existing data (if any)
DROP TABLE IF EXISTS releases;
DROP TABLE IF EXISTS artists;

-- Create tables with timestamps and UUID support
CREATE TABLE artists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT NOT NULL,
  genre TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE releases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  release_date INTEGER NOT NULL,
  status TEXT NOT NULL,
  genre TEXT NOT NULL,
  artist_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (artist_id) REFERENCES artists(id)
);

-- Insert artists with auto-generated IDs
INSERT INTO artists (id, name, bio, genre, created_at, updated_at) VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Jane Doe', 'Indie pop sensation from Portland', 'Indie Pop', unixepoch('now') * 1000, unixepoch('now') * 1000),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'John Smith', 'Rock legend with 20 years of experience', 'Rock',unixepoch('now') * 1000, unixepoch('now') * 1000),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Max Wave', 'Electronic music producer with a unique style', 'Electronic',unixepoch('now') * 1000, unixepoch('now') * 1000),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'The Blue Notes', 'Jazz quartet from New Orleans', 'Jazz',unixepoch('now') * 1000, unixepoch('now') * 1000);

-- Insert releases with auto-generated IDs
INSERT INTO releases (id, title, release_date, status, genre, artist_id, created_at, updated_at) VALUES 
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Breaking Free', unixepoch('2024-04-01'), 'unreleased', 'Indie Pop', (SELECT id FROM artists WHERE name = 'Jane Doe'),unixepoch('now') * 1000, unixepoch('now') * 1000),
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Summer Nights', unixepoch('2024-03-15'), 'released', 'Indie Pop', (SELECT id FROM artists WHERE name = 'Jane Doe'),unixepoch('now') * 1000, unixepoch('now') * 1000),
  ('g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'Rock Revolution', unixepoch('2024-02-01'), 'trending', 'Rock', (SELECT id FROM artists WHERE name = 'John Smith'),unixepoch('now') * 1000, unixepoch('now') * 1000),
  ('h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'Electric Dreams', unixepoch('2024-05-10'), 'unreleased', 'Electronic', (SELECT id FROM artists WHERE name = 'Max Wave'),unixepoch('now') * 1000, unixepoch('now') * 1000),
  ('i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'Midnight Sessions', unixepoch('2024-01-15'), 'trending', 'Jazz', (SELECT id FROM artists WHERE name = 'The Blue Notes'),unixepoch('now') * 1000, unixepoch('now') * 1000),
  ('j0eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 'Urban Echoes', unixepoch('2023-11-20'), 'released', 'Jazz', (SELECT id FROM artists WHERE name = 'The Blue Notes'),unixepoch('now') * 1000, unixepoch('now') * 1000);

-- Verify data was inserted
SELECT 'Artists count: ' || COUNT(*) as result FROM artists;
SELECT 'Releases count: ' || COUNT(*) as result FROM releases;
