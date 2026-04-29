#!/bin/sh

# Ejecutar el comando para crear la base de datos
npm run sqlz -- db:create --env=development

# Iniciar la aplicación
npm run dev
