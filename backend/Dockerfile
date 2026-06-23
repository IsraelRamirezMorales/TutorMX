FROM php:8.4-cli-alpine

# Install PostgreSQL client dev libraries, ICU, and PDO extensions
RUN apk add --no-cache postgresql-dev icu-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo pdo_pgsql pgsql intl

WORKDIR /app

# Copy dependency files
COPY composer.json composer.lock ./

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-interaction --no-scripts --prefer-dist

# Copy the rest of the application
COPY . .

# Generate optimized autoload files
RUN composer dump-autoload --optimize

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
