/**
 * Redesigned Animated Icon and Splash Screen (Web Version)
 * Replaces all Expo logo images with custom glowing concentric ring elements.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Keyframe, Easing } from 'react-native-reanimated';

const DURATION = 300;

export function AnimatedSplashOverlay() {
  return null;
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: 0 }],
  },
  60: {
    transform: [{ scale: 1.2 }],
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(1.2),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    opacity: 0,
  },
  60: {
    transform: [{ scale: 1.2 }],
    opacity: 0,
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(1.2),
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View style={styles.background} entering={keyframe.duration(DURATION)} />
      <Animated.View style={styles.logoHaloContainer} entering={logoKeyframe.duration(DURATION)}>
        <View style={styles.innerGlowingRing} />
      </Animated.View>
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
    backgroundColor: '#0a0a0c',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
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
    shadowColor: '#fa2d5a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
});
