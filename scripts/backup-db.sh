#!/bin/sh
# PostgreSQL-Backup-Script für PERN-Fortress (Docker Compose)
# Legt ein Dump-File im Verzeichnis ./db_backups an
#
# Nutzung:
#   ./scripts/backup-db.sh
#
# Voraussetzungen:
#   - Docker Compose installiert
#   - .env mit PGPASSWORD und POSTGRES_USER gesetzt
#   - db-backup-Service im docker-compose.yml vorhanden

set -e

BACKUP_DIR="$(dirname "$0")/../db_backups"
mkdir -p "$BACKUP_DIR"

# Backup ausführen
cd "$(dirname "$0")/.."
docker-compose run --rm db-backup

echo "Backup erfolgreich erstellt in $BACKUP_DIR."
