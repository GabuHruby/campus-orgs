// Single source of truth for colors, spacing, and shape. Screens import from here,
// so a palette change is a one-file edit.

export const palette = {
  navy900: '#011634',
  navy700: '#164075',
  blue600: '#205CA9',
  blue500: '#2F79D8',
  green500: '#96C223',
} as const;

export const colors = {
  // Brand
  primary: palette.blue600,
  primaryDark: palette.navy700,
  accent: palette.blue500,
  cta: palette.green500,
  // Text on the green CTA must be navy: white on #96C223 fails WCAG contrast.
  onCta: palette.navy900,

  // Surfaces
  background: '#F4F7FB',
  surface: '#FFFFFF',
  surfaceTint: '#EAF1FB',
  border: '#DCE4EF',
  sidebar: palette.navy900,

  // Text
  text: palette.navy900,
  textMuted: '#5B6B82',
  textSubtle: '#8A98AD',
  onDark: '#FFFFFF',
  onDarkMuted: '#A9B8CE',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const layout = {
  // Feed column never stretches past this on desktop.
  contentMaxWidth: 640,
  asideWidth: 300,
  sidebarWidth: 240,
  sidebarCompactWidth: 80,
} as const;

