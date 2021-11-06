/*
    Actualiza un usuario.
*/
UPDATE usuarios
SET nombre=$2, apellido=$3, "fechaActualizacion" = current_date
WHERE username=$1
RETURNING *