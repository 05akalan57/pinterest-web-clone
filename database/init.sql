CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    name VARCHAR(255)
);

insert into users (username, password, email, name) values ('user1', 'password1', 'user1@gmail.com', 'User 1');
insert into users (username, password, email, name) values ('user2', 'password2', 'user2@gmail.com', 'User 2');

CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    user_id INTEGER REFERENCES users(id),
    is_private BOOLEAN
);

insert into boards (name, user_id, is_private) values ('My Board', 1, false);
insert into boards (name, user_id, is_private) values ('My Private Board', 1, true);

CREATE TABLE pins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    image_url VARCHAR(255),
    board_id INTEGER REFERENCES boards(id)
);

insert into pins (name, image_url, board_id) values ('My Pin', 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', 1);
insert into pins (name, image_url, board_id) values ('My Private Pin', 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', 2);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

insert into tags (name) values ('My Tag');
insert into tags (name) values ('My Other Tag');

CREATE TABLE pin_tags (
    id SERIAL PRIMARY KEY,
    pin_id INTEGER REFERENCES pins(id),
    tag_id INTEGER REFERENCES tags(id)
);

insert into pin_tags (pin_id, tag_id) values (1, 1);
insert into pin_tags (pin_id, tag_id) values (2, 2);

CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES users(id),
    following_id INTEGER REFERENCES users(id)
);

insert into follows (follower_id, following_id) values (1, 1);
insert into follows (follower_id, following_id) values (1, 2);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    content TEXT
);

insert into messages (sender_id, receiver_id, content) values (1, 2, 'Hello');
