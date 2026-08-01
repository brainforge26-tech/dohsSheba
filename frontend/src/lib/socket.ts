import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (token?: string): Socket => {
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      auth: { token },
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to dohsSheba Socket.IO server:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from Socket.IO server');
    });
  }

  if (token && socket && (socket.auth as any)?.token !== token) {
    socket.auth = { token };
    if (socket.connected) {
      socket.disconnect();
    }
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
