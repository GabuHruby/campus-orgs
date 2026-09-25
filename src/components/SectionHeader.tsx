import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/theme';

type Props = { title: string; count?: number };

export function SectionHeader({ title, count }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {count !== undefined && <Text style={styles.count}>{count}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginTop: spacing.sm },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  count: { fontSize: 13, fontWeight: '600', color: colors.textSubtle },
});
