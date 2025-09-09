/**
 * Chat panel component for real-time messaging
 */

import React, { useRef, useEffect } from 'react';
import { ChatMessagePayload } from '../types';
import { formatTimestamp } from '../utils';

interface ChatPanelProps {
  chat: ChatMessagePayload[];
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onSendChat: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  chat,
  chatInput,
  onChatInputChange,
  onSendChat,
}) => {
  const chatListRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [chat]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendChat();
    }
  };

  return (
    <div
      className="chat-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid #e5e7eb',
        backgroundColor: '#fff',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc',
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#374151' }}>
          Chat
        </h3>
      </div>

      <div
        ref={chatListRef}
        className="chat-messages"
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 8,
          maxHeight: 'calc(100vh - 200px)',
        }}
      >
        {chat.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: '#9ca3af',
              padding: 20,
              fontSize: 14,
            }}
          >
            No messages yet. Start the conversation!
          </div>
        ) : (
          chat.map((message, index) => (
            <div
              key={`${message.ts}-${index}`}
              className="chat-message"
              style={{
                margin: '8px 0',
                padding: '8px 12px',
                backgroundColor: '#f9fafb',
                borderRadius: 8,
                borderLeft: '3px solid #3b82f6',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color: '#1f2937',
                    fontSize: 14,
                  }}
                >
                  {message.name}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: '#6b7280',
                  }}
                >
                  {formatTimestamp(message.ts)}
                </span>
              </div>
              <div
                style={{
                  color: '#374151',
                  fontSize: 14,
                  lineHeight: 1.4,
                  wordBreak: 'break-word',
                }}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
      </div>

      <div
        className="chat-input-container"
        style={{
          display: 'flex',
          gap: 8,
          padding: 12,
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc',
        }}
      >
        <input
          value={chatInput}
          onChange={(e) => onChatInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your guess…"
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            fontSize: 14,
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
          }}
        />
        <button
          onClick={onSendChat}
          disabled={!chatInput.trim()}
          style={{
            padding: '8px 16px',
            backgroundColor: chatInput.trim() ? '#3b82f6' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
            fontSize: 14,
            fontWeight: 600,
            transition: 'background-color 0.2s',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};
