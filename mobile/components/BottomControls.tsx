/**
 * Bottom controls component for drawing tools
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLOR_PALETTE } from '../src/types';

interface BottomControlsProps {
  size: number;
  color: string;
  onSizeChange: (size: number) => void;
  onColorChange: (color: string) => void;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  size,
  color,
  onSizeChange,
  onColorChange,
}) => {
  return (
    <View style={styles.container}>
      {/* Size Controls */}
      <View style={styles.sizeControls}>
        <Text style={styles.label}>Size</Text>
        <TouchableOpacity
          onPress={() => onSizeChange(Math.max(2, size - 1))}
          style={styles.sizeButton}
        >
          <Text style={styles.sizeButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.sizeDisplay}>{size}</Text>
        <TouchableOpacity
          onPress={() => onSizeChange(Math.min(16, size + 1))}
          style={styles.sizeButton}
        >
          <Text style={styles.sizeButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Color Palette */}
      <View style={styles.colorControls}>
        <Text style={styles.label}>Color</Text>
        <View style={styles.colorPalette}>
          {COLOR_PALETTE.map((paletteColor: string) => (
            <TouchableOpacity
              key={paletteColor}
              onPress={() => onColorChange(paletteColor)}
              style={[
                styles.colorSwatch,
                { backgroundColor: paletteColor },
                color === paletteColor && styles.colorSwatchActive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },
  sizeButton: {
    marginHorizontal: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  sizeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  sizeDisplay: {
    width: 24,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  colorPalette: {
    flexDirection: 'row',
    gap: 8,
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchActive: {
    borderColor: '#111827',
    borderWidth: 3,
  },
});
