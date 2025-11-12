import { useState, useEffect } from 'react';
import socketService from '../../services/socketService';
import { FiWifi, FiWifiOff } from 'react-icons/fi';

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  if (!isConnected) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
        <FiWifiOff />
        <span className="text-sm">Disconnected</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-pulse">
      <FiWifi />
      <span className="text-sm">Live</span>
    </div>
  );
};

export default ConnectionStatus;
