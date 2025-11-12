import { createContext, useState, useContext } from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);

  const updateProject = (project) => {
    setCurrentProject(project);
  };

  const updateProjects = (projectsList) => {
    setProjects(projectsList);
  };

  const addProject = (project) => {
    setProjects(prev => [...prev, project]);
  };

  const removeProject = (projectId) => {
    setProjects(prev => prev.filter(p => p._id !== projectId));
  };

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        projects,
        updateProject,
        updateProjects,
        addProject,
        removeProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
