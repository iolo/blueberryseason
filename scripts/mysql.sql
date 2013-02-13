DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
  id       INT AUTO_INCREMENT,
  created  TIMESTAMP DEFAULT '00000-00-00 00:00:00',
  modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  author   VARCHAR(200),
  title    VARCHAR(200),
  content  TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE comments (
  id       INT AUTO_INCREMENT,
  created  TIMESTAMP DEFAULT '00000-00-00 00:00:00',
  modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  author   VARCHAR(200),
  content  TEXT,
  postId   INT,
  PRIMARY KEY (id),
  FOREIGN KEY (postId) REFERENCES posts (id)
    ON DELETE CASCADE
);


INSERT INTO posts (created, author, title, content) VALUES (null, 'iolo', 'first post', 'this is first post');
INSERT INTO posts (created, author, title, content) VALUES (null, 'gwenno', 'second post', 'this is second post');
INSERT INTO posts (created, author, title, content) VALUES (null, 'shamino', 'third post', 'this is third post');
INSERT INTO posts (created, author, title, content) VALUES (null, 'dupre', 'fourth post', 'this is fourth post');
