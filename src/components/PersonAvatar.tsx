import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme';
import type { Person } from '@/types/domain';

type Props = { person: Person; size?: number };

function initials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
}

export function PersonAvatar({ person, size = 36 }: Props) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: person.avatarColor },
      ]}>
      <Text style={[styles.text, { fontSize: size * 0.38 }]}>{initials(person.name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  text: { color: colors.onDark, fontWeight: '800' },
});
