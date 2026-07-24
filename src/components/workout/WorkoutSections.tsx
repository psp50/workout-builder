"use client";

import { WorkoutBlock } from "@/lib/workout/types";
import WorkoutSectionCard from "./WorkoutSectionCard";

interface WorkoutSectionsProps {
  blocks: WorkoutBlock[];
  onAddSubstep: (blockId: string) => void;
  onRemoveSubstep: (blockId: string, substepId: string) => void;
  onChangeSubstepDistance: (blockId: string, substepId: string, distanceKm: number) => void;
  onRemoveBlock: (blockId: string) => void;
}

/**
 * Purely presentational: it maps 1:1 over the same `blocks` array that
 * drives the Timeline, in the same order, so the two views can never
 * drift apart (single source of truth lives in useWorkoutBuilder).
 */
export default function WorkoutSections({
  blocks,
  onAddSubstep,
  onRemoveSubstep,
  onChangeSubstepDistance,
  onRemoveBlock,
}: WorkoutSectionsProps) {
  if (blocks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white/50 p-8 text-center text-sm text-slate-400">
        No blocks yet — add one from the palette to see its section here.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block) => (
        <WorkoutSectionCard
          key={block.id}
          block={block}
          onAddSubstep={() => onAddSubstep(block.id)}
          onRemoveSubstep={(substepId) => onRemoveSubstep(block.id, substepId)}
          onChangeSubstepDistance={(substepId, km) =>
            onChangeSubstepDistance(block.id, substepId, km)
          }
          onRemoveBlock={() => onRemoveBlock(block.id)}
        />
      ))}
    </div>
  );
}
