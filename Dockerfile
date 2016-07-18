FROM php:7-apache
RUN a2enmod rewrite expires headers

# install the PHP extensions we need
RUN apt-get update && apt-get install -y libpng12-dev libjpeg-dev && rm -rf /var/lib/apt/lists/* \
	&& docker-php-ext-configure gd --with-png-dir=/usr --with-jpeg-dir=/usr \
	&& docker-php-ext-install gd mysqli pdo_mysql

RUN apt-get update && apt-get install -y libmcrypt-dev && docker-php-ext-install mcrypt
RUN apt-get update && apt-get install zip unzip git-core -y

RUN service apache2 restart

VOLUME /var/www/html

CMD ["apache2-foreground"]
