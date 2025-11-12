import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import TaskModal from '../tasks/TaskModal';
import { taskService } from '../../services/taskService';
import toast from 'react-hot-toast';
import { FiInfo } from 'react-icons/fi';

const KanbanBoard = ({ projectId, members, isOwner }) => {
  const [tasks, setTasks] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('todo');
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'completed', title: 'Completed' }
  ];

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasksByProject(projectId);
      setTasks(data || []);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newStatus = destination.droppableId;

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === draggableId ? { ...task, status: newStatus } : task
      )
    );

    taskService.updateTaskStatus(projectId, draggableId, newStatus)
      .then(() => {
        toast.success('Task status updated');
      })
      .catch((error) => {
        toast.error('Failed to update task status');
        fetchTasks();
      });
  };

  const handleAddTask = (status) => {
    setSelectedStatus(status);
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

const handleDeleteTask = async (task) => {
  // REMOVE THIS LINE:
  // if (window.confirm(`Delete "${task.title}"?`)) {
  
  // Just delete directly - TaskCard already shows the modal
  try {
    await taskService.deleteTask(projectId, task._id);
    toast.success('Task deleted successfully');
    fetchTasks();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to delete task');
  }
  
  // REMOVE THIS LINE:
  // }
};

  const handleSubmitTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.updateTask(projectId, editingTask._id, taskData);
        toast.success('Task updated successfully');
      } else {
        await taskService.createTask(projectId, taskData);
        toast.success('Task created successfully');
      }
      fetchTasks();
      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50">
    {!isOwner && (
  <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
    <div className="flex items-start gap-3">
      <FiInfo className="text-blue-600 mt-1" size={20} />
      <div>
        <p className="text-sm font-medium text-blue-900">Member View</p>
        <p className="text-xs text-blue-700 mt-1">
          You can create, edit, and delete tasks. Tasks you create are automatically assigned to you. Only the owner can assign tasks to other members.
        </p>
      </div>
    </div>
  </div>
)}


      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((column) => {
            const columnTasks = tasks.filter(task => task.status === column.id);
            return (
              <Column
                key={column.id}
                column={column}
                tasks={columnTasks}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask} 
                isOwner={isOwner}
              />
            );
          })}
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmitTask}
        initialData={editingTask}
        members={members}
        initialStatus={selectedStatus}
        isOwner={isOwner}
      />
    </div>
  );
};

export default KanbanBoard;
