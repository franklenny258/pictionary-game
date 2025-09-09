/**
 * Toolbar component for room controls and drawing settings
 */

import React from 'react';
import { COLOR_PALETTE, CONFIG } from '../types';

interface ToolbarProps {
  room: string;
  name: string;
  joined: boolean;
  color: string;
  size: number;
  onRoomChange: (room: string) => void;
  onNameChange: (name: string) => void;
  onJoin: () => void;
  onClear: () => void;
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  room,
  name,
  joined,
  color,
  size,
  onRoomChange,
  onNameChange,
  onJoin,
  onClear,
  onColorChange,
  onSizeChange,
}) => {
  return (
    <div
      className="toolbar"
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        padding: 8,
        borderBottom: '1px solid #eee',
        backgroundColor: '#f8fafc',
      }}
    >
      <input
        value={room}
        onChange={(e) => onRoomChange(e.target.value)}
        placeholder="Room"
        style={{
          padding: '8px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: 6,
          fontSize: 14,
        }}
      />
      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Name"
        style={{
          padding: '8px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: 6,
          fontSize: 14,
        }}
      />
      <button
        onClick={onJoin}
        disabled={joined}
        style={{
          padding: '8px 16px',
          backgroundColor: joined ? '#9ca3af' : '#111827',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: joined ? 'not-allowed' : 'pointer',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {joined ? 'Joined' : 'Join'}
      </button>
      <button
        onClick={onClear}
        style={{
          padding: '8px 16px',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Clear
      </button>
      
      <div style={{ marginLeft: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 500 }}>
          Color
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            style={{ width: 32, height: 32, border: 'none', borderRadius: 4, cursor: 'pointer' }}
          />
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 500 }}>
          Size
          <input
            type="range"
            min={CONFIG.MIN_STROKE_SIZE}
            max={CONFIG.MAX_STROKE_SIZE}
            value={size}
            onChange={(e) => onSizeChange(parseInt(e.target.value))}
            style={{ width: 80 }}
          />
          <span style={{ minWidth: 20, textAlign: 'center', fontSize: 12 }}>{size}</span>
        </label>
      </div>
      
      <span style={{ marginLeft: 'auto', opacity: 0.7, fontSize: 14 }}>
        {joined ? `Joined: ${room}` : 'Not joined'}
      </span>
    </div>
  );
};
