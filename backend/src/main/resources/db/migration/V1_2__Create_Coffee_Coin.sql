CREATE TABLE IF NOT EXISTS coffee_coin
(
  id         BIGINT PRIMARY KEY,
  created_at TIMESTAMP             NOT NULL,
  coin_key   CHARACTER VARYING(19) NOT NULL,
  coin_value BIGINT                NOT NULL,
  is_used    BOOLEAN DEFAULT FALSE NOT NULL
);

ALTER TABLE coffee_coin
  ADD CONSTRAINT uq_coin_key UNIQUE (coin_key);