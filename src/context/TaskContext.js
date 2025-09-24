import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TaskContext = createContext();

export const initialState = {
  tasks: [
    {
      id: '1',
      title: "Design new landing page",
      description: "Create wireframes and mockups for the new product landing page",
      status: 'todo',
      priority: 'low',
      assignee: 'John Doe',
      tags: ["Design", "UI/UX"],
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: "API integration",
      description: "Integrate third-party payment API",
      status: 'inprogress',
      priority: 'medium',
      assignee: 'Sarah Wilson',
      tags: ["Backend", "API"],
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: "Security audit",
      description: "Review code for security vulnerabilities",
      status: 'done',
      priority: 'high',
      assignee: 'Jane Smith',
      tags: ["Security", "Review"],
      createdAt: new Date().toISOString(),
    }
  ],
  draggedTask: null,
  editingTask: null,
  showModal: false
};

export const taskReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_TASKS':
      return {
        ...state,
        tasks: action.payload,
      };
    
    case 'ADD_TASK':
      const newTask = {
        id: Date.now().toString(),
        title: action.payload.title,
        description: action.payload.description,
        status: action.payload.status || 'todo',
        priority: action.payload.priority || 'medium',
        tags: action.payload.tags || [],
        assignee: action.payload.assignee || 'John Doe',
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    
    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        ),
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    
    case 'MOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? { ...task, status: action.payload.newStatus }
            : task
        ),
      };
    
    case 'SET_EDITING_TASK':
      return {
        ...state,
        editingTask: action.payload,
      };
    
    case 'TOGGLE_MODAL':
      return {
        ...state,
        showModal: action.payload,
      };
    
    case 'SET_DRAGGED_TASK':
      return {
        ...state,
        draggedTask: action.payload
      };
    
    default:
      return state;
  }
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('kanban-tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        // Only load if we have valid tasks
        if (Array.isArray(parsedTasks) && parsedTasks.length > 0) {
          dispatch({ type: 'LOAD_TASKS', payload: parsedTasks });
        }
      }
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      // If there's an error, use the initial state
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem('kanban-tasks', JSON.stringify(state.tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [state.tasks]);

  const value = {
    tasks: state.tasks,
    draggedTask: state.draggedTask,
    editingTask: state.editingTask,
    showModal: state.showModal,
    dispatch,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};