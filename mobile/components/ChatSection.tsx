/**
 * Chat section component for real-time messaging
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { ChatMessagePayload } from '../src/types';
import { formatTimestamp } from '../src/utils';

interface ChatSectionProps {
  chat: ChatMessagePayload[];
  chatInput: string;
  onChatInputChange: (text: string) => void;
  onSendChat: () => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  chat,
  chatInput,
  onChatInputChange,
  onSendChat,
}) => {
  const listRef = useRef<FlatList<ChatMessagePayload>>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chat.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [chat]);

  const renderMessage = ({ item, index }: { item: ChatMessagePayload; index: number }) => (
    <View style={styles.messageContainer}>
      <View style={styles.messageHeader}>
        <Text style={styles.senderName}>{item.name}</Text>
        <Text style={styles.timestamp}>{formatTimestamp(item.ts)}</Text>
      </View>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chat</Text>
      </View>

      <FlatList
        ref={listRef}
        style={styles.messagesList}
        data={chat}
        keyExtractor={(item, idx) => `${item.ts}-${idx}`}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={true}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet.</Text>
            <Text style={styles.emptySubtext}>Start the conversation!</Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={chatInput}
          onChangeText={onChatInputChange}
          placeholder="Type your guess…"
          placeholderTextColor="#6b7280"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="send"
          blurOnSubmit={false}
          onSubmitEditing={onSendChat}
          multiline={false}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: chatInput.trim() ? '#3b82f6' : '#9ca3af' }
          ]}
          onPress={onSendChat}
          disabled={!chatInput.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 8,
    flexGrow: 1,
  },
  messageContainer: {
    marginVertical: 4,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
  },
  messageText: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#d1d5db',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
  },
  textInput: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: 'white',
    fontSize: 14,
    marginRight: 8,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
