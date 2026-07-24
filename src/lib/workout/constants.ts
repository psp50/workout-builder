import { BlockTemplate } from "./types";

/**
 * The six canonical block templates available in the palette.
 *
 * Distances come from the product spec:
 *  - Warm Up: 3 km          - Two Step Repeat: Hard 2 km + Easy 2 km = 4 km
 *  - Active: 3 km           - Ramp Up: 2 + 1 + 1 + 1 = 5 km
 *  - Cool Down: 3 km        - Ramp Down: 1 + 1 + 1 + 1 = 4 km
 *
 * Substep labels for warmUp/active/coolDown are set to the block's own name
 * (e.g. a Warm Up block's single substep is itself labeled "Warm Up"),
 * matching the reference screenshots exactly. twoStepRepeat's "Hard"/"Easy"
 * labels are likewise taken directly from the screenshots. rampUp/rampDown
 * substep labels weren't visible in any reference image, so they default to
 * "Ramp" — easy to rename later if the real design differs.
 *
 * `heightPercent` is a purely cosmetic per-kind "signature" height for the
 * timeline bar (0-150, matching the reference Y-axis) so the graph reads
 * like a real intensity chart instead of a flat row of equal-height bars.
 * It is NOT derived from distance/effort data — that mapping wasn't
 * confirmed from the references — so treat these specific numbers as a
 * reasonable placeholder, not a spec value.
 */
export const BLOCK_TEMPLATES: BlockTemplate[] = [
  {
    kind: "warmUp",
    name: "Warm Up",
    color: "bg-violet-400",
    accentBg: "bg-violet-400/20",
    heightPercent: 75,
    defaultSubsteps: [{ label: "Warm Up", distanceKm: 3 }],
  },
  {
    kind: "active",
    name: "Active",
    color: "bg-violet-400",
    accentBg: "bg-violet-400/20",
    heightPercent: 100,
    defaultSubsteps: [{ label: "Active", distanceKm: 3 }],
  },
  {
    kind: "coolDown",
    name: "Cool Down",
    color: "bg-violet-400",
    accentBg: "bg-violet-400/20",
    heightPercent: 75,
    defaultSubsteps: [{ label: "Cool Down", distanceKm: 3 }],
  },
  {
    kind: "twoStepRepeat",
    name: "Two Step Repeat",
    color: "bg-violet-400",
    accentBg: "bg-violet-400/20",
    heightPercent: 100,
    defaultSubsteps: [
      { label: "Hard", distanceKm: 2 },
      { label: "Easy", distanceKm: 2 },
    ],
  },
  {
    kind: "rampUp",
    name: "Ramp Up",
    color: "bg-violet-400",
    accentBg: "bg-violet-400/20",
    heightPercent: 75,
    defaultSubsteps: [
      { label: "Ramp", distanceKm: 2 },
      { label: "Ramp", distanceKm: 1 },
      { label: "Ramp", distanceKm: 1 },
      { label: "Ramp", distanceKm: 1 },
    ],
  },
  {
    kind: "rampDown",
    name: "Ramp Down",
    color: "bg-violet-400",
    accentBg: "bg-violet-400/20",
    heightPercent: 100,
    defaultSubsteps: [
      { label: "Ramp", distanceKm: 1 },
      { label: "Ramp", distanceKm: 1 },
      { label: "Ramp", distanceKm: 1 },
      { label: "Ramp", distanceKm: 1 },
    ],
  },
];

export const getTemplateByKind = (kind: string): BlockTemplate | undefined =>
  BLOCK_TEMPLATES.find((t) => t.kind === kind);

/** Fixed Y-axis gridlines matching the reference design (0-150%, step 25). */
export const Y_AXIS_TICKS: number[] = [0, 25, 50, 75, 100, 125, 150];
