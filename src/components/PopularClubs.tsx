import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClubAvatar } from '@/components/ClubAvatar';
import { PillButton } from '@/components/PillButton';
import { useAppData } from '@/data/AppDataProvider';
import { clubsByPopularity } from '@/lib/feed';
import { openClub } from '@/lib/nav';
import { colors, radius, spacing } from '@/theme';

// Desktop-only side panel, like Reddit's "Popular communities".
export function PopularClubs() {
  const { clubs, isJoined, toggleJoin } = useAppData();

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Popular clubs</Text>
      {clubsByPopularity(clubs).map((club) => {
        const joined = isJoined(club.id);
        return (
          <View key={club.id} style={styles.row}>
            <Pressable
              style={styles.clubLink}
              onPress={() => openClub(club.id)}>
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
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  heading: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  clubLink: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minWidth: 0 },
  text: { flex: 1, minWidth: 0 },
  name: { fontSize: 14, fontWeight: '700', color: colors.text },
  meta: { fontSize: 12, color: colors.textMuted },
});
