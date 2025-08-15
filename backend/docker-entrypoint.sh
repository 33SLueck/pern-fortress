#!/bin/sh

echo "🚀 Starting PERN-Fortress Backend..."

# Warte auf Database Verfügbarkeit
echo "⏳ Waiting for database to be ready..."
until npx prisma db push --accept-data-loss 2>/dev/null; do
  echo "Database not ready yet, waiting 2 seconds..."
  sleep 2
done

echo "✅ Database connection established!"

# Prisma Client generieren (falls noch nicht geschehen)
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Database Migration/Deploy
echo "🗄️ Running database migrations..."
npx prisma db push --accept-data-loss

# Optional: Seed data (falls seed script existiert)
if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
  echo "🌱 Seeding database..."
  npx prisma db seed || echo "⚠️ No seed script found or seed failed"
fi

echo "🎯 Starting Node.js application..."
exec node dist/index.js
