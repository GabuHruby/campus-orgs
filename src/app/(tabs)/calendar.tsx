import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClubAvatar } from '@/components/ClubAvatar';
import { Page } from '@/components/Page';
import { PillButton } from '@/components/PillButton';
import { PopularClubs } from '@/components/PopularClubs';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionHeader } from '@/components/SectionHeader';
import { useAppData } from '@/data/AppDataProvider';
import { dayChip, dayLabel, formatTime, isSameDay, nextDays } from '@/lib/dates';
import { groupByDay } from '@/lib/feed';
import { openClub } from '@/lib/nav';
import { colors, radius, spacing } from '@/theme';

// Everything the user has RSVP'd to: a week strip on top, then an agenda grouped by day.
export default function CalendarScreen() {
  const { events, user, clubsById, toggleRsvp } = useAppData();
  // Selected day in the week strip (ISO midnight), or null to show every day.
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const going = events.filter((e) => user.rsvpedEventIds.includes(e.id));
  const groups = groupByDay(going);
  const visible = selectedDay ? groups.filter((g) => isSameDay(g.day, selectedDay)) : groups;
  const week = nextDays(7);

  return (
    <Page aside={<PopularClubs />}>
      <ScreenHeader title="Calendar" subtitle="Events you’re going to" />

      <View style={styles.week}>
        {week.map((day) => {
          const chip = dayChip(day);
          const hasEvents = groups.some((g) => isSameDay(g.day, day));
          const selected = selectedDay !== null && isSameDay(selectedDay, day);
          return (
            <Pressable
              key={day}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={dayLabel(day)}
              onPress={() => setSelectedDay(selected ? null : day)}
              style={({ hovered }) => [styles.chip, hovered && styles.chipHover, selected && styles.chipSelected]}>
              <Text style={[styles.chipWeekday, selected && styles.chipTextSelected]}>{chip.weekday}</Text>
              <Text style={[styles.chipDay, selected && styles.chipTextSelected]}>{chip.day}</Text>
              <View style={[styles.dot, hasEvents && styles.dotOn]} />
            </Pressable>
          );
        })}
      </View>

      {visible.map((group) => (
        <View key={group.day} style={styles.group}>
          <SectionHeader title={dayLabel(group.day)} count={group.events.length} />
          {group.events.map((e) => {
            const club = clubsById.get(e.clubId);
            if (!club) return null;
            return (
              <Pressable
                key={e.id}
                onPress={() => openClub(club.id)}
                style={({ pressed, hovered }) => [styles.row, (pressed || hovered) && styles.rowActive]}>
                <View style={styles.timeCol}>
                  <Text style={styles.time}>{formatTime(e.startTime)}</Text>
                  <Text style={styles.endTime}>{formatTime(e.endTime)}</Text>
                </View>
                <View style={styles.bar} />
                <View style={styles.info}>
                  <Text style={styles.title} numberOfLines={2}>
                    {e.title}
                  </Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="location-outline" size={13} color={colors.textMuted} />
                    <Text style={styles.meta} numberOfLines={1}>
                      {e.location}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <ClubAvatar club={club} size={18} />
                    <Text style={styles.meta} numberOfLines={1}>
                      {club.name}
                    </Text>
                  </View>
                </View>
                <PillButton
                  label="Going"
                  icon="checkmark"
                  variant="outline"
                  size="sm"
                  onPress={() => toggleRsvp(e.id)}
                />
              </Pressable>
            );
          })}
        </View>
      ))}

      {visible.length === 0 && (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={32} color={colors.accent} />
          <Text style={styles.emptyTitle}>{selectedDay ? 'Nothing planned this day' : 'No plans yet'}</Text>
          <Text style={styles.emptyBody}>
            {selectedDay
              ? 'Tap the day again to see all your events.'
              : 'RSVP to events on Home and they’ll show up here.'}
          </Text>
          {!selectedDay && (
            <PillButton label="Find events" variant="primary" onPress={() => router.navigate('/')} />
          )}
        </View>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  week: { flexDirection: 'row', gap: spacing.sm },
  chip: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipHover: { borderColor: colors.accent },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipWeekday: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  chipDay: { fontSize: 18, fontWeight: '800', color: colors.text },
  chipTextSelected: { color: colors.onDark },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 2, backgroundColor: 'transparent' },
  dotOn: { backgroundColor: colors.cta },
  group: { gap: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowActive: { borderColor: colors.accent },
  timeCol: { width: 64, gap: 2 },
  time: { fontSize: 14, fontWeight: '700', color: colors.text },
  endTime: { fontSize: 12, color: colors.textSubtle },
  bar: { width: 3, alignSelf: 'stretch', borderRadius: 2, backgroundColor: colors.cta },
  info: { flex: 1, minWidth: 0, gap: 3 },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  meta: { fontSize: 13, color: colors.textMuted, flexShrink: 1 },
  empty: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  emptyBody: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
});
