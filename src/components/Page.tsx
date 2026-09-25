import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBreakpoints } from '@/hooks/useBreakpoints';
import { colors, layout, spacing } from '@/theme';

type Props = {
  children: ReactNode;
  /** Right-hand panel, only rendered on wide screens. */
  aside?: ReactNode;
};

// Scrollable screen with a centered, width-capped content column so the feed
// never stretches edge-to-edge on desktop.
export function Page({ children, aside }: Props) {
  const { isWide, showAside } = useBreakpoints();
  const withAside = Boolean(aside) && showAside;
  const maxWidth = layout.contentMaxWidth + (withAside ? layout.asideWidth + spacing.xl : 0);

  return (
    // Sidebar layout has no top bar, and desktop browsers have no notch.
    <SafeAreaView edges={isWide ? [] : ['top']} style={styles.safe}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingHorizontal: isWide ? spacing.xl : spacing.lg },
        ]}>
        <View style={[styles.row, { maxWidth }]}>
          <View style={styles.main}>{children}</View>
          {withAside && <View style={styles.aside}>{aside}</View>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { alignItems: 'center', paddingTop: spacing.lg, paddingBottom: spacing.xxl },
  row: { width: '100%', flexDirection: 'row', gap: spacing.xl, alignItems: 'flex-start' },
  main: { flex: 1, minWidth: 0, gap: spacing.lg },
  aside: { width: layout.asideWidth, gap: spacing.lg },
});
