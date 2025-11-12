import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { FiPlus } from 'react-icons/fi';

const Column = ({ column, tasks, onAddTask, onEditTask, onDeleteTask, isOwner = true }) => {
  const getColumnColor = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 border-gray-300';
      case 'inprogress':
        return 'bg-blue-50 border-blue-300';
      case 'completed':
        return 'bg-green-50 border-green-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getHeaderColor = (status) => {
    switch (status) {
      case 'todo':
        return 'text-gray-700';
      case 'inprogress':
        return 'text-blue-700';
      case 'completed':
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className={`rounded-lg border-2 ${getColumnColor(column.id)} p-4 min-h-[600px] flex flex-col`}>
      {/* Column Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className={`font-semibold text-lg ${getHeaderColor(column.id)}`}>
            {column.title}
          </h3>
          <span className="text-sm text-gray-600">{tasks.length} tasks</span>
        </div>
        {isOwner && (
          <button
            onClick={() => onAddTask(column.id)}
            className="p-2 hover:bg-white rounded-full transition"
            title="Add task"
          >
            <FiPlus size={20} />
          </button>
        )}
      </div>

      {/* Droppable Area - Bigger drop zone */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 rounded-lg transition-all duration-200 ${
              snapshot.isDraggingOver ? 'bg-blue-200 bg-opacity-40 ring-2 ring-blue-400' : ''
            }`}
            style={{ minHeight: '500px' }}
          >
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  index={index}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  isOwner={isOwner}
                />
              ))}
            </div>
            {provided.placeholder}
            
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="text-center text-gray-400 text-sm py-12">
                Drop tasks here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
