DROP TABLE recipes IF EXISTS;

CREATE TABLE users (
id SERIAL PRIMARY KEY,
first VARCHAR NOT NULL,
last VARCHAR NOT NULL,
email VARCHAR UNIQUE NOT NULL,
password VARCHAR NOT NULL,
userpic VARCHAR,
usertimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipes (
id SERIAL PRIMARY KEY,
creator INTEGER NOT NULL REFERENCES users(id),
title VARCHAR UNIQUE NOT NULL,
category VARCHAR NOT NULL,
ingredients VARCHAR [] NOT NULL,
directions VARCHAR [] NOT NULL ,
description VARCHAR,
picture VARCHAR,
servings INTEGER,
difficulty INTEGER,
vegetarian BOOLEAN,
vegan BOOLEAN,
subcategory VARCHAR,
rating INTEGER,
duration INTEGER,
notes VARCHAR [],
timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_codes (
id SERIAL PRIMARY KEY,
email VARCHAR NOT NULL,
code VARCHAR NOT NULL,
resettimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);