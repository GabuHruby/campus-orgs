import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClubAvatar } from '@/components/ClubAvatar';
import { PillButton } from '@/components/PillButton';
import { useAppData } from '@/data/AppDataProvider';
import { dateTile, formatEventWhen } from '@/lib/dates';
import { openClub } from '@/lib/nav';
import { colors, radius, spacing } from '@/theme';
import type { Club, Event } from '@/types/domain';

type Props = {
  event: Event;
  club: Club;
  /** Show a Join chip next to the club name when the user isn't a member (Discover feed). */
  showJoin?: boolean;
};

export function EventCard({ event, club, showJoin = false }: Props) {
  const { isJoined, isRsvped, toggleJoin, toggleRsvp } = useAppData();
  const going = isRsvped(event.id);
  const tile = dateTile(event.startTime);

  return (
    <Pressable
      onPress={() => openClub(club.id)}
      style={({ pressed, hovered }) => [
        styles.card,
        (pressed || hovered) && styles.cardActive,
      ]}>
      <View style={styles.header}>
        <Pressable
          style={styles.clubLink}
          onPress={() => openClub(club.id)}>
          <ClubAvatar club={club} size={24} />
          <Text style={styles.clubName} numberOfLines={1}>
            {club.name}
          </Text>
        </Pressable>
        {showJoin && !isJoined(club.id) && (
          <PillButton label="Join" size="sm" variant="primary" onPress={() => toggleJoin(club.id)} />
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.tile}>
          <Text style={styles.tileMonth}>{tile.month}</Text>
          <Text style={styles.tileDay}>{tile.day}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text style={styles.meta}>{formatEventWhen(event.startTime)}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.meta} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.metaRow}>
          <Ionicons name="people" size={14} color={colors.accent} />
          <Text style={styles.going}>{event.rsvpCount} going</Text>
        </View>
        <PillButton
          label={going ? 'Going' : 'RSVP'}
          icon={going ? 'checkmark' : undefined}
          variant={going ? 'outline' : 'cta'}
          onPress={() => toggleRsvp(event.id)}
        />
      </View>
    </Pressable>
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
  cardActive: { borderColor: colors.accent },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  clubLink: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1 },
  clubName: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  body: { flexDirection: 'row', gap: spacing.md },
  tile: {
    width: 52,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileMonth: { fontSize: 11, fontWeight: '700', color: colors.primary, letterSpacing: 0.5 },
  tileDay: { fontSize: 20, fontWeight: '800', color: colors.text },
  info: { flex: 1, gap: spacing.xs },
  title: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 },
  meta: { fontSize: 14, color: colors.textMuted, flexShrink: 1 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  going: { fontSize: 14, fontWeight: '600', color: colors.text },
});
