# Contributing to SkyGraph

## Before You Start

SkyGraph's authoritative research, architecture, and roadmap artifacts are maintainer-controlled and
intentionally not distributed in this repository. Contributions must begin from an approved
Engineering Execution Plan task and its GitHub issue. An issue or pull request may not change a
frozen decision without prior maintainer approval through the architecture-change process.

## Ways to Contribute

- Implement an approved execution-plan task.
- Add or improve tests for existing behavior.
- Improve documentation without changing frozen technical decisions.
- Report reproducible bugs, security concerns, or performance regressions.
- Propose an architecture exception before writing code when a verified blocker makes the frozen
  design impractical.

## Development Prerequisites

- Node.js 24.4.1, selected through `.node-version` or `.nvmrc`.
- pnpm 11.9.0, activated through Corepack when it is not already installed.

Install the exact dependency graph with `pnpm install --frozen-lockfile`. Run `pnpm check` before
requesting review. Do not introduce an unapproved language, framework, database, deployment target,
or service boundary.

## Select an Execution-Plan Task

Work must map to one small task in the approved Engineering Execution Plan and its GitHub issue.
Confirm dependencies are complete, acceptance criteria are unambiguous, and the task has no
unresolved architecture question.

## Branching and Commits

- Branch from current `main` using the branch name specified by the task.
- Keep the branch limited to one coherent task.
- Use Conventional Commits with a lowercase type and an imperative subject.
- Do not mix formatting-only changes with behavior changes.
- Rebase or merge current `main` according to maintainer direction before final review; never
  rewrite shared protected-branch history.

## Quality Requirements

Every change must provide explicit validation, safe error handling, relevant unit and integration
tests, and updated documentation. Native-boundary changes must include malformed-input and
exception-translation tests. Algorithm changes must include known-answer fixtures and performance
measurements. No placeholder implementations, fake behavior, skipped validation, TODO comments, or
unexplained test exclusions are accepted.

## Pull Requests

Complete every applicable section of the pull request template. Link the issue, identify the
execution-plan task, explain test evidence, and disclose security, performance, schema, environment,
and architectural impact. A reviewer should be able to reproduce the verification from the pull
request description.

## Architecture Change Process

Open the architecture-change issue template before implementation. Explain the verified problem,
alternatives, tradeoffs, and exactly which private planning artifacts would be affected. Wait for
explicit maintainer approval. Approval of a pull request is not retroactive approval of an
undocumented architecture change.

## Data and Safety

Use only the approved open data sources and comply with their terms and rate limits. Never commit
secrets, production data, proprietary aeronautical charts, or paywalled competitor data. Keep all
product language educational and simulation-only; do not imply certified operational ATC or
navigation use.

## Code Review

At least one approving review and all required status checks are required before merge. The author
resolves feedback with code or evidence, not by dismissing a thread. Maintainers may require
additional algorithm, security, data, or ML review for high-risk changes.

## Release Notes and Journal

Update `CHANGELOG.md` when a user-visible or operationally meaningful change is introduced. After a
task merges, add its completed entry to the Project Journal using the required template and include
the next recommended task.
