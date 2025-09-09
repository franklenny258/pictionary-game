/**
 * Drawing area component with SVG-based drawing
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Stroke, Point } from '../src/types';

interface DrawingAreaProps {
  strokes: Record<string, Stroke>;
  canvasSize: { width: number; height: number };
  onLayout: (event: any) => void;
  onTouchStart: (event: any) => void;
  onTouchMove: (event: any) => void;
  onTouchEnd: () => void;
}

export const DrawingArea: React.FC<DrawingAreaProps> = ({
  strokes,
  canvasSize,
  onLayout,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => {
  const convertPointsToPath = (points: Point[]): string => {
    if (points.length === 0) return '';
    
    let pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }
    return pathData;
  };

  return (
    <View
      style={styles.container}
      onLayout={onLayout}
      onStartShouldSetResponder={() => true}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Svg width="100%" height="100%">
        {Object.values(strokes).map((stroke) => (
          <Path
            key={stroke.id}
            d={convertPointsToPath(stroke.points)}
            stroke={stroke.color}
            strokeWidth={stroke.size}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    overflow: 'hidden',
  },
});
