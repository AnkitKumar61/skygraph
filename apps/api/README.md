# SkyGraph API Application

This deployable unit will contain the persistent Node.js and Express modular
monolith deployed to Railway. It will host REST presentation, the WebSocket
gateway, and the MVP ingestion poller while loading the C++ engine in-process
through N-API.

The mandatory dependency direction is presentation and infrastructure toward
application and domain. Business logic does not belong in controllers, and
domain/application code may not import concrete Express, PostgreSQL, Redis,
external-provider, ML-client, or native-addon types.

No backend application code is introduced during repository initialization.
