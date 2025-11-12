import { Draggable } from '@hello-pangea/dnd';
import { FiCalendar, FiUser, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

const TaskCard = ({ task, index, onEdit, onDelete, isOwner = true }) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Draggable draggableId={task._id.toString()} index={index}>
      {(provided, snapshot) => {
        // Get the transform style
        const style = provided.draggableProps.style;
        const transform = style?.transform;
        
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              // Fix: Remove any offset, keep only the transform
              transform: snapshot.isDragging ? transform : undefined,
            }}
            className={`bg-white rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
              snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500 opacity-90' : ''
            } ${isOverdue ? 'border-l-4 border-red-500' : ''}`}
          >
            {/* Task Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-medium text-gray-900 flex-1 text-sm">
                {task.title}
              </h4>
              {isOwner && (
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
                        <button
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => {
                            onDelete(task);
                            setShowMenu(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                        >
                          <FiTrash2 size={14} />
                          Delete
                        </button>
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

            {/* Task Description */}
            {task.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Task Footer */}
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
  );
};

export default TaskCard;
