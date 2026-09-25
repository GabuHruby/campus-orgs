import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ClubAvatar } from '@/components/ClubAvatar';
import { colors, spacing } from '@/theme';
import type { Club } from '@/types/domain';

type Props = { clubs: Club[]; onFindMore: () => void };

// Horizontal row of the user's clubs at the top of My Groups.
export function MyClubsRow({ clubs, onFindMore }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {clubs.map((club) => (
        <Pressable
          key={club.id}
          style={styles.item}
          onPress={() => router.push({ pathname: '/club/[id]', params: { id: club.id } })}>
          <ClubAvatar club={club} size={52} />
          <Text style={styles.name} numberOfLines={2}>
            {club.name}
          </Text>
        </Pressable>
      ))}
      <Pressable style={styles.item} onPress={onFindMore}>
        <View style={styles.more}>
          <Ionicons name="add" size={26} color={colors.primary} />
        </View>
        <Text style={styles.name}>Find clubs</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.md, paddingVertical: spacing.xs },
  item: { width: 76, alignItems: 'center', gap: 6 },
  name: { fontSize: 12, fontWeight: '600', color: colors.text, textAlign: 'center' },
  more: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
