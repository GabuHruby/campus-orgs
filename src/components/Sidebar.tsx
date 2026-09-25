import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Wordmark } from '@/components/Wordmark';
import { useAppData } from '@/data/AppDataProvider';
import { colors, layout, radius, spacing } from '@/theme';

type Props = BottomTabBarProps & { expanded: boolean };

// Desktop/tablet navigation, Twitter-style. Rendered by the Tabs navigator in place of
// the bottom bar, so it reuses the same routes, icons, and tabPress listeners.
export function Sidebar({ state, descriptors, navigation, expanded }: Props) {
  const { user } = useAppData();

  return (
    <View
      style={[
        styles.sidebar,
        { width: expanded ? layout.sidebarWidth : layout.sidebarCompactWidth },
        !expanded && styles.compact,
      ]}>
      <View style={[styles.brand, !expanded && styles.brandCompact]}>
        {expanded ? <Wordmark onDark size={26} /> : <Wordmark onDark size={14} />}
      </View>

      <View style={styles.nav}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const label = options.title ?? route.name;
          const color = focused ? colors.onDark : colors.onDarkMuted;

          const onPress = () => {
            // Same event the bottom bar emits, so demo-only tabs can still cancel it.
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              onPress={onPress}
              style={({ pressed, hovered }) => [
                styles.item,
                !expanded && styles.itemCompact,
                (pressed || hovered) && styles.itemHover,
                focused && styles.itemActive,
              ]}>
              {options.tabBarIcon?.({ focused, color, size: 24 })}
              {expanded && (
                <Text style={[styles.label, { color }, focused && styles.labelActive]}>
                  {label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.user, !expanded && styles.userCompact]}>
        <View style={styles.userAvatar}>
          <Text style={styles.userInitials}>DS</Text>
        </View>
        {expanded && (
          <View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userMeta}>{user.joinedClubIds.length} clubs joined</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: colors.sidebar,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    gap: spacing.xl,
  },
  compact: { alignItems: 'center', paddingHorizontal: spacing.sm },
  brand: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  brandCompact: { paddingHorizontal: 0 },
  nav: { flex: 1, gap: spacing.xs },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  itemCompact: { justifyContent: 'center', paddingHorizontal: spacing.md },
  itemHover: { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
  itemActive: { backgroundColor: colors.primaryDark },
  label: { fontSize: 17, fontWeight: '600' },
  labelActive: { fontWeight: '800' },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  userCompact: { padding: spacing.xs, backgroundColor: 'transparent' },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInitials: { color: colors.onDark, fontWeight: '800', fontSize: 13 },
  userName: { color: colors.onDark, fontWeight: '700', fontSize: 14 },
  userMeta: { color: colors.onDarkMuted, fontSize: 12 },
});
