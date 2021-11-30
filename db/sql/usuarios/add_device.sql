INSERT INTO devices("username", "id")
VALUES($1, $2)
RETURNING *
