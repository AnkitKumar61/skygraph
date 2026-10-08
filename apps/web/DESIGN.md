---
name: SkyGraph
description: A precise analytical workbench with truthful data and service states.
colors:
  ink: "#17283c"
  canvas: "#f3f6fa"
  surface: "#fff"
  muted: "#52647a"
  line: "#d5dfeb"
  accent: "#165bc4"
  focus: "#9a4600"
  rail: "#eaf0f7"
  navigation-ink: "#384f69"
  navigation-hover: "#dde7f3"
  navigation-selected: "#d8e6fa"
  action-ink: "#124fae"
  action-hover: "#104a9f"
  action-secondary: "#e7effa"
typography:
  headline:
    fontFamily: '"Segoe UI", system-ui, sans-serif'
    fontSize: "clamp(1.8rem, 3vw, 2.55rem)"
    fontWeight: 650
    lineHeight: 1.18
    letterSpacing: "-.025em"
  title:
    fontFamily: '"Segoe UI", system-ui, sans-serif'
    fontSize: "1.35rem"
    fontWeight: 650
    lineHeight: 1.3
  body:
    fontFamily: '"Segoe UI", system-ui, sans-serif'
    fontSize: "1rem"
    lineHeight: 1.65
  label:
    fontFamily: '"Segoe UI", system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 550
  action:
    fontFamily: '"Segoe UI", system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 600
  context:
    fontFamily: '"Segoe UI", system-ui, sans-serif'
    fontSize: ".92rem"
    lineHeight: 1.65
rounded:
  control: "8px"
  panel: "14px"
spacing:
  compact: "8px"
  inline: "10px"
  label-gap: "12px"
  control-inline: "16px"
  rail: "20px"
  inset: "24px"
  section: "28px"
  stacked: "40px"
  broad: "48px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
  button-secondary:
    backgroundColor: "{colors.action-secondary}"
    textColor: "{colors.action-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "10px 18px"
  navigation-item:
    textColor: "{colors.navigation-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  navigation-item-hover:
    backgroundColor: "{colors.navigation-hover}"
  navigation-item-selected:
    backgroundColor: "{colors.navigation-selected}"
    textColor: "{colors.action-ink}"
  state-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "clamp(24px, 4vw, 48px)"
---

<!-- markdownlint-configure-file { "MD025": { "front_matter_title": "" } } -->

# Design System: SkyGraph

## Overview

<!-- markdownlint-disable-next-line MD036 -->
**Creative North Star: "The Analytical Workbench"**

SkyGraph is a quiet, precise operating environment. Pale blue-gray surfaces, dark ink, and
restrained blue actions support scanning and recovery without competing with the content. The system
UI face is a deliberate choice for sustained use; this is an operating interface, not a display-led
brand treatment.

The shipped shell is spacious but bounded: compact navigation, a dominant working area, and
subordinate explanatory text. Empty, loading, unavailable-service, and unexpected-error views share
the same calm container language. The interface communicates what is known through explicit wording
rather than decorative status theater.

**Key Characteristics:**

- Cool tonal surfaces with restrained blue actions.
- Compact controls inside a spacious, bounded workspace.
- System UI typography with clear weight and size hierarchy.
- Text-led states, visible focus, and minimal motion.

## Colors

The palette uses cool neutrals for structure, blue for interaction, and a separate warm focus color
for keyboard orientation. Frontmatter values are normative.

### Primary

- **Action Blue** (`accent`): primary buttons and links.
- **Deep Action Blue** (`action-hover`): primary-button hover.
- **Blue Action Ink** (`action-ink`): secondary controls and current-route text.
- **Pale Action Blue** (`action-secondary`): secondary-button surface.
- **Selected Blue** (`navigation-selected`): current-route background.

### Neutral

- **Dark Ink** (`ink`): headings and the wordmark.
- **Cool Canvas** (`canvas`): application background.
- **White Surface** (`surface`): state panels and primary-control lettering.
- **Slate Text** (`muted`): explanations and secondary information.
- **Blue-Gray Line** (`line`): rail boundaries, panel borders, and contextual dividers.
- **Rail Mist** (`rail`): navigation region.
- **Navigation Slate** (`navigation-ink`): inactive navigation text.
- **Hover Mist** (`navigation-hover`): navigation hover surface.

Warm amber (`focus`) is an accessibility signal, not a second decorative accent.

**The Action Blue Rule.** Reserve saturated blue for actionable elements and current navigation;
explanatory surfaces remain cool and quiet.

**The Words Before Color Rule.** State messages name the condition and recovery action; a colored
mark alone never communicates availability.

## Typography

**Body and interface font:** Segoe UI, with system-ui and sans-serif fallbacks.

**Character:** A single familiar operating face creates continuity across headings, controls, and
explanations. Hierarchy comes from size, weight, spacing, and reading position rather than a
separate display family. The wordmark is a compact text link, not an independent display-type
system.

### Hierarchy

- **Headline:** the fluid `headline` role identifies the current view; text wraps with balanced
  lines.
- **Title:** the `title` role labels reusable state panels.
- **Section title:** body-sized headings use medium-heavy weight (650) for explanatory subsections.
- **Body:** the `body` role gives explanations a relaxed line height and a maximum reading measure
  (68ch).
- **Label:** the `label` role distinguishes navigation without uppercase or expanded tracking.
- **Action:** the `action` role gives buttons a slightly stronger weight than navigation.
- **Context:** the `context` role makes educational explanations subordinate without compressing
  their line height.

**The Operating Type Rule.** Keep operating text in the shared UI stack; use the existing hierarchy
rather than introducing display branding into task controls.

## Layout

The desktop shell uses a fixed navigation column (220px) and a flexible main column. Main content
has fluid inset padding (`clamp(24px, 4vw, 64px)`). The workspace is centered within a maximum width
(1450px), pairing a flexible primary area with a contextual column (250px) and a broad gap (48px).
State panels cap their width (850px).

At viewport widths up to 1100px, the contextual column stacks below the working area, with a reduced
gap (40px) and a reading-width cap (65ch). Up to 680px, the rail becomes a top region; navigation
becomes horizontal and wraps, the rail footer is hidden, and heading separation tightens (28px). The
body minimum width is 320px; flexible content columns explicitly allow shrinking.

Use the recorded spacing steps for repeated relationships: compact navigation gaps, short
label-to-copy spacing, generous panel insets, and broad separation between major regions. Paragraphs
remain reading-width bounded even inside a wide workspace.

**The Bounded Workspace Rule.** Let the working region grow, but constrain explanatory line lengths
and state-panel width; extra viewport space is not a reason to stretch prose.

## Elevation & Depth

The shipped system has no box shadows. Depth comes from the canvas, slightly darker rail, white
panels, and thin blue-gray boundaries. Focus outlines communicate interaction state rather than
elevation.

**The Tonal Depth Rule.** Separate regions with tone and a restrained border; do not add
floating-card shadows to the established workbench.

## Shapes

Controls and navigation items share gently curved corners (`control`); state containers use the
broader `panel` curve. Panel and rail boundaries use thin strokes (1px). No ornamental clipping or
decorative geometry defines the system.

## Components

### Buttons

Compact, explicit actions with a minimum touch height (44px). Primary and secondary variants share
geometry and action typography. The primary variant darkens on hover; the secondary keeps its pale
surface on hover in the shipped cascade.

Keyboard focus uses a warm outline (3px) separated from the control (4px). Disabled request controls
reduce opacity (.65), use the waiting cursor, and change their text to the checking state.
Background-color transitions are short (.16s ease-out) and only enabled when reduced motion is not
requested. Forced-color mode adds a visible system-colored button border.

### Cards / Containers

The state panel is the recurring container, not a generic dashboard tile. It pairs a title, a
bounded explanatory paragraph, and an optional recovery or navigation action. White fill, a thin
line border, broader curved corners, and fluid padding create separation without shadow. Paragraph
spacing inside this container is asymmetric (14px above, 28px below), keeping the action distinct
from its explanation.

Loading panels expose a status role. Non-empty states announce politely; the normal empty state does
not. Failed health checks name the lack of a valid response rather than claiming a confirmed network
outage. A successful health response does not imply that flight data exists.

### Navigation

Navigation is a text-only list with generous targets (minimum 44px). Inactive items use slate text,
hover adds a cool surface, and the current route combines blue text with a pale blue background.
Route selection also exposes `aria-current="page"`; forced-color mode adds an outline (2px solid
Highlight). Mobile navigation wraps across the top without hiding working routes.

A skip link appears at the top when focused and targets main content. Main content is
programmatically focusable.

### Contextual Explanation

The contextual region stays visually open rather than adopting the state-panel frame. Compact
subsection titles, smaller explanatory paragraphs, and thin horizontal dividers establish a reading
rhythm. It stacks below the workspace at the tablet breakpoint.

## Do's and Don'ts

### Do

- Do use the shared UI type stack and recorded hierarchy for operating surfaces.
- Do preserve explicit state wording and real recovery actions.
- Do keep keyboard focus visible and honor reduced-motion and forced-color preferences.
- Do separate the main working area from bounded explanatory text.

### Don't

- Don't imply available flight data from an API health response.
- Don't replace textual state explanations with color-only indicators.
- Don't add shadows to the flat tonal surface system.
- Don't document unimplemented maps, graphs, metrics, or simulation results as existing components.
