DELETE FROM PARTICIPATE;
DELETE FROM SESSIONS;
DELETE FROM TEACHERS;
DELETE FROM USERS;

ALTER TABLE TEACHERS ALTER COLUMN id RESTART WITH 1;
ALTER TABLE USERS ALTER COLUMN id RESTART WITH 1;
ALTER TABLE SESSIONS ALTER COLUMN id RESTART WITH 1;

INSERT INTO TEACHERS (first_name, last_name)
VALUES ('Margot', 'DELAHAYE'),
       ('Hélène', 'THIERCELIN');

INSERT INTO USERS (first_name, last_name, admin, email, password)
VALUES ('adminFirst', 'adminLast', true, 'admin@example.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'),
       ('userFirst', 'userLast', false, 'user@example.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'),
       ('userDelete', 'userDelete', false, 'user-delete@example.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq');

INSERT INTO SESSIONS (name, description, date, teacher_id)
VALUES ('Session 1', 'My description', '2024-12-01 10:00:00', 1),
       ('Session 2', 'My description', '2024-12-02 18:00:00', 2);


INSERT INTO PARTICIPATE (user_id, session_id) VALUES (1, 1);
INSERT INTO PARTICIPATE (user_id, session_id) VALUES (2, 1);