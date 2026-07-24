"use client";

import { useCallback, useMemo, useState } from "react";
import { BlockKind, WorkoutBlock } from "@/lib/workout/types";
import { getTemplateByKind } from "@/lib/workout/constants";
import {
  createBlockFromTemplate,
  createSubstep,
  getBlockDistance,
  getBlockWidthPercent,
  getTotalDistance,
  reorderArray,
} from "@/lib/workout/utils";

export interface TimelineItem {
  block: WorkoutBlock;
  distanceKm: number;
  widthPercent: number;
  heightPercent: number;
}

/**
 * Single source of truth for the whole builder.
 * Every mutation flows through this hook's setBlocks call, and both the
 * Timeline and the WorkoutSections views are derived (not duplicated)
 * from the same `blocks` array, so they can never go out of sync.
 */
export function useWorkoutBuilder() {
  const [blocks, setBlocks] = useState<WorkoutBlock[]>([]);

  const totalDistance = useMemo(() => getTotalDistance(blocks), [blocks]);

  const timelineItems: TimelineItem[] = useMemo(
    () =>
      blocks.map((block) => ({
        block,
        distanceKm: getBlockDistance(block),
        widthPercent: getBlockWidthPercent(block, totalDistance),
        heightPercent: block.heightPercent,
      })),
    [blocks, totalDistance]
  );

  /** Adds a new block built from a template, at an optional index (defaults to end). */
  const addBlock = useCallback((kind: BlockKind, atIndex?: number) => {
    const template = getTemplateByKind(kind);
    if (!template) return;
    const newBlock = createBlockFromTemplate(template);
    setBlocks((prev) => {
      const next = Array.from(prev);
      const insertAt = atIndex === undefined ? next.length : atIndex;
      next.splice(insertAt, 0, newBlock);
      return next;
    });
  }, []);

  const removeBlock = useCallback((blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  }, []);

  const reorderBlocks = useCallback((fromIndex: number, toIndex: number) => {
    setBlocks((prev) => reorderArray(prev, fromIndex, toIndex));
  }, []);

  /** Reorders substeps within a single block (each block's substep list is its own Droppable). */
  const reorderSubsteps = useCallback((blockId: string, fromIndex: number, toIndex: number) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId ? { ...b, substeps: reorderArray(b.substeps, fromIndex, toIndex) } : b
      )
    );
  }, []);

  const addSubstep = useCallback((blockId: string) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId ? { ...b, substeps: [...b.substeps, createSubstep()] } : b
      )
    );
  }, []);

  const removeSubstep = useCallback((blockId: string, substepId: string) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? { ...b, substeps: b.substeps.filter((s) => s.id !== substepId) }
          : b
      )
    );
  }, []);

  const updateSubstepDistance = useCallback(
    (blockId: string, substepId: string, distanceKm: number) => {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === blockId
            ? {
                ...b,
                substeps: b.substeps.map((s) =>
                  s.id === substepId ? { ...s, distanceKm: Math.max(0, distanceKm) } : s
                ),
              }
            : b
        )
      );
    },
    []
  );

  const clearWorkout = useCallback(() => setBlocks([]), []);

  return {
    blocks,
    timelineItems,
    totalDistance,
    addBlock,
    removeBlock,
    reorderBlocks,
    reorderSubsteps,
    addSubstep,
    removeSubstep,
    updateSubstepDistance,
    clearWorkout,
  };
}

export type UseWorkoutBuilderReturn = ReturnType<typeof useWorkoutBuilder>;
