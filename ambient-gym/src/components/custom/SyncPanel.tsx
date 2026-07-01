/**
 * SyncPanel Component
 * Demonstrates local-first database status, sync queues, and allows simulation of 3-way merges.
 */
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { GlassCard } from './GlassCard';
import { resolveThreeWayMerge, SyncRecord } from '../../services/syncEngine';

interface SyncPanelProps {
  dirtyCount: number;
  onSyncTriggered: () => void;
}

export function SyncPanel({ dirtyCount, onSyncTriggered }: SyncPanelProps) {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  
  // States for interactive conflict resolution simulation
  const [showDemo, setShowDemo] = useState(false);
  const [ancestor, setAncestor] = useState<SyncRecord>({
    id: 'demo-set',
    weight: 225,
    reps: 8,
    rpe: 8,
    updatedAt: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
  });

  const [client, setClient] = useState<SyncRecord>({
    id: 'demo-set',
    weight: 230, // Client increased weight
    reps: 8,
    rpe: 8.5,    // Client increased RPE
    updatedAt: new Date().toISOString(),
  });

  const [server, setServer] = useState<SyncRecord>({
    id: 'demo-set',
    weight: 225,
    reps: 10,   // Server increased reps
    rpe: 9,     // Server increased RPE (with later timestamp)
    updatedAt: new Date(Date.now() - 30 * 1000).toISOString(), // 30 seconds ago
  });

  const [mergeResult, setMergeResult] = useState<SyncRecord | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Simulate server synchronization delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setLastSync(new Date().toLocaleTimeString());
    setSyncing(false);
    onSyncTriggered();

    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const runMergeSimulation = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    const resolved = resolveThreeWayMerge(ancestor, client, server);
    setMergeResult(resolved);
  };

  return (
    <GlassCard style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Sync & Local Persistence</Text>
        <View style={[styles.badge, dirtyCount > 0 ? styles.badgeDirty : styles.badgeClean]}>
          <Text style={styles.badgeText}>{dirtyCount > 0 ? `${dirtyCount} Dirty` : 'Synced'}</Text>
        </View>
      </View>

      <Text style={styles.details}>
        SQLite is saving local updates instantly. {dirtyCount > 0 ? `${dirtyCount} rows are queued for cloud synchronisation.` : 'Database is fully aligned with Supabase.'}
      </Text>

      <TouchableOpacity
        style={[styles.syncButton, syncing && styles.syncDisabled]}
        onPress={handleSync}
        disabled={syncing}
      >
        <Text style={styles.syncButtonText}>{syncing ? 'Syncing...' : 'Sync Database Now'}</Text>
      </TouchableOpacity>

      {lastSync && <Text style={styles.timestamp}>Last synced at: {lastSync}</Text>}

      <TouchableOpacity style={styles.demoToggle} onPress={() => setShowDemo(!showDemo)}>
        <Text style={styles.demoToggleText}>
          {showDemo ? 'Hide 3-Way Merge Simulation' : 'Inspect 3-Way Merge Simulator'}
        </Text>
      </TouchableOpacity>

      {showDemo && (
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Interactive 3-Way Conflict Simulator</Text>
          <Text style={styles.demoDesc}>
            Simulate a concurrent write conflict. Below is an ancestor record, and two divergent edits made by client and server.
          </Text>

          <View style={styles.flowRow}>
            {/* Ancestor */}
            <View style={styles.cardCol}>
              <Text style={styles.colHeader}>Ancestor (Base)</Text>
              <Text style={styles.colText}>Weight: {ancestor.weight} lbs</Text>
              <Text style={styles.colText}>Reps: {ancestor.reps}</Text>
              <Text style={styles.colText}>RPE: {ancestor.rpe}</Text>
            </View>

            {/* Client State */}
            <View style={styles.cardCol}>
              <Text style={[styles.colHeader, { color: '#818cf8' }]}>Client (You)</Text>
              <Text style={styles.colText}>Weight: <Text style={styles.highlight}>{client.weight}</Text></Text>
              <Text style={styles.colText}>Reps: {client.reps}</Text>
              <Text style={styles.colText}>RPE: <Text style={styles.highlight}>{client.rpe}</Text></Text>
            </View>

            {/* Server State */}
            <View style={styles.cardCol}>
              <Text style={[styles.colHeader, { color: '#fb7185' }]}>Server (Cloud)</Text>
              <Text style={styles.colText}>Weight: {server.weight}</Text>
              <Text style={styles.colText}>Reps: <Text style={styles.highlight}>{server.reps}</Text></Text>
              <Text style={styles.colText}>RPE: <Text style={styles.highlight}>{server.rpe}</Text></Text>
            </View>
          </View>

          <TouchableOpacity style={styles.mergeButton} onPress={runMergeSimulation}>
            <Text style={styles.mergeButtonText}>Execute 3-Way Merge</Text>
          </TouchableOpacity>

          {mergeResult && (
            <View style={styles.resultBox}>
              <Text style={styles.resultHeader}>Merged Outcome</Text>
              <Text style={styles.resultText}>Weight: <Text style={styles.resVal}>{mergeResult.weight}</Text> (From Client - only client changed)</Text>
              <Text style={styles.resultText}>Reps: <Text style={styles.resVal}>{mergeResult.reps}</Text> (From Server - only server changed)</Text>
              <Text style={styles.resultText}>RPE: <Text style={styles.resVal}>{mergeResult.rpe}</Text> (From Client - LWW applied due to higher timestamp)</Text>
            </View>
          )}
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeDirty: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  badgeClean: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000000',
  },
  details: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 18,
    marginBottom: 16,
  },
  syncButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  syncDisabled: {
    opacity: 0.5,
  },
  syncButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.4)',
    textAlign: 'center',
    marginTop: 8,
  },
  demoToggle: {
    marginTop: 16,
    alignSelf: 'center',
  },
  demoToggleText: {
    color: '#4f46e5',
    fontSize: 13,
    fontWeight: '500',
  },
  demoBox: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: 16,
  },
  demoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
  },
  demoDesc: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 12,
  },
  flowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  cardCol: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 8,
  },
  colHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.4)',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  colText: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 4,
  },
  highlight: {
    fontWeight: '700',
    color: '#10b981',
  },
  mergeButton: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  mergeButtonText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '600',
  },
  resultBox: {
    marginTop: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  resultHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 12,
    color: '#333333',
    lineHeight: 16,
  },
  resVal: {
    fontWeight: '700',
    color: '#10b981',
  },
});
