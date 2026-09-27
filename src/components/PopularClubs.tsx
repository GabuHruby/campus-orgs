import { StyleSheet, Text, View } from 'react-native';

import { ClubRow } from '@/components/ClubRow';
import { useAppData } from '@/data/AppDataProvider';
import { clubsByPopularity } from '@/lib/feed';
import { colors, radius, spacing } from '@/theme';

// Desktop-only side panel, like Reddit's "Popular communities".
export function PopularClubs() {
  const { clubs } = useAppData();

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Popular clubs</Text>
      {clubsByPopularity(clubs).map((club) => (
        <ClubRow key={club.id} club={club} />
      ))}
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
});
