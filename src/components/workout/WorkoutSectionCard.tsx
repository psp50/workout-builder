"use client";

import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { WorkoutBlock, substepsDroppableId } from "@/lib/workout/types";
import SubstepRow from "./SubstepRow";

interface WorkoutSectionCardProps {
  block: WorkoutBlock;
  onAddSubstep: () => void;
  onRemoveSubstep: (substepId: string) => void;
  onChangeSubstepDistance: (substepId: string, distanceKm: number) => void;
  onRemoveBlock: () => void;
}

export default function WorkoutSectionCard({
  block,
  onAddSubstep,
  onRemoveSubstep,
  onChangeSubstepDistance,
  onRemoveBlock,
}: WorkoutSectionCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card"
      title={`${block.name}`}
    >
      {/* Header carries only the section-level menu — matches the reference,
          where the block's name is legible from its (only) substep row for
          simple blocks, and from each substep's own label otherwise. */}
      <header className="flex items-center justify-end px-3 py-2">
        <div className="relative">
          <button
            type="button"
            aria-label="Block options"
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:bg-slate-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="12" cy="19" r="1.8" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-36 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  onRemoveBlock();
                  setMenuOpen(false);
                }}
                className="w-full px-3 py-1.5 text-left text-xs text-red-500 hover:bg-slate-50"
              >
                Delete block
              </button>
            </div>
          )}
        </div>
      </header>

      <Droppable droppableId={substepsDroppableId(block.id)}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={snapshot.isDraggingOver ? "bg-brand-50/50" : undefined}
          >
            {block.substeps.map((substep, index) => (
              <SubstepRow
                key={substep.id}
                substep={substep}
                index={index}
                onChangeDistance={(km) => onChangeSubstepDistance(substep.id, km)}
                onRemove={() => onRemoveSubstep(substep.id)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Divider-line button, matching the hairline-through-the-pill look
          in the reference screenshots. */}
      <div className="relative flex items-center justify-center py-4">
        <div className="absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-slate-100" />
        <button
          type="button"
          onClick={onAddSubstep}
          className="relative rounded-full border border-brand-300 bg-white px-4 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
        >
          Add Substep
        </button>
      </div>
    </section>
  );
}
