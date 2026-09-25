import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { PillButton } from '@/components/PillButton';
import { useAppData } from '@/data/AppDataProvider';
import { dateTile, formatEventWhen, isPast } from '@/lib/dates';
import { colors, radius, spacing } from '@/theme';
import type { Event } from '@/types/domain';

type Props = { event: Event };

// Compact event card attached to a channel message. RSVP works right from the chat.
export function EventEmbed({ event }: Props) {
  const { isRsvped, toggleRsvp } = useAppData();
  const going = isRsvped(event.id);
  const past = isPast(event.endTime);
  const tile = dateTile(event.startTime);

  return (
    <View style={styles.card}>
      <View style={styles.tile}>
        <Text style={styles.tileMonth}>{tile.month}</Text>
        <Text style={styles.tileDay}>{tile.day}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {formatEventWhen(event.startTime)}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={13} color={colors.textMuted} />
          <Text style={styles.meta} numberOfLines={1}>
            {event.location}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.going}>{event.rsvpCount} going</Text>
          {!past && (
            <PillButton
              label={going ? 'Going' : 'RSVP'}
              icon={going ? 'checkmark' : undefined}
              variant={going ? 'outline' : 'cta'}
              size="sm"
              onPress={() => toggleRsvp(event.id)}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: 420,
  },
  tile: {
    width: 44,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileMonth: { fontSize: 10, fontWeight: '700', color: colors.primary, letterSpacing: 0.5 },
  tileDay: { fontSize: 17, fontWeight: '800', color: colors.text },
  info: { flex: 1, gap: 2, minWidth: 0 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { fontSize: 13, color: colors.textMuted, flexShrink: 1 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  going: { fontSize: 13, fontWeight: '600', color: colors.text },
});
