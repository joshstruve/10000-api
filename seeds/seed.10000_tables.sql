BEGIN;

TRUNCATE
users,
skills
RESTART IDENTITY CASCADE;

INSERT INTO users (email, password)
VALUES
('email@email.com', '$2a$04$g5FRCYMFhz9zMamcceJfLul.uJaWNGHhoyWLoLw/XjrLWEIl2J.lW');

INSERT INTO skills (owner_id, title, time_left)
VALUES
(1, 'Guitar', 36000000000),
(1, 'Screenwriting', 36000000000);

COMMIT;