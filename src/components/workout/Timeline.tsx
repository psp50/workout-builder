"use client";

import { Droppable } from "@hello-pangea/dnd";
import { TimelineItem } from "@/hooks/useWorkoutBuilder";
import { TIMELINE_DROPPABLE_ID } from "@/lib/workout/types";
import { Y_AXIS_TICKS } from "@/lib/workout/constants";
import { generateAxisTicks, formatKm } from "@/lib/workout/utils";
import TimelineBlock from "./TimelineBlock";

interface TimelineProps {
  items: TimelineItem[];
  totalDistance: number;
  onClear: () => void;
}

const PLOT_HEIGHT_PX = 220;

export default function Timeline({ items, totalDistance, onClear }: TimelineProps) {
  const xTicks = generateAxisTicks(totalDistance);
  const isEmpty = items.length === 0;

  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-card">
      <button
        type="button"
        onClick={onClear}
        disabled={isEmpty}
        className="absolute right-4 top-4 z-10 rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Clear Blocks
      </button>

      <div className="flex" style={{ height: PLOT_HEIGHT_PX }}>
        {/* Y-axis labels */}
        <div className="mr-2 flex w-10 shrink-0 flex-col-reverse justify-between text-[11px] text-slate-400">
          {Y_AXIS_TICKS.map((tick) => (
            <span key={tick} className="-translate-y-1/2">
              {tick}%
            </span>
          ))}
        </div>

        {/* Plot area */}
        <Droppable droppableId={TIMELINE_DROPPABLE_ID} direction="horizontal">
          {(provided, snapshot) => (
            <div className="relative flex-1">
              {/* Horizontal gridlines, one per Y tick */}
              <div className="absolute inset-0 flex flex-col-reverse justify-between">
                {Y_AXIS_TICKS.map((tick) => (
                  <div key={tick} className="h-px w-full bg-slate-100" />
                ))}
              </div>

              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`relative flex h-full items-stretch gap-0.5 rounded-md transition ${
                  snapshot.isDraggingOver ? "bg-brand-50/70 ring-2 ring-brand-200" : ""
                }`}
              >
                {isEmpty && !snapshot.isDraggingOver && (
                  <div className="flex w-full items-center gap-2 self-center px-1 text-sm text-slate-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 -scale-x-100">
                      <path d="M4 15c4-8 12-10 16-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M17 8l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Click the blocks or drag them here to begin building your workout.
                  </div>
                )}
                {items.map((item, index) => (
                  <TimelineBlock key={item.block.id} item={item} index={index} />
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </div>

      {/* X-axis */}
      <div className="ml-12 mt-1 flex justify-between border-t border-slate-200 pt-2 text-[11px] text-slate-400">
        {xTicks.map((tick, i) => (
          <span key={i}>{formatKm(tick)}</span>
        ))}
      </div>
    </div>
  );
}
