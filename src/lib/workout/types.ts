/**
 * Domain types for the Workout Builder.
 * Kept free of React / UI concerns so they can be reused by
 * hooks, utils, and (eventually) API/server code alike.
 */

export type BlockKind =
  | "warmUp"
  | "active"
  | "coolDown"
  | "twoStepRepeat"
  | "rampUp"
  | "rampDown";

/** A single leg inside a block, e.g. "Hard - 2 km". */
export interface Substep {
  id: string;
  label: string;
  distanceKm: number;
}

/** A block placed on the timeline / workout section list. */
export interface WorkoutBlock {
  id: string;
  kind: BlockKind;
  name: string;
  /** Tailwind background color class used for the timeline bar. */
  color: string;
  /** Literal light-tint background class (kept for potential future accents). */
  accentBg: string;
  /**
   * Bar height as a percentage of the graph's plot area (0-150, matching the
   * reference design's Y-axis). This is a purely visual "signature" per
   * block kind — it is NOT derived from distance and carries no numeric
   * meaning; it exists to make the timeline read like a real workout
   * intensity graph. See constants.ts for the exact per-kind values and
   * the assumption noted there.
   */
  heightPercent: number;
  substeps: Substep[];
}

/** Static definition used to spawn new blocks from the palette. */
export interface BlockTemplate {
  kind: BlockKind;
  name: string;
  color: string;
  accentBg: string;
  heightPercent: number;
  defaultSubsteps: Array<Pick<Substep, "label" | "distanceKm">>;
}

/** Drag sources understood by the DnD layer. */
export const PALETTE_DROPPABLE_ID = "palette";
export const TIMELINE_DROPPABLE_ID = "timeline";

/** Draggable id prefix used to distinguish a palette template drag
 * from a reorder-drag of an existing timeline block. */
export const PALETTE_DRAG_PREFIX = "palette-template::";

/** Every block's substep list is its own isolated Droppable, scoped by
 * block id, so substeps can be reordered within a block without ever
 * colliding with the timeline's own draggableIds. */
export const substepsDroppableId = (blockId: string): string => `substeps::${blockId}`;

export const isSubstepsDroppableId = (id: string): boolean => id.startsWith("substeps::");

export const blockIdFromSubstepsDroppableId = (id: string): string =>
  id.replace("substeps::", "");
