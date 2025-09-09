import React, { useState, useRef, useCallback } from 'react';
import { Toolbar } from './components/Toolbar';
import { DrawingCanvas } from './components/DrawingCanvas';
import { ChatPanel } from './components/ChatPanel';
import { useSocket } from './hooks/useSocket';
import {
  CONFIG,
  SOCKET_EVENTS,
  StrokeStartPayload,
  StrokeChunkPayload,
  StrokeEndPayload,
  ChatMessagePayload,
  ChatMessageSendPayload,
  StrokeStyle,
  Point,
  Stroke,
} from './types';
import config from './config/env';
import { generateStrokeId, sanitizeMessage, createLogger } from './utils';

const logger = createLogger('WEB-APP');
const SOCKET_URL = config.socketUrl;

export default function App() {
  // State management
  const [room, setRoom] = useState<string>(CONFIG.DEFAULT_ROOM);
  const [name, setName] = useState<string>('Web');
  const [joined, setJoined] = useState(false);
  const [color, setColor] = useState<string>(CONFIG.DEFAULT_STROKE_COLOR);
  const [size, setSize] = useState<number>(CONFIG.DEFAULT_STROKE_SIZE);
  const [chatInput, setChatInput] = useState('');
  const [chat, setChat] = useState<ChatMessagePayload[]>([]);

  // Refs for canvas and drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pathsRef = useRef<Map<string, Path2D>>(new Map());
  const stylesRef = useRef<Map<string, StrokeStyle>>(new Map());

  // Socket connection and event handlers
  const { socket, connected } = useSocket({
    socketUrl: SOCKET_URL,
    canvasRef,
    pathsRef,
    stylesRef,
    onRoomJoined: () => setJoined(true),
    onBoardClear: () => {
      // Clear local canvas state when board is cleared
      pathsRef.current.clear();
      stylesRef.current.clear();
    },
    onChatMessage: (message) => {
      setChat((prev) => [...prev, message]);
    },
  });

  // Event handlers
  const handleJoin = useCallback(() => {
    if (!socket || !room.trim()) return;
    logger.info(`Joining room: ${room}`);
    socket.emit(SOCKET_EVENTS.ROOM_JOIN, { room: room.trim(), name: name.trim() });
  }, [socket, room, name]);

  const handleClear = useCallback(() => {
    if (!socket || !room) return;
    logger.info('Clearing board');
    socket.emit(SOCKET_EVENTS.BOARD_CLEAR, { room });
  }, [socket, room]);

  const handleSendChat = useCallback(() => {
    const text = chatInput.trim();
    if (!socket || !text || !room) return;

    const sanitizedText = sanitizeMessage(text);
    const payload: ChatMessageSendPayload = { room, text: sanitizedText };

    logger.info(`Sending chat message: ${sanitizedText}`);
    socket.emit(SOCKET_EVENTS.CHAT_MESSAGE, payload);
    setChatInput('');
  }, [socket, room, chatInput]);

  const handleStrokeStart = useCallback(
    (payload: StrokeStartPayload) => {
      if (!socket) return;
      socket.emit(SOCKET_EVENTS.STROKE_START, payload);
    },
    [socket]
  );

  const handleStrokeChunk = useCallback(
    (payload: StrokeChunkPayload) => {
      if (!socket) return;
      socket.emit(SOCKET_EVENTS.STROKE_CHUNK, payload);
    },
    [socket]
  );

  const handleStrokeEnd = useCallback(
    (payload: StrokeEndPayload) => {
      if (!socket) return;
      socket.emit(SOCKET_EVENTS.STROKE_END, payload);
    },
    [socket]
  );

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <Toolbar
        room={room}
        name={name}
        joined={joined}
        color={color}
        size={size}
        onRoomChange={(room: string) => setRoom(room)}
        onNameChange={(name: string) => setName(name)}
        onJoin={handleJoin}
        onClear={handleClear}
        onColorChange={(color: string) => setColor(color)}
        onSizeChange={(size: number) => setSize(size)}
      />

      <div
        className="main-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          height: 'calc(100vh - 60px)',
          backgroundColor: '#f8fafc',
        }}
      >
        <DrawingCanvas
          joined={joined && connected}
          room={room}
          color={color}
          size={size}
          onStrokeStart={handleStrokeStart}
          onStrokeChunk={handleStrokeChunk}
          onStrokeEnd={handleStrokeEnd}
          pathsRef={pathsRef}
          stylesRef={stylesRef}
          canvasRef={canvasRef}
        />

        <ChatPanel
          chat={chat}
          chatInput={chatInput}
          onChatInputChange={setChatInput}
          onSendChat={handleSendChat}
        />
      </div>

      {!connected && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fbbf24',
            color: '#92400e',
            padding: '8px 16px',
            textAlign: 'center',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Connecting to server...
        </div>
      )}
    </div>
  );
}
