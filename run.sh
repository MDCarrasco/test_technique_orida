#!/bin/bash

docker build . | tee /dev/tty | tail -n1 | cut -d' ' -f3 | xargs -I{} docker run --rm {}
# linux may need this
# sudo chown -R $USER:"`id -gn`" .
docker-compose build
docker-compose up
