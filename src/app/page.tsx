"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useWorkoutBuilder } from "@/hooks/useWorkoutBuilder";
import {
  PALETTE_DRAG_PREFIX,
  PALETTE_DROPPABLE_ID,
  TIMELINE_DROPPABLE_ID,
  BlockKind,
  isSubstepsDroppableId,
  blockIdFromSubstepsDroppableId,
} from "@/lib/workout/types";
import Header from "@/components/workout/Header";
import BlockPalette from "@/components/workout/BlockPalette";
import Timeline from "@/components/workout/Timeline";
import WorkoutSections from "@/components/workout/WorkoutSections";

export default function Home() {
  const {
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
  } = useWorkoutBuilder();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const fromPalette = source.droppableId === PALETTE_DROPPABLE_ID;
    const toTimeline = destination.droppableId === TIMELINE_DROPPABLE_ID;

    // Case 1: dragging a template from the palette onto the timeline
    // -> insert a NEW block at the drop index (start / middle / end all
    // work naturally because destination.index reflects the drop slot).
    if (fromPalette && toTimeline && draggableId.startsWith(PALETTE_DRAG_PREFIX)) {
      const kind = draggableId.slice(PALETTE_DRAG_PREFIX.length).split("::")[0] as BlockKind;
      addBlock(kind, destination.index);
      return;
    }

    // Case 2: reordering an existing block within the timeline.
    if (
      source.droppableId === TIMELINE_DROPPABLE_ID &&
      destination.droppableId === TIMELINE_DROPPABLE_ID
    ) {
      if (source.index !== destination.index) {
        reorderBlocks(source.index, destination.index);
      }
      return;
    }

    // Case 3: reordering substeps within a single block's own section card.
    if (
      isSubstepsDroppableId(source.droppableId) &&
      isSubstepsDroppableId(destination.droppableId) &&
      source.droppableId === destination.droppableId
    ) {
      if (source.index !== destination.index) {
        reorderSubsteps(
          blockIdFromSubstepsDroppableId(source.droppableId),
          source.index,
          destination.index
        );
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
        <Header title="Workout" onSave={() => console.log("Save workout", blocks)} />

        <main className="flex flex-1 flex-col gap-4 p-4 lg:flex-row">
          <BlockPalette onClickAdd={(kind) => addBlock(kind)} />

          <div className="flex flex-1 flex-col gap-4">
            <Timeline items={timelineItems} totalDistance={totalDistance} onClear={clearWorkout} />

            <WorkoutSections
              blocks={blocks}
              onAddSubstep={addSubstep}
              onRemoveSubstep={removeSubstep}
              onChangeSubstepDistance={updateSubstepDistance}
              onRemoveBlock={removeBlock}
            />
          </div>
        </main>
      </div>
    </DragDropContext>
  );
}
