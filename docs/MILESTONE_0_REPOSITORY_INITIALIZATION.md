# Milestone 0 — Repository Initialization

## Status and Guardrails

Milestone 0 establishes a production-quality repository before application
implementation. It creates no application code, database schema, build
manifest, native binding, model, or deployable image. Authoritative research,
architecture, and roadmap artifacts remain maintainer-controlled, private, and
outside the Git repository.

## 1. Repository Name

`skygraph`

The lowercase name is concise, works cleanly in URLs, package scopes, image
names, and deployment identifiers, and matches the product name without adding
booking-oriented language.

## 2. Repository Description

> AI-powered global air-traffic simulation, graph optimization, and network
> analytics platform built with modern C++, Node.js, React, PostgreSQL, and
> Redis.

GitHub limits the description length, so the safety/educational qualifier and
full positioning belong near the top of the completed README.

## 3. GitHub Topics

- `air-traffic-simulation`
- `graph-algorithms`
- `graph-optimization`
- `network-analysis`
- `cpp`
- `n-api`
- `nodejs`
- `express`
- `react`
- `typescript`
- `postgresql`
- `redis`
- `websockets`
- `leaflet`
- `clean-architecture`
- `system-design`
- `simulation`
- `data-visualization`
- `machine-learning`
- `portfolio-project`

Do not use `flight-booking`, `reservation-system`, `airline-management`, or any
topic implying certified operational ATC use.

## 4. Visibility Recommendation

Use a **public repository**. SkyGraph is a flagship engineering portfolio, so
public design rationale, issue history, tests, benchmark evidence, security
posture, and review discipline are part of the artifact interviewers should be
able to inspect. A private repository would hide much of that signal.

Public visibility requires strict secret handling, license review for datasets
and dependencies, and removal of proprietary or paywalled data. If a data-use
agreement later prohibits redistribution, keep only that data outside Git and
document the acquisition process; do not make the engineering repository
private by default.

## 5. Recommended License

Use **Apache License 2.0**. It is permissive for portfolio and educational use,
includes an explicit patent grant, and is well suited to a polyglot project with
a native engine. `LICENSE` and `NOTICE` are included. Dataset licenses remain
separate and must be recorded when ingestion fixtures or derived data are added.

## 6. README Structure — Headings Only

The initialized `README.md` intentionally contains these headings and no claims
about unimplemented behavior:

1. SkyGraph
2. Overview
3. Project Identity and Non-Goals
4. Flagship Capabilities
5. Architecture
6. Technology Stack
7. Repository Structure
8. Getting Started
9. Local Development
10. Configuration
11. Testing
12. Performance and Benchmarks
13. Security
14. Deployment
15. Engineering Execution Plan
16. Project Journal
17. Contributing
18. Code of Conduct
19. License
20. Acknowledgements and Data Sources

Content is added only as each referenced capability becomes real and verifiable.

## 7. Repository Folder Structure

The frozen deployable-unit and Clean Architecture structure is preserved:

- `apps/web`: React SPA, feature-first inside `src`.
- `apps/api`: Express modular monolith, layered as domain, application,
  infrastructure, and presentation.
- `engine`: C++17/20 graph engine and N-API binding with its own tests/build.
- `ml`: isolated training and internal inference service boundary.
- `packages/shared-types`: web/API DTO contracts.
- `infra/docker`: container and local orchestration assets.
- `infra/github-actions`: workflow support assets.

Repository-governance additions do not redesign the runtime architecture:

- `.github`: issue/PR templates, workflows, and dependency automation.
- `docs/execution-plan`: permanent Engineering Execution Plan parts.
- `docs/journal`: chronological engineering journal entries.
- `docs/PLANNING_ARTIFACT_POLICY.md`: public handling rules for private planning
  artifacts.

## 8. Initial Files

The initial commit contains:

- Repository identity: `README.md`, `LICENSE`, `NOTICE`, `CHANGELOG.md`.
- Contributor governance: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`,
  `SECURITY.md`.
- Local consistency: `.editorconfig`, `.gitattributes`, `.gitignore`,
  `.markdownlint.json`, `.markdownlint-cli2.yaml`, `.yamllint.yml`.
- Environment contract: `.env.example`, containing names and safe local example
  values only.
- GitHub configuration: issue forms, pull request template, Dependabot, and
  initial repository-only workflows.
- Boundary documentation: README files for web, API, engine, ML, shared types,
  Docker, and GitHub Actions.
- Planning records: this Milestone 0 specification and the Project Journal
  template.
- Planning controls: a public policy that prevents maintainer-only research,
  architecture, and roadmap artifacts from entering Git history or CI output.

Application manifests are deliberately absent until their roadmap tasks. This
avoids fake build pipelines and placeholder deployables.

## 9. `.gitignore`

The initialized ignore policy covers secrets, Node dependencies and builds,
Vite/Vercel output, test output, C++/CMake/native binaries, Python virtual
environments and model artifacts, local data, logs, IDE/OS metadata, local
Docker overrides, benchmarks, and load-test results.

`.env.example` is explicitly allowed; all real `.env` variants are ignored.
Raw/interim/processed data and trained model artifacts are ignored by default
because size, licensing, reproducibility, and provenance must be addressed
before any artifact is committed.

## 10. `.editorconfig`

UTF-8, LF endings, final newlines, and trimmed trailing whitespace are enforced.
The default indentation is two spaces; C++ and Python use four; Makefiles use
tabs. Markdown permits intentional trailing spaces.

## 11. Code of Conduct Recommendation

Adopt Contributor Covenant 2.1, adapted only to use a private GitHub contact
channel until a maintained conduct email exists. The repository includes the
policy now because a public project should define community expectations before
accepting contributions.

## 12. `CONTRIBUTING.md` Structure

1. Before You Start
2. Ways to Contribute
3. Development Prerequisites
4. Select an Execution-Plan Task
5. Branching and Commits
6. Quality Requirements
7. Pull Requests
8. Architecture Change Process
9. Data and Safety
10. Code Review
11. Release Notes and Journal

The content makes task traceability, architecture approval, test obligations,
native-boundary safety, and journal updates explicit.

## 13. `SECURITY.md` Recommendation

Enable GitHub Private Vulnerability Reporting and keep vulnerabilities out of
public issues. Before v1.0, support only current `main`; after v1.0, support the
current major line and document any exception. Name a private security contact
before the first public deployment. The policy highlights the N-API boundary,
compute-cost rate limiting, upstream-data validation, secrets, CORS/JWT, and
supply-chain controls as project-specific risks.

## 14. Issue Templates

Use structured GitHub Issue Forms:

- **Bug report**: task ownership, observed/expected behavior, deterministic
  reproduction, environment, affected subsystem, and sanitized evidence.
- **Approved-plan feature task**: task number, dependency state, acceptance
  criteria, affected boundaries, and complete verification obligations.
- **Architecture exception request**: verified blocker, current frozen decision,
  alternatives/tradeoffs, affected private planning artifacts,
  migration/rollback impact,
  and an explicit maintainer decision field.

Disable blank issues. Route security reports privately and link contributors to
the public planning-artifact policy and approved execution-plan tasks.

## 15. Pull Request Template

The PR template requires task/issue traceability, outcome, changed layers/APIs,
architecture-freeze compliance, unit/integration/E2E/manual/performance/security
evidence, operational impact, documentation/journal updates, and focused reviewer
guidance.

## 16. GitHub Discussions Recommendation

Enable Discussions after the repository is public. Start with:

- `Announcements`: maintainer-only milestone and release posts.
- `Q&A`: usage, architecture clarification, and development setup questions.
- `Ideas`: future discussion that does not authorize implementation.
- `Show and tell`: benchmark reports, simulation scenarios, and visual demos.

Architecture changes still require the structured issue form and explicit
approval. Discussions do not supersede private planning artifacts, issues, or
accepted execution-plan tasks.

## 17. GitHub Projects Recommendation

Create one organization/user-level **SkyGraph Engineering** GitHub Projects v2
board linked to the repository. Use views:

- Roadmap by GitHub milestone.
- Current iteration as a board grouped by Status.
- Dependency risk filtered to Blocked or At Risk.
- Release readiness filtered to the next version.

Recommended fields: Status, Execution Task, Phase, Version, Priority,
Difficulty, Estimate, Start Date, Target Date, Dependency State, Area, and Risk.
Use statuses Backlog, Ready, In Progress, In Review, Blocked, and Done. Only one
task should be In Progress for a solo implementation unless work is genuinely
independent and quality is unaffected.

## 18. Branch Protection Rules

Protect `main` immediately:

- Require a pull request before merge.
- Require at least one approval; dismiss stale approvals on new commits.
- Require approval of the most recent reviewable push by someone other than the
  pusher when collaborators exist.
- Require all review conversations to be resolved.
- Require `Repository quality`, `Secret scan`, and later every relevant web,
  API, engine, ML, integration, and container check.
- Require branches to be current with `main` before merge or use a merge queue
  when contributor volume justifies it.
- Require linear history and allow squash merge as the default.
- Block force pushes and deletion.
- Include administrators; bypass only for a documented emergency.
- Restrict direct pushes to release automation and maintainers only when
  technically necessary.

Add a tag protection rule for `v*`. Require signed release tags and GitHub
environment approval for production deployments before v1.0.

## 19. Branching Strategy

Use trunk-based development with short-lived task branches from `main`; do not
create a permanent `develop` branch. One approved execution-plan task maps to
one issue and normally one branch/PR.

Branch forms:

- `chore/task-00-repository-initialization`
- `feat/task-07-live-ingestion`
- `fix/task-07-opensky-timeout`
- `test/task-18-napi-contract`
- `docs/task-00-execution-plan`
- `perf/task-42-engine-benchmarks`
- `security/task-45-compute-rate-limits`

Use lowercase kebab-case and retain the task number. Delete merged branches.
Create a `release/vX.Y.Z` branch only for short release stabilization when
needed; do not use long-lived phase branches.

## 20. Semantic Versioning Strategy

Follow Semantic Versioning 2.0.0:

- `MAJOR`: incompatible public API/contract or supported-data behavior after a
  stable release.
- `MINOR`: backward-compatible user-visible capability or milestone increment.
- `PATCH`: backward-compatible bug, security, documentation, deployment, or
  performance correction that does not add a public capability.

Before v1.0, the public contract is still evolving, but breaking changes must be
documented and intentional. Pre-releases use `-alpha.N`, `-beta.N`, and `-rc.N`.
Do not encode phase names or dates into the SemVer core.

## 21. Git Tag Strategy

Create annotated, signed tags only at verified release points:

```text
v0.1.0
v0.2.0-beta.1
v0.3.1
v1.0.0-rc.1
v1.0.0
```

Tags point to protected `main` commits after CI, staging, migration, rollback,
security, journal, and changelog checks complete. Do not tag every task. Do not
move or reuse a published tag; issue a new patch or pre-release instead.

## 22. Conventional Commit Strategy

Format:

```text
<type>(<scope>): <imperative subject>
```

Allowed types: `feat`, `fix`, `perf`, `refactor`, `test`, `docs`, `build`, `ci`,
`chore`, `revert`, and `security`. Preferred scopes include `web`, `api`,
`domain`, `engine`, `napi`, `db`, `redis`, `ingestion`, `ml`, `infra`, `ci`,
`docs`, and `repo`.

Use `!` plus a `BREAKING CHANGE:` footer for intentional incompatible changes.
Reference the task and issue in the body/footer when the subject alone does not
provide traceability. Squash PRs so `main` contains one reviewed Conventional
Commit per task unless preserving multiple commits materially improves history.

The exact first commit message is:

```text
chore(repo): initialize SkyGraph repository
```

## 23. Initial GitHub Actions Workflows

Repository initialization adds workflows that can produce real signal before
application code exists:

- `repository-quality.yml`: Markdown, YAML, and GitHub Actions validation.
- `secret-scan.yml`: pull-request, `main`, and scheduled full-history Gitleaks
  scans.
- `dependency-review.yml`: blocks pull requests introducing dependencies with
  at least moderate known severity and rejects licenses incompatible with the
  chosen project policy.

Dependabot initially updates GitHub Actions. Add package ecosystems only when
their real lockfiles/manifests exist. Web/API/C++/ML/Docker/deployment workflows
are introduced with their corresponding implementation tasks so they never
pretend to build absent applications.

## 24. Docker Strategy

Preserve the architecture document's three-stage production image: native C++
build, Node application build, and slim runtime. Use Docker Compose locally for
PostgreSQL, Redis, API, and the compiled engine; add ML only at its roadmap
point. Run as non-root, pin base-image versions, use lockfiles, keep compilers
out of runtime, add health checks, handle graceful shutdown, and scan images.

Do not create a placeholder Dockerfile in Milestone 0. The first Dockerfile must
compile and run the first real API skeleton and addon state available at that
task. Vercel remains the frontend deployment target; the backend image remains
for Railway.

## 25. Environment Variable Strategy

- Commit only `.env.example`; never commit values or environment-specific files.
- Validate required variables and types at process startup and fail fast with a
  safe diagnostic.
- Separate local, test, staging, and production credentials and databases.
- Store CI secrets in GitHub Environments, backend secrets in Railway, and
  frontend build variables in Vercel.
- Expose only the `VITE_` values that are safe to embed in browser assets.
- Rotate secrets independently and document ownership and expiry before use.
- Use least-privilege service credentials and distinct tokens for internal ML
  calls.
- Never log connection strings, tokens, upstream credentials, or JWT secrets.

The initial contract groups API/runtime, PostgreSQL, Redis, ingestion providers,
the internal ML boundary, minimal JWT settings, and browser-safe frontend URLs.

## 26. Repository Badges to Add Later

Add badges only after their linked artifact exists and is trustworthy:

- Repository quality/CI status.
- C++ engine matrix status.
- Web and API test status.
- Code coverage, with a published report and defined scope.
- Latest release and license.
- Vercel frontend and Railway API deployment status.
- OpenSSF Scorecard.
- Container image/security scan status.
- Performance benchmark report.

Avoid vanity badges, unverifiable percentages, live-flight counts, or claims of
production/ATC certification.

## 27. Initial Project Directory Tree

```text
skygraph/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── architecture_change.yml
│   │   ├── bug_report.yml
│   │   ├── config.yml
│   │   └── feature_request.yml
│   ├── workflows/
│   │   ├── dependency-review.yml
│   │   ├── repository-quality.yml
│   │   └── secret-scan.yml
│   ├── dependabot.yml
│   └── pull_request_template.md
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── application/
│   │   │   ├── domain/
│   │   │   ├── infrastructure/
│   │   │   │   ├── engine/
│   │   │   │   ├── external/
│   │   │   │   ├── ml/
│   │   │   │   ├── postgres/
│   │   │   │   └── redis/
│   │   │   └── presentation/
│   │   │       ├── http/
│   │   │       └── websocket/
│   │   └── README.md
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   ├── features/
│       │   └── shared/
│       └── README.md
├── docs/
│   ├── execution-plan/
│   ├── journal/
│   ├── MILESTONE_0_REPOSITORY_INITIALIZATION.md
│   ├── PLANNING_ARTIFACT_POLICY.md
│   └── PROJECT_JOURNAL_TEMPLATE.md
├── engine/
│   ├── binding/
│   ├── include/
│   ├── src/
│   │   └── algorithms/
│   ├── tests/
│   └── README.md
├── infra/
│   ├── docker/
│   │   └── README.md
│   ├── github-actions/
│   │   └── README.md
│   └── README.md
├── ml/
│   └── README.md
├── packages/
│   └── shared-types/
│       └── README.md
├── .editorconfig
├── .env.example
├── .gitattributes
├── .gitignore
├── .markdownlint-cli2.yaml
├── .markdownlint.json
├── .yamllint.yml
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── NOTICE
├── README.md
└── SECURITY.md
```

Git records only non-empty directories. The deeper frozen source directories
are created locally now and become tracked naturally when their first approved
production files are added; `.gitkeep` files are intentionally avoided.

## 28. Initial GitHub Milestones

Create these milestones in order:

| Milestone | Version target | Outcome |
|---|---:|---|
| M0 — Repository and Execution Plan | no release tag | Governance, frozen inputs, complete approved execution plan, and journal |
| M1 — Foundation and Live Data Spine | v0.1.0 | Deployed live map, ingestion, WebSocket, stores, health, metrics, CI/CD |
| M2 — Core C++ Graph Engine | v0.2.0 | Multi-algorithm routing through validated async N-API with comparison UI |
| M3 — Network Intelligence | v0.3.0 | Centrality, failure simulation, congestion/Monte Carlo, flagship simulator |
| M4 — AI/ML Intelligence | v0.4.0 | Versioned delay prediction and shared-engine delay propagation |
| M5 — Analytics and Production Proof | v0.5.0 | Analytics, benchmark evidence, load/fault/security hardening |
| M6 — Flagship Stable Release | v1.0.0 | Complete documented portfolio release with reproducible deployment |

Stretch work receives no milestone until v1.0 completion and explicit scope
approval. Job-queue extraction is created only if measured load reaches the
architecture document's trigger.

## Exact Git Commands from an Empty Local Folder

Run these commands after creating the GitHub repository named `skygraph` and
replace only `<GITHUB_USERNAME>` with its actual owner. The commands assume the
Milestone 0 files have been placed in the new folder before `git add`.

```powershell
New-Item -ItemType Directory -Path skygraph
Set-Location skygraph
git init
git branch -M main
git remote add origin https://github.com/<GITHUB_USERNAME>/skygraph.git
git add .
git commit -m "chore(repo): initialize SkyGraph repository"
git push -u origin main
```

If SSH is the configured transport, use this remote command instead and leave
all other commands unchanged:

```powershell
git remote add origin git@github.com:<GITHUB_USERNAME>/skygraph.git
```

Do not create the remote with generated README, license, or `.gitignore` files;
that would create unrelated history and a first-push conflict with this prepared
repository.

## Milestone 0 GitHub Push Point

Push after repository governance, planning-artifact safeguards, and the Project
Journal template have passed local repository checks. The Engineering Execution
Plan may follow in reviewed parts while the private planning artifacts remain
outside Git. The first commit message remains
`chore(repo): initialize SkyGraph repository`. Milestone 0 receives no release
tag because it contains no released application capability.
