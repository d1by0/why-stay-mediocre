/**
 * Custom Frosted Glass Sidebar Drawer Panel
 * Renders an overlay navigation drawer featuring user details, navigation links, and dynamic telemetry metrics.
 */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Animated, Dimensions, TouchableOpacity, Image, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useSession } from '../../hooks/useSession';
import { DB } from '../../database/client';

interface CustomGlassDrawerContentProps {
  visible: boolean;
  onClose: () => void;
}

export function CustomGlassDrawerContent({ visible, onClose }: CustomGlassDrawerContentProps) {
  const router = useRouter();
  const { session, logout } = useSession();
  const [slideAnim] = useState(new Animated.Value(Dimensions.get('window').width));
  const [metrics, setMetrics] = useState({
    workouts: 0,
    totalVolume: 0,
    streak: 14,
  });

  // Slide animation trigger
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // Aggregate database telemetry metrics on load
  useEffect(() => {
    if (!visible) return;

    async function loadMetrics() {
      try {
        const sets = await DB.getWorkoutSets();
        const todayStr = new Date().toISOString().split('T')[0];
        const todaySets = sets.filter(s => s.updatedAt.startsWith(todayStr));

        // Aggregate unique exercises logged today
        const uniqueExercises = new Set(todaySets.map(s => s.exerciseId));
        // Aggregate cumulative weight volume
        const volume = todaySets.reduce((sum, s) => sum + (s.weight * s.reps), 0);

        setMetrics({
          workouts: uniqueExercises.size,
          totalVolume: volume,
          streak: 14, // Hardcoded standard target consistent with mockups
        });
      } catch (err) {
        console.error('Failed to query sidebar telemetry: ', err);
      }
    }
    loadMetrics();
  }, [visible]);

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path as any);
  };

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop Tap to Close */}
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      {/* Animated Sliding Sidebar Container */}
      <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: slideAnim }] }]}>
        
        {/* Frosted Glass Overlay */}
        <BlurView
          intensity={85}
          tint="light"
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.content}>
          {/* User profile header card */}
          <View style={styles.profileCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' }}
              style={styles.avatar}
            />
            <Text style={styles.username}>{session?.fullName || 'Athlete Dashboard'}</Text>
            <Text style={styles.email}>{session?.email || 'athlete@domain.com'}</Text>
          </View>

          {/* Dynamic Telemetry Metric Panel */}
          <View style={styles.metricsCard}>
            <Text style={styles.metricsHeader}>Today's Telemetry</Text>
            
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Daily Workouts</Text>
              <Text style={styles.metricValue}>{metrics.workouts}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Total Volume</Text>
              <Text style={styles.metricValue}>{metrics.totalVolume.toLocaleString()} lbs</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Active Streak</Text>
              <Text style={styles.streakValue}>🔥 {metrics.streak} Days</Text>
            </View>
          </View>

          {/* Navigation Links */}
          <View style={styles.navGroup}>
            <TouchableOpacity style={styles.navLink} onPress={() => handleNavigate('/')}>
              <Text style={styles.navLinkText}>🏠 Home Workspace</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navLink} onPress={() => handleNavigate('/circle')}>
              <Text style={styles.navLinkText}>👥 Ambient Circle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navLink} onPress={() => handleNavigate('/explore')}>
              <Text style={styles.navLinkText}>🧭 Explore System</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Action */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Log Out Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const drawerWidth = 280;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 10,
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: drawerWidth,
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 20,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 8,
  },
  content: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 20,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: '#FF8E8E',
    marginBottom: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1c1c1e',
  },
  email: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.4)',
    marginTop: 2,
  },
  metricsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
  },
  metricsHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF8E8E',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  metricLabel: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1c1c1e',
  },
  streakValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fbbf24',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.04)',
    marginVertical: 4,
  },
  navGroup: {
    gap: 8,
    flex: 1,
  },
  navLink: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  navLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  footer: {
    paddingBottom: 40,
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
  },
});
export default CustomGlassDrawerContent;
