/**
 * WorkoutLogCard Component
 * Displays a single set logged in the system with elegant layouts and soft-delete features.
 */
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { GlassCard } from './GlassCard';

interface WorkoutLogCardProps {
  id: string;
  exerciseName: string;
  weight: number;
  reps: number;
  rpe: number | null;
  updatedAt: string;
  isDirty?: boolean;
  onDelete: (id: string) => void;
}

export function WorkoutLogCard({
  id,
  exerciseName,
  weight,
  reps,
  rpe,
  updatedAt,
  isDirty,
  onDelete,
}: WorkoutLogCardProps) {
  const timeString = new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <GlassCard style={styles.card}>
      <View style={styles.container}>
        <View style={styles.leftCol}>
          <Text style={styles.exerciseTitle}>{exerciseName}</Text>
          <Text style={styles.timeText}>{timeString}</Text>
        </View>
        
        <View style={styles.midCol}>
          <View style={styles.metricCell}>
            <Text style={styles.metricVal}>{weight}</Text>
            <Text style={styles.metricLbl}>lbs</Text>
          </View>
          <View style={styles.metricCell}>
            <Text style={styles.metricVal}>{reps}</Text>
            <Text style={styles.metricLbl}>reps</Text>
          </View>
          {rpe !== null && (
            <View style={styles.metricCell}>
              <Text style={[styles.metricVal, { color: '#fbbf24' }]}>{rpe}</Text>
              <Text style={styles.metricLbl}>RPE</Text>
            </View>
          )}
        </View>

        <View style={styles.rightCol}>
          {isDirty && (
            <View style={styles.syncIndicator}>
              <Text style={styles.syncText}>Pending Sync</Text>
            </View>
          )}
          <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(id)}>
            <Text style={styles.deleteText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 2,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  timeText: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.4)',
    marginTop: 2,
  },
  midCol: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricCell: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  metricLbl: {
    fontSize: 9,
    color: 'rgba(0,0,0,0.4)',
    textTransform: 'uppercase',
  },
  rightCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  syncIndicator: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    borderWidth: 1,
    borderColor: '#fbbf24',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  syncText: {
    fontSize: 8,
    color: '#fbbf24',
    fontWeight: '600',
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
});
export default WorkoutLogCard;
