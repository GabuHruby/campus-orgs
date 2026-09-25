import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { timeAgo } from '@/lib/dates';
import { colors, radius, spacing } from '@/theme';
import type { Announcement, Club } from '@/types/domain';

type Props = { announcement: Announcement; club: Club };

// Deliberately slimmer and text-only so announcements read differently from events.
export function AnnouncementCard({ announcement, club }: Props) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/club/[id]', params: { id: club.id } })}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
      <View style={styles.header}>
        <Ionicons name="megaphone" size={13} color={colors.primary} />
        <Text style={styles.club} numberOfLines={1}>
          {club.name}
        </Text>
        <Text style={styles.time}>· {timeAgo(announcement.postedAt)}</Text>
      </View>
      <Text style={styles.title}>{announcement.title}</Text>
      <Text style={styles.body} numberOfLines={2}>
        {announcement.body}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceTint,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.cta,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  club: { fontSize: 12, fontWeight: '700', color: colors.primary, flexShrink: 1 },
  time: { fontSize: 12, color: colors.textSubtle },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  body: { fontSize: 14, lineHeight: 20, color: colors.textMuted },
});
