# Security Policy

## Supported Versions

Before the first stable release, only the latest commit on `main` is supported.
After v1.0.0, the current major release receives security fixes. Maintainers may
backport a critical fix when a supported deployment cannot upgrade immediately.

## Reporting a Vulnerability

Do not open a public issue. Use GitHub Private Vulnerability Reporting for this
repository. Include affected version or commit, reproduction steps, impact,
required conditions, and any proposed mitigation. Remove secrets and personal
data from the report.

The maintainers will acknowledge a complete report, validate it, assess
severity, prepare a coordinated fix, and credit the reporter when requested.
Specific response deadlines will be published once the repository has a named
security contact and active release cadence.

## Security Boundaries

Security review gives special priority to:

- Type, range, size, and structural validation before data crosses N-API into
  native C++.
- Translation of every native exception into a controlled JavaScript error.
- Cost-aware rate limits for compute-trigger endpoints.
- Validation of untrusted OpenSky and ADS-B Exchange data before persistence or
  graph construction.
- Strict CORS, minimal JWT authentication, least-privilege credentials, and
  environment-separated secrets.
- Dependency, workflow, container, and native toolchain supply-chain risk.
- Prevention of operational or safety-of-life claims.

## Secrets

Never commit secrets. Use `.env.example` for variable names only and use GitHub,
Railway, and Vercel secret stores for values. Rotate any credential immediately
if it is exposed, even when Git history is later rewritten.

## Out of Scope

The project intentionally stores no payment data and no PII beyond the minimum
identifier required to own a saved scenario. SkyGraph is educational simulation
software and must never be represented as certified flight-planning, navigation,
dispatch, or air-traffic-control software.
