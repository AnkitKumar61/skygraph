# SkyGraph Project Journal Template

## Journal Rules

- Add one immutable entry after each execution-plan task is completed and
  merged.
- Use ISO 8601 dates (`YYYY-MM-DD`) in the Asia/Kolkata project timezone.
- Reference committed repository-relative paths and stable API routes.
- Record only implemented and verified behavior; do not claim planned work as
  complete.
- Use `None` with a short justification when a field is not applicable; do not
  silently omit required fields.
- Link the GitHub issue, pull request, merge commit, and release tag when one
  exists.
- Record limitations and technical debt candidly. If either blocks acceptance,
  the task is not complete and must not receive a completed journal entry.
- Append entries chronologically under `docs/journal/`; do not rewrite historical
  entries except to correct a factual error through a reviewed commit.

## Journal Index Entry

Add one row to the journal index when the task entry is merged:

| Task | Completion date | Summary | Pull request | Release | Next task |
|---:|---|---|---|---|---:|
| 00 | YYYY-MM-DD | Concise verified outcome | #000 | Not applicable | 01 |

## Completed Task Entry

### Task Number

`Task 00`

### Task Name

Use the exact approved Engineering Execution Plan task name.

### Completion Date

`YYYY-MM-DD`

### Traceability

- GitHub issue:
- Git branch:
- Pull request:
- Merge commit:
- Version/tag, if applicable:
- Deployed environment/URL, if applicable:

### Summary

Describe the production behavior completed by this task, the user or engineering
value it provides, and the key design constraints preserved. Keep the summary
factual and verifiable.

### Files Created

- `path/to/file`: responsibility.

### Files Modified

- `path/to/file`: material change.

### APIs Added

For each public or internal API, record method/protocol, versioned route or
channel, authentication, request/response contract location, status/error
behavior, and compatibility impact.

- None — this task introduced no API contract.

### Database Changes

Record tables, columns, constraints, indexes, partitions, migrations, backfill,
rollback, query-plan evidence, and durability/cache ownership.

- None — this task introduced no durable-data change.

### Algorithms Added

Record algorithm, implementation location, complexity, correctness fixtures,
numeric/geospatial assumptions, and measured performance conditions.

- None — this task introduced no algorithm.

### Tests Added

#### Unit Tests

- Test name/path and behavior proven.

#### Integration Tests

- Test name/path, real dependency boundary, and behavior proven.

#### End-to-End Tests

- Test name/path and complete user flow proven, or a reason E2E is not
  applicable.

#### Manual Verification

- Environment, steps, expected result, and observed result.

#### Performance Verification

- Dataset/graph size, workload, warm-up, repetitions, hardware/environment,
  p50/p95/p99 or algorithm timing, memory/CPU result, threshold, and outcome.

#### Security Verification

- Inputs/failure modes tested, boundary controls, dependency/container scan
  result, authorization/rate-limit result, and any residual risk.

### Observability Added or Changed

Record logs, correlation fields, metrics, traces, alerts, dashboards, and
runbook impact. State explicitly when no observability change was required.

### Deployment and Operational Changes

Record workflow, container, environment variable, migration ordering, health
check, graceful shutdown, rollout, and rollback changes.

### Known Limitations

- Limitation, why it is acceptable for this task, and the owning future task or
  issue.

### Technical Debt

- Debt item, quantified impact/risk, owner, and target task/version.

`None` is valid only when review found no deferred work.

### Decisions and Tradeoffs

Record implementation-level decisions made within the frozen architecture. Link
an approved architecture-exception issue if one exists; never use the journal to
retroactively authorize a deviation.

### Acceptance Criteria Evidence

Map every acceptance criterion from the execution-plan task to its test,
artifact, metric, screenshot, log query, or manual verification result.

| Acceptance criterion | Evidence | Result |
|---|---|---|
| Criterion text | Test/artifact/link | Pass |

### Definition of Done Confirmation

- [ ] All acceptance criteria are satisfied.
- [ ] Required unit and integration tests pass.
- [ ] Required E2E tests pass or the task explicitly marks them not applicable.
- [ ] Manual, performance, and security validation is complete.
- [ ] No placeholder implementation, fake behavior, TODO comment, skipped
      validation, swallowed error, or unexplained skipped test remains.
- [ ] Clean Architecture and frozen technology/data/deployment boundaries are
      preserved.
- [ ] Documentation, contracts, changelog, operational notes, and this journal
      entry are current.
- [ ] Required CI checks and review approvals passed.
- [ ] The change is merged and, when required, deployed and smoke-tested.

### Next Recommended Task

`Task 01 — Exact task name`

Explain why its dependencies are now satisfied and identify any risk or setup the
next task should address first.
