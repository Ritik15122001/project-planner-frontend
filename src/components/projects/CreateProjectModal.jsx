import { useState, useEffect } from 'react';
import { FiX, FiFolder, FiFileText } from 'react-icons/fi';

const CreateProjectModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || ''
      });
    } else {
      setFormData({ title: '', description: '' });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must not exceed 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ title: '', description: '' });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg transform transition-all">
          {/* Glassmorphism Modal */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
              <div className="absolute inset-0 bg-white/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <FiFolder className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {initialData ? 'Edit Project' : 'Create New Project'}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {initialData ? 'Update your project details' : 'Start a new project journey'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                  aria-label="Close modal"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                  <FiFileText className="text-blue-600" size={16} />
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength="100"
                  className={`w-full px-4 py-3 bg-white/60 backdrop-blur-sm border ${
                    errors.title ? 'border-red-500' : 'border-white/40'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500 text-gray-900 font-medium shadow-sm`}
                  placeholder="e.g., Website Redesign Project"
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.title ? (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.title}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-600">Give your project a clear, descriptive name</p>
                  )}
                  <span className="text-xs text-gray-500">{formData.title.length}/100</span>
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                  <FiFileText className="text-purple-600" size={16} />
                  Description <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  maxLength="500"
                  className={`w-full px-4 py-3 bg-white/60 backdrop-blur-sm border ${
                    errors.description ? 'border-red-500' : 'border-white/40'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-500 text-gray-900 resize-none shadow-sm`}
                  placeholder="Describe the project goals, timeline, and key deliverables..."
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.description ? (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.description}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-600">Add context to help your team understand the project</p>
                  )}
                  <span className="text-xs text-gray-500">{formData.description.length}/500</span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50/50 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-lg">💡</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium mb-1">Pro Tip</p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      You can invite team members and create tasks after creating the project.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-white/60 backdrop-blur-sm text-gray-700 font-medium rounded-xl hover:bg-white/80 transition-all border border-white/40 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    initialData ? '✓ Update Project' : '+ Create Project'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
