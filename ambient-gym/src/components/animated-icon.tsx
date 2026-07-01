/**
 * Redesigned Animated Icon and Splash Screen (Light Theme Compatible)
 * Fixes web interaction blocking by using a reliable setTimeout.
 */
import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';

const DURATION = 600;

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Automatically hide splash screen after delay to prevent blocking clicks/touches
    const timer = setTimeout(() => {
      setVisible(false);
      SplashScreen.hideAsync().catch(() => {});
    }, DURATION + 100);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const brandingElement = (
    <View style={styles.splashBrandContainer}>
      <View style={styles.glowingHalo} />
      <Text style={styles.splashBrandText}>Ambient</Text>
      <Text style={styles.splashBrandSubtext}>HABITS</Text>
    </View>
  );

  return (
    <View style={styles.splashOverlay}>
      {brandingElement}
    </View>
  );
}

const logoKeyframe = new Keyframe({
  0: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <View style={styles.background} />
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
    zIndex: 10,
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
    shadowColor: '#fa2d5a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  },
  splashBrandContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowingHalo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: '#fa2d5a',
    marginBottom: 24,
  },
  splashBrandText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  splashBrandSubtext: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.4)',
    letterSpacing: 6,
    marginTop: 4,
    textTransform: 'uppercase',
  },
});
export default AnimatedSplashOverlay;
