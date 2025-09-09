/**
 * Drawing canvas component with touch/mouse support
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { 
  StrokeStartPayload, 
  StrokeChunkPayload, 
  StrokeEndPayload,
  StrokeStyle,
  Point 
} from '../types';
import { normalizeCoordinates } from '../utils';

interface DrawingCanvasProps {
  joined: boolean;
  room: string;
  color: string;
  size: number;
  onStrokeStart: (payload: StrokeStartPayload) => void;
  onStrokeChunk: (payload: StrokeChunkPayload) => void;
  onStrokeEnd: (payload: StrokeEndPayload) => void;
  pathsRef: React.MutableRefObject<Map<string, Path2D>>;
  stylesRef: React.MutableRefObject<Map<string, StrokeStyle>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  joined,
  room,
  color,
  size,
  onStrokeStart,
  onStrokeChunk,
  onStrokeEnd,
  pathsRef,
  stylesRef,
  canvasRef,
}) => {
  const drawing = useRef(false);
  const currentId = useRef<string | null>(null);

  // Handle canvas DPI for crisp rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        
        // Set default drawing styles
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const generateStrokeId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!joined) return;
    
    const canvas = e.currentTarget as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = (e as any).clientX - rect.left;
    const y = (e as any).clientY - rect.top;

    const id = generateStrokeId();
    currentId.current = id;
    drawing.current = true;

    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;

    stylesRef.current.set(id, { color, size });

    const { nx, ny } = normalizeCoordinates(x, y, rect.width, rect.height);
    onStrokeStart({
      room,
      id,
      color,
      size,
      nx,
      ny,
    });
  }, [joined, room, color, size, onStrokeStart, stylesRef, generateStrokeId]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !currentId.current) return;
    
    const canvas = e.currentTarget as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = (e as any).clientX - rect.left;
    const y = (e as any).clientY - rect.top;

    const ctx = canvas.getContext('2d')!;
    ctx.lineTo(x, y);
    ctx.stroke();

    const { nx, ny } = normalizeCoordinates(x, y, rect.width, rect.height);
    onStrokeChunk({
      room,
      id: currentId.current,
      nx,
      ny,
    });
  }, [room, onStrokeChunk]);

  const handlePointerUp = useCallback(() => {
    if (!drawing.current || !currentId.current) return;
    
    drawing.current = false;
    onStrokeEnd({
      room,
      id: currentId.current,
    });
    currentId.current = null;
  }, [room, onStrokeEnd]);

  return (
    <div style={{ padding: 12, flex: 1 }}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown as any}
        onPointerMove={handlePointerMove as any}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          width: '100%',
          height: '100%',
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          touchAction: 'none',
          display: 'block',
          cursor: joined ? 'crosshair' : 'not-allowed',
        }}
      />
    </div>
  );
};
