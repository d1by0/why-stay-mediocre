/**
 * Swipe-to-Confirm Destructive Reset Component
 * Designed to prevent accidental data deletions with physics-based snap-back and haptics.
 */
import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, Modal, Animated, PanResponder, Dimensions, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ConfirmationalResetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function ConfirmationalReset({
  visible,
  onClose,
  onConfirm,
  title = "Reset Routine Data?",
  description = "This action cannot be undone. All active tracking metrics will be permanently erased.",
}: ConfirmationalResetProps) {
  const panX = useRef(new Animated.Value(0)).current;
  const trackWidth = Dimensions.get('window').width - 64; // Horizontal margins padding
  const handleSize = 56;
  const targetThreshold = trackWidth - handleSize - 8;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: async () => {
        if (Platform.OS !== 'web') {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow dragging to the right, constraint friction boundary
        if (gestureState.dx > 0) {
          panX.setValue(Math.min(gestureState.dx, targetThreshold + 10));
        }
      },
      onPanResponderRelease: async (_, gestureState) => {
        if (gestureState.dx >= targetThreshold) {
          // Success
          if (Platform.OS !== 'web') {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          Animated.spring(panX, {
            toValue: targetThreshold,
            useNativeDriver: false,
            tension: 50,
            friction: 7, // Critically damped ζ=1 feel
          }).start(() => {
            onConfirm();
            panX.setValue(0);
            onClose();
          });
        } else {
          // Cancelled/Reset
          if (Platform.OS !== 'web') {
            await Haptics.selectionAsync();
          }
          Animated.spring(panX, {
            toValue: 0,
            useNativeDriver: false,
            tension: 40,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          {/* Swipe Interactive Area */}
          <View style={styles.stepperContainer}>
            <View style={styles.sliderTrack}>
              <Text style={styles.sliderPlaceholder}>Swipe to Confirm Reset</Text>
              
              {/* Draggable Handle */}
              <Animated.View
                style={[
                  styles.sliderHandle,
                  {
                    transform: [{ translateX: panX }],
                  },
                ]}
                {...panResponder.panHandlers}
              >
                <Text style={styles.arrowText}>→</Text>
              </Animated.View>
            </View>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity 
            style={styles.cancelBtn} 
            onPress={async () => {
              if (Platform.OS !== 'web') {
                await Haptics.selectionAsync();
              }
              onClose();
            }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1c1c1e',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
    marginBottom: 28,
  },
  stepperContainer: {
    width: '100%',
    height: 64,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 32,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    marginBottom: 20,
    justifyContent: 'center',
  },
  sliderTrack: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  sliderPlaceholder: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 14,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '600',
  },
  sliderHandle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff4d4d', // Red Warning Action
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff4d4d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  arrowText: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.5)',
  },
});
export default ConfirmationalReset;
