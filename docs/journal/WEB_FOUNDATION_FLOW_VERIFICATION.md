# Web Foundation Flow Verification

Date: 2026-10-08

## Scope

Verified the implemented web foundation: Workspace, Service status, unknown-route recovery, and
unexpected-error recovery. This verification does not mark later milestones complete.

## Findings and Fixes

- The open preview used a reserved test API address while no local API process was running.
  Started the real local API and replaced that preview with the development server.
- Local health requests previously crossed origins before production CORS configuration existed.
  Added an exact-path, development-only health proxy using the validated API origin. Production
  builds and production previews retain direct HTTPS API requests and do not inherit this proxy.
- Unknown-route and unexpected-error recovery lacked a top-level heading. Added an explicit heading
  level to the shared state panel and regression assertions for both recovery views.
- Existing browser tests intercepted every health response. Added an unintercepted real-process
  API-to-browser suite, refresh verification, correlation-header verification, and keyboard skip-link
  activation checks.

## Verification

- Formatting, strict lint, TypeScript checks, and production builds passed.
- 60 unit/integration tests passed, including separate development and production health-origin tests.
- 10 desktop/mobile browser tests passed, covering controlled offline/retry behavior and real API
  health responses. Accessibility scans reported no violations for the tested WCAG A/AA rules.
- Minimum-width 320px checks passed with reduced motion and forced colors.
- Compressed production bundle: JavaScript 93,602 bytes; CSS 2,943 bytes. Both satisfy the budgets.
- Dependency license validation passed; dependency audit reported no known vulnerabilities.
- Manual browser confirmation showed the real API reachable from the local development site.

## Review and Limitations

Production transport validation remains unchanged. The proxy is limited to `/health/live`, does not
forward arbitrary paths, does not disable certificate validation, and is not enabled in preview or
production. Request timeouts, cancellation, bounded retries, private-error suppression, and disabled
pending controls remain intact. No dependency or architecture changes were introduced.

The UI detector reported four existing design-documentation mismatches: wordmark, rail-footer, and
context-heading type sizes, plus the disconnected-feed dot color. These did not change in this fix
and do not indicate broken controls or failed contrast checks.

The site remains a foundation shell. No flight feed, map, graph routing, simulation, database-backed
feature, or production staging deployment is claimed as available. Cross-origin staging verification
remains a Task 05 gate. Continue the approved milestone work only within its existing scope.
