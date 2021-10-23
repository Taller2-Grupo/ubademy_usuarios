/*
    Inserta un nuevo usuario.
*/
INSERT INTO usuarios(username, password, nombre, apellido, esAdmin)
VALUES($1, $2, $3, $4, $5)
RETURNING *
