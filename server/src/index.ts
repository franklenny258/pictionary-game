import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  RoomJoinPayload,
  StrokeStartPayload,
  StrokeChunkPayload,
  StrokeEndPayload,
  BoardClearPayload,
  ChatMessageSendPayload,
  SOCKET_EVENTS
} from './types.js';
import { sanitizeMessage, generateFallbackName, createLogger } from './utils.js';

dotenv.config();

const PORT = 4000;
const CORS_ORIGIN = '*';
const logger = createLogger('SERVER');

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

interface SocketData {
  name?: string;
  room?: string;
}

io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
  let currentRoom: string | null = null;
  let name: string | null = null;

  logger.info(`Client connected: ${socket.id}`);

  socket.on(SOCKET_EVENTS.ROOM_JOIN, ({ room, name: n }: RoomJoinPayload) => {
    if (currentRoom) {
      socket.leave(currentRoom);
    }

    currentRoom = room;
    name = (n && String(n).slice(0, 32)) || generateFallbackName(socket.id);

    socket.join(room);
    socket.data = { name, room } as SocketData;

    socket.emit(SOCKET_EVENTS.ROOM_JOINED, { room, name });
    socket.to(room).emit('system', { message: `${name} joined ${room}` });

    logger.info(`${name} joined room: ${room}`);
  });

  socket.on(SOCKET_EVENTS.STROKE_START, (payload: StrokeStartPayload) => {
    if (payload?.room) {
      socket.to(payload.room).emit(SOCKET_EVENTS.STROKE_START, payload);
    }
  });

  socket.on(SOCKET_EVENTS.STROKE_CHUNK, (payload: StrokeChunkPayload) => {
    if (payload?.room) {
      socket.to(payload.room).emit(SOCKET_EVENTS.STROKE_CHUNK, payload);
    }
  });

  socket.on(SOCKET_EVENTS.STROKE_END, (payload: StrokeEndPayload) => {
    if (payload?.room) {
      socket.to(payload.room).emit(SOCKET_EVENTS.STROKE_END, payload);
    }
  });

  socket.on(SOCKET_EVENTS.BOARD_CLEAR, ({ room }: BoardClearPayload) => {
    if (room) {
      io.to(room).emit(SOCKET_EVENTS.BOARD_CLEAR, { room });
      logger.info(`Board cleared in room: ${room}`);
    }
  });

  socket.on(SOCKET_EVENTS.CHAT_MESSAGE, ({ room, text }: ChatMessageSendPayload) => {
    if (!room || !text) return;

    const safe = sanitizeMessage(text);
    const socketData = socket.data as SocketData;
    const senderName = socketData?.name || 'Anonymous';

    const payload = {
      room,
      name: senderName,
      text: safe,
      ts: Date.now()
    };

    io.to(room).emit(SOCKET_EVENTS.CHAT_MESSAGE, payload);
    logger.info(`Chat message in ${room} from ${senderName}: ${safe}`);
  });

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    if (currentRoom && name) {
      socket.to(currentRoom).emit('system', { message: `${name} left` });
      logger.info(`${name} disconnected from room: ${currentRoom}`);
    }
  });
});

app.get('/', (_: Request, res: Response) => {
  res.send('Pictionary server with chat running');
});

server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
