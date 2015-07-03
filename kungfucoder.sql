CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    users_id SERIAL PRIMARY KEY,
    username VARCHAR (25) UNIQUE,
    email VARCHAR UNIQUE,
    password VARCHAR,
    admin BOOLEAN DEFAULT FALSE,
    account_type VARCHAR (15),
    lockout_enabled BOOLEAN DEFAULT FALSE,
    lockout_end_date TIMESTAMP,
    registration_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_login (
    users_login_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE,
    last_login_ip VARCHAR,
    last_login_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_banned (
    users_banned_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id),
    banned_by_users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE,
    reason VARCHAR (150),
    banned_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
    jobs_id SERIAL PRIMARY KEY,
    active BOOLEAN,
    title VARCHAR (350),
    description VARCHAR (10000),
    location VARCHAR (200),
    duration TIMESTAMP,
    start_datetime TIMESTAMP,
    end_datetime TIMESTAMP,
    created_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE developers_details (
    developers_details_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id),
    short_bio VARCHAR (200),
    bio VARCHAR (1500),
    portfolio_url VARCHAR (300),
    updated_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employers_details (
    employers_details_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id),
    jobs_id INTEGER REFERENCES jobs(jobs_id),
    name VARCHAR (450),
    about VARCHAR (1000),
    address JSON,
    email VARCHAR,
    updated_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    tags_id SERIAL PRIMARY KEY,
    name VARCHAR
);

CREATE TABLE jobs_tags (
    jobs_tags_id SERIAL PRIMARY KEY,
    tags_id INTEGER REFERENCES tags(tags_id),
    jobs_id INTEGER REFERENCES jobs(jobs_id)
);

CREATE TABLE developers_tags (
    developers_tags_id SERIAL PRIMARY KEY,
    tags_id INTEGER REFERENCES tags(tags_id),
    developers_details_id INTEGER REFERENCES
        developers_details(developers_details_id)
);

CREATE TABLE employers_tags (
    employers_tags_id SERIAL PRIMARY KEY,
    tags_id INTEGER REFERENCES tags(tags_id),
    employers_details_id INTEGER REFERENCES
        employers_details(employers_details_id)
);

CREATE TABLE users_messages (
    users_messages_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id),
    to_users_id INTEGER REFERENCES users(users_id),
    has_read BOOLEAN DEFAULT FALSE,
    title VARCHAR (300),
    body VARCHAR (3000),
    sent_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_notifications (
    users_notifications_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id)
);

CREATE TABLE newsletters (
    newsletters_id SERIAL PRIMARY KEY,
    created_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE newsletters_list (
    newsletters_list_id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE,
    added_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO kungfucoder_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO kungfucoder_user;