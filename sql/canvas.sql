DROP TABLE IF EXISTS canvas;
CREATE TABLE canvas(
    id SERIAL PRIMARY KEY,
    masterpiece TEXT NOT NULL CHECK (masterpiece!=''),
    user_id INTEGER REFERENCES registered(id) NOT NULL
);
