import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { projectService } from '../../services/projectService';
import ProjectCard from './ProjectCard';
import CreateProjectModal from '../projects/CreateProjectModal';
import Navbar from '../common/Navbar';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';
import { FiPlus, FiFolder, FiTrendingUp, FiUsers, FiCheckCircle, FiClock, FiActivity } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects();
      
      const projectsWithOwnerFlag = data.map(project => ({
        ...project,
        isOwner: project.owner._id === user?.id || project.owner._id === user?._id
      }));
      
      setProjects(projectsWithOwnerFlag);
    } catch (error) {
      toast.error('Failed to fetch projects');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      if (editingProject) {
        await projectService.updateProject(editingProject._id, projectData);
        toast.success('Project updated successfully');
      } else {
        await projectService.createProject(projectData);
        toast.success('Project created successfully');
      }
      fetchProjects();
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save project');
      throw error;
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (project) => {
    if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
      try {
        await projectService.deleteProject(project._id);
        toast.success('Project deleted successfully');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to delete project');
        console.error(error);
      }
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  // Calculate stats
  const totalProjects = projects.length;
  const totalTasks = projects.reduce((acc, project) => acc + (project.taskCount || 0), 0);
  const completedTasks = projects.reduce((acc, project) => acc + (project.completedTaskCount || 0), 0);
  const overallCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section with Glassmorphism */}
        <div className="mb-8">
          <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{user?.name}</span>! 👋
                </h1>
                <p className="text-gray-700 text-base md:text-lg">
                  {projects.length > 0 
                    ? "Here's an overview of your projects today."
                    : "Let's get started by creating your first project!"}
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 font-medium"
              >
                <FiPlus size={20} />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards with Glassmorphism - Only show when there are projects */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {/* Total Projects */}
            <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <FiFolder className="text-white text-xl" />
                </div>
                <span className="text-2xl">📁</span>
              </div>
              <p className="text-gray-700 text-sm font-medium mb-1">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900">{totalProjects}</p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <FiActivity className="text-green-600" size={14} />
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>

            {/* Total Tasks */}
            <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <FiCheckCircle className="text-white text-xl" />
                </div>
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-gray-700 text-sm font-medium mb-1">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{totalTasks}</p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <FiTrendingUp className="text-blue-600" size={14} />
                <span className="text-blue-600 font-medium">Ongoing</span>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                  <FiTrendingUp className="text-white text-xl" />
                </div>
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-gray-700 text-sm font-medium mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{completedTasks}</p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <span className="text-green-600 font-medium">+{completedTasks} tasks</span>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                  <FiClock className="text-white text-xl" />
                </div>
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-gray-700 text-sm font-medium mb-1">Progress</p>
              <p className="text-3xl font-bold text-gray-900">{overallCompletion}%</p>
              <div className="mt-2 w-full bg-gray-200/50 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${overallCompletion}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid or Empty State */}
        {projects.length === 0 ? (
          // Beautiful Empty State with Glassmorphism
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
              <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <FiFolder size={48} className="text-blue-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <FiPlus size={20} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                  No Projects Yet
                </h3>
                <p className="text-gray-700 text-center mb-8 leading-relaxed">
                  Start your journey by creating your first project. Organize tasks, collaborate with your team, and track progress effortlessly.
                </p>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-gray-800">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiCheckCircle className="text-blue-600" size={16} />
                    </div>
                    <span className="text-sm font-medium">Create unlimited projects</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-800">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiUsers className="text-purple-600" size={16} />
                    </div>
                    <span className="text-sm font-medium">Invite team members</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-800">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiTrendingUp className="text-pink-600" size={16} />
                    </div>
                    <span className="text-sm font-medium">Track with Kanban boards</span>
                  </div>
                </div>

                <button
                  onClick={openCreateModal}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 font-medium"
                >
                  <FiPlus size={20} />
                  Create Your First Project
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Projects Grid with Glassmorphism
          <>
            <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-6 border border-white/20 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Projects <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">({projects.length})</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create/Edit Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleCreateProject}
        initialData={editingProject}
      />
    </div>
  );
};

export default Dashboard;
