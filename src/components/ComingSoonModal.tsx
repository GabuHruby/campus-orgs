import { Modal, Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '@/theme';

type Props = {
  // Name of the feature shown in the title, e.g. "Messages". null hides the modal.
  feature: string | null;
  onClose: () => void;
};

// Cross-platform popup. Alert.alert is a no-op on react-native-web, so we use Modal.
export function ComingSoonModal({ feature, onClose }: Props) {
  return (
    <Modal visible={feature !== null} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Inner Pressable swallows taps so clicking the card doesn't close it. */}
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>{feature} is coming soon</Text>
          <Text style={styles.body}>
            This feature isn&apos;t available in the demo. It&apos;s on the clubHQ roadmap.
          </Text>
          <Pressable style={styles.button} onPress={onClose} accessibilityRole="button">
            <Text style={styles.buttonText}>Got it</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(1, 22, 52, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, lineHeight: 21, color: colors.textMuted },
  button: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: { color: colors.onDark, fontSize: 15, fontWeight: '600' },
});
