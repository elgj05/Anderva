#!/bin/bash

echo "Building Server"
cd server
docker build -t anderva-rest-api:latest .

cd ..
echo "DONE"

echo "\
TO RUN CONTAINER:
docker run --name anderva-rest-api --network-alias anderva-rest-api -p '127.0.0.1:3080:3000' -d anderva-rest-api:latest
"