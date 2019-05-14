DROP TABLE registered CASCADE; --drop table that has foregin key or dependacies
CREATE TABLE registered(
    id SERIAL PRIMARY KEY,
    firstN VARCHAR(100) NOT NULL CHECK (firstN!=''),
    lastN VARCHAR(100) NOT NULL CHECK (lastN!=''),
    email VARCHAR(300) NOT NULL UNIQUE CHECK (email like '%@%'),
    pw VARCHAR(300) NOT NULL CHECK (pw!=''),
    avatarUrl VARCHAR(300),
    bioText VARCHAR (500)
);
-- (email like '%_@__%.__%')
-- sudo service postgresql service
-- sudo su postgres
-- createdb {name}
