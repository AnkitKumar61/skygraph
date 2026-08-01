# GitHub Actions Strategy

Repository-only workflows begin at initialization. Application workflows are
added alongside the first real application manifests and must eventually cover:

- Web lint, type checking, unit tests, production build, and Playwright smoke
  testing.
- API lint, type checking, unit tests, repository integration tests against
  disposable PostgreSQL and Redis services, and production build.
- C++ formatting/static analysis, known-answer tests, sanitizer builds, and a
  platform matrix that produces prebuilt N-API binaries for Linux, macOS, and
  Windows, with Linux as the Railway deployment target.
- ML formatting, type checking, tests, evaluation gates, and model-artifact
  integrity checks.
- Multi-stage container build, vulnerability scan, staging deployment, and
  controlled production promotion.
- Scheduled or pre-release load tests rather than per-commit load tests.

Workflow permissions remain least-privilege, actions are reviewed and pinned as
the repository hardens, and production environments require approval.
