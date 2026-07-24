# Workout Builder

Next.js (App Router) + TypeScript + Tailwind CSS, using **react-beautiful-dnd**
per the assignment spec.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Drag-and-drop library: @hello-pangea/dnd (not react-beautiful-dnd)

The assignment named `react-beautiful-dnd`, and that's what an earlier version
of this project used — but it turned out to be genuinely broken with drag
initiation under React 18 (Atlassian archived the package; this is a known,
unmaintained incompatibility, not a config issue on our end). Disabling React
Strict Mode fixed the most common failure, but a second issue remained:
rbd's drag-start sensor depends on synchronous state updates that React 18
automatically batches, breaking drag before it starts.

`@hello-pangea/dnd` is a community-maintained fork with an **identical API**
— same `DragDropContext`/`Droppable`/`Draggable` components, same props, same
`DropResult` shape — created specifically to fix this React 18 problem. The
switch was a straight import-path swap (`react-beautiful-dnd` →
`@hello-pangea/dnd`) with no logic changes anywhere else. Strict Mode is back
on (`next.config.js`) since it's no longer a problem.

If your assignment is graded by checking `package.json` for the literal
string `react-beautiful-dnd`, mention this tradeoff to whoever's grading it —
the alternative is genuinely-non-functional drag-and-drop with the originally
named package.

## Architecture

- `src/lib/workout/` — pure domain logic: types, the 6 block templates
  (distances, substep labels, colors, per-kind bar height), and all math
  (total distance, proportional width, "nice" axis ticks). No React here.
- `src/hooks/useWorkoutBuilder.ts` — the **single source of truth**: one
  `WorkoutBlock[]` array. Timeline widths/heights and the Workout Sections
  list are `useMemo`/render-time derivations of that same array, so they
  can't drift out of sync.
- `src/components/workout/` — presentational components (palette, timeline,
  section cards, substep rows).

## Drag and drop

Three drag scenarios, all handled in `src/app/page.tsx`'s single `onDragEnd`:

1. **Palette → Timeline**: dropping a template block calls
   `addBlock(kind, destination.index)`. `destination.index` is the exact
   drop slot, so start / middle / end insertion all fall out of the same
   code path — no special-casing needed.
2. **Reordering blocks**: dragging an existing Timeline bar calls
   `reorderBlocks(source.index, destination.index)`.
3. **Reordering substeps**: each block's substep list is its **own**
   `Droppable` (id `substeps::<blockId>`), so substeps can be dragged to
   reorder *within* their block without ever needing a duplicate
   `draggableId` in the same `DragDropContext`.

Clicking a palette block (rather than dragging it) calls `addBlock(kind)`
with no index, which appends it to the end — covering the "click to add"
requirement from the walkthrough video.

## Design decisions made without Figma access

A few things were visible in the screenshots but not fully specified, so
here's exactly what was assumed and where to change it if the real design
differs:

- **Bar height (`heightPercent` in `constants.ts`)**: the reference graph's
  bars aren't all the same height — there's a Y-axis from 0–150%. This isn't
  tied to distance or explained in the walkthrough, so it's implemented as a
  fixed cosmetic value **per block kind**. Treat the specific numbers as
  placeholders, not a confirmed spec.
- **Substep default labels**: Warm Up / Active / Cool Down default to a
  single substep labeled with the block's own name (confirmed directly from
  the screenshots — e.g. a "Warm Up" row inside a Warm Up block). Two Step
  Repeat's "Hard"/"Easy" labels are likewise taken directly from the
  screenshots. Ramp Up / Ramp Down substep labels were never visible in any
  reference image, so they default to "Ramp" — trivial to rename in
  `constants.ts` if the real labels differ.
- **X-axis ticks**: switched from "always exactly 8 equal slices" to
  round-number ticks (0, 1, 2, 3... or 0, 2, 4, 6... depending on scale),
  matching the reference's `0, 1, 2, 3, 4` and `0, 2, 4, 6, 8, 10, 12`
  examples.
- **Section card header**: the reference shows a blank bar with only a
  kebab menu — no visible block name/total there. Kept it that way; the
  block's name/total is available as a tooltip on the card (hover) for
  usability without changing the visual match.

If you do get me a working Figma link/connector, I can replace these
placeholder decisions with exact values (spacing, exact colors, real substep
labels, and the actual height-to-something mapping if there is one).
