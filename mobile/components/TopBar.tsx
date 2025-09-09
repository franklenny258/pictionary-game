/**
 * Top bar component for room controls and connection status
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface TopBarProps {
  room: string;
  name: string;
  joined: boolean;
  connected: boolean;
  onRoomChange: (room: string) => void;
  onNameChange: (name: string) => void;
  onJoin: () => void;
  onClear: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  room,
  name,
  joined,
  connected,
  onRoomChange,
  onNameChange,
  onJoin,
  onClear,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Text style={styles.label}>Room</Text>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={room}
          onChangeText={onRoomChange}
          placeholder="room"
          placeholderTextColor="#9ca3af"
        />
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={[styles.input, { maxWidth: 120 }]}
          value={name}
          onChangeText={onNameChange}
          placeholder="name"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.button,
            joined && styles.buttonDisabled,
            { backgroundColor: joined ? '#9ca3af' : '#111827' },
          ]}
          onPress={onJoin}
          disabled={joined || !connected}
        >
          <Text style={styles.buttonText}>
            {!connected ? 'Connecting...' : joined ? 'Joined' : 'Join'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#dc2626' }]}
          onPress={onClear}
          disabled={!joined}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {!connected && (
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>Connecting to server...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginHorizontal: 4,
  },
  input: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 14,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  statusBar: {
    backgroundColor: '#fbbf24',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  statusText: {
    color: '#92400e',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
