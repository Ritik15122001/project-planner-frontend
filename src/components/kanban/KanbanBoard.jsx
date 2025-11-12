import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import TaskModal from '../tasks/TaskModal';
import { taskService } from '../../services/taskService';
import toast from 'react-hot-toast';
import { FiInfo } from 'react-icons/fi';
import { useSocket } from '../../context/SocketContext';

const KanbanBoard = ({ projectId, members, isOwner }) => {
  const [tasks, setTasks] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('todo');
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'completed', title: 'Completed' }
  ];

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  // Real-time Socket.IO listeners
  useEffect(() => {
    if (!socket || !projectId) {
      console.log('❌ Socket or projectId missing', { socket: !!socket, projectId });
      return;
    }

    console.log('🔌 Setting up socket listeners for project:', projectId);

    // Join project room
    socket.emit('joinProject', projectId);

    // Listen for task created
    const handleTaskCreated = (newTask) => {
      console.log('📝 Real-time: Task created', newTask);
      setTasks(prev => {
        const exists = prev.some(t => t._id === newTask._id);
        if (exists) {
          console.log('⏭️ Task already exists, skipping');
          return prev;
        }
        console.log('✅ Adding new task to state');
        return [newTask, ...prev];
      });
      toast.success('New task added!', { icon: '✨', duration: 2000 });
    };

    // Listen for task updated
    const handleTaskUpdated = (updatedTask) => {
      console.log('✏️ Real-time: Task updated', updatedTask);
      setTasks(prev => {
        const updated = prev.map(task =>
          task._id === updatedTask._id ? updatedTask : task
        );
        console.log('✅ Updated task in state');
        return updated;
      });
      // toast.success('Task updated!', { icon: '🔄', duration: 2000 });
    };

    // Listen for task deleted
    const handleTaskDeleted = ({ taskId }) => {
      console.log('🗑️ Real-time: Task deleted', taskId);
      setTasks(prev => {
        const filtered = prev.filter(task => task._id !== taskId);
        console.log('✅ Removed task from state');
        return filtered;
      });
      toast.success('Task removed!', { icon: '🗑️', duration: 2000 });
    };

    socket.on('taskCreated', handleTaskCreated);
    socket.on('taskUpdated', handleTaskUpdated);
    socket.on('taskDeleted', handleTaskDeleted);

    // Cleanup
    return () => {
      console.log('🔌 Cleaning up socket listeners for project:', projectId);
      socket.emit('leaveProject', projectId);
      socket.off('taskCreated', handleTaskCreated);
      socket.off('taskUpdated', handleTaskUpdated);
      socket.off('taskDeleted', handleTaskDeleted);
    };
  }, [socket, projectId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      console.log('📥 Fetching tasks for project:', projectId);
      const data = await taskService.getTasksByProject(projectId);
      console.log('✅ Fetched tasks:', data?.length);
      setTasks(data || []);
    } catch (error) {
      console.error('❌ Failed to fetch tasks:', error);
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

    console.log('🎯 Drag & drop:', { taskId: draggableId, newStatus });

    // Optimistic UI update
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === draggableId ? { ...task, status: newStatus } : task
      )
    );

    // Update backend
    taskService.updateTaskStatus(projectId, draggableId, newStatus)
      .then(() => {
        console.log('✅ Task status updated on backend');
        toast.success('Task moved!');
      })
      .catch((error) => {
        console.error('❌ Failed to update task status:', error);
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
    try {
      console.log('🗑️ Deleting task:', task._id);
      await taskService.deleteTask(projectId, task._id);
      console.log('✅ Task deleted on backend');
      // Socket will handle the update
    } catch (error) {
      console.error('❌ Failed to delete task:', error);
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleSubmitTask = async (taskData) => {
    try {
      if (editingTask) {
        console.log('✏️ Updating task:', editingTask._id);
        await taskService.updateTask(projectId, editingTask._id, taskData);
        console.log('✅ Task updated on backend');
        toast.success('Task updated!');
      } else {
        console.log('📝 Creating new task');
        await taskService.createTask(projectId, taskData);
        console.log('✅ Task created on backend');
        toast.success('Task created!');
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('❌ Failed to save task:', error);
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
      {/* Real-time Status Indicator */}
      {/* <div className="mb-4 flex items-center gap-2 text-xs px-3 py-2 rounded-lg border w-fit">
        {socket?.connected ? (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-green-700">Real-time sync active (ID: {socket.id})</span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="font-medium text-red-700">Socket disconnected</span>
          </>
        )}
      </div> */}

      {!isOwner && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <FiInfo className="text-blue-600 mt-1" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900">Member View</p>
              <p className="text-xs text-blue-700 mt-1">
                You can create, edit, and delete tasks, but only the owner can assign tasks to members.
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
