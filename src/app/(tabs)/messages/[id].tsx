import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Fragment, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ChannelItemView } from '@/components/ChannelItemView';
import { ClubAvatar } from '@/components/ClubAvatar';
import { PersonAvatar } from '@/components/PersonAvatar';
import { PillButton } from '@/components/PillButton';
import { RoleBadge } from '@/components/RoleBadge';
import { useAppData } from '@/data/AppDataProvider';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { buildChannel, canPost, roleOf } from '@/lib/channel';
import { dayLabel, isSameDay } from '@/lib/dates';
import { colors, layout, radius, spacing } from '@/theme';

// A club's channel: club header, then messages oldest → newest like a chat,
// with a footer that reflects who is allowed to post.
export default function ClubChannelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { clubsById, messages, announcements, members, peopleById, user, isJoined, toggleJoin, roleIn } =
    useAppData();
  const { isWide } = useBreakpoints();
  const scrollRef = useRef<ScrollView>(null);
  const scrolledToEnd = useRef(false);

  const club = clubsById.get(id);
  if (!club) {
    return (
      <View style={styles.missing}>
        <Stack.Screen options={{ title: 'Club not found' }} />
        <Text style={styles.missingText}>This club doesn’t exist.</Text>
      </View>
    );
  }

  const items = buildChannel(club.id, messages, announcements);
  const team = members.filter((m) => m.clubId === club.id);
  const joined = isJoined(club.id);
  const locked = !canPost(club, roleOf(roleIn(club.id, user.id)));
  const column = [styles.column, { paddingHorizontal: isWide ? spacing.xl : spacing.lg }];

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: club.name }} />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        // Open at the newest message, like any chat app. Only on first layout, so
        // RSVPing to an older message doesn't yank the scroll position.
        onContentSizeChange={() => {
          if (scrolledToEnd.current) return;
          scrollRef.current?.scrollToEnd({ animated: false });
          scrolledToEnd.current = true;
        }}>
        <View style={column}>
          <View style={styles.hero}>
            <View style={styles.heroTop}>
              <ClubAvatar club={club} size={64} />
              <View style={styles.heroText}>
                <Text style={styles.clubName}>{club.name}</Text>
                <Text style={styles.clubMeta}>
                  {club.category} · {club.memberCount} members
                </Text>
              </View>
              <PillButton
                label={joined ? 'Joined' : 'Join'}
                icon={joined ? 'checkmark' : undefined}
                variant={joined ? 'outline' : 'primary'}
                onPress={() => toggleJoin(club.id)}
              />
            </View>
            <Text style={styles.description}>{club.shortDescription}</Text>
            <View style={styles.team}>
              {team.map((m) => {
                const person = peopleById.get(m.personId);
                return (
                  person && (
                    <View key={m.personId} style={styles.teamMember}>
                      <PersonAvatar person={person} size={22} />
                      <Text style={styles.teamName}>{person.name}</Text>
                      <RoleBadge member={m} />
                    </View>
                  )
                );
              })}
            </View>
          </View>

          {items.map((item, i) => (
            <Fragment key={item.id}>
              {(i === 0 || !isSameDay(items[i - 1].sentAt, item.sentAt)) && (
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>{dayLabel(item.sentAt)}</Text>
                  <View style={styles.dividerLine} />
                </View>
              )}
              <ChannelItemView item={item} clubId={club.id} />
            </Fragment>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={[column, styles.footerInner]}>
          {!joined ? (
            <>
              <Text style={styles.footerText}>
                Join {club.name} to get its messages and events in My Groups.
              </Text>
              <PillButton label="Join" variant="primary" onPress={() => toggleJoin(club.id)} />
            </>
          ) : locked ? (
            <>
              <Ionicons name="lock-closed" size={16} color={colors.textMuted} />
              <Text style={styles.footerText}>
                Only leaders and approved members can post in {club.name}.
              </Text>
            </>
          ) : (
            // Reached once a leader opens the chat to everyone (chatPermission: 'everyone').
            <Text style={styles.footerText}>Messaging is coming soon.</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { alignItems: 'center', paddingTop: spacing.lg, paddingBottom: spacing.xl },
  column: { width: '100%', maxWidth: layout.contentMaxWidth, gap: spacing.lg },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  heroText: { flex: 1, minWidth: 0, gap: 2 },
  clubName: { fontSize: 20, fontWeight: '800', color: colors.text },
  clubMeta: { fontSize: 13, color: colors.textMuted },
  description: { fontSize: 14, lineHeight: 20, color: colors.textMuted },
  team: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
  },
  teamName: { fontSize: 13, fontWeight: '600', color: colors.text },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 12, fontWeight: '700', color: colors.textSubtle },
  footer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.md,
  },
  footerInner: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  footerText: { flex: 1, fontSize: 14, color: colors.textMuted },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  missingText: { fontSize: 15, color: colors.textMuted },
});
