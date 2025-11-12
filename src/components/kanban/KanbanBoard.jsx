import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import TaskModal from '../tasks/TaskModal';
import { taskService } from '../../services/taskService';
import toast from 'react-hot-toast';
import { FiInfo } from 'react-icons/fi';

const KanbanBoard = ({ projectId, members, isOwner = true }) => {
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

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // No change in position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Move within or between columns
    const newStatus = destination.droppableId;

    // Update UI immediately
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task._id === draggableId ? { ...task, status: newStatus } : task
      );
      return updatedTasks;
    });

    // Update backend
    taskService.updateTaskStatus(projectId, draggableId, newStatus)
      .then(() => {
        toast.success('Task moved successfully', { duration: 2000 });
      })
      .catch((error) => {
        console.error('Failed to update:', error);
        toast.error('Failed to move task');
        fetchTasks(); // Revert on error
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
    if (window.confirm(`Delete "${task.title}"?`)) {
      try {
        await taskService.deleteTask(projectId, task._id);
        toast.success('Task deleted');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleSubmitTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.updateTask(projectId, editingTask._id, taskData);
        toast.success('Task updated');
      } else {
        await taskService.createTask(projectId, taskData);
        toast.success('Task created');
      }
      fetchTasks();
      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      toast.error('Failed to save task');
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
                You can only see tasks assigned to you.
              </p>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      />
    </div>
  );
};

export default KanbanBoard;
