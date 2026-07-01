/**
 * AudioRecorder Component
 * Captures user voice workout logs, coordinates with the AI semantic parsing engine,
 * and executes native haptic responses.
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, TextInput, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { GlassCard } from './GlassCard';
import { parseWorkoutVoiceInput } from '../../services/aiParser';

interface AudioRecorderProps {
  onParsedWorkout: (exercise: string, weight: number, reps: number, rpe: number | null) => void;
  openaiKey?: string;
}

export function AudioRecorder({ onParsedWorkout, openaiKey }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [manualText, setManualText] = useState('');
  const [pulseScale, setPulseScale] = useState(1);

  // Timer loop during recording
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
        // Micro-animation pulsing
        setPulseScale((scale) => (scale === 1 ? 1.25 : 1));
      }, 1000);
    } else {
      setSeconds(0);
      setPulseScale(1);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = async () => {
    setIsRecording(true);
    // Haptics for Selection tap
    if (Platform.OS !== 'web') {
      await Haptics.selectionAsync();
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Impact haptics confirming end of recording
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      // Parse using AI module (simulates file upload or processes mock payload)
      const res = await parseWorkoutVoiceInput(null, undefined, openaiKey);
      
      if (res.success && res.parsedSets.length > 0) {
        setTranscript(res.rawTranscript);
        // Populate first parsed workout
        const first = res.parsedSets[0];
        onParsedWorkout(first.exercise, first.weight, first.reps, first.rpe);
        
        if (Platform.OS !== 'web') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualText.trim()) return;
    setIsProcessing(true);
    
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      const res = await parseWorkoutVoiceInput(null, manualText, openaiKey);
      if (res.success && res.parsedSets.length > 0) {
        setTranscript(res.rawTranscript);
        const first = res.parsedSets[0];
        onParsedWorkout(first.exercise, first.weight, first.reps, first.rpe);
        setManualText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <GlassCard style={styles.container}>
      <Text style={styles.header}>Voice Workout Intake</Text>
      
      <View style={styles.recorderWrapper}>
        {isRecording ? (
          <TouchableOpacity
            style={[styles.recordButton, styles.recordingActive, { transform: [{ scale: pulseScale }] }]}
            onPress={handleStopRecording}
          >
            <View style={styles.stopIcon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.recordButton}
            onPress={handleStartRecording}
            disabled={isProcessing}
          >
            <View style={styles.recordIcon} />
          </TouchableOpacity>
        )}

        <Text style={styles.statusText}>
          {isRecording
            ? `Recording... 00:${seconds < 10 ? '0' + seconds : seconds}`
            : isProcessing
            ? 'Whisper & GPT transcribing...'
            : 'Tap mic and speak workout (e.g. "Squat, 315 lbs for 5 reps, RPE 9")'}
        </Text>
      </View>

      {isProcessing && <ActivityIndicator color="#6366f1" size="small" style={styles.spinner} />}

      {transcript ? (
        <View style={styles.transcriptBox}>
          <Text style={styles.transcriptLabel}>AI Parsed Text:</Text>
          <Text style={styles.transcriptText}>{transcript}</Text>
        </View>
      ) : null}

      <View style={styles.manualInputWrapper}>
        <TextInput
          placeholder="Or type workout log here..."
          placeholderTextColor="rgba(0,0,0,0.35)"
          value={manualText}
          onChangeText={setManualText}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleManualSubmit}
          disabled={isProcessing}
        >
          <Text style={styles.sendButtonText}>Parse</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  recorderWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  recordButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: 10,
  },
  recordingActive: {
    backgroundColor: '#dc2626',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  recordIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  stopIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  statusText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  spinner: {
    marginVertical: 8,
  },
  transcriptBox: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  transcriptLabel: {
    fontSize: 11,
    color: '#4f46e5',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  transcriptText: {
    fontSize: 14,
    color: '#000000',
    marginTop: 2,
  },
  manualInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    height: 40,
    color: '#000000',
    fontSize: 14,
    paddingHorizontal: 8,
  },
  sendButton: {
    backgroundColor: '#000000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});
