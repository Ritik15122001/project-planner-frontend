import { Link } from 'react-router-dom';
import { FiUsers, FiCalendar, FiMoreVertical, FiEdit2, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { useState } from 'react';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const totalTasks = project.taskCount || 0;
  const completedTasks = project.completedTaskCount || 0;
  const completionPercentage = project.completionPercentage || 0;
  const isOwner = project.isOwner;

  const getProgressGradient = (percentage) => {
    if (percentage >= 75) return 'from-green-500 to-emerald-500';
    if (percentage >= 50) return 'from-blue-500 to-cyan-500';
    if (percentage >= 25) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="group relative">
      <Link to={`/projects/${project._id}`}>
        {/* Glassmorphism Card */}
        <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
          {/* Gradient Top Border */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 pr-2">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>
              
              {isOwner && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowMenu(!showMenu);
                    }}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors backdrop-blur-sm"
                  >
                    <FiMoreVertical className="text-gray-700" />
                  </button>
                  
                  {showMenu && (
                    <>
                      <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl z-20 border border-white/20 py-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onEdit(project);
                            setShowMenu(false);
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-800 hover:bg-blue-50 transition-colors"
                        >
                          <FiEdit2 size={16} className="text-blue-600" />
                          <span className="font-medium">Edit Project</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onDelete(project);
                            setShowMenu(false);
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiTrash2 size={16} />
                          <span className="font-medium">Delete Project</span>
                        </button>
                      </div>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowMenu(false);
                        }}
                      />
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Progress Section */}
            <div className="space-y-4 mt-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-700">Progress</span>
                  <span className="text-xs font-bold text-gray-900">
                    {completedTasks}/{totalTasks} tasks
                  </span>
                </div>
                <div className="w-full bg-gray-200/50 rounded-full h-2.5 overflow-hidden backdrop-blur-sm">
                  <div
                    className={`h-2.5 rounded-full bg-gradient-to-r ${getProgressGradient(completionPercentage)} transition-all duration-500 shadow-md`}
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs font-medium text-gray-600">{completionPercentage}% Complete</span>
                  {completionPercentage === 100 && (
                    <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                      ✓ Completed
                    </span>
                  )}
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between pt-4 border-t border-white/30">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <FiUsers size={16} />
                    <span className="text-sm font-medium">{project.members?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <FiCalendar size={14} />
                    <span className="text-xs">{new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                  <span>View</span>
                  <FiArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProjectCard;
