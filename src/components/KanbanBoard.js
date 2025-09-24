import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useTasks } from '../context/TaskContext';
import Column from './Column';
import { STATUSES } from '../utils/helpers';

const KanbanBoard = () => {
  const { tasks, dispatch } = useTasks();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
     
      
      const overColumnId = over.id;

      if (Object.keys(STATUSES).includes(overColumnId)) {
        dispatch({
          type: 'MOVE_TASK',
          payload: {
            taskId: active.id,
            newStatus: overColumnId,
          },
        });
      }
    }
  };

  return (
    <div className="kanban-board-container">
      <div className="column-grid">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {Object.entries(STATUSES).map(([statusKey, status]) => (
            <Column
              key={statusKey}
              id={statusKey}
              title={status.label}
              tasks={tasks.filter(task => task.status === statusKey)}
              color={status.color}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanBoard;