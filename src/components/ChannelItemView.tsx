import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { EventEmbed } from '@/components/EventEmbed';
import { PersonAvatar } from '@/components/PersonAvatar';
import { RoleBadge } from '@/components/RoleBadge';
import { useAppData } from '@/data/AppDataProvider';
import type { ChannelItem } from '@/lib/channel';
import { formatTime } from '@/lib/dates';
import { colors, radius, spacing } from '@/theme';

type Props = { item: ChannelItem; clubId: string };

// One post in a club channel, Slack-style: avatar, author + role badge, then the content.
export function ChannelItemView({ item, clubId }: Props) {
  const { peopleById, eventsById, roleIn } = useAppData();
  const author = peopleById.get(item.authorId);
  const member = roleIn(clubId, item.authorId);
  const event =
    item.kind === 'message' && item.message.eventId ? eventsById.get(item.message.eventId) : undefined;
  if (!author) return null;

  return (
    <View style={styles.row}>
      <PersonAvatar person={author} size={36} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{author.name}</Text>
          {member && <RoleBadge member={member} />}
          <Text style={styles.time}>{formatTime(item.sentAt)}</Text>
        </View>

        {item.kind === 'message' ? (
          <>
            <Text style={styles.body}>{item.message.body}</Text>
            {event && <EventEmbed event={event} />}
          </>
        ) : (
          <View style={styles.announcement}>
            <View style={styles.announcementLabel}>
              <Ionicons name="megaphone" size={12} color={colors.primary} />
              <Text style={styles.announcementLabelText}>Announcement</Text>
            </View>
            <Text style={styles.announcementTitle}>{item.announcement.title}</Text>
            <Text style={styles.body}>{item.announcement.body}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  content: { flex: 1, minWidth: 0 },
  header: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 2 },
  name: { fontSize: 14, fontWeight: '700', color: colors.text },
  time: { fontSize: 12, color: colors.textSubtle },
  body: { fontSize: 15, lineHeight: 21, color: colors.text },
  announcement: {
    marginTop: spacing.xs,
    backgroundColor: colors.surfaceTint,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.cta,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    maxWidth: 480,
  },
  announcementLabel: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  announcementLabelText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  announcementTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
});
