#!/bin/bash

echo "📦 Building containers..."
docker-compose build

echo "🚀 Starting containers..."
docker-compose up -d

echo "⏳ Waiting for MySQL to be ready..."
while ! docker-compose exec db mysqladmin ping -h"localhost" -uroot -p123456 --silent; do
    sleep 1
done

echo "🛠 Installing Laravel dependencies..."
docker-compose exec backend composer install

echo "🔑 Checking application key..."
docker-compose exec backend bash -c "
  if [ ! -f .env ]; then 
    cp .env.example .env
  fi
  if ! grep -q '^APP_KEY=base64:' .env; then 
    php artisan key:generate
  fi
"

# Calculate hash of all seeder files
SEEDERS_HASH=$(docker-compose exec backend bash -c "find database/seeders -type f -name '*.php' -exec md5sum {} + | sort | md5sum | cut -d' ' -f1")

# Check if we need to refresh seeders
if [ ! -f .seedhash ] || [ "$(cat .seedhash)" != "$SEEDERS_HASH" ]; then
    echo "🔄 Seeders changed - running fresh migrations with seeding..."
    docker-compose exec backend php artisan migrate:fresh --force --seed
    echo "$SEEDERS_HASH" > .seedhash
    echo "✅ Database has been refreshed with new seed data"
else
    echo "🔵 Running normal migrations..."
    docker-compose exec backend php artisan migrate --force
fi

echo "🌍 Starting Laravel development server..."
docker-compose exec -d backend php artisan serve --host=0.0.0.0 --port=8000

echo ""
echo "✅ All services are up and ready!"
echo ""
echo "🔗 Laravel Backend: http://localhost:8000"
echo "🔗 Next.js Frontend: http://localhost:3000"
echo "🐬 MySQL Host: localhost:3307 (user: root, password: 123456)"