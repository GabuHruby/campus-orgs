import { StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/theme';

type Props = { onDark?: boolean; size?: number };

export function Wordmark({ onDark = false, size = 24 }: Props) {
  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel="clubHQ">
      <Text style={[styles.club, { fontSize: size, color: onDark ? colors.onDark : colors.text }]}>
        club
      </Text>
      <View style={styles.badge}>
        <Text style={[styles.hq, { fontSize: size * 0.8 }]}>HQ</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  club: { fontWeight: '800', letterSpacing: -0.5 },
  badge: {
    backgroundColor: colors.cta,
    borderRadius: radius.sm,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  hq: { fontWeight: '900', color: colors.onCta, letterSpacing: -0.3 },
});
