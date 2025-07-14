# ---- Stage 1: Composer ----
FROM composer:2 AS composer

# ---- Stage 2: Laravel PHP ----
FROM php:8.2-fpm

ARG DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip unzip curl git nano \
    libzip-dev \
    default-mysql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl bcmath gd

# Copy composer binary
COPY --from=composer /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy Laravel source code (won’t matter if volume mounts it later)
COPY . .

# Expose Laravel dev server port
EXPOSE 8000

# For dev, we won’t run Laravel here—let docker-compose handle it
CMD ["sleep", "infinity"]