import { BlockTemplate, Substep, WorkoutBlock } from "./types";

/** Generates a reasonably unique id without extra deps. */
export const generateId = (prefix: string): string =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;

/** Total distance (km) of a single block = sum of its substeps. */
export const getBlockDistance = (block: WorkoutBlock): number =>
  block.substeps.reduce((sum, s) => sum + s.distanceKm, 0);

/** Total distance (km) across the whole workout. */
export const getTotalDistance = (blocks: WorkoutBlock[]): number =>
  blocks.reduce((sum, b) => sum + getBlockDistance(b), 0);

/**
 * Proportional width of a block relative to the whole workout.
 * width = (blockDistance / totalWorkoutDistance) * containerWidth
 * Expressed as a percentage so it stays fluid/responsive; multiplying
 * this percentage by the container's actual pixel width at render time
 * yields the exact formula from the spec.
 */
export const getBlockWidthPercent = (
  block: WorkoutBlock,
  totalDistance: number
): number => {
  if (totalDistance <= 0) return 0;
  return (getBlockDistance(block) / totalDistance) * 100;
};

/** Builds a brand-new WorkoutBlock instance (with fresh ids) from a template. */
export const createBlockFromTemplate = (template: BlockTemplate): WorkoutBlock => ({
  id: generateId("block"),
  kind: template.kind,
  name: template.name,
  color: template.color,
  accentBg: template.accentBg,
  heightPercent: template.heightPercent,
  substeps: template.defaultSubsteps.map((s) => ({
    id: generateId("substep"),
    label: s.label,
    distanceKm: s.distanceKm,
  })),
});

/** Creates a fresh substep, defaulting to a 1km leg named after its parent block. */
export const createSubstep = (label = "Run", distanceKm = 1): Substep => ({
  id: generateId("substep"),
  label,
  distanceKm,
});

/** Immutable reorder helper: moves item at `from` to `to` within an array. */
export function reorderArray<T>(list: T[], from: number, to: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
}

/** Formats a km value for display, trimming unnecessary decimals (summary text). */
export const formatKm = (value: number): string =>
  Number.isInteger(value) ? `${value}` : value.toFixed(2).replace(/0+$/, "");

/** Formats a km value with a fixed 2 decimals, e.g. "3.00 km" (matches the substep-row inputs in the reference design). */
export const formatKmFixed = (value: number): string => value.toFixed(2);

/**
 * "Nice" round-number axis ticks (0, 1, 2, 3... or 0, 2, 4, 6... depending on
 * scale), matching the reference design's X-axis rather than dividing the
 * total into a fixed number of equal slices. Picks a step from a standard
 * 1/2/5-per-decade sequence so the tick count stays readable regardless of
 * total distance.
 */
export const generateAxisTicks = (totalDistance: number): number[] => {
  if (totalDistance <= 0) return [0];

  const targetTickCount = 6;
  const rawStep = totalDistance / targetTickCount;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
  const candidates = [1, 2, 5, 10].map((n) => n * magnitude);
  const step = candidates.find((c) => c >= rawStep) ?? candidates[candidates.length - 1];

  const ticks: number[] = [];
  for (let t = 0; t <= totalDistance + step * 0.001; t += step) {
    ticks.push(+t.toFixed(2));
  }
  // Always show the exact total as the final tick, even if it falls
  // between two "nice" steps.
  if (ticks[ticks.length - 1] !== +totalDistance.toFixed(2)) {
    ticks.push(+totalDistance.toFixed(2));
  }
  return ticks;
};
