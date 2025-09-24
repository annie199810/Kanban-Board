import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
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
      const activeTask = tasks.find(task => task.id === active.id);
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


  const taskIds = tasks.map(task => task.id);

  return (
    <div className="kanban-board-container">
      <div className="column-grid">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {Object.entries(STATUSES).map(([statusKey, status]) => (
              <Column
                key={statusKey}
                id={statusKey}
                title={status.label}
                tasks={tasks.filter(task => task.status === statusKey)}
                color={status.color}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanBoard;