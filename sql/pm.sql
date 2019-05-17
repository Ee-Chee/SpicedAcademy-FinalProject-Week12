DROP TABLE IF EXISTS pm;

CREATE TABLE pm(
    id SERIAL PRIMARY KEY,
    pm VARCHAR(300) NOT NULL CHECK (pm!=''),
    sender_id INTEGER REFERENCES registered(id) NOT NULL,
    recipient_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
