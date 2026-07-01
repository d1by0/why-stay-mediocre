/**
 * Explore Screen - Unified Ambient Gym User Guide & Technical Reference
 */
import React from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../components/custom/GlassCard';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.glowTop} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>System Architecture</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <GlassCard style={styles.card}>
            <Text style={styles.cardHeader}>Ambient AI Intake Pipeline</Text>
            <Text style={styles.cardText}>
              The application processes voice clips through a dual-stage cloud execution engine.
            </Text>
            <View style={styles.stepRow}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
              <View style={styles.stepBody}>
                <Text style={styles.stepTitle}>Whisper Speech-to-Text</Text>
                <Text style={styles.stepDesc}>Transcribes 16kHz mono audio logs, using prompts optimized for fitness terminologies (RPE, RIR, lift names).</Text>
              </View>
            </View>
            
            <View style={styles.stepRow}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
              <View style={styles.stepBody}>
                <Text style={styles.stepTitle}>LLM Semantic JSON Extraction</Text>
                <Text style={styles.stepDesc}>Uses strict guided schemas to output JSON matching SQLite column types, creating profile keys instantly.</Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard style={styles.card}>
            <Text style={styles.cardHeader}>Progressive Overload Math</Text>
            <Text style={styles.formulaLabel}>Estimated One-Rep Max (e1RM)</Text>
            <Text style={styles.formulaCode}>e1RM = Weight × (37 - Reps) / 36</Text>

            <Text style={styles.formulaLabel}>Adaptive Target Calculation</Text>
            <Text style={styles.formulaCode}>w_next = δ × w_current × (1 + β × (r_actual - r_target + RIR))</Text>

            <Text style={styles.formulaLabel}>Fatigue Adaptation Scale (δ)</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}><Text style={styles.tableLeft}>High (≥85% sleep, minimal soreness)</Text><Text style={styles.tableRight}>1.025</Text></View>
              <View style={styles.tableRow}><Text style={styles.tableLeft}>Optimal (stable adaptation)</Text><Text style={styles.tableRight}>1.000</Text></View>
              <View style={styles.tableRow}><Text style={styles.tableLeft}>Compromised (&lt;60% sleep, sore)</Text><Text style={styles.tableRight}>0.950</Text></View>
              <View style={styles.tableRow}><Text style={styles.tableLeft}>Elevated Fatigue / Deload</Text><Text style={styles.tableRight}>0.900 / 0.600</Text></View>
            </View>
          </GlassCard>

          <GlassCard style={styles.card}>
            <Text style={styles.cardHeader}>3-Way Merge Conflict Resolution</Text>
            <Text style={styles.cardText}>
              Protects workout data integrity when changes are made offline on the local SQLite client concurrently with remote PostgreSQL records.
            </Text>
            <Text style={styles.subLabel}>Resolution Policies:</Text>
            <Bullet point="Disjoint modifications: Merged seamlessly across columns." />
            <Bullet point="Overlapping column modifications: Handled by Last-Write-Wins (LWW) timestamp comparisons." />
            <Bullet point="Soft deletes: Managed by the is_deleted flag." />
          </GlassCard>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Bullet({ point }: { point: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletSymbol}>•</Text>
      <Text style={styles.bulletText}>{point}</Text>
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
  glowTop: {
    position: 'absolute',
    top: -120,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    filter: Platform.OS === 'web' ? 'blur(60px)' : undefined,
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    width: '100%',
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 18,
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  stepBody: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  stepDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 16,
    marginTop: 2,
  },
  formulaLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    marginTop: 10,
    marginBottom: 4,
  },
  formulaCode: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    color: '#a5b4fc',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  table: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  tableLeft: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  tableRight: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34d399',
  },
  subLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  bulletSymbol: {
    color: '#818cf8',
    fontSize: 16,
    lineHeight: 16,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 16,
  },
});
