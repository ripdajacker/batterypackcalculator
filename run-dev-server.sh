#!/bin/bash

# Start Nginx container on port 7070 for development
podman run --name batterypack-dev-server -p 7070:80 -v "${PWD}":/usr/share/nginx/html:z --rm 	-it nginx
