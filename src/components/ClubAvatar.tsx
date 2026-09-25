import { StyleSheet, Text, View } from 'react-native';

import type { Club } from '@/types/domain';

type Props = { club: Club; size?: number };

export function ClubAvatar({ club, size = 32 }: Props) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: club.avatarColor },
      ]}>
      <Text style={{ fontSize: size * 0.5 }}>{club.emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
});
