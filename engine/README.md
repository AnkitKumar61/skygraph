# SkyGraph C++ Engine

This top-level unit will contain the C++17/20 graph-optimization and simulation
engine, its immutable CSR graph representation, algorithm implementations,
thin N-API bindings, and native known-answer tests.

The engine is compiled as an in-process N-API addon for the API. It is not an
MVP network service. Compute-heavy calls use `Napi::AsyncWorker`, and every
binding validates inputs and translates native exceptions before returning to
JavaScript.

No engine implementation or build manifest is introduced during repository
initialization.
