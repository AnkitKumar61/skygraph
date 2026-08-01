# Docker Strategy

The production API image will use a multi-stage build:

1. A native build stage compiles the C++ N-API addon with the required C++
   toolchain and headers.
2. An application build stage installs locked Node dependencies and builds the
   API and its addon wrapper.
3. A slim runtime stage copies only runtime dependencies, the built API, and the
   compiled `.node` binary; it contains no compiler or package-manager cache.

Local development will use Docker Compose for PostgreSQL, Redis, the API, and
the compiled engine. The ML service joins the composition when its roadmap task
begins. Health checks, graceful shutdown, non-root execution, pinned base-image
versions, and `.dockerignore` controls are required from the first real image.

No Dockerfile is created before application manifests exist because an image
that cannot build a real application would violate the no-placeholder rule.
