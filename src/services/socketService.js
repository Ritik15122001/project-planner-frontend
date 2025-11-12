import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinProject(projectId) {
    if (this.socket) {
      console.log('🚀 Joining project:', projectId);
      this.socket.emit('joinProject', projectId);
    }
  }

  leaveProject(projectId) {
    if (this.socket) {
      console.log('👋 Leaving project:', projectId);
      this.socket.emit('leaveProject', projectId);
    }
  }

  onTaskCreated(callback) {
    if (this.socket) {
      this.socket.on('taskCreated', callback);
    }
  }

  onTaskUpdated(callback) {
    if (this.socket) {
      this.socket.on('taskUpdated', callback);
    }
  }

  onTaskDeleted(callback) {
    if (this.socket) {
      this.socket.on('taskDeleted', callback);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.off('taskCreated');
      this.socket.off('taskUpdated');
      this.socket.off('taskDeleted');
    }
  }
}

export default new SocketService();
