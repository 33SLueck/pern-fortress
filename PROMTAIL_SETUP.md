# Promtail Integration Guide

Diese Anleitung beschreibt, wie Promtail im PERN-Fortress-Setup eingerichtet wird, um Logs zentral an Loki (und damit Grafana) weiterzuleiten.

---

## Was ist Promtail?

Promtail ist ein Log-Forwarder aus dem Grafana-Ökosystem. Er liest Log-Dateien (z. B. aus lokalen Verzeichnissen oder Docker-Containern) und sendet sie an Loki. So können Logs zentral in Grafana durchsucht und visualisiert werden.

---

## Schritt 1: Promtail-Konfigurationsdatei anlegen

Lege im Projektverzeichnis `promtail/config.yaml` mit folgendem Beispielinhalt an:

```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: system
    static_configs:
      - targets:
          - localhost
        labels:
          job: varlogs
          __path__: /var/log/*.log
  - job_name: app-logs
    static_configs:
      - targets:
          - localhost
        labels:
          job: app
          __path__: /app/log/*.log
```

Passe ggf. die Pfade unter `__path__` an deine Log-Verzeichnisse an (z. B. `/app/log/*.log` für Backend-Logs).

---

## Schritt 2: Docker-Compose anpassen

Füge in `docker-compose.yml` den Promtail-Service hinzu (falls nicht vorhanden):

```yaml
promtail:
  image: grafana/promtail:2.9.4
  volumes:
    - ./promtail/config.yaml:/etc/promtail/config.yaml:ro
    - /var/log:/var/log:ro
    - ./backend/log:/app/log:ro
  command: -config.file=/etc/promtail/config.yaml
  depends_on:
    - loki
```

- Passe die Volume-Mounts an deine Log-Verzeichnisse an.
- Stelle sicher, dass Loki läuft und unter `loki:3100` erreichbar ist.

---

## Schritt 3: Logs in Grafana anzeigen

1. Starte alle Container neu:
   ```bash
   docker-compose up -d --build
   ```
2. Öffne Grafana (`http://localhost:3009`), logge dich ein.
3. Gehe zu **Explore** → **Loki** und suche nach deinen Logs, z. B.:
   ```
   {job="app"}
   ```

---

## Hinweise

- Promtail ist optional, aber für zentrales Log-Monitoring sehr hilfreich.
- Die Konfiguration kann beliebig erweitert werden (weitere Log-Pfade, Labeling, etc.).
- Für produktive Umgebungen sollten Log-Rotation und Berechtigungen beachtet werden.

---

**Weitere Infos:**

- [Promtail Doku](https://grafana.com/docs/loki/latest/clients/promtail/)
- [Loki Doku](https://grafana.com/docs/loki/latest/)
