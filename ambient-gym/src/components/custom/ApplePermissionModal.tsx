/**
 * ApplePermissionModal Component
 * Replicates the clean, native iOS modal for privacy authorization (HealthKit, Notifications).
 */
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';

interface ApplePermissionModalProps {
  visible: boolean;
  type: 'health' | 'notifications';
  onClose: (approved: boolean) => void;
}

export function ApplePermissionModal({ visible, type, onClose }: ApplePermissionModalProps) {
  const isHealth = type === 'health';
  const title = isHealth ? '"Ambient Habits" Would Like to Access Your Health Data' : '"Ambient Habits" Would Like to Send You Notifications';
  const description = isHealth 
    ? 'This allows Ambient Habits to track physical activity, active energy, and hydration data in sync with Apple HealthKit.' 
    : 'Notifications may include alerts, sounds, and icon badges to keep you and your friends updated on habit streaks.';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.button} onPress={() => onClose(false)}>
              <Text style={styles.cancelText}>Don't Allow</Text>
            </TouchableOpacity>
            
            <View style={styles.verticalDivider} />
            
            <TouchableOpacity style={styles.button} onPress={() => onClose(true)}>
              <Text style={styles.allowText}>Allow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.56)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    width: 270,
    backgroundColor: '#1c1c1e',
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
    lineHeight: 18,
  },
  divider: {
    width: '100%',
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  actionRow: {
    flexDirection: 'row',
    height: 44,
    width: '100%',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalDivider: {
    width: 0.5,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  cancelText: {
    color: '#0a84ff',
    fontSize: 17,
    fontWeight: '400',
  },
  allowText: {
    color: '#0a84ff',
    fontSize: 17,
    fontWeight: '600',
  },
});
export default ApplePermissionModal;
