import api from './api';

export const projectService = {
  // Get all projects for the logged-in user
  getAllProjects: async () => {
    const response = await api.get('/projects');
    return response.data.projects; // Your backend returns { success, count, projects }
  },

  // Get single project by ID
  getProjectById: async (projectId) => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data.project; // Your backend returns { success, project }
  },

  // Create new project
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data.project; // Your backend returns { success, message, project }
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    const response = await api.patch(`/projects/${projectId}`, projectData);
    return response.data.project; // Your backend returns { success, message, project }
  },

  // Delete project
  deleteProject: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data; // Your backend returns { success, message }
  },

  // Add member to project (if you want to implement this separately)
  addMember: async (projectId, email) => {
    // You can use updateProject with members array
    const response = await api.patch(`/projects/${projectId}`, { 
      members: [email] // Send array of member emails
    });
    return response.data.project;
  },

  // Remove member from project
  removeMember: async (projectId, memberEmail) => {
    // You'll need to fetch current members, filter out the one to remove, then update
    const project = await projectService.getProjectById(projectId);
    const updatedMembers = project.members
      .filter(member => member.email !== memberEmail)
      .map(member => member.email);
    
    const response = await api.patch(`/projects/${projectId}`, {
      members: updatedMembers
    });
    return response.data.project;
  }
};
