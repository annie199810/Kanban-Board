
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTasks } from '../context/TaskContext';
import { PRIORITIES, getAvatarColor, getInitials, getTagType, TAG_STYLES } from '../utils/helpers';

const TaskCard = ({ task }) => {
  const { dispatch } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    assignee: task.assignee,
    tags: task.tags || []
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const tagType = getTagType(task);
  const avatarColor = getAvatarColor(task.assignee);
  const initials = getInitials(task.assignee);
  const priorityConfig = PRIORITIES[task.priority] || PRIORITIES.medium;

  const handleButtonClick = (e, action) => {
    e.stopPropagation(); 
    
    switch(action) {
      case 'edit':
        setIsEditing(true);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this task?')) {
          dispatch({ type: 'DELETE_TASK', payload: task.id });
        }
        break;
      case 'view':
        dispatch({ type: 'SET_EDITING_TASK', payload: task });
        dispatch({ type: 'TOGGLE_MODAL', payload: true });
        break;
      default:
        break;
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch({
      type: 'EDIT_TASK',
      payload: {
        id: task.id,
        updates: editForm,
      },
    });
    setIsEditing(false);
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setIsEditing(false); 
    setEditForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignee: task.assignee,
      tags: task.tags || []
    });
  };

  const getPriorityClass = () => {
    switch(task.priority) {
      case 'high': return 'border-red-400';
      case 'medium': return 'border-yellow-400';
      case 'low': return 'border-green-400';
      default: return 'border-gray-300';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card bg-white rounded-lg p-4 border-l-4 ${getPriorityClass()} ${
        isDragging ? 'shadow-lg rotate-2' : 'shadow-sm hover:shadow-md'
      } cursor-grab active:cursor-grabbing transition-all duration-200 mb-3 relative`}
    >
      {isEditing ? (
        <div 
          className="space-y-3" 
          onClick={(e) => e.stopPropagation()} 
        >
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Task title"
            autoFocus
          />
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Task description"
            rows="2"
          />
          
         
          <div className="grid grid-cols-2 gap-2">
            <select
              value={editForm.priority}
              onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
              className="p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            
            <select
              value={editForm.assignee}
              onChange={(e) => setEditForm({ ...editForm, assignee: e.target.value })}
              className="p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
              <option value="Sarah Wilson">Sarah Wilson</option>
              <option value="Mike Johnson">Mike Johnson</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleEditSubmit}
              className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 px-3 py-2 bg-gray-300 rounded text-sm hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
         
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 pr-2">
              {task.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
              {priorityConfig.label}
            </span>
          </div>
          
          <p className="text-gray-600 text-xs mb-3 leading-relaxed">{task.description}</p>
          
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.map((tag, index) => (
                <span 
                  key={index}
                  className={`px-2 py-1 rounded-md text-xs font-medium ${TAG_STYLES[tagType] || 'bg-gray-100 text-gray-700'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`${avatarColor} w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold`}>
                {initials}
              </div>
              <span className="text-xs text-gray-600">{task.assignee}</span>
            </div>
            
           
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => handleButtonClick(e, 'edit')}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                onClick={(e) => handleButtonClick(e, 'delete')}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
              <button
                onClick={(e) => handleButtonClick(e, 'view')}
                className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                title="View Details"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;