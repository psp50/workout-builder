"use client";

import { Draggable } from "@hello-pangea/dnd";
import { TimelineItem } from "@/hooks/useWorkoutBuilder";
import { formatKm } from "@/lib/workout/utils";

interface TimelineBlockProps {
  item: TimelineItem;
  index: number;
}

export default function TimelineBlock({ item, index }: TimelineBlockProps) {
  const { block, distanceKm, widthPercent, heightPercent } = item;

  // heightPercent is on a 0-150 scale (matching the Y-axis), so convert to a
  // fraction of the plot area's pixel height.
  const heightFraction = Math.min(heightPercent, 150) / 150;

  return (
    <Draggable draggableId={block.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ width: `${widthPercent}%`, ...provided.draggableProps.style }}
          className="flex h-full items-end"
        >
          <div
            style={{ height: `${heightFraction * 100}%` }}
            className={`w-full ${block.color} transition-shadow ${
              snapshot.isDragging ? "shadow-xl ring-2 ring-white" : ""
            }`}
            title={`${block.name} — ${formatKm(distanceKm)} km`}
          />
        </div>
      )}
    </Draggable>
  );
}
