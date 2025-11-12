import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import KanbanBoard from '../kanban/KanbanBoard';
import Navbar from '../common/Navbar';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiUsers, FiUserPlus, FiX, FiMail, FiShield, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('board');
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjectById(id);
      
      console.log('Project data:', data);
      console.log('Current user:', user);
      
      setProject(data);
    } catch (error) {
      toast.error('Failed to fetch project details');
      console.error(error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    
    if (!memberEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(memberEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (project.members.some(m => m.email === memberEmail)) {
      toast.error('This user is already a member');
      return;
    }

    if (project.owner.email === memberEmail) {
      toast.error('Owner is already part of the project');
      return;
    }

    setAddingMember(true);
    try {
      const currentMemberEmails = project.members.map(m => m.email);
      await projectService.updateProject(id, {
        members: [...currentMemberEmails, memberEmail]
      });
      
      toast.success(`Invitation sent to ${memberEmail}`);
      setMemberEmail('');
      setShowAddMember(false);
      fetchProject();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (member) => {
    if (window.confirm(`Remove ${member.name || member.email} from this project?`)) {
      try {
        const updatedMembers = project.members
          .filter(m => m._id !== member._id)
          .map(m => m.email);
        
        await projectService.updateProject(id, {
          members: updatedMembers
        });
        
        toast.success('Member removed successfully');
        fetchProject();
      } catch (error) {
        toast.error('Failed to remove member');
        console.error(error);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!project) {
    return null;
  }

  // Check if current user is the owner
  const isOwner = project.owner._id === user?._id || project.owner._id === user?.id;
  
  console.log('Is Owner:', isOwner);
  console.log('Project owner ID:', project.owner._id);
  console.log('Current user ID:', user?._id || user?.id);

  // Combine owner and members for display
  const allMembers = [project.owner, ...(project.members || [])];
  const totalMemberCount = allMembers.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
          >
            <FiArrowLeft />
            Back to Dashboard
          </Link>

          {/* Project Info Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h1>
                {project.description && (
                  <p className="text-gray-600 mb-4">{project.description}</p>
                )}
              </div>
              {isOwner && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  <FiShield size={14} />
                  Owner
                </span>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FiUsers className="text-blue-600" />
                <span className="font-medium">{totalMemberCount} members</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <span className="text-green-600 font-medium">
                  {project.completionPercentage || 0}% Complete
                </span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/20">
          {/* Tab Headers */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <nav className="flex" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === 'board'}
                onClick={() => setActiveTab('board')}
                className={`px-6 py-4 text-sm font-medium transition-all ${
                  activeTab === 'board'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                📋 Kanban Board
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'members'}
                onClick={() => setActiveTab('members')}
                className={`px-6 py-4 text-sm font-medium transition-all ${
                  activeTab === 'members'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                👥 Team Members
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div role="tabpanel" className="bg-white">
            {activeTab === 'board' && (
              <KanbanBoard 
                projectId={id} 
                members={project.members || []} 
                isOwner={isOwner} 
              />
            )}

            {activeTab === 'members' && (
              <div className="p-6">
                {/* Add Member Section */}
                {isOwner && (
                  <div className="mb-6">
                    {!showAddMember ? (
                      <button
                        onClick={() => setShowAddMember(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-medium"
                      >
                        <FiUserPlus size={20} />
                        Invite Team Member
                      </button>
                    ) : (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Invite New Member
                        </h3>
                        <form onSubmit={handleAddMember} className="flex gap-3">
                          <div className="flex-1 relative">
                            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="email"
                              value={memberEmail}
                              onChange={(e) => setMemberEmail(e.target.value)}
                              placeholder="colleague@example.com"
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={addingMember}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
                          >
                            {addingMember ? 'Inviting...' : 'Send Invite'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddMember(false);
                              setMemberEmail('');
                            }}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                          >
                            Cancel
                          </button>
                        </form>
                        <p className="text-xs text-gray-600 mt-2">
                          💡 The user must already have an account to join this project
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Members List */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Team Members ({totalMemberCount})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Owner - Always First */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-xl border-2 border-blue-300 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg ring-2 ring-white shadow-md">
                          {project.owner.name?.charAt(0).toUpperCase() || project.owner.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {project.owner.name || 'No Name'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {project.owner.email}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full font-bold shadow-md">
                        👑 Owner
                      </span>
                    </div>

                    {/* Other Members */}
                    {project.members && project.members.length > 0 ? (
                      project.members.map((member) => (
                        <div
                          key={member._id}
                          className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                              {member.name?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {member.name || 'No Name'}
                              </p>
                              <p className="text-sm text-gray-600">
                                {member.email}
                              </p>
                            </div>
                          </div>

                          {isOwner && (
                            <button
                              onClick={() => handleRemoveMember(member)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Remove member"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-12 bg-gray-50 rounded-xl">
                        <FiUsers size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium">No other members yet</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Invite team members to collaborate on this project
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
