CREATE TABLE IF NOT EXISTS user_coffee_coin
(
  id             BIGINT PRIMARY KEY,
  created_at     TIMESTAMP NOT NULL,
  student_id     BIGINT    NOT NULL,
  coffee_coin_id BIGINT    NOT NULL
);

ALTER TABLE user_coffee_coin
  ADD FOREIGN KEY (student_id) REFERENCES student (id);

ALTER TABLE user_coffee_coin
  ADD FOREIGN KEY (coffee_coin_id) REFERENCES coffee_coin (id);

CREATE TABLE IF NOT EXISTS cup_log
(
  id         BIGINT PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  student_id BIGINT    NOT NULL
);

ALTER TABLE cup_log
  ADD FOREIGN KEY (student_id) REFERENCES student (id);
