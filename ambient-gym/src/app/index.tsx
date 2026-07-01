/**
 * Premium Apple Routines-Inspired Daily Habit Tracker
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { HabitCapsule } from '../components/custom/HabitCapsule';
import { AudioRecorder } from '../components/custom/AudioRecorder';
import { SyncPanel } from '../components/custom/SyncPanel';
import { OverloadPanel } from '../components/custom/OverloadPanel';
import { WorkoutLogCard } from '../components/custom/WorkoutLogCard';
import { GlassCard } from '../components/custom/GlassCard';
import { useWorkoutData } from '../hooks/useWorkoutData';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { workoutSets, addWorkoutSet, deleteWorkoutSet, clearAllSets, refreshData } = useWorkoutData();
  
  // Hydration state
  const [waterOunces, setWaterOunces] = useState(32);
  const waterTarget = 80;

  // Selected Day Timeline
  const [selectedDay, setSelectedDay] = useState('Thu');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Check auth status on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const token = Platform.OS === 'web' 
          ? localStorage.getItem('ambient_gym_jwt_token')
          : await SecureStore.getItemAsync('ambient_gym_jwt_token');

        if (!token) {
          router.replace('/onboarding' as any);
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error(err);
        router.replace('/onboarding' as any);
      }
    }
    checkAuth();
  }, []);

  const handleAdjustWater = async (amount: number) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setWaterOunces((prev) => Math.max(0, Math.min(prev + amount, 120)));
  };

  // Calculations
  const activeCaloriesBurned = workoutSets.reduce((sum, s) => sum + (s.weight * s.reps * 0.1), 0);
  const calorieTarget = 400;
  const journalProgress = workoutSets.length > 0 ? 1.0 : 0.0;
  const dirtyCount = workoutSets.filter(s => s.isDirty).length;

  if (isAuthenticated === null) {
    return <View style={styles.loadingContainer} />;
  }

  return (
    <View style={styles.container}>
      {/* Background glow layers with pointerEvents="none" to prevent click interception */}
      <View style={styles.glowTop} pointerEvents="none" />
      <View style={styles.glowBottom} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.dateLabel}>MAY 2026</Text>
            <Text style={styles.headerTitle}>Daily Habits</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.resetAuthButton} 
              onPress={async () => {
                if (Platform.OS === 'web') {
                  localStorage.removeItem('ambient_gym_jwt_token');
                } else {
                  await SecureStore.deleteItemAsync('ambient_gym_jwt_token');
                }
                router.replace('/onboarding' as any);
              }}
            >
              <Text style={styles.resetAuthText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Calendar Horizontal Bar */}
        <View style={styles.calendarBar}>
          {days.map((d) => {
            const isSelected = d === selectedDay;
            return (
              <TouchableOpacity
                key={d}
                style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
                onPress={() => setSelectedDay(d)}
              >
                <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                  {d}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* routines timeline vertical capsules */}
          <GlassCard style={styles.timelineCard}>
            <Text style={styles.sectionHeader}>Routines & Completion</Text>
            <View style={styles.capsuleRow}>
              <HabitCapsule
                title="Activity"
                progress={activeCaloriesBurned / calorieTarget}
                color="#FF8E8E" // Coral Pink
                backgroundColor="#FFF0F0"
                valueText={`${Math.round(activeCaloriesBurned)} kcal`}
                iconText="🏃"
              />
              <HabitCapsule
                title="Hydration"
                progress={waterOunces / waterTarget}
                color="#79C2EC" // Pastel Blue
                backgroundColor="#EBF5FC"
                valueText={`${waterOunces} oz`}
                iconText="💧"
              />
              <HabitCapsule
                title="Journal"
                progress={journalProgress}
                color="#BCA0E6" // Lavender
                backgroundColor="#F3EEFA"
                valueText={journalProgress > 0 ? 'Logged' : 'Pending'}
                iconText="✍️"
              />
            </View>
          </GlassCard>

          {/* Stepper Hydration Card */}
          <GlassCard style={styles.waterCard}>
            <Text style={styles.cardHeader}>Hydration Level</Text>
            <Text style={styles.waterTotal}>{waterOunces} oz of {waterTarget} oz target</Text>
            
            <View style={styles.stepperContainer}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => handleAdjustWater(-8)}>
                <Text style={styles.stepBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.stepperLabel}>
                <Text style={styles.stepperQty}>8 oz</Text>
                <Text style={styles.stepperUnit}>increments</Text>
              </View>
              <TouchableOpacity style={styles.stepBtn} onPress={() => handleAdjustWater(8)}>
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Voice Intake */}
          <AudioRecorder onParsedWorkout={addWorkoutSet} />

          {/* Overload adaptation details */}
          <OverloadPanel />

          {/* Sync conflicts resolver */}
          <SyncPanel dirtyCount={dirtyCount} onSyncTriggered={refreshData} />

          {/* Activity Logs */}
          <View style={styles.logsSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.logsHeader}>Daily Logbook</Text>
              {workoutSets.length > 0 && (
                <TouchableOpacity onPress={clearAllSets}>
                  <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>

            {workoutSets.length === 0 ? (
              <GlassCard style={styles.emptyCard}>
                <Text style={styles.emptyText}>No routine activities logged.</Text>
                <Text style={styles.emptySubtext}>Use the voice recorder above to add an activity log.</Text>
              </GlassCard>
            ) : (
              workoutSets.map((set) => (
                <WorkoutLogCard
                  key={set.id}
                  id={set.id}
                  exerciseName={set.exerciseName || 'Unknown'}
                  weight={set.weight}
                  reps={set.reps}
                  rpe={set.rpe}
                  updatedAt={set.updatedAt}
                  isDirty={set.isDirty}
                  onDelete={deleteWorkoutSet}
                />
              ))
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6F6', // Blush Warm Pale Pink
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FCF6F6',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  glowTop: {
    position: 'absolute',
    top: -120,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255, 142, 142, 0.08)',
    filter: Platform.OS === 'web' ? 'blur(80px)' : undefined,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -120,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(121, 194, 236, 0.06)',
    filter: Platform.OS === 'web' ? 'blur(80px)' : undefined,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fa2d5a', // iOS Red/Pink
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1c1c1e',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetAuthButton: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resetAuthText: {
    color: '#1c1c1e',
    fontSize: 11,
    fontWeight: '700',
  },
  calendarBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#FF8E8E', // Selected coral background
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.5)',
  },
  dayTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  timelineCard: {
    width: '100%',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1c1c1e',
    marginBottom: 16,
  },
  capsuleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  waterCard: {
    width: '100%',
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1c1c1e',
    marginBottom: 10,
  },
  waterTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#79C2EC',
    marginBottom: 16,
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 22,
    color: '#1c1c1e',
    fontWeight: 'bold',
  },
  stepperLabel: {
    alignItems: 'center',
  },
  stepperQty: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1c1c1e',
  },
  stepperUnit: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.4)',
    textTransform: 'uppercase',
  },
  logsSection: {
    marginTop: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logsHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1c1c1e',
  },
  clearText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#1c1c1e',
    fontWeight: '700',
    fontSize: 14,
  },
  emptySubtext: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
});
