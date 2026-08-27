# IG Stalker Console — Design Brainstorm

## Approach 1 — Terminal Noir
**Theme Name:** Terminal Noir

**Very Brief Intro:** A dark editorial developer console with a warm paper-like black, signal green, and amber highlights. It makes profile data feel like a live inspection readout: sharp, intentional, and a little clandestine without leaning into generic cyberpunk.

**Probability:** 0.067

## Approach 2 — Soft Systems Lab
**Theme Name:** Soft Systems Lab

**Very Brief Intro:** A light, tactile interface inspired by printed lab notebooks and modern data observatories. Cream canvas, graphite type, cobalt markers, and thin measurement rules make the tool feel investigative and trustworthy.

**Probability:** 0.021

## Approach 3 — Neon Protocol
**Theme Name:** Neon Protocol

**Very Brief Intro:** A saturated, black-glass command center with ultraviolet glow, electric cyan, and animated scanlines. The mood is fast and theatrical, aimed at users who want a visibly futuristic tool.

**Probability:** 0.089

# Selected Direction — Terminal Noir

## Design Movement
Contemporary **Swiss International Typographic Style** refracted through a terminal UI: disciplined alignment, oversized typographic labels, visible structure, and editorial information density.

## Core Principles
1. **Evidence over decoration:** every visual accent should clarify the state of the lookup or the structure of the returned data.
2. **Asymmetric inspection:** a persistent command rail and offset content column should feel like a real operator console, not a centered landing page.
3. **Warm darkness:** use near-black ink and smoky panels instead of blue-black gradients; signal colors stay sparse and purposeful.
4. **Visible machinery:** show the API endpoint, request state, response keys, and timestamps so the interface feels inspectable.

## Color Philosophy
The canvas is a warm ink black (#121311) with graphite panels (#1B1E1A) and parchment text (#E8E7DD), keeping long sessions calmer than a pure high-contrast blue-black. The signature signal color is **acid lime (#C6F36B)**, used only for executable actions, verified values, and healthy state. A dusty amber (#E9B872) communicates metadata and context, while rust red (#D86A50) is reserved for errors.

## Layout Paradigm
A persistent left command rail anchors the experience, while the main workspace is offset and broken into a large hero command block, a two-column profile readout, and a raw response inspector. On smaller screens the rail collapses into a compact top bar, preserving the same hierarchy without forcing a centered card stack.

## Signature Elements
- A monospaced **route ribbon** showing `GET /api/stalker/ig` and live request state.
- Small **section index labels** like `01 / IDENTITY` and `02 / AUDIENCE` aligned to the left edge of every block.
- Lime **cursor bars** and thin measurement rules that animate in when a lookup resolves.

## Interaction Philosophy
Interactions should feel like issuing a command, not shopping in a dashboard. The input accepts a handle with or without `@`, Enter submits instantly, and the button gives a short press response. Loading uses a restrained scan state; success reveals data in a quick cascade; errors explain the next action in plain language.

## Animation
Use 180–260ms ease-out transitions for button and panel states. On successful lookup, the profile card fades and rises 8px, then the metric cells reveal with a 40ms stagger. Use a subtle cursor blink only in the endpoint ribbon. Do not animate keyboard-initiated submission beyond state feedback. Respect `prefers-reduced-motion` by removing reveal transforms and blinking.

## Typography System
Use **Space Grotesk** for display headings and primary labels, with **IBM Plex Mono** for endpoints, metadata, values, and code surfaces. Headings use tight letter spacing and sentence case; all-caps micro-labels use mono at 10–11px with increased tracking. Body copy stays in Space Grotesk at 15–16px for warmth and legibility.

## Brand Essence
**IG Stalker Console is a transparent profile lookup instrument for curious operators who want fast, structured public Instagram data without the noise of a generic analytics dashboard.**

**Personality:** observant, exacting, unflashy.

## Brand Voice
Headlines are concise and operational. CTAs sound like commands, not marketing. Microcopy tells the user what the system is doing and what it needs next.

Example lines:
- **“Inspect a public profile.”**
- **“Enter a handle. We’ll map the surface.”**

## Wordmark & Logo
The mark is a compact lime square containing three offset inspection brackets—`[ ]` abstracted into a stepped glyph—paired with a custom wordmark set in Space Grotesk with a clipped terminal dot. It should read as an instrument label rather than a social-media clone.

## Signature Brand Color
**Signal Lime — #C6F36B.** A high-visibility operator color that feels like a green terminal cursor without defaulting to hacker clichés.

## Style Decisions
- Build with a warm black canvas, graphite panels, parchment text, signal lime actions, and dusty amber metadata.
- Keep layout asymmetric with a command rail and offset workspace.
- Use Space Grotesk + IBM Plex Mono; avoid Inter and generic purple gradients.
- Treat the API endpoint and response schema as visible product content.
- Use custom generated graphics only for the brand mark and subtle console atmosphere; the data remains the visual hero.

## Style Decisions

- Signal Lime #C6F36B is functional, not decorative: reserve it for actions, active states, verified values, cursor/rule accents, section indices, and the digital rain signal glyphs.
- The first viewport should read as an inspection console before it reads as a landing page: strengthen endpoint ribbons, readout framing, and visible schema cues around the request and empty states.
- The brand mark should always include the compact lime bracket glyph and a customized Space Grotesk wordmark treatment so the identity reads as an instrument label, not a default sidebar title.
- The Matrix rain stays atmospheric and low contrast, with a stronger presence at the outer edges and reduced intensity on narrow screens so data remains primary.
