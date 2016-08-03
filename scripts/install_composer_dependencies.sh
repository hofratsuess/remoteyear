#!/bin/sh

# Make sure composer.phar is present
if [ ! -f api/composer.phar ]; then
  cd api/ && ./../scripts/fetch_composer.sh && cd ..
fi

if [ "$CIRCLECI" == "true" ]; then
  cd api/ && php composer.phar install
else
  docker exec -it remoteyearapi_web_1 bash -c "cd api/ && php composer.phar install"
fi
