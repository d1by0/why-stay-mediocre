/**
 * Redesigned Animated Icon (Web Light Theme Version)
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function AnimatedSplashOverlay() {
  return null;
}

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <View style={styles.background} />
      <View style={styles.logoHaloContainer}>
        <View style={styles.innerGlowingRing} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
  },
  background: {
    borderRadius: 40,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
    width: 128,
    height: 128,
    position: 'absolute',
  },
  logoHaloContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 76,
    height: 76,
  },
  innerGlowingRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 5,
    borderColor: '#fa2d5a', // Activity Pink
  },
});
