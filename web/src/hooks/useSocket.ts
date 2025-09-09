/**
 * Custom hook for Socket.IO connection and event handling
 */


import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  SOCKET_EVENTS,
  StrokeStartPayload,
  StrokeChunkPayload,
  StrokeEndPayload,
  ChatMessagePayload,
  StrokeStyle,
} from '../types';
import { createLogger, denormalizeCoordinates } from '../utils';


const logger = createLogger('WEB-SOCKET');


interface UseSocketProps {
  socketUrl: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  pathsRef: React.MutableRefObject<Map<string, Path2D>>;
  stylesRef: React.MutableRefObject<Map<string, StrokeStyle>>;
  onRoomJoined: () => void;
  onBoardClear: () => void;
  onChatMessage: (message: ChatMessagePayload) => void;
}


export const useSocket = ({
  socketUrl,
  canvasRef,
  pathsRef,
  stylesRef,
  onRoomJoined,
  onBoardClear,
  onChatMessage,
}: UseSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  // Stabilize callback references to prevent unnecessary re-renders
  const stableOnRoomJoined = useCallback(onRoomJoined, []);
  const stableOnBoardClear = useCallback(onBoardClear, []);
  const stableOnChatMessage = useCallback(onChatMessage, []);

  useEffect(() => {
    logger.info(`Connecting to ${socketUrl}`);
    const socket = io(socketUrl, { transports: ['websocket'] });
    socketRef.current = socket;

    // Connection events
    socket.on(SOCKET_EVENTS.CONNECT, () => {
      logger.info('Connected to server');
      setConnected(true);
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      logger.info('Disconnected from server');
      setConnected(false);
    });

    // Room events
    socket.on(SOCKET_EVENTS.ROOM_JOINED, () => {
      logger.info('Joined room successfully');
      stableOnRoomJoined();
    });


    // Board clear event
    socket.on(SOCKET_EVENTS.BOARD_CLEAR, () => {
      logger.info('Board cleared');
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      pathsRef.current.clear();
      stylesRef.current.clear();
      stableOnBoardClear();
    });

    // Drawing events - denormalize incoming coordinates
    socket.on(SOCKET_EVENTS.STROKE_START, (payload: StrokeStartPayload) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const { x, y } = denormalizeCoordinates(payload.nx, payload.ny, rect.width, rect.height);

      const path = new Path2D();
      path.moveTo(x, y);
      pathsRef.current.set(payload.id, path);
      stylesRef.current.set(payload.id, { color: payload.color, size: payload.size });
    });

    socket.on(SOCKET_EVENTS.STROKE_CHUNK, (payload: StrokeChunkPayload) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const { x, y } = denormalizeCoordinates(payload.nx, payload.ny, rect.width, rect.height);

      let path = pathsRef.current.get(payload.id);
      if (!path) {
        path = new Path2D();
        pathsRef.current.set(payload.id, path);
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }

      const style = stylesRef.current.get(payload.id) || { color: '#222', size: 4 };
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = style.color;
      ctx.lineWidth = style.size;
      ctx.stroke(path);
    });

    // Chat events
    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (message: ChatMessagePayload) => {
      logger.info(`New chat message from ${message.name}`);
      stableOnChatMessage(message);
    });

    // Error handling
    socket.on('error', (error: any) => {
      logger.error('Socket error:', error);
    });

    return () => {
      logger.info('Cleaning up socket connection');
      socket.disconnect();
    };
  }, [socketUrl]); // Only socketUrl should trigger reconnection

  return {
    socket: socketRef.current,
    connected,
  };
};
