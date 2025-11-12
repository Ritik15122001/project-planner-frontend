import api from './api';

export const taskService = {
  // Get all tasks for a project
  getTasksByProject: async (projectId) => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data.project.tasks || []; // Tasks are in project response
  },

  // Create new task
  createTask: async (projectId, taskData) => {
    const response = await api.post(`/projects/${projectId}/tasks`, taskData);
    return response.data.task;
  },

  // Update task
  updateTask: async (projectId, taskId, taskData) => {
    const response = await api.patch(`/tasks/${taskId}`, taskData);
    return response.data.task;
  },

  // Delete task
  deleteTask: async (projectId, taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  // Update task status (for drag & drop)
  updateTaskStatus: async (projectId, taskId, status) => {
    const response = await api.patch(`/tasks/${taskId}`, { status });
    return response.data.task;
  }
};
