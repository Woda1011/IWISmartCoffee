DELETE FROM telemetry;

ALTER TABLE telemetry
  DROP COLUMN humidity;

ALTER TABLE telemetry
  ADD COLUMN fill_level BIGINT;

ALTER TABLE telemetry
  ADD COLUMN is_brewing BOOLEAN;
