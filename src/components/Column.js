
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

const Column = ({ id, title, tasks, color }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex-1 min-w-[300px]">
      <div className={`p-4 rounded-t-lg ${color}`}>
        <h2 className="text-lg font-semibold">
          {title} <span className="ml-2 bg-white bg-opacity-30 px-2 py-1 rounded-full text-sm">{tasks.length}</span>
        </h2>
      </div>
      <div
        ref={setNodeRef}
        className="bg-gray-100 p-4 rounded-b-lg min-h-[500px]"
      >
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        {id === 'todo' && <TaskForm defaultStatus={id} />}
      </div>
    </div>
  );
};

export default Column;