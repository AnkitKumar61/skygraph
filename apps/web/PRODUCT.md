# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Software engineering evaluators and learners exploring graph algorithms through air traffic
simulation. The primary evaluation goal is engineering clarity, algorithm correctness, measured
performance, and usability.

## Product Purpose

SkyGraph makes global air traffic networks, routing decisions, and simulation tradeoffs
understandable through interactive visualization and evidence.

## Operating Context

Users explore the application on desktop and smaller browser viewports. The initial shell supports
navigation and explains data availability before live ingestion and simulation features are
implemented.

## Capabilities and Constraints

React, TypeScript, Vite, Tailwind, Leaflet, and Framer Motion form the approved frontend stack.
React Query owns request/response state; a lightweight store owns ephemeral UI state; live positions
have a separate normalized store. The API is a persistent Express process on Railway and the web
application deploys to Vercel. The product is educational and simulation-only. Every visible data
state must reflect real availability; no fabricated aircraft, metrics, or results.

## Brand Commitments

The product name is SkyGraph. Language is precise, direct, and educational.

## Evidence on Hand

The API foundation provides liveness, readiness, and metrics. No flight feed, airport graph,
simulation result, or benchmark claim exists at this milestone.

## Product Principles

- Explain algorithm decisions and limitations with evidence.
- Keep data ownership and state transitions explicit.
- Prefer a coherent, accessible workflow over feature count.
- Preserve truthful empty, offline, loading, and error states.

## Accessibility & Inclusion

Target WCAG 2.2 AA: keyboard operation, visible focus, semantic landmarks, screen-reader status
messages, reduced motion, and usable layouts at 200% zoom.
