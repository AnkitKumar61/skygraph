# Application shell — Task 03

## Job and scope

Operate mode. Evaluators and learners orient themselves, inspect service status, and understand why
network data is not yet available. Task 03 introduces only the shell and state boundaries. Live
ingestion, maps, routing, and simulation belong to later tasks. The instruction to continue
delegates routine visual choices.

## Direction

A precise analytical workspace: a pale blue-gray canvas, dark ink, a restrained blue accent, and a
compact navigation rail. A system UI font supports long operating sessions. The main workspace
carries a real empty state; a contextual aside explains the data boundary and educational scope. A
status route gives users a practical recovery action by refreshing the actual API health check.

## Interaction and layout

Navigation exposes Workspace and Service status as working routes. A skip link and visible keyboard
focus provide direct access to main content. On narrow screens the navigation becomes a horizontal
bar and the aside stacks below the workspace. No essential control depends on hover or color alone.

## States and budgets

Loading uses an announced status; empty names the missing data; offline explains the unavailable
connection and offers retry; unexpected failure provides safe recovery. Untrusted error text renders
as text. No transport is connected to the live store yet. Initial JavaScript must remain below 250
KiB gzip, CSS below 30 KiB gzip. Synthetic store updates must notify only affected subscribers.

## Verification

Unit and integration coverage includes environment validation, API error mapping, query retry
policy, error recovery, and selective subscriptions. Production browser tests cover landmarks,
keyboard navigation, route fallback, responsive overflow, accessibility, offline states, and console
errors.
