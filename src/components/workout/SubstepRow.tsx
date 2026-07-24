"use client";

import { useEffect, useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Substep } from "@/lib/workout/types";
import { formatKmFixed } from "@/lib/workout/utils";

interface SubstepRowProps {
  substep: Substep;
  index: number;
  onChangeDistance: (distanceKm: number) => void;
  onRemove: () => void;
}

export default function SubstepRow({
  substep,
  index,
  onChangeDistance,
  onRemove,
}: SubstepRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  // Local draft lets the input show "3.00" (matching the reference) while
  // still being freely editable; it re-syncs whenever the underlying value
  // changes from elsewhere (e.g. another action) and reformats on blur.
  const [draft, setDraft] = useState(formatKmFixed(substep.distanceKm));

  useEffect(() => {
    setDraft(formatKmFixed(substep.distanceKm));
  }, [substep.distanceKm]);

  const commit = () => {
    const parsed = parseFloat(draft);
    const next = Number.isFinite(parsed) ? Math.max(0, parsed) : substep.distanceKm;
    onChangeDistance(next);
    setDraft(formatKmFixed(next));
  };

  return (
    <Draggable draggableId={substep.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3 last:border-b-0 ${
            snapshot.isDragging ? "shadow-lg ring-1 ring-brand-200" : ""
          }`}
        >
          <span
            {...provided.dragHandleProps}
            aria-label="Drag to reorder"
            className="cursor-grab text-slate-300 hover:text-slate-400"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="8" cy="6" r="1.4" />
              <circle cx="8" cy="12" r="1.4" />
              <circle cx="8" cy="18" r="1.4" />
              <circle cx="14" cy="6" r="1.4" />
              <circle cx="14" cy="12" r="1.4" />
              <circle cx="14" cy="18" r="1.4" />
            </svg>
          </span>

          <span className="flex-1 text-sm font-semibold text-slate-700">{substep.label}</span>

          <div className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1">
            <input
              type="text"
              inputMode="decimal"
              value={draft}
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              className="w-12 bg-transparent text-right text-sm text-slate-600 outline-none"
            />
            <span className="text-xs text-slate-400">km</span>
          </div>

          <div className="relative">
            <button
              type="button"
              aria-label="Substep options"
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:bg-slate-100"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.6" />
                <circle cx="12" cy="12" r="1.6" />
                <circle cx="12" cy="19" r="1.6" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-10 mt-1 w-32 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    onRemove();
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-red-500 hover:bg-slate-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
