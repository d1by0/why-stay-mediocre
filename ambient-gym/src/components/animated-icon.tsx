/**
 * Redesigned Animated Icon and Splash Screen
 * Replaces all Expo logo images with custom glowing concentric ring elements.
 */
import React, { useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const INITIAL_SCALE_FACTOR = Dimensions.get('screen').height / 90;
const DURATION = 600;

export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      opacity: 1,
    },
    70: {
      opacity: 0,
      easing: Easing.elastic(0.7),
    },
    100: {
      opacity: 0,
    },
  });

  const brandingElement = (
    <View style={styles.splashBrandContainer}>
      <View style={styles.glowingHalo} />
      <Text style={styles.splashBrandText}>Ambient</Text>
      <Text style={styles.splashBrandSubtext}>HABITS</Text>
    </View>
  );

  return animate ? (
    <Animated.View
      entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={styles.splashOverlay}>
      {brandingElement}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => {
          setAnimate(true);
        });
      }}
      style={styles.splashOverlay}>
      {brandingElement}
    </View>
  );
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: INITIAL_SCALE_FACTOR }],
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

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
      <Animated.View entering={keyframe.duration(DURATION)} style={styles.background} />
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
    zIndex: 100,
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
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
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
    shadowColor: '#fa2d5a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    marginBottom: 24,
  },
  splashBrandText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  splashBrandSubtext: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 6,
    marginTop: 4,
    textTransform: 'uppercase',
  },
});
