import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClubAvatar } from '@/components/ClubAvatar';
import { Page } from '@/components/Page';
import { PillButton } from '@/components/PillButton';
import { PopularClubs } from '@/components/PopularClubs';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAppData } from '@/data/AppDataProvider';
import { buildChannel, previewText } from '@/lib/channel';
import { chatTimestamp } from '@/lib/dates';
import { colors, radius, spacing } from '@/theme';

// Chat list: one row per joined club, most recent activity first.
export default function MessagesScreen() {
  const { clubs, messages, announcements, peopleById, isJoined } = useAppData();

  const rows = clubs
    .filter((c) => isJoined(c.id))
    .map((club) => ({ club, latest: buildChannel(club.id, messages, announcements).at(-1) }))
    .sort((a, b) => (b.latest?.sentAt ?? '').localeCompare(a.latest?.sentAt ?? ''));

  return (
    <Page aside={<PopularClubs />}>
      <ScreenHeader title="Messages" subtitle="Channels from your clubs" />

      {rows.length > 0 ? (
        <View style={styles.list}>
          {rows.map(({ club, latest }, i) => {
            const author = latest && peopleById.get(latest.authorId);
            return (
              <Pressable
                key={club.id}
                onPress={() => router.push({ pathname: '/messages/[id]', params: { id: club.id } })}
                style={({ pressed, hovered }) => [
                  styles.row,
                  i > 0 && styles.rowDivider,
                  (pressed || hovered) && styles.rowActive,
                ]}>
                <ClubAvatar club={club} size={48} />
                <View style={styles.text}>
                  <View style={styles.topLine}>
                    <Text style={styles.name} numberOfLines={1}>
                      {club.name}
                    </Text>
                    {latest && <Text style={styles.time}>{chatTimestamp(latest.sentAt)}</Text>}
                  </View>
                  <Text style={styles.preview} numberOfLines={1}>
                    {latest
                      ? `${author ? `${author.name.split(' ')[0]}: ` : ''}${previewText(latest)}`
                      : 'No messages yet'}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No channels yet</Text>
          <Text style={styles.emptyBody}>Join a club and its channel shows up here.</Text>
          <PillButton label="Discover clubs" variant="primary" onPress={() => router.navigate('/')} />
        </View>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  rowDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  rowActive: { backgroundColor: colors.surfaceTint },
  text: { flex: 1, minWidth: 0, gap: 2 },
  topLine: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  name: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  time: { fontSize: 12, color: colors.textSubtle },
  preview: { fontSize: 14, color: colors.textMuted },
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
