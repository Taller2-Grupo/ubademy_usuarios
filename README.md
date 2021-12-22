# ubademy_usuarios
API de usuarios para Ubademy

## Para levantar la base de datos usando docker

Crear Volume: \
docker volume create --name postgresql-volume -d local

Levantar postgres usando volume: \
docker run --rm --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 -v postgresql-volume:/var/lib/postgresql/data postgres

## Migrations

Parar crear migration: npm run migrate create {NOMBRE}

Ejemplo: npm run migrate create add user table

Para correr migrations: npm run migrate up

Para revertir una migration: npm run migrate down 1

## Uso del .env
Para correr localmente se debe crear un archivo .env en el root, esta commiteado un .env-example que se puede copiar.

## Variables de entorno necesarias

DATABASE_URL: URL de la base de datos postgres, si se usa heroku se setea automaticamente al agregarle una base de datos a la aplicacion.

API_KEY_ENABLED: Habilita el chequeo de api key en los requests a la api.

API_KEY: Api key que autoriza los requests a la api.

TEST_DATABASE_URL: URL de la base de datos de prueba.

### Para monitoreo datadog:

DD_API_KEY: api key de datadog

DD_DYNO_HOST=false

DD_APM_ENABLED=true

DD_DOGSTATSD_NON_LOCAL_TRAFFIC=true

## Scripts destacados

### npm run test

Corre el linter, revierte todas las migraciones, luego las vuelve a aplicar y despues corre los tests.

### npm run dev

Levanta la aplicacion en "modo dev", cualquier cambio que se haga mientras esta levantada la reinicia automaticamente.

