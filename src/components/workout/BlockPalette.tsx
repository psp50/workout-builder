"use client";

import { Droppable } from "@hello-pangea/dnd";
import { BLOCK_TEMPLATES } from "@/lib/workout/constants";
import { BlockKind, PALETTE_DROPPABLE_ID } from "@/lib/workout/types";
import PaletteBlockItem from "./PaletteBlockItem";

interface BlockPaletteProps {
  onClickAdd: (kind: BlockKind) => void;
}

export default function BlockPalette({ onClickAdd }: BlockPaletteProps) {
  return (
    <aside className="w-full shrink-0 rounded-xl border border-slate-200 bg-white p-4 shadow-card lg:w-64">
      <div className="mb-3 flex items-center gap-1.5">
        <p className="text-sm font-semibold text-slate-700">
          Click or drag the blocks to build workout
        </p>
        <span
          title="Drag a block onto the timeline, or click it to append it."
          className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-slate-300 text-[10px] text-slate-400"
        >
          i
        </span>
      </div>

      {/*
        isDropDisabled: the palette is a drag SOURCE only, never a drop target.
        NOTE: dnd libraries need a flexbox (not CSS grid) container to compute
        drag positions correctly, so the 3-per-row look is done with flex-wrap
        + fixed-width items instead of `grid`.
      */}
      <Droppable droppableId={PALETTE_DROPPABLE_ID} isDropDisabled direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-wrap gap-2"
          >
            {BLOCK_TEMPLATES.map((template, index) => (
              <div key={template.kind} className="w-[calc(33.333%_-_0.34rem)]">
                <PaletteBlockItem template={template} index={index} onClickAdd={onClickAdd} />
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </aside>
  );
}
