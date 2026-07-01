/**
 * OverloadPanel Component
 * Displays the mathematical progressions, e1RM, volume loads, and computes next targets.
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { GlassCard } from './GlassCard';
import { calculateEstimated1RM, calculateNextTargetWeight, RecoveryMetrics } from '../../services/overloadEngine';

export function OverloadPanel() {
  const [weight, setWeight] = useState('225');
  const [actualReps, setActualReps] = useState('5');
  const [targetReps, setTargetReps] = useState('5');
  const [rpe, setRpe] = useState('9');
  
  // Recovery parameters
  const [sleep, setSleep] = useState(85);
  const [soreness, setSoreness] = useState<'minimal' | 'moderate' | 'elevated'>('minimal');
  const [days, setDays] = useState(1);
  const [isDeload, setIsDeload] = useState(false);

  // Computed values
  const [e1rm, setE1rm] = useState(0);
  const [nextWeight, setNextWeight] = useState(0);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const w = parseFloat(weight) || 0;
    const r = parseInt(actualReps, 10) || 0;
    const tr = parseInt(targetReps, 10) || 0;
    const rp = parseFloat(rpe) || 0;

    // e1RM Brzycki
    const calculatedE1rm = calculateEstimated1RM(w, r);
    setE1rm(Math.round(calculatedE1rm * 10) / 10);

    // Volume
    setVolume(w * r);

    // Next Target Weight
    const metrics: RecoveryMetrics = {
      sleepQuality: sleep,
      muscleSoreness: soreness,
      consecutiveTrainingDays: days,
      isDeload,
    };
    const nextTarget = calculateNextTargetWeight(w, r, tr, rp, metrics);
    setNextWeight(nextTarget);
  }, [weight, actualReps, targetReps, rpe, sleep, soreness, days, isDeload]);

  const toggleSoreness = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.selectionAsync();
    }
    setSoreness((current) => {
      if (current === 'minimal') return 'moderate';
      if (current === 'moderate') return 'elevated';
      return 'minimal';
    });
  };

  return (
    <GlassCard style={styles.container}>
      <Text style={styles.header}>Progressive Overload Adaptation</Text>

      {/* Primary workout logs */}
      <View style={styles.inputRow}>
        <View style={styles.inputCol}>
          <Text style={styles.label}>Weight</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="225"
            placeholderTextColor="rgba(255,255,255,0.3)"
          />
        </View>

        <View style={styles.inputCol}>
          <Text style={styles.label}>Reps</Text>
          <TextInput
            style={styles.input}
            value={actualReps}
            onChangeText={setActualReps}
            keyboardType="numeric"
            placeholder="5"
            placeholderTextColor="rgba(255,255,255,0.3)"
          />
        </View>

        <View style={styles.inputCol}>
          <Text style={styles.label}>Target</Text>
          <TextInput
            style={styles.input}
            value={targetReps}
            onChangeText={setTargetReps}
            keyboardType="numeric"
            placeholder="5"
            placeholderTextColor="rgba(255,255,255,0.3)"
          />
        </View>

        <View style={styles.inputCol}>
          <Text style={styles.label}>RPE</Text>
          <TextInput
            style={styles.input}
            value={rpe}
            onChangeText={setRpe}
            keyboardType="numeric"
            placeholder="9"
            placeholderTextColor="rgba(255,255,255,0.3)"
          />
        </View>
      </View>

      {/* Recovery variables */}
      <Text style={styles.subHeader}>Fatigue & Recovery Inputs</Text>
      
      <View style={styles.recoveryRow}>
        <TouchableOpacity style={styles.optionButton} onPress={toggleSoreness}>
          <Text style={styles.optionText}>Soreness: {soreness}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionButton, isDeload && styles.activeOption]} 
          onPress={() => setIsDeload(!isDeload)}
        >
          <Text style={styles.optionText}>{isDeload ? 'Deload: ON' : 'Deload: OFF'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sliderRow}>
        <View style={styles.sliderCol}>
          <Text style={styles.label}>Sleep Quality: {sleep}%</Text>
          <View style={styles.btnGroup}>
            <TouchableOpacity style={styles.btnMini} onPress={() => setSleep(Math.max(40, sleep - 10))}><Text style={styles.btnMiniText}>-</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btnMini} onPress={() => setSleep(Math.min(100, sleep + 10))}><Text style={styles.btnMiniText}>+</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.sliderCol}>
          <Text style={styles.label}>Training Days: {days}</Text>
          <View style={styles.btnGroup}>
            <TouchableOpacity style={styles.btnMini} onPress={() => setDays(Math.max(0, days - 1))}><Text style={styles.btnMiniText}>-</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btnMini} onPress={() => setDays(Math.min(7, days + 1))}><Text style={styles.btnMiniText}>+</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Mathematical Adaptation Outputs */}
      <View style={styles.outputsBox}>
        <View style={styles.outputCell}>
          <Text style={styles.outLabel}>Volume Load</Text>
          <Text style={styles.outValue}>{volume} lbs</Text>
        </View>

        <View style={styles.outputCell}>
          <Text style={styles.outLabel}>Estimated 1RM</Text>
          <Text style={styles.outValue}>{e1rm} lbs</Text>
        </View>

        <View style={[styles.outputCell, styles.primaryOutput]}>
          <Text style={[styles.outLabel, { color: '#a5b4fc' }]}>Next Target Weight</Text>
          <Text style={[styles.outValue, { color: '#818cf8', fontSize: 22 }]}>{nextWeight} lbs</Text>
        </View>
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
    color: '#ffffff',
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  inputCol: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    height: 38,
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  recoveryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  optionButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeOption: {
    borderColor: '#818cf8',
    backgroundColor: 'rgba(129, 140, 248, 0.15)',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  sliderRow: {
    flexDirection: 'row',
    gap: 16,
  },
  sliderCol: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  btnGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  btnMini: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnMiniText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  outputsBox: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
  },
  outputCell: {
    flex: 1,
    alignItems: 'center',
  },
  primaryOutput: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.1)',
  },
  outLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  outValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
export default OverloadPanel;
