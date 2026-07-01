/**
 * AppleRing Component
 * Renders an Apple Fitness-style concentric circular progress ring using react-native-svg.
 */
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface AppleRingProps {
  progress: number; // 0.0 to 1.0 or more
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  value?: string;
}

export function AppleRing({
  progress,
  size = 120,
  strokeWidth = 12,
  color = '#fa2d5a', // Activity Pink
  backgroundColor = 'rgba(250, 45, 90, 0.15)',
  label,
  value,
}: AppleRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Cap progress or allow wrapping
  const boundedProgress = Math.max(0, Math.min(progress, 1));
  const strokeDashoffset = circumference - boundedProgress * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Track Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Foreground Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          // Rotate start from top (12 o'clock)
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {/* Label and Value Overlay */}
      <View style={styles.overlay}>
        {value && <Text style={styles.valueText}>{value}</Text>}
        {label && <Text style={styles.labelText}>{label}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  labelText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 2,
  },
});
export default AppleRing;
