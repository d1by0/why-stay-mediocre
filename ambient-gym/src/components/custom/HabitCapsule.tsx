/**
 * HabitCapsule Component
 * Displays a premium, vertical capsule progress bar inspired by award-winning Apple routines.
 */
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface HabitCapsuleProps {
  title: string;
  progress: number; // 0.0 to 1.0
  color: string;
  backgroundColor: string;
  valueText: string;
  iconText: string;
}

export function HabitCapsule({
  title,
  progress,
  color,
  backgroundColor,
  valueText,
  iconText,
}: HabitCapsuleProps) {
  const percentage = Math.round(progress * 100);
  const heightPercent = `${Math.max(15, Math.min(percentage, 100))}%` as any;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{iconText}</Text>
      
      {/* Vertical Pill Capsule */}
      <View style={[styles.capsuleTrack, { backgroundColor }]}>
        <View style={[styles.capsuleFill, { height: heightPercent, backgroundColor: color }]} />
      </View>

      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.valueText}>{valueText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 70,
  },
  icon: {
    fontSize: 20,
    marginBottom: 8,
  },
  capsuleTrack: {
    width: 24,
    height: 110,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  capsuleFill: {
    width: '100%',
    borderRadius: 12,
  },
  titleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1c1c1e',
    textAlign: 'center',
    marginBottom: 2,
  },
  valueText: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.5)',
    fontWeight: '600',
  },
});
export default HabitCapsule;
