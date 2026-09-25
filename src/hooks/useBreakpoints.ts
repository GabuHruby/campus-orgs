import { useWindowDimensions } from 'react-native';

// Width-based, not platform-based: a phone browser gets the mobile layout,
// and an iPad in landscape gets the sidebar.
export function useBreakpoints() {
  const { width } = useWindowDimensions();
  return {
    /** Tabs move from the bottom to a left sidebar. */
    isWide: width >= 768,
    /** Sidebar shows labels next to icons (otherwise icons only). */
    sidebarExpanded: width >= 1100,
    /** Right-hand "Popular clubs" panel appears. */
    showAside: width >= 1000,
  };
}
