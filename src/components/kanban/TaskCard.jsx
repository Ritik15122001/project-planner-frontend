import { Draggable } from '@hello-pangea/dnd';
import { FiCalendar, FiUser, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

const TaskCard = ({ task, index, onEdit, onDelete, isOwner }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  const handleDeleteClick = () => {
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task);
    setShowDeleteModal(false);
  };

  return (
    <>
      <Draggable draggableId={task._id.toString()} index={index}>
        {(provided, snapshot) => {
          const style = provided.draggableProps.style;
          const transform = style?.transform;
          
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                ...provided.draggableProps.style,
                transform: snapshot.isDragging ? transform : undefined,
              }}
              className={`bg-white rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
                snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500 opacity-90' : ''
              } ${isOverdue ? 'border-l-4 border-red-500' : ''}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-medium text-gray-900 flex-1 text-sm">
                  {task.title}
                </h4>
                {/* Menu */}
                {onEdit && (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded"
                    >
                      •••
                    </button>
                    
                    {showMenu && (
                      <>
                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                          <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => {
                              onEdit(task);
                              setShowMenu(false);
                            }}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                          >
                            <FiEdit2 size={14} />
                            Edit
                          </button>
                          {onDelete && (
                            <button
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={handleDeleteClick}
                              className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                            >
                              <FiTrash2 size={14} />
                              Delete
                            </button>
                          )}
                        </div>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowMenu(false)}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>

              {task.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-3 text-xs text-gray-500">
                {task.assignedTo && (
                  <div className="flex items-center gap-1">
                    <FiUser size={12} />
                    <span>{task.assignedTo.name || task.assignedTo.email.split('@')[0]}</span>
                  </div>
                )}
                {task.dueDate && (
                  <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                    <FiCalendar size={12} />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </Draggable>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setShowDeleteModal(false)}
          ></div>

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <FiTrash2 className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Delete Task
                    </h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Are you sure you want to delete "{task.title}"?
                  </p>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone. The task will be permanently removed from the project.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-6 pb-6">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Delete Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
