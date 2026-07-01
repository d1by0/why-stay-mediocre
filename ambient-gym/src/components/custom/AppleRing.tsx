/**
 * AppleRing Component (Light Theme / iOS Health Optimized)
 * Renders circular progress rings using explicit cross-platform layouts.
 */
import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface AppleRingProps {
  progress: number; // 0.0 to 1.0
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  value?: string;
}

export function AppleRing({
  progress,
  size = 90,
  strokeWidth = 9,
  color = '#FF8E8E', // Coral pink
  backgroundColor = '#FDF0F0',
  label,
  value,
}: AppleRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const boundedProgress = Math.max(0, Math.min(progress, 1));
  const strokeDashoffset = circumference - boundedProgress * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Arc */}
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
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {/* Centered Labels */}
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
  svg: {
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1c1c1e',
  },
  labelText: {
    fontSize: 9,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
export default AppleRing;
