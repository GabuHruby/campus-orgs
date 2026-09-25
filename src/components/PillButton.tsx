import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '@/theme';

type Variant = 'cta' | 'primary' | 'outline';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: 'sm' | 'md';
};

const variantStyles = {
  cta: { bg: colors.cta, fg: colors.onCta, border: colors.cta },
  primary: { bg: colors.primary, fg: colors.onDark, border: colors.primary },
  outline: { bg: colors.surface, fg: colors.primary, border: colors.border },
} as const;

export function PillButton({ label, onPress, variant = 'cta', icon, size = 'md' }: Props) {
  const v = variantStyles[variant];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: v.bg, borderColor: v.border, opacity: pressed ? 0.8 : 1 },
      ]}>
      {icon && <Ionicons name={icon} size={size === 'sm' ? 14 : 16} color={v.fg} />}
      <Text style={[styles.label, size === 'sm' && styles.labelSm, { color: v.fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  md: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  sm: { paddingHorizontal: spacing.md, paddingVertical: 5 },
  label: { fontSize: 14, fontWeight: '700' },
  labelSm: { fontSize: 13 },
});
