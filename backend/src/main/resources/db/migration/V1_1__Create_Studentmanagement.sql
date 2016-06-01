CREATE TABLE IF NOT EXISTS student
(
  id             BIGINT PRIMARY KEY,
  created_at     TIMESTAMP              NOT NULL,
  updated_at     TIMESTAMP              NOT NULL,
  is_deleted     BOOLEAN DEFAULT FALSE,
  first_name     CHARACTER VARYING(50)  NOT NULL,
  last_name      CHARACTER VARYING(75)  NOT NULL,
  hska_id        CHARACTER VARYING(8)   NOT NULL,
  campus_card_id VARCHAR(255),
  password       CHARACTER VARYING(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS role
(
  id   BIGINT PRIMARY KEY,
  name CHARACTER VARYING(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS student_role_assignment
(
  id         BIGINT PRIMARY KEY,
  student_id BIGINT NOT NULL,
  role_id    BIGINT NOT NULL
);

ALTER TABLE student
  ADD CONSTRAINT uq_hska_id UNIQUE (hska_id);
