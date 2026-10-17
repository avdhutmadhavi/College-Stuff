CREATE USER IF NOT EXISTS 'navro_app'@'localhost'
  IDENTIFIED BY 'system';

GRANT SELECT, INSERT, UPDATE, DELETE
  ON navro_living.*
  TO 'navro_app'@'localhost';
