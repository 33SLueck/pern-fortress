# Monitoring Stack Setup Guide

This document describes all the fixes applied to get Loki, Prometheus, and node-exporter working together in the PERN Fortress application.

## Overview

The monitoring stack consists of:

- **Loki**: Log aggregation system
- **Promtail**: Log collector that forwards logs to Loki
- **Prometheus**: Metrics collection and storage
- **node-exporter**: System metrics exporter
- **Grafana**: Visualization dashboard for both logs and metrics

## Issues Fixed

### 1. Promtail Configuration Missing

**Problem**: Promtail container was exiting with error "config file does not exist"

**Root Cause**: Promtail expected configuration at `/etc/promtail/config.yml` but only `promtail.yaml` existed

**Solution**: Created proper configuration file

#### Files Created/Modified:

**`promtail/config.yml`** (new file):

```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  # System logs
  - job_name: system
    static_configs:
      - targets:
          - localhost
        labels:
          job: varlogs
          __path__: /var/log/*log

  # Docker container logs
  - job_name: containers
    static_configs:
      - targets:
          - localhost
        labels:
          job: containerlogs
          __path__: /var/log/containers/*.log

  # Additional docker logs path
  - job_name: docker
    static_configs:
      - targets:
          - localhost
        labels:
          job: dockerlogs
          __path__: /var/log/docker.log
```

**Commands executed**:

```bash
# Copy existing config to expected filename
cp promtail/promtail.yaml promtail/config.yml

# Restart Promtail with new configuration
docker-compose restart promtail
```

### 2. Node-exporter Missing from Docker Compose

**Problem**: Prometheus couldn't scrape node-exporter metrics because the service wasn't defined

**Root Cause**: `docker-compose.yml` was missing node-exporter service definition

**Solution**: Added node-exporter service to docker-compose.yml

#### Changes to `docker-compose.yml`:

**Added node-exporter service**:

```yaml
node-exporter:
  image: prom/node-exporter
  command:
    - '--path.rootfs=/host'
  volumes:
    - '/:/host:ro,rslave'
  restart: always
```

**Note**: Initially tried with port mapping `9100:9100` but removed it due to port conflict with existing node-exporter container.

**Commands executed**:

```bash
# Start the node-exporter service
docker-compose up -d node-exporter
```

## Verification Steps

### 1. Check Promtail Status

```bash
# Check if Promtail is running and sending logs
docker logs fortress-test-beta-promtail-1 --tail 10
```

Expected output: Log entries showing successful log forwarding (rate limiting warnings are normal with high log volume)

### 2. Verify Loki is Receiving Data

```bash
# Check available labels in Loki
curl -s "http://localhost:3100/loki/api/v1/labels"
```

Expected output:

```json
{ "status": "success", "data": ["filename", "job"] }
```

```bash
# Check available job values
curl -s "http://localhost:3100/loki/api/v1/label/job/values"
```

Expected output:

```json
{ "status": "success", "data": ["varlogs"] }
```

### 3. Verify Prometheus Targets

```bash
# Check Prometheus targets health
curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | {job: .labels.job, instance: .labels.instance, health: .health}'
```

Expected output:

```json
{
  "job": "node",
  "instance": "node-exporter:9100",
  "health": "up"
}
{
  "job": "prometheus",
  "instance": "localhost:9090",
  "health": "up"
}
```

### 4. Test Prometheus Metrics

```bash
# Query basic 'up' metric
curl -s "http://localhost:9090/api/v1/query?query=up"
```

Expected: Both prometheus and node-exporter should show value "1" (up)

## Grafana Configuration

### Configure Data Sources

#### 1. Loki Data Source

- **URL**: `http://loki:3100`
- **Access**: Server (default)

#### 2. Prometheus Data Source

- **URL**: `http://prometheus:9090`
- **Access**: Server (default)

### Loki Query Examples

```logql
# Show all logs
{job="varlogs"}

# Show logs with specific text
{job="varlogs"} |= "error"

# Show logs from specific files
{job="varlogs", filename=~".*/var/log/syslog"}
```

### Prometheus Query Examples

```promql
# CPU Usage
100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory Usage
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Disk Usage
100 - ((node_filesystem_avail_bytes * 100) / node_filesystem_size_bytes)

# Network Traffic
irate(node_network_receive_bytes_total[5m])
```

## Service Overview

| Service       | Port | Purpose         | Status     |
| ------------- | ---- | --------------- | ---------- |
| Loki          | 3100 | Log aggregation | ✅ Working |
| Promtail      | -    | Log collection  | ✅ Working |
| Prometheus    | 9090 | Metrics storage | ✅ Working |
| node-exporter | -    | System metrics  | ✅ Working |
| Grafana       | 3009 | Visualization   | ✅ Working |

## Access URLs

- **Grafana Dashboard**: <http://localhost:3009> (admin/admin)
- **Prometheus UI**: <http://localhost:9090>
- **Loki API**: <http://localhost:3100>

## Common Issues and Solutions

### Promtail Rate Limiting

**Symptoms**: Warnings about "Ingestion rate limit exceeded"
**Solution**: This is normal with high log volume. Loki will catch up as rate limits reset.

### No Data in Grafana

**Symptoms**: Empty dashboards or "No data" messages
**Solution**:

1. Verify data sources are configured correctly
2. Check that services are healthy using verification commands above
3. Wait a few minutes for metrics/logs to accumulate

### Node-exporter Port Conflicts

**Symptoms**: "Port already allocated" error when starting node-exporter
**Solution**: Remove port mapping from docker-compose.yml (internal access only needed)

## Files Modified Summary

1. **`promtail/config.yml`** - Created proper Promtail configuration
2. **`docker-compose.yml`** - Added node-exporter service definition

## Architecture Flow

```
System Logs → Promtail → Loki → Grafana (Logs)
System Metrics → node-exporter → Prometheus → Grafana (Metrics)
```

This setup provides comprehensive monitoring with both logs and metrics centralized in Grafana for visualization and alerting.
