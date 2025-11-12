import { useState } from 'react';
import { FiEdit2, FiTrash2, FiCalendar, FiUser, FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi';

const TaskList = ({ tasks, onEdit, onDelete, onUpdateStatus }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'inprogress':
        return <FiClock className="text-blue-500" />;
      default:
        return <FiCircle className="text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      todo: 'bg-gray-100 text-gray-700',
      inprogress: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700'
    };
    
    const labels = {
      todo: 'To Do',
      inprogress: 'In Progress',
      completed: 'Completed'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (task) => {
    return task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="space-y-4">
      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('todo')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'todo'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            To Do ({tasks.filter(t => t.status === 'todo').length})
          </button>
          <button
            onClick={() => setFilter('inprogress')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'inprogress'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            In Progress ({tasks.filter(t => t.status === 'inprogress').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed ({tasks.filter(t => t.status === 'completed').length})
          </button>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="createdAt">Sort by: Created Date</option>
          <option value="dueDate">Sort by: Due Date</option>
          <option value="title">Sort by: Title</option>
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task._id}
              className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition ${
                isOverdue(task) ? 'border-l-4 border-red-500' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getStatusIcon(task.status)}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-1">
                      {task.title}
                    </h4>
                    
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      {getStatusBadge(task.status)}

                      {task.assignedTo && (
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          <FiUser size={12} />
                          <span>{task.assignedTo.name || task.assignedTo.email}</span>
                        </div>
                      )}

                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded ${
                          isOverdue(task)
                            ? 'bg-red-50 text-red-700 font-medium'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        <FiCalendar size={12} />
                        <span>{formatDate(task.dueDate)}</span>
                        {isOverdue(task) && <span className="ml-1">(Overdue)</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(task)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                    title="Edit task"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(task)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    title="Delete task"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
