# SkyGraph API Application

This deployable unit will contain the persistent Node.js and Express modular monolith deployed to
Railway. It will host REST presentation, the WebSocket gateway, and the MVP ingestion poller while
loading the C++ engine in-process through N-API.

The mandatory dependency direction is presentation and infrastructure toward application and domain.
Business logic does not belong in controllers, and domain/application code may not import concrete
Express, PostgreSQL, Redis, external-provider, ML-client, or native-addon types.

The runtime foundation provides strict configuration validation, structured and redacted JSON logs,
bounded Prometheus metrics, correlation IDs, centralized safe errors, distinct liveness/readiness
signals, and bounded graceful shutdown. Domain and application layers depend only on ports; Express,
Pino, Prometheus, and environment parsing remain adapters.

## Run Locally

Copy the repository `.env.example` to `.env`, build from the repository root with `pnpm build`, and
start with Node's environment-file support:

```powershell
node --env-file=.env apps/api/dist/src/main.js
```

The API validates every Task 02 variable before opening a socket. It handles `SIGINT` and `SIGTERM`,
stops accepting traffic, drains active requests, and enforces `API_SHUTDOWN_TIMEOUT_MS`.

## Operational Endpoints

- `GET /health/live` reports process liveness without consulting dependencies.
- `GET /health/ready` returns HTTP 200 only when all injected readiness probes are available.
- `GET /metrics` exposes bounded Prometheus dimensions when `METRICS_ENABLED=true`.

No CORS policy is enabled in this task. The staging web origin is introduced with deployment
configuration in Task 05.
