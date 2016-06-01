CREATE TABLE IF NOT EXISTS telemetry
(
  id          BIGINT PRIMARY KEY,
  temperature DECIMAL   NOT NULL,
  humidity    DECIMAL   NOT NULL,
  created_at  TIMESTAMP NOT NULL
);

ALTER TABLE telemetry
  ADD CONSTRAINT uq_created_at UNIQUE (created_at);

INSERT INTO telemetry (id, temperature, humidity, created_at)
VALUES (1, 68.5, 50.1, to_timestamp('2016-04-05 10:31:10', 'yyyy-mm-dd hh24:mi:ss'));

INSERT INTO telemetry (id, temperature, humidity, created_at)
VALUES (2, 70.1, 50.0, to_timestamp('2016-04-05 10:36:12', 'yyyy-mm-dd hh24:mi:ss'));

INSERT INTO telemetry (id, temperature, humidity, created_at)
VALUES (3, 72.2, 50.0, to_timestamp('2016-04-05 10:41:11', 'yyyy-mm-dd hh24:mi:ss'));

INSERT INTO telemetry (id, temperature, humidity, created_at)
VALUES (4, 70.6, 48.1, to_timestamp('2016-04-05 10:46:13', 'yyyy-mm-dd hh24:mi:ss'));

INSERT INTO telemetry (id, temperature, humidity, created_at)
VALUES (5, 68.5, 46.9, to_timestamp('2016-04-05 10:51:10', 'yyyy-mm-dd hh24:mi:ss'));

INSERT INTO telemetry (id, temperature, humidity, created_at)
VALUES (6, 66.7, 44.3, to_timestamp('2016-04-05 10:56:15', 'yyyy-mm-dd hh24:mi:ss'));

INSERT INTO telemetry (id, temperature, humidity, created_at)
VALUES (7, 63.2, 42.3, to_timestamp('2016-04-05 11:01:11', 'yyyy-mm-dd hh24:mi:ss'));

INSERT INTO telemetry (id, temperature, humidity, created_at)
VALUES (8, 61.9, 40.9, to_timestamp('2016-04-05 11:06:12', 'yyyy-mm-dd hh24:mi:ss'));

INSERT INTO telemetry (id, temperature, humidity, created_at)
VALUES (9, 58.8, 38.0, to_timestamp('2016-04-05 11:11:13', 'yyyy-mm-dd hh24:mi:ss'));

INSERT INTO telemetry (id, temperature, humidity, created_at)
VALUES (10, 56.4, 35.7, to_timestamp('2016-04-05 11:16:11', 'yyyy-mm-dd hh24:mi:ss'));