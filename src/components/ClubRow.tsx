import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClubAvatar } from '@/components/ClubAvatar';
import { PillButton } from '@/components/PillButton';
import { useAppData } from '@/data/AppDataProvider';
import { openClub } from '@/lib/nav';
import { colors, spacing } from '@/theme';
import type { Club } from '@/types/domain';

type Props = {
  club: Club;
  // Runs before navigating to the club, e.g. to close a popup.
  onOpen?: () => void;
};

// Avatar, name, category · members, and a Join/Joined button. Tapping the club opens its channel.
export function ClubRow({ club, onOpen }: Props) {
  const { isJoined, toggleJoin } = useAppData();
  const joined = isJoined(club.id);

  return (
    <View style={styles.row}>
      <Pressable
        style={styles.clubLink}
        onPress={() => {
          onOpen?.();
          openClub(club.id);
        }}>
        <ClubAvatar club={club} size={32} />
        <View style={styles.text}>
          <Text style={styles.name} numberOfLines={1}>
            {club.name}
          </Text>
          <Text style={styles.meta}>
            {club.category} · {club.memberCount} members
          </Text>
        </View>
      </Pressable>
      <PillButton
        label={joined ? 'Joined' : 'Join'}
        size="sm"
        variant={joined ? 'outline' : 'primary'}
        onPress={() => toggleJoin(club.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  clubLink: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minWidth: 0 },
  text: { flex: 1, minWidth: 0 },
  name: { fontSize: 14, fontWeight: '700', color: colors.text },
  meta: { fontSize: 12, color: colors.textMuted },
});
