# Planning Artifact Policy

SkyGraph's research report, production architecture design, and implementation
roadmap are private maintainer planning artifacts. They remain outside this
repository and must not be committed, attached to issues, copied into pull
requests, published as workflow artifacts, or included in release archives.

The public Engineering Execution Plan is an approved implementation derivative.
It may describe the work required to build SkyGraph, but it does not replace or
amend the private planning artifacts. When a conflict or architectural blocker
is discovered, implementation stops and the architecture-exception process is
used. The maintainer reviews the private artifacts and explicitly approves or
rejects any change before code is written.

`.gitignore` blocks the known private planning filenames and the
`private-planning/` directory. Contributors must also check staged files and CI
artifacts for private planning content before every push.
