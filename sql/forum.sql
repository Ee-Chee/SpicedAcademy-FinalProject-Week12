DROP TABLE forum CASCADE;
CREATE TABLE forum(
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL CHECK (title!='')
);
