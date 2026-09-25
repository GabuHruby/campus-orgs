import { StyleSheet, Text, View } from 'react-native';

import { AnnouncementCard } from '@/components/AnnouncementCard';
import { Page } from '@/components/Page';
import { PopularClubs } from '@/components/PopularClubs';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAppData } from '@/data/AppDataProvider';
import { inClubs, sortAnnouncements } from '@/lib/feed';
import { colors, radius, spacing } from '@/theme';

export default function InboxScreen() {
  const { announcements, user, clubsById } = useAppData();
  const items = sortAnnouncements(inClubs(announcements, user.joinedClubIds));

  return (
    <Page aside={<PopularClubs />}>
      <ScreenHeader title="Inbox" subtitle="Announcements from your clubs" />
      {items.map((a) => {
        const club = clubsById.get(a.clubId);
        return club && <AnnouncementCard key={a.id} announcement={a} club={club} />;
      })}
      {items.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Your inbox is empty</Text>
          <Text style={styles.emptyBody}>Join clubs to get their announcements here.</Text>
        </View>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  emptyBody: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
});
