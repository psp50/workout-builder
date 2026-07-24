"use client";

import { Draggable } from "@hello-pangea/dnd";
import { BlockTemplate, PALETTE_DRAG_PREFIX } from "@/lib/workout/types";

interface PaletteBlockItemProps {
  template: BlockTemplate;
  index: number;
  onClickAdd: (kind: BlockTemplate["kind"]) => void;
}

/**
 * Mimics the reference thumbnails: single-substep blocks (Warm Up, Active,
 * Cool Down) render as one flat horizontal bar sitting on a light track;
 * multi-substep blocks (Two Step Repeat, Ramp Up, Ramp Down) render as a
 * small step/bar chart hinting at their substep distances.
 */
function MiniBars({ template }: { template: BlockTemplate }) {
  if (template.defaultSubsteps.length === 1) {
    return (
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full w-3/4 rounded-full ${template.color}`} />
      </div>
    );
  }

  const max = Math.max(...template.defaultSubsteps.map((s) => s.distanceKm));
  return (
    <div className="flex h-8 w-full items-end justify-center gap-0.5">
      {template.defaultSubsteps.map((s, i) => (
        <span
          key={i}
          className={`w-2 rounded-sm ${template.color}`}
          style={{ height: `${Math.max(25, (s.distanceKm / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

export default function PaletteBlockItem({
  template,
  index,
  onClickAdd,
}: PaletteBlockItemProps) {
  const draggableId = `${PALETTE_DRAG_PREFIX}${template.kind}::${index}`;

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <button
          type="button"
          title={template.name}
          onClick={() => onClickAdd(template.kind)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex h-14 w-full flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-2 transition ${
            snapshot.isDragging ? "shadow-lg ring-2 ring-brand-400" : "hover:border-brand-300 hover:shadow-sm"
          }`}
        >
          <MiniBars template={template} />
        </button>
      )}
    </Draggable>
  );
}
