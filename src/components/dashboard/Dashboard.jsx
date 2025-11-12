import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import Navbar from '../common/Navbar';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';
import { FiPlus, FiUsers, FiCalendar, FiCheckCircle, FiFolder, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [creating, setCreating] = useState(false);
  
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  // Real-time project updates
  useEffect(() => {
    if (!socket) return;

    console.log('🔌 Dashboard: Setting up project update listener');

    const handleProjectUpdated = (updatedProject) => {
      console.log('📊 Dashboard: Project updated', updatedProject);
      
      setProjects(prev => 
        prev.map(project => 
          project._id === updatedProject._id ? updatedProject : project
        )
      );
    };

    socket.on('projectUpdated', handleProjectUpdated);

    return () => {
      socket.off('projectUpdated', handleProjectUpdated);
    };
  }, [socket]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects();
      setProjects(data || []);
    } catch (error) {
      toast.error('Failed to fetch projects');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!newProject.title.trim()) {
      toast.error('Project title is required');
      return;
    }

    setCreating(true);
    try {
      const data = await projectService.createProject(newProject);
      setProjects(prev => [data, ...prev]);
      toast.success('Project created successfully!');
      setShowCreateModal(false);
      setNewProject({ title: '', description: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <Loader />;
  }

  // Calculate dashboard metrics
  const totalProjects = projects.length;
  const totalTasks = projects.reduce((sum, p) => sum + (p.taskCount || 0), 0);
  const completedTasks = projects.reduce((sum, p) => {
    const completed = Math.round((p.taskCount || 0) * (p.completionPercentage || 0) / 100);
    return sum + completed;
  }, 0);
  const averageCompletion = totalProjects > 0 
    ? Math.round(projects.reduce((sum, p) => sum + (p.completionPercentage || 0), 0) / totalProjects)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Real-time Status */}
        {socket?.connected && (
          <div className="mb-4 flex items-center gap-2 text-xs bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200 w-fit">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Live updates enabled</span>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Projects
              </h1>
              <p className="text-gray-600">
                Manage and track your collaborative projects
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <FiPlus size={20} />
              New Project
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Projects */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900">{totalProjects}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiFolder className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            {/* Total Tasks */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900">{totalTasks}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="text-purple-600" size={24} />
                </div>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{completedTasks}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            {/* Average Completion */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg. Completion</p>
                  <p className="text-3xl font-bold text-gray-900">{averageCompletion}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FiTrendingUp className="text-orange-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <FiFolder className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first project to get started
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-medium"
            >
              <FiPlus size={20} />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20 hover:scale-[1.02]"
              >
                {/* Progress Bar */}
                <div className="h-2 bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${project.completionPercentage || 0}%` }}
                  ></div>
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      <FiCheckCircle size={12} />
                      {project.completionPercentage || 0}%
                    </span>
                  </div>

                  {/* Description */}
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiUsers size={16} />
                      <span>{(project.members?.length || 0) + 1}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCheckCircle size={16} />
                      <span>{project.taskCount || 0} tasks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar size={16} />
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div 
              className="fixed inset-0 bg-black/50"
              onClick={() => setShowCreateModal(false)}
            ></div>
            
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Create New Project
                </h2>
                
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter project title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows="3"
                      placeholder="Describe your project"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
                    >
                      {creating ? 'Creating...' : 'Create Project'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
