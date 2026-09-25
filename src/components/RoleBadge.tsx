import { StyleSheet, Text, View } from 'react-native';

import { roleLabel } from '@/lib/channel';
import { colors, radius } from '@/theme';
import type { ClubMember } from '@/types/domain';

type Props = { member: ClubMember };

// Leaders get the solid brand badge; members allowed to post get a lighter one.
export function RoleBadge({ member }: Props) {
  const leader = member.role === 'leader';
  return (
    <View style={[styles.badge, leader ? styles.leader : styles.poster]}>
      <Text style={[styles.text, { color: leader ? colors.onDark : colors.primary }]}>
        {roleLabel(member)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 1 },
  leader: { backgroundColor: colors.primaryDark },
  poster: { backgroundColor: colors.surfaceTint },
  text: { fontSize: 11, fontWeight: '700' },
});
