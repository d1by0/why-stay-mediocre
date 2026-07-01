/**
 * Apple Health-Inspired Ambient Habit Dashboard
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { AppleRing } from '../components/custom/AppleRing';
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
  const [waterOunces, setWaterOunces] = useState(0);
  const waterTarget = 80; // 80 oz target

  // API config state
  const [apiKey, setApiKey] = useState('');
  const [showConfig, setShowConfig] = useState(false);

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

  const handleLogWater = async (amount: number) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setWaterOunces((prev) => Math.min(prev + amount, 120));
  };

  const handleClearWater = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    setWaterOunces(0);
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
      <View style={styles.glowTop} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.dateLabel}>THURSDAY, JULY 2</Text>
            <Text style={styles.headerTitle}>Summary</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.configButton} onPress={() => setShowConfig(!showConfig)}>
              <Text style={styles.configButtonText}>⚙️</Text>
            </TouchableOpacity>
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

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Key Configurations Panel */}
          {showConfig && (
            <GlassCard style={styles.configCard}>
              <Text style={styles.configHeader}>API Credentials</Text>
              <Text style={styles.configText}>
                Provide an OpenAI API key to process voice transcriptions. Leave blank to run simulated voice logs.
              </Text>
              <TextInput
                style={styles.configInput}
                placeholder="sk-proj-..."
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={apiKey}
                onChangeText={setApiKey}
                secureTextEntry
              />
              <TouchableOpacity style={styles.configSave} onPress={() => setShowConfig(false)}>
                <Text style={styles.configSaveText}>Done</Text>
              </TouchableOpacity>
            </GlassCard>
          )}

          {/* Concentric rings metrics */}
          <GlassCard style={styles.ringsCard}>
            <Text style={styles.cardHeader}>Daily Activity Rings</Text>
            <View style={styles.ringsContainer}>
              <AppleRing 
                progress={activeCaloriesBurned / calorieTarget} 
                color="#fa2d5a" // Pink
                backgroundColor="rgba(250, 45, 90, 0.15)"
                value={`${Math.round(activeCaloriesBurned)}`}
                label="Cal"
                size={84}
                strokeWidth={9}
              />
              <AppleRing 
                progress={waterOunces / waterTarget} 
                color="#00a2ff" // Cyan
                backgroundColor="rgba(0, 162, 255, 0.15)"
                value={`${waterOunces}`}
                label="oz"
                size={84}
                strokeWidth={9}
              />
              <AppleRing 
                progress={journalProgress} 
                color="#af52de" // Purple
                backgroundColor="rgba(175, 82, 222, 0.15)"
                value={journalProgress > 0 ? 'Log' : 'No'}
                label="Diary"
                size={84}
                strokeWidth={9}
              />
            </View>
          </GlassCard>

          {/* Hydration Logger */}
          <GlassCard style={styles.waterCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.cardHeader}>Hydration</Text>
              {waterOunces > 0 && (
                <TouchableOpacity onPress={handleClearWater}>
                  <Text style={styles.clearText}>Reset</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.waterTotal}>{waterOunces} oz of {waterTarget} oz target</Text>
            
            <View style={styles.waterLogButtons}>
              <TouchableOpacity style={styles.waterBtn} onPress={() => handleLogWater(8)}>
                <Text style={styles.waterBtnText}>+8 oz</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.waterBtn} onPress={() => handleLogWater(16)}>
                <Text style={styles.waterBtnText}>+16 oz</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.waterBtn} onPress={() => handleLogWater(24)}>
                <Text style={styles.waterBtnText}>+24 oz</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Voice Intake */}
          <AudioRecorder onParsedWorkout={addWorkoutSet} openaiKey={apiKey} />

          {/* Overload calculation engine */}
          <OverloadPanel />

          {/* Sync engine conflict resolver */}
          <SyncPanel dirtyCount={dirtyCount} onSyncTriggered={refreshData} />

          {/* Logged Workouts List */}
          <View style={styles.logsSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.logsHeader}>Physical Activities</Text>
              {workoutSets.length > 0 && (
                <TouchableOpacity onPress={clearAllSets}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {workoutSets.length === 0 ? (
              <GlassCard style={styles.emptyCard}>
                <Text style={styles.emptyText}>No activities logged today.</Text>
                <Text style={styles.emptySubtext}>Use the voice recorder above to capture a physical workout set.</Text>
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
    backgroundColor: '#f2f2f7',
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f2f2f7',
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
    backgroundColor: 'rgba(250, 45, 90, 0.03)',
    filter: Platform.OS === 'web' ? 'blur(80px)' : undefined,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.4)',
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  configButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 8,
  },
  configButtonText: {
    fontSize: 16,
  },
  resetAuthButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resetAuthText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '600',
  },
  configCard: {
    width: '100%',
  },
  configHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  configText: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
    marginVertical: 8,
    lineHeight: 16,
  },
  configInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 10,
    color: '#000000',
    fontSize: 13,
    marginBottom: 10,
  },
  configSave: {
    backgroundColor: '#000000',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  configSaveText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  ringsCard: {
    width: '100%',
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  ringsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  waterCard: {
    width: '100%',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clearText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  waterTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00a2ff',
    marginBottom: 16,
  },
  waterLogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  waterBtn: {
    flex: 1,
    backgroundColor: 'rgba(0, 162, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 162, 255, 0.2)',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  waterBtnText: {
    color: '#00a2ff',
    fontSize: 13,
    fontWeight: '700',
  },
  logsSection: {
    marginTop: 8,
  },
  logsHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 14,
  },
  emptySubtext: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
});
