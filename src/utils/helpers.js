
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};


export const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};


export const PRIORITIES = {
  low: { 
    label: 'Low', 
    color: 'bg-green-100 text-green-800',
    borderColor: 'border-green-400'
  },
  medium: { 
    label: 'Medium', 
    color: 'bg-yellow-100 text-yellow-800',
    borderColor: 'border-yellow-400'
  },
  high: { 
    label: 'High', 
    color: 'bg-red-100 text-red-800',
    borderColor: 'border-red-400'
  },
};


export const getAvatarColor = (name) => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500', 
    'bg-pink-500',
    'bg-indigo-500',
    'bg-green-500',
    'bg-yellow-500'
  ];
  const index = name.length % colors.length;
  return colors[index];
};

export const STATUSES = {
  todo: { 
    label: '📄 To Do',  
    color: 'bg-gradient-to-r from-blue-500 to-blue-600'
  },
  inprogress: { 
    label: '🔄 In Progress',  
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500'
  },
  done: { 
    label: '✔ Completed',  
    color: 'bg-gradient-to-r from-green-500 to-green-600'
  }
};




export const getTasksByStatus = (tasks, status) => {
  return tasks.filter(task => task.status === status);
};


export const validateTask = (task) => {
  const errors = {};
  
  if (!task.title?.trim()) {
    errors.title = 'Title is required';
  }
  
  if (!task.assignee?.trim()) {
    errors.assignee = 'Assignee is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};


export const getTagType = (task) => {
  const title = task.title.toLowerCase();
  if (title.includes('design') || title.includes('ui/ux')) return 'design';
  if (title.includes('ci/cd') || title.includes('pipeline')) return 'devops';
  if (title.includes('api')) return 'backend';
  if (title.includes('mobile')) return 'mobile';
  if (title.includes('security')) return 'security';
  return 'frontend';
};


export const TAG_STYLES = {
  design: 'bg-blue-100 text-blue-800',
  devops: 'bg-purple-100 text-purple-800',
  backend: 'bg-green-100 text-green-800',
  frontend: 'bg-yellow-100 text-yellow-800',
  security: 'bg-red-100 text-red-800',
  mobile: 'bg-pink-100 text-pink-800'
};