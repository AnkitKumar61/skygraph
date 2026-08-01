# SkyGraph ML Service

This top-level unit will contain offline training, feature processing,
evaluation, model-versioning, and internal inference service concerns for delay
prediction and later approved ML features.

The ML boundary remains independent from both the Node process and C++ engine
and is consumed by the API through an internal client adapter.

No model, training pipeline, dependency manifest, or service implementation is
introduced during repository initialization.
