/**
 * Ambient AI Gym & Workout Tracking Main Dashboard
 */
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../hooks/useSession';
import { useWorkoutData } from '../hooks/useWorkoutData';
import { AudioRecorder } from '../components/custom/AudioRecorder';
import { SyncPanel } from '../components/custom/SyncPanel';
import { OverloadPanel } from '../components/custom/OverloadPanel';
import { WorkoutLogCard } from '../components/custom/WorkoutLogCard';
import { GlassCard } from '../components/custom/GlassCard';
import { AI_KEYS } from '../services/aiParser';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const { session, loginWithOAuth, logout } = useSession();
  const { workoutSets, addWorkoutSet, deleteWorkoutSet, clearAllSets, refreshData } = useWorkoutData();
  const [apiKey, setApiKey] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const handleParsedWorkout = (exercise: string, weight: number, reps: number, rpe: number | null) => {
    addWorkoutSet(exercise, weight, reps, rpe);
  };

  const triggerHapticAuth = async (provider: 'apple' | 'google') => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    await loginWithOAuth(provider);
  };

  // Compute stats
  const totalVolume = workoutSets.reduce((sum, s) => sum + s.weight * s.reps, 0);
  const dirtyCount = workoutSets.filter(s => s.isDirty).length;

  if (!session) {
    return (
      <View style={styles.authContainer}>
        {/* Ambient Gradient Glow */}
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <SafeAreaView style={styles.authContent}>
          <View style={styles.heroSection}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=200&auto=format&fit=crop' }}
              style={styles.logoImage}
            />
            <Text style={styles.brandTitle}>AMBIENT GYM</Text>
            <Text style={styles.brandSubtitle}>The AI-First, Local-Offline Fitness Ecosystem</Text>
          </View>

          <GlassCard style={styles.authCard}>
            <Text style={styles.authCardTitle}>Connect Your Profile</Text>
            <Text style={styles.authCardDesc}>
              Securely authenticate to enable cloud backup, cross-device sync, and custom fatigue tracking models.
            </Text>

            <TouchableOpacity
              style={[styles.authButton, styles.appleButton]}
              onPress={() => triggerHapticAuth('apple')}
            >
              <Text style={styles.authButtonText}>Sign in with Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.authButton, styles.googleButton]}
              onPress={() => triggerHapticAuth('google')}
            >
              <Text style={styles.authButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            <Text style={styles.lockInfo}>🔒 Encrypted inside your iPhone's Secure Enclave</Text>
          </GlassCard>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background glow layers */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{session.fullName}</Text>
          </View>

          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.btnSetting} onPress={() => setShowConfig(!showConfig)}>
              <Text style={styles.btnSettingText}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnLogout} onPress={logout}>
              <Text style={styles.btnLogoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Key Configurations Panel */}
          {showConfig && (
            <GlassCard style={styles.configCard}>
              <Text style={styles.configTitle}>API Keys & Services</Text>
              <Text style={styles.configDesc}>
                Provide an OpenAI API key to use live voice transcription. Leave blank to run the offline simulation sandbox mode.
              </Text>
              <TextInput
                style={styles.configInput}
                placeholder="sk-proj-..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={apiKey}
                onChangeText={setApiKey}
                secureTextEntry
              />
              <TouchableOpacity style={styles.btnSaveConfig} onPress={() => setShowConfig(false)}>
                <Text style={styles.btnSaveConfigText}>Close Configuration</Text>
              </TouchableOpacity>
            </GlassCard>
          )}

          {/* Quick Metrics */}
          <View style={styles.statsRow}>
            <GlassCard style={styles.statCell}>
              <Text style={styles.statLabel}>Today's Volume</Text>
              <Text style={styles.statValue}>{totalVolume} lbs</Text>
            </GlassCard>

            <GlassCard style={styles.statCell}>
              <Text style={styles.statLabel}>Sets Logged</Text>
              <Text style={styles.statValue}>{workoutSets.length}</Text>
            </GlassCard>
          </View>

          {/* Voice Intake */}
          <AudioRecorder onParsedWorkout={handleParsedWorkout} openaiKey={apiKey} />

          {/* Overload calculations engine */}
          <OverloadPanel />

          {/* Conflict resolution sync panel */}
          <SyncPanel dirtyCount={dirtyCount} onSyncTriggered={refreshData} />

          {/* Active Workout Logs */}
          <View style={styles.logsSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Workout Logs</Text>
              {workoutSets.length > 0 && (
                <TouchableOpacity onPress={clearAllSets}>
                  <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>

            {workoutSets.length === 0 ? (
              <GlassCard style={styles.emptyCard}>
                <Text style={styles.emptyText}>No workout logs recorded today.</Text>
                <Text style={styles.emptySubtext}>Use the voice recorder or type a log above to get started!</Text>
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
    backgroundColor: '#0a0a0c',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  glowTop: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    filter: Platform.OS === 'web' ? 'blur(60px)' : undefined,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -100,
    right: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(236, 72, 153, 0.12)',
    filter: Platform.OS === 'web' ? 'blur(80px)' : undefined,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
  },
  welcomeText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btnSetting: {
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
  },
  btnSettingText: {
    fontSize: 16,
  },
  btnLogout: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnLogoutText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginVertical: 10,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  configCard: {
    marginVertical: 10,
  },
  configTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  configDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginVertical: 6,
  },
  configInput: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    padding: 10,
    color: '#ffffff',
    fontSize: 13,
    marginBottom: 10,
  },
  btnSaveConfig: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnSaveConfigText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  logsSection: {
    marginTop: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  clearText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  // Auth Screen styles
  authContainer: {
    flex: 1,
    backgroundColor: '#0a0a0c',
    justifyContent: 'center',
  },
  authContent: {
    padding: 24,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 90,
    height: 90,
    borderRadius: 24,
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
    textAlign: 'center',
  },
  authCard: {
    width: '100%',
    padding: 24,
  },
  authCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  authCardDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  authButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  appleButton: {
    backgroundColor: '#ffffff',
  },
  googleButton: {
    backgroundColor: '#4285f4',
  },
  authButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  lockInfo: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    marginTop: 10,
  },
});
