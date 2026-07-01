/**
 * Onboarding Flow Screen
 * Multi-step setup for permissions, focus items, and profile alignment.
 */
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ApplePermissionModal } from '../components/custom/ApplePermissionModal';
import { useSession } from '../hooks/useSession';

export default function OnboardingScreen() {
  const router = useRouter();
  const { loginWithOAuth } = useSession();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [friendCode, setFriendCode] = useState('');
  
  // Selection habits
  const [habits, setHabits] = useState({
    activity: true,
    water: true,
    journal: true,
    custom: false,
  });

  // Permission Modals
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);

  const toggleHabit = (key: keyof typeof habits) => {
    setHabits((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!name.trim()) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // Trigger Health Permission Modal
      setShowHealthModal(true);
    } else if (step === 4) {
      // Complete Onboarding, trigger session login
      await loginWithOAuth('apple');
      
      // Navigate to dashboard
      router.replace('/' as any);
    }
  };

  const handleHealthResolve = (approved: boolean) => {
    setShowHealthModal(false);
    // Show Notification Permission Modal next
    setShowNotifyModal(true);
  };

  const handleNotifyResolve = (approved: boolean) => {
    setShowNotifyModal(false);
    setStep(4);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Step 1: Welcome & Name Setup */}
        {step === 1 && (
          <View style={styles.stepBox}>
            <Text style={styles.header}>Welcome to Ambient Habits</Text>
            <Text style={styles.description}>
              An offline-first daily activity and habit tracker. Connect with friends and build consistent streaks together.
            </Text>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>YOUR NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="Alex Carter"
                placeholderTextColor="rgba(255,255,255,0.25)"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>
        )}

        {/* Step 2: Focus / Habit Selection */}
        {step === 2 && (
          <View style={styles.stepBox}>
            <Text style={styles.header}>Define Your Focus</Text>
            <Text style={styles.description}>
              Select the daily habits you wish to track. These will define your progress dashboard rings.
            </Text>

            <View style={styles.optionList}>
              <TouchableOpacity 
                style={[styles.optionCard, habits.activity && styles.optionCardActive]} 
                onPress={() => toggleHabit('activity')}
              >
                <Text style={styles.optionTitle}>Physical Activity</Text>
                <Text style={styles.optionDesc}>Log steps, movements, active calories, and performance targets.</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.optionCard, habits.water && styles.optionCardActive]} 
                onPress={() => toggleHabit('water')}
              >
                <Text style={styles.optionTitle}>Hydration Tracking</Text>
                <Text style={styles.optionDesc}>Log daily water consumption in ounces or milliliters.</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.optionCard, habits.journal && styles.optionCardActive]} 
                onPress={() => toggleHabit('journal')}
              >
                <Text style={styles.optionTitle}>Daily Mental Journal</Text>
                <Text style={styles.optionDesc}>Use voice ingestion to transcribe mood patterns and summaries.</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 3: Permissions Request Intro */}
        {step === 3 && (
          <View style={styles.stepBox}>
            <Text style={styles.header}>Health & Privacy Consent</Text>
            <Text style={styles.description}>
              We value your local-first ownership. All physical data is saved locally on your device. We request native permissions to sync with Apple HealthKit.
            </Text>
            
            <View style={styles.consentCard}>
              <Text style={styles.consentTitle}>Local-First Philosophy</Text>
              <Text style={styles.consentDesc}>
                We do not send your metrics to private servers without your permission. Sharing is only done with approved friends in your circle.
              </Text>
            </View>
          </View>
        )}

        {/* Step 4: Social Friendship Code */}
        {step === 4 && (
          <View style={styles.stepBox}>
            <Text style={styles.header}>Social Circle Sync</Text>
            <Text style={styles.description}>
              Input a friend's sharing code below to instantly share activity updates, streaks, and motivation logs.
            </Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>FRIEND CODE (OPTIONAL)</Text>
              <TextInput
                style={styles.input}
                placeholder="AMB-9482-SYS"
                placeholderTextColor="rgba(255,255,255,0.25)"
                value={friendCode}
                onChangeText={setFriendCode}
                autoCapitalize="characters"
              />
            </View>
          </View>
        )}

        {/* Navigation Button */}
        <TouchableOpacity 
          style={[styles.actionButton, step === 1 && !name.trim() && styles.buttonDisabled]} 
          onPress={handleNextStep}
          disabled={step === 1 && !name.trim()}
        >
          <Text style={styles.actionButtonText}>
            {step === 4 ? 'Enter Dashboard' : 'Continue'}
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Simulated native permission sheets */}
      <ApplePermissionModal 
        visible={showHealthModal} 
        type="health" 
        onClose={handleHealthResolve} 
      />
      <ApplePermissionModal 
        visible={showNotifyModal} 
        type="notifications" 
        onClose={handleNotifyResolve} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBox: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
    marginBottom: 32,
  },
  inputWrapper: {
    width: '100%',
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    height: 50,
    color: '#000000',
    fontSize: 16,
    paddingHorizontal: 16,
  },
  optionList: {
    width: '100%',
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    borderRadius: 14,
    padding: 16,
  },
  optionCardActive: {
    borderColor: '#0a84ff',
    backgroundColor: 'rgba(10, 132, 255, 0.08)',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.5)',
    lineHeight: 18,
  },
  consentCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    borderRadius: 14,
    padding: 20,
    width: '100%',
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  consentDesc: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#000000',
    width: '100%',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

