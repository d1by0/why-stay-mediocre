/**
 * Glassmorphic Card Container with iOS native BlurView support
 */
import React from 'react';
import { StyleSheet, View, ViewStyle, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export function GlassCard({ children, style, intensity = 65 }: GlassCardProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight, style]}>
      {/* Native-accelerated iOS Blur Layer */}
      <BlurView
        intensity={intensity}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  cardDark: {
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(20, 20, 25, 0.4)',
  },
  cardLight: {
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  content: {
    padding: 20,
  },
});
export default GlassCard;
