/**
 * Types for the Pictionary Realtime mobile client
 */

// Socket event types
export interface RoomJoinPayload {
  room: string;
  name?: string;
}

export interface RoomJoinedPayload {
  room: string;
  name: string;
}

export interface StrokeStartPayload {
  room: string;
  id: string;
  color: string;
  size: number;
  nx: number; // normalized x coordinate (0-1)
  ny: number; // normalized y coordinate (0-1)
}

export interface StrokeChunkPayload {
  room: string;
  id: string;
  nx: number; // normalized x coordinate (0-1)
  ny: number; // normalized y coordinate (0-1)
}

export interface StrokeEndPayload {
  room: string;
  id: string;
}

export interface BoardClearPayload {
  room: string;
}

export interface ChatMessagePayload {
  room: string;
  name: string;
  text: string;
  ts: number;
}

export interface ChatMessageSendPayload {
  room: string;
  text: string;
}

// Client-side types
export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  color: string;
  size: number;
  points: Point[];
}

export interface StrokeStyle {
  color: string;
  size: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}

// Socket event names as constants
export const SOCKET_EVENTS = {
  // Room events
  ROOM_JOIN: 'room:join',
  ROOM_JOINED: 'room:joined',
  
  // Drawing events
  STROKE_START: 'stroke:start',
  STROKE_CHUNK: 'stroke:chunk',
  STROKE_END: 'stroke:end',
  BOARD_CLEAR: 'board:clear',
  
  // Chat events
  CHAT_MESSAGE: 'chat:message',
  
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECTION: 'connection',
} as const;

// Configuration constants
export const CONFIG = {
  DEFAULT_PORT: 4000,
  DEFAULT_ROOM: 'demo',
  DEFAULT_STROKE_SIZE: 4,
  DEFAULT_STROKE_COLOR: '#111111',
  MAX_NAME_LENGTH: 32,
  MAX_MESSAGE_LENGTH: 500,
  MIN_STROKE_SIZE: 2,
  MAX_STROKE_SIZE: 16,
} as const;

// Color palette
export const COLOR_PALETTE = [
  '#111111', // Black
  '#E11D48', // Red
  '#2563EB', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
] as const;

// Validation helpers
export const isValidRoom = (room: string): boolean => {
  return typeof room === 'string' && room.trim().length > 0;
};

export const isValidName = (name: string): boolean => {
  return typeof name === 'string' && name.trim().length > 0 && name.length <= CONFIG.MAX_NAME_LENGTH;
};

export const isValidMessage = (message: string): boolean => {
  return typeof message === 'string' && message.trim().length > 0 && message.length <= CONFIG.MAX_MESSAGE_LENGTH;
};

export const isValidStrokeSize = (size: number): boolean => {
  return typeof size === 'number' && size >= CONFIG.MIN_STROKE_SIZE && size <= CONFIG.MAX_STROKE_SIZE;
};

export const isValidColor = (color: string): boolean => {
  return typeof color === 'string' && /^#[0-9A-F]{6}$/i.test(color);
};

export const isValidCoordinate = (coord: number): boolean => {
  return typeof coord === 'number' && coord >= 0 && coord <= 1;
};
