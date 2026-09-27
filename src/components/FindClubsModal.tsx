import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ClubRow } from '@/components/ClubRow';
import { useAppData } from '@/data/AppDataProvider';
import { clubsByPopularity } from '@/lib/feed';
import { colors, radius, spacing } from '@/theme';
import type { Club } from '@/types/domain';

type Props = { visible: boolean; onClose: () => void };

function matches(club: Club, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [club.name, club.category, club.shortDescription].some((s) => s.toLowerCase().includes(q));
}

// Popup listing every club with a filter box. Closes on backdrop tap, the X, Esc (web), or Android back.
export function FindClubsModal({ visible, onClose }: Props) {
  const { clubs } = useAppData();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const results = clubsByPopularity(clubs).filter((c) => matches(c, query));

  const close = () => {
    setQuery('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close}>
        {/* Inner Pressable swallows taps so clicking the card doesn't close it. */}
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>Find clubs</Text>
            <Pressable
              onPress={close}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              style={({ pressed }) => [styles.close, pressed && styles.closePressed]}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </Pressable>
          </View>

          <View style={[styles.search, focused && styles.searchFocused]}>
            <Ionicons name="search" size={18} color={colors.textSubtle} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search clubs"
              placeholderTextColor={colors.textSubtle}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              accessibilityLabel="Search clubs"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} accessibilityLabel="Clear search" hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={colors.textSubtle} />
              </Pressable>
            )}
          </View>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled">
            {results.map((club) => (
              <ClubRow key={club.id} club={club} onOpen={close} />
            ))}
            {results.length === 0 && (
              <Text style={styles.empty}>No clubs match &ldquo;{query.trim()}&rdquo;</Text>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(1, 22, 52, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '85%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  close: { padding: spacing.xs, borderRadius: radius.pill },
  closePressed: { backgroundColor: colors.background },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  searchFocused: { borderColor: colors.accent },
  // The browser's focus ring is removed in global.css; the box border shows focus instead.
  input: { flex: 1, minWidth: 0, paddingVertical: spacing.md, fontSize: 15, color: colors.text },
  list: { flexGrow: 0 },
  listContent: { gap: spacing.md },
  empty: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.xl },
});
