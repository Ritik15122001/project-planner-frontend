// Task status helpers
// src/utils/taskHelpers.js
export const TASK_STATUS = {
  TODO: 'To Do', // Changed
  IN_PROGRESS: 'In Progress', // Changed
  COMPLETED: 'Completed' // Changed
};


export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'To Do',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.COMPLETED]: 'Completed'
};

// Check if task is overdue
export const isTaskOverdue = (task) => {
  if (!task.dueDate || task.status === TASK_STATUS.COMPLETED) {
    return false;
  }
  return new Date(task.dueDate) < new Date();
};

// Get task priority based on due date
export const getTaskPriority = (task) => {
  if (!task.dueDate) return 'normal';
  
  const daysUntilDue = Math.ceil(
    (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysUntilDue < 0) return 'overdue';
  if (daysUntilDue <= 1) return 'urgent';
  if (daysUntilDue <= 3) return 'high';
  return 'normal';
};

// Format date for display
export const formatTaskDate = (date) => {
  if (!date) return 'No due date';
  
  const taskDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Reset time for comparison
  taskDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  
  if (taskDate.getTime() === today.getTime()) return 'Today';
  if (taskDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
  
  return taskDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: taskDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
};

// Sort tasks by various criteria
export const sortTasks = (tasks, sortBy = 'createdAt') => {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      
      case 'title':
        return a.title.localeCompare(b.title);
      
      case 'status':
        const statusOrder = { todo: 0, inprogress: 1, completed: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      
      case 'priority':
        const priorityOrder = { overdue: 0, urgent: 1, high: 2, normal: 3 };
        const aPriority = getTaskPriority(a);
        const bPriority = getTaskPriority(b);
        return priorityOrder[aPriority] - priorityOrder[bPriority];
      
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });
};

// Filter tasks
export const filterTasks = (tasks, filters = {}) => {
  return tasks.filter(task => {
    // Status filter
    if (filters.status && filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }
    
    // Assigned user filter
    if (filters.assignedTo && task.assignedTo?._id !== filters.assignedTo) {
      return false;
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
};

// Group tasks by status
export const groupTasksByStatus = (tasks) => {
  return {
    todo: tasks.filter(task => task.status === TASK_STATUS.TODO),
    inprogress: tasks.filter(task => task.status === TASK_STATUS.IN_PROGRESS),
    completed: tasks.filter(task => task.status === TASK_STATUS.COMPLETED)
  };
};

// Calculate project progress
export const calculateProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  
  const completedTasks = tasks.filter(task => task.status === TASK_STATUS.COMPLETED).length;
  return Math.round((completedTasks / tasks.length) * 100);
};
