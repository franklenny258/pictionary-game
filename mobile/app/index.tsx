import React, { useState, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { TopBar } from '../components/TopBar';
import { DrawingArea } from '../components/DrawingArea';
import { ChatSection } from '../components/ChatSection';
import { BottomControls } from '../components/BottomControls';
import { useSocket } from '../hooks/useSocket';
import {
  CONFIG,
  SOCKET_EVENTS,
  StrokeStartPayload,
  StrokeChunkPayload,
  StrokeEndPayload,
  ChatMessagePayload,
  ChatMessageSendPayload,
  Stroke,
  CanvasSize,
} from '../src/types';
import {
  generateStrokeId,
  sanitizeMessage,
  normalizeCoordinates,
  createLogger,
} from '../src/utils';

const logger = createLogger('MOBILE-APP');


export default function Home() {
  // State management
  const [room, setRoom] = useState<string>(CONFIG.DEFAULT_ROOM);
  const [name, setName] = useState<string>('Mobile');
  const [joined, setJoined] = useState(false);
  const [color, setColor] = useState<string>(CONFIG.DEFAULT_STROKE_COLOR);
  const [size, setSize] = useState<number>(CONFIG.DEFAULT_STROKE_SIZE);
  const [chat, setChat] = useState<ChatMessagePayload[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ width: 0, height: 0 });
  
  // Drawing state
  const strokesRef = useRef<Record<string, Stroke>>({});
  const drawingIdRef = useRef<string | null>(null);
  const canvasSizeRef = useRef(canvasSize);
  const [, setTick] = useState(0); // force rerender of SVG on updates

  // Update canvas size ref when canvasSize changes
  canvasSizeRef.current = canvasSize;

  // Memoized callback handlers to prevent socket reconnection
  const handleRoomJoined = useCallback(() => {
    setJoined(true);
  }, []);

  const handleBoardClear = useCallback(() => {
    strokesRef.current = {};
    setTick((t) => t + 1);
  }, []);

  const handleChatMessage = useCallback((message: ChatMessagePayload) => {
    setChat((prev) => [...prev, message]);
  }, []);

  const handleStrokeStart = useCallback((payload: StrokeStartPayload) => {
    const { width, height } = canvasSizeRef.current;
    if (!width || !height) return;
    const x = payload.nx * width;
    const y = payload.ny * height;
    strokesRef.current[payload.id] = {
      id: payload.id,
      color: payload.color,
      size: payload.size,
      points: [{ x, y }],
    };
    setTick((t) => t + 1);
  }, []);

  const handleStrokeChunk = useCallback((payload: StrokeChunkPayload) => {
    const { width, height } = canvasSizeRef.current;
    if (!width || !height) return;
    const x = payload.nx * width;
    const y = payload.ny * height;
    const stroke = strokesRef.current[payload.id];
    if (stroke) {
      stroke.points.push({ x, y });
    } else {
      strokesRef.current[payload.id] = {
        id: payload.id,
        color: CONFIG.DEFAULT_STROKE_COLOR,
        size: CONFIG.DEFAULT_STROKE_SIZE,
        points: [{ x, y }],
      };
    }
    setTick((t) => t + 1);
  }, []);

  // Socket connection and event handlers
  const { socket, connected } = useSocket({
    canvasSize,
    onRoomJoined: handleRoomJoined,
    onBoardClear: handleBoardClear,
    onChatMessage: handleChatMessage,
    onStrokeStart: handleStrokeStart,
    onStrokeChunk: handleStrokeChunk,
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

  // Touch event handlers for drawing
  const handleTouchStart = useCallback((e: any) => {
    if (!joined || !connected) return;
    const { locationX: x, locationY: y } = e.nativeEvent;
    const { width, height } = canvasSize;
    if (!width || !height) return;

    const id = generateStrokeId();
    drawingIdRef.current = id;
    strokesRef.current[id] = { id, color, size, points: [{ x, y }] };

    const { nx, ny } = normalizeCoordinates(x, y, width, height);
    const payload: StrokeStartPayload = {
      room,
      id,
      color,
      size,
      nx,
      ny,
    };
    
    socket?.emit(SOCKET_EVENTS.STROKE_START, payload);
    setTick((t) => t + 1);
  }, [joined, connected, canvasSize, room, color, size, socket]);

  const handleTouchMove = useCallback((e: any) => {
    if (!joined || !connected || !drawingIdRef.current) return;
    const { locationX: x, locationY: y } = e.nativeEvent;
    const { width, height } = canvasSize;
    if (!width || !height) return;

    const stroke = strokesRef.current[drawingIdRef.current];
    if (!stroke) return;
    stroke.points.push({ x, y });

    const { nx, ny } = normalizeCoordinates(x, y, width, height);
    const payload: StrokeChunkPayload = {
      room,
      id: drawingIdRef.current,
      nx,
      ny,
    };
    
    socket?.emit(SOCKET_EVENTS.STROKE_CHUNK, payload);
    setTick((t) => t + 1);
  }, [joined, connected, canvasSize, room, socket]);

  const handleTouchEnd = useCallback(() => {
    if (!joined || !connected || !drawingIdRef.current) return;
    
    const payload: StrokeEndPayload = {
      room,
      id: drawingIdRef.current,
    };
    
    socket?.emit(SOCKET_EVENTS.STROKE_END, payload);
    drawingIdRef.current = null;
  }, [joined, connected, room, socket]);

  const handleCanvasLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setCanvasSize({ width, height });
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.container}>
          <TopBar
            room={room}
            name={name}
            joined={joined}
            connected={connected}
            onRoomChange={setRoom}
            onNameChange={setName}
            onJoin={handleJoin}
            onClear={handleClear}
          />

          <DrawingArea
            strokes={strokesRef.current}
            canvasSize={canvasSize}
            onLayout={handleCanvasLayout}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          <ChatSection
            chat={chat}
            chatInput={chatInput}
            onChatInputChange={setChatInput}
            onSendChat={handleSendChat}
          />

          <BottomControls
            size={size}
            color={color}
            onSizeChange={setSize}
            onColorChange={setColor}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});
