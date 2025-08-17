# Persistente Daten & Docker-Volumes

Damit deine Dashboards, Logs und Datenbanken nach einem Neustart oder Update der Container erhalten bleiben, werden Docker-Volumes verwendet. Diese Volumes sorgen dafür, dass wichtige Daten nicht verloren gehen und nicht versehentlich ins Git-Repository gelangen.

## Wichtige persistente Ordner/Volumes

- `postgres_data/` – speichert die Datenbankdaten von PostgreSQL
- `grafana_data/` – speichert alle Dashboards, User und Einstellungen von Grafana
- `loki/` – speichert Log-Daten von Loki
- `prometheus/` – speichert Metrikdaten von Prometheus
- `promtail/` – speichert ggf. Log-Positionen von Promtail
- `log/` – speichert Anwendungs-Logs (Backend)

Diese Ordner/Volumes werden automatisch von Docker Compose angelegt, wenn du die Container startest. Sie sind in der `.gitignore` eingetragen und werden nicht ins Repository übernommen.

## Hinweise

- Lösche diese Ordner nur, wenn du wirklich alle gespeicherten Daten entfernen möchtest.
- Bei Problemen mit alten Daten kannst du die Volumes gezielt löschen (z. B. mit `docker volume rm` oder durch Entfernen der lokalen Ordner).
- Für Backups genügt es, die jeweiligen Ordner zu sichern.

## Beispiel: docker-compose.yml (Ausschnitt)

```yaml
grafana:
  image: grafana/grafana
  volumes:
    - grafana_data:/var/lib/grafana

volumes:
  grafana_data:
  postgres_data:
  loki:
  prometheus:
  promtail:
```

## Weitere Infos

- Siehe `.gitignore` für alle ausgeschlossenen Ordner.
- Siehe `.env.example` für Beispiel-Konfigurationen.
