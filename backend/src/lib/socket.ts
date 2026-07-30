import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

let io: Server | null = null;

export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    },
  });

  // Socket Auth & Room Join
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'dohssheba_jwt_secret_dev_key_2026'
      ) as { id: string; role: string; email: string };

      socket.data.user = decoded;
      next();
    } catch (err) {
      console.warn('⚠️ Socket connection unauthenticated or token expired.');
      next();
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user;

    if (user) {
      console.log(`⚡ Socket connected: User ${user.id} (${user.role})`);
      socket.join(`user_${user.id}`);
      socket.join(`role_${user.role}`);

      if (user.role === 'RIDER') {
        socket.join('online_riders');
      }
    } else {
      console.log(`⚡ Socket connected: Anonymous (${socket.id})`);
    }

    socket.on('join_order', (orderId: string) => {
      socket.join(`order_${orderId}`);
    });

    socket.on('leave_order', (orderId: string) => {
      socket.leave(`order_${orderId}`);
    });

    socket.on('join_seller', (sellerId: string) => {
      socket.join(`seller_${sellerId}`);
    });

    socket.on('disconnect', () => {
      if (user) {
        console.log(`🔌 Socket disconnected: User ${user.id}`);
      }
    });
  });

  console.log('✅ Socket.IO initialized successfully.');
  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO not initialized! Call initSocket(server) first.');
  }
  return io;
};

// ── Event Emitters ─────────────────────────────────────────────────────────────

export const emitToUser = (userId: string, event: string, payload: any) => {
  if (io) io.to(`user_${userId}`).emit(event, payload);
};

export const emitToRole = (role: string, event: string, payload: any) => {
  if (io) io.to(`role_${role}`).emit(event, payload);
};

export const emitToOnlineRiders = (event: string, payload: any) => {
  if (io) io.to('online_riders').emit(event, payload);
};

export const emitToSellerRoom = (sellerId: string, event: string, payload: any) => {
  if (io) io.to(`seller_${sellerId}`).emit(event, payload);
};

export const emitToOrderRoom = (orderId: string, event: string, payload: any) => {
  if (io) io.to(`order_${orderId}`).emit(event, payload);
};
