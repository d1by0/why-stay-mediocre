/**
 * Circle Screen - Friends & Social Sharing
 */
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Share, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '../components/custom/GlassCard';

interface FriendProgress {
  id: string;
  name: string;
  activityPercentage: number; // 0 to 100
  waterOunces: number;
  waterTarget: number;
  journalLogged: boolean;
  streakDays: number;
  lastUpdate: string;
}

export default function CircleScreen() {
  const [friends, setFriends] = useState<FriendProgress[]>([
    {
      id: 'f-1',
      name: 'Sarah Connor',
      activityPercentage: 92,
      waterOunces: 64,
      waterTarget: 80,
      journalLogged: true,
      streakDays: 14,
      lastUpdate: '10m ago',
    },
    {
      id: 'f-2',
      name: 'Marcus Wright',
      activityPercentage: 45,
      waterOunces: 32,
      waterTarget: 100,
      journalLogged: false,
      streakDays: 3,
      lastUpdate: '1h ago',
    },
    {
      id: 'f-3',
      name: 'John Connor',
      activityPercentage: 110, // Overachieved
      waterOunces: 96,
      waterTarget: 96,
      journalLogged: true,
      streakDays: 28,
      lastUpdate: '2m ago',
    }
  ]);

  const [cheeredIds, setCheeredIds] = useState<string[]>([]);

  const handleCheer = async (friendId: string) => {
    if (cheeredIds.includes(friendId)) return;
    
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setCheeredIds((prev) => [...prev, friendId]);
  };

  const handleShareStreak = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    try {
      await Share.share({
        message: 'Checking in on Ambient Habits! I have maintained my daily logging streak for 12 days. Connect with me: AMB-4981-CRT',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.glowTop} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Friends Circle</Text>
          <TouchableOpacity style={styles.shareButton} onPress={handleShareStreak}>
            <Text style={styles.shareButtonText}>Share Code</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <GlassCard style={styles.infoCard}>
            <Text style={styles.infoTitle}>Connect & Elevate</Text>
            <Text style={styles.infoDesc}>
              Track physical movements, hydration limits, and daily entries together. Keep each other motivated with active streaks.
            </Text>
          </GlassCard>

          <Text style={styles.sectionTitle}>Shared Insights</Text>

          {friends.map((friend) => (
            <GlassCard key={friend.id} style={styles.friendCard}>
              <View style={styles.friendHeader}>
                <View>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <Text style={styles.updateText}>Updated {friend.lastUpdate}</Text>
                </View>
                <View style={styles.streakBadge}>
                  <Text style={styles.streakVal}>{friend.streakDays}d Streak</Text>
                </View>
              </View>

              <View style={styles.metricsGrid}>
                <View style={styles.metricCell}>
                  <Text style={styles.metricVal}>{friend.activityPercentage}%</Text>
                  <Text style={styles.metricLabel}>Activity</Text>
                </View>

                <View style={styles.metricCell}>
                  <Text style={styles.metricVal}>
                    {friend.waterOunces}/{friend.waterTarget} oz
                  </Text>
                  <Text style={styles.metricLabel}>Hydration</Text>
                </View>

                <View style={styles.metricCell}>
                  <Text style={[styles.metricVal, friend.journalLogged ? styles.greenText : styles.dimText]}>
                    {friend.journalLogged ? 'Completed' : 'Pending'}
                  </Text>
                  <Text style={styles.metricLabel}>Journal</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.cheerButton, cheeredIds.includes(friend.id) && styles.cheerDisabled]}
                onPress={() => handleCheer(friend.id)}
                disabled={cheeredIds.includes(friend.id)}
              >
                <Text style={styles.cheerText}>
                  {cheeredIds.includes(friend.id) ? 'Cheered!' : 'Cheer Friend'}
                </Text>
              </TouchableOpacity>
            </GlassCard>
          ))}
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
  glowTop: {
    position: 'absolute',
    top: -120,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(99, 102, 241, 0.03)',
    filter: Platform.OS === 'web' ? 'blur(60px)' : undefined,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
  },
  shareButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  shareButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  infoCard: {
    width: '100%',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.6)',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  friendCard: {
    width: '100%',
  },
  friendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  updateText: {
    fontSize: 11,
    color: 'rgba(0, 0, 0, 0.4)',
    marginTop: 2,
  },
  streakBadge: {
    backgroundColor: 'rgba(250, 45, 90, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(250, 45, 90, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  streakVal: {
    color: '#fa2d5a',
    fontSize: 11,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  metricCell: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  metricLabel: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.4)',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  greenText: {
    color: '#10b981',
  },
  dimText: {
    color: 'rgba(0, 0, 0, 0.3)',
  },
  cheerButton: {
    backgroundColor: '#0a84ff',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  cheerDisabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  cheerText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});

