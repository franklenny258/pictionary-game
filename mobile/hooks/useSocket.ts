/**
 * Custom hook for Socket.IO connection in React Native
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  SOCKET_EVENTS,
  StrokeStartPayload,
  StrokeChunkPayload,
  ChatMessagePayload,
  CanvasSize,
} from '../src/types';
import { createLogger } from '../src/utils';
import mobileConfig from '../src/config/env';

const logger = createLogger('MOBILE-SOCKET');

interface UseSocketProps {
  canvasSize: CanvasSize;
  onRoomJoined: () => void;
  onBoardClear: () => void;
  onChatMessage: (message: ChatMessagePayload) => void;
  onStrokeStart: (payload: StrokeStartPayload) => void;
  onStrokeChunk: (payload: StrokeChunkPayload) => void;
}

export const useSocket = ({
  canvasSize,
  onRoomJoined,
  onBoardClear,
  onChatMessage,
  onStrokeStart,
  onStrokeChunk,
}: UseSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const socketUrl = mobileConfig.socketUrl;

  // Stabilize callback references to prevent unnecessary re-renders
  const stableOnRoomJoined = useCallback(onRoomJoined, []);
  const stableOnBoardClear = useCallback(onBoardClear, []);
  const stableOnChatMessage = useCallback(onChatMessage, []);
  const stableOnStrokeStart = useCallback(onStrokeStart, []);
  const stableOnStrokeChunk = useCallback(onStrokeChunk, []);
  
  // Store canvas size in ref to avoid dependency issues
  const canvasSizeRef = useRef(canvasSize);
  canvasSizeRef.current = canvasSize;

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
      stableOnBoardClear();
    });

    // Drawing events - pass through normalized coordinates directly
    socket.on(SOCKET_EVENTS.STROKE_START, (payload: StrokeStartPayload) => {
      stableOnStrokeStart(payload);
    });

    socket.on(SOCKET_EVENTS.STROKE_CHUNK, (payload: StrokeChunkPayload) => {
      stableOnStrokeChunk(payload);
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
