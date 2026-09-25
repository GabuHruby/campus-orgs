import { StyleSheet, Text, View } from 'react-native';

import { Wordmark } from '@/components/Wordmark';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { colors, spacing } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
  /** On phones, show the clubHQ wordmark instead of the title (the sidebar shows it on desktop). */
  brandOnMobile?: boolean;
};

export function ScreenHeader({ title, subtitle, brandOnMobile = false }: Props) {
  const { isWide } = useBreakpoints();
  return (
    <View style={styles.header}>
      {brandOnMobile && !isWide ? <Wordmark /> : <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: colors.textMuted },
});
