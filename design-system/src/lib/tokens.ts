// ============================================================================
// DESIGN SYSTEM TOKENS
// Production-ready design tokens for Figma export
// ============================================================================

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface SemanticColors {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;
}

export interface SurfaceColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  modal: string;
  modalForeground: string;
  muted: string;
  mutedForeground: string;
}

export interface BorderColors {
  default: string;
  muted: string;
  strong: string;
  focus: string;
}

// ============================================================================
// COLOR GENERATION UTILITIES
// ============================================================================

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function generateColorScale(baseColor: string): ColorScale {
  const { h, s } = hexToHSL(baseColor);
  
  // Generate scale with proper luminosity distribution for accessibility
  return {
    50: hslToHex(h, Math.min(s * 0.3, 100), 97),
    100: hslToHex(h, Math.min(s * 0.4, 100), 94),
    200: hslToHex(h, Math.min(s * 0.5, 100), 86),
    300: hslToHex(h, Math.min(s * 0.6, 100), 76),
    400: hslToHex(h, Math.min(s * 0.8, 100), 64),
    500: hslToHex(h, s, 50),
    600: hslToHex(h, Math.min(s * 1.1, 100), 42),
    700: hslToHex(h, Math.min(s * 1.15, 100), 34),
    800: hslToHex(h, Math.min(s * 1.2, 100), 26),
    900: hslToHex(h, Math.min(s * 1.25, 100), 18),
    950: hslToHex(h, Math.min(s * 1.3, 100), 10),
  };
}

export function generateDarkModeScale(lightScale: ColorScale): ColorScale {
  // Invert luminosity with enhanced contrast for dark mode
  return {
    50: lightScale[950],
    100: lightScale[900],
    200: lightScale[800],
    300: lightScale[700],
    400: lightScale[600],
    500: lightScale[500],
    600: lightScale[400],
    700: lightScale[300],
    800: lightScale[200],
    900: lightScale[100],
    950: lightScale[50],
  };
}

// ============================================================================
// DEFAULT COLOR PALETTE
// ============================================================================

export const defaultColors: SemanticColors = {
  primary: generateColorScale('#2563eb'),      // Blue
  secondary: generateColorScale('#7c3aed'),    // Purple
  accent: generateColorScale('#06b6d4'),       // Cyan
  neutral: generateColorScale('#64748b'),      // Slate
  success: generateColorScale('#22c55e'),      // Green
  warning: generateColorScale('#f59e0b'),      // Amber
  error: generateColorScale('#ef4444'),        // Red
  info: generateColorScale('#3b82f6'),         // Light Blue
};

export const lightSurfaces: SurfaceColors = {
  background: '#ffffff',
  foreground: '#0f172a',
  card: '#ffffff',
  cardForeground: '#0f172a',
  popover: '#ffffff',
  popoverForeground: '#0f172a',
  modal: '#ffffff',
  modalForeground: '#0f172a',
  muted: '#f1f5f9',
  mutedForeground: '#64748b',
};

export const darkSurfaces: SurfaceColors = {
  background: '#0a0a0b',
  foreground: '#fafafa',
  card: '#18181b',
  cardForeground: '#fafafa',
  popover: '#18181b',
  popoverForeground: '#fafafa',
  modal: '#27272a',
  modalForeground: '#fafafa',
  muted: '#27272a',
  mutedForeground: '#a1a1aa',
};

export const lightBorders: BorderColors = {
  default: 'rgba(0, 0, 0, 0.08)',
  muted: 'rgba(0, 0, 0, 0.04)',
  strong: 'rgba(0, 0, 0, 0.16)',
  focus: '#2563eb',
};

export const darkBorders: BorderColors = {
  default: 'rgba(255, 255, 255, 0.08)',
  muted: 'rgba(255, 255, 255, 0.04)',
  strong: 'rgba(255, 255, 255, 0.16)',
  focus: '#3b82f6',
};

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export interface TypeStyle {
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  fontWeight: number;
}

export interface TypographyScale {
  display: {
    xl: TypeStyle;
    lg: TypeStyle;
    md: TypeStyle;
    sm: TypeStyle;
  };
  heading: {
    h1: TypeStyle;
    h2: TypeStyle;
    h3: TypeStyle;
    h4: TypeStyle;
    h5: TypeStyle;
    h6: TypeStyle;
  };
  body: {
    xl: TypeStyle;
    lg: TypeStyle;
    md: TypeStyle;
    sm: TypeStyle;
    xs: TypeStyle;
  };
  caption: TypeStyle;
  overline: TypeStyle;
}

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const typography: TypographyScale = {
  display: {
    xl: { fontSize: '72px', lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: fontWeights.bold },
    lg: { fontSize: '60px', lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: fontWeights.bold },
    md: { fontSize: '48px', lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: fontWeights.bold },
    sm: { fontSize: '36px', lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: fontWeights.semibold },
  },
  heading: {
    h1: { fontSize: '32px', lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: fontWeights.semibold },
    h2: { fontSize: '28px', lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: fontWeights.semibold },
    h3: { fontSize: '24px', lineHeight: '1.35', letterSpacing: '-0.005em', fontWeight: fontWeights.semibold },
    h4: { fontSize: '20px', lineHeight: '1.4', letterSpacing: '0', fontWeight: fontWeights.medium },
    h5: { fontSize: '18px', lineHeight: '1.4', letterSpacing: '0', fontWeight: fontWeights.medium },
    h6: { fontSize: '16px', lineHeight: '1.5', letterSpacing: '0', fontWeight: fontWeights.medium },
  },
  body: {
    xl: { fontSize: '20px', lineHeight: '1.6', letterSpacing: '0', fontWeight: fontWeights.regular },
    lg: { fontSize: '18px', lineHeight: '1.6', letterSpacing: '0', fontWeight: fontWeights.regular },
    md: { fontSize: '16px', lineHeight: '1.6', letterSpacing: '0', fontWeight: fontWeights.regular },
    sm: { fontSize: '14px', lineHeight: '1.5', letterSpacing: '0', fontWeight: fontWeights.regular },
    xs: { fontSize: '12px', lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: fontWeights.regular },
  },
  caption: { fontSize: '12px', lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: fontWeights.regular },
  overline: { fontSize: '11px', lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: fontWeights.medium },
};

// ============================================================================
// SPACING TOKENS
// ============================================================================

export const spacing = {
  0: '0px',
  px: '1px',
  0.5: '2px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
} as const;

export const semanticSpacing = {
  compact: {
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[3],
    lg: spacing[4],
    xl: spacing[6],
  },
  default: {
    xs: spacing[2],
    sm: spacing[3],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
  },
  comfortable: {
    xs: spacing[3],
    sm: spacing[4],
    md: spacing[6],
    lg: spacing[8],
    xl: spacing[12],
  },
} as const;

// ============================================================================
// BORDER RADIUS TOKENS
// ============================================================================

export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
} as const;

// ============================================================================
// ELEVATION / SHADOW TOKENS
// ============================================================================

export interface ElevationLevel {
  light: string;
  dark: string;
}

export const elevation: Record<1 | 2 | 3 | 4 | 5, ElevationLevel> = {
  1: {
    light: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    dark: '0 1px 2px 0 rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.03)',
  },
  2: {
    light: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    dark: '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)',
  },
  3: {
    light: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    dark: '0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
  },
  4: {
    light: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    dark: '0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -4px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
  },
  5: {
    light: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    dark: '0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 8px 10px -6px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.07)',
  },
};

// ============================================================================
// WCAG CONTRAST UTILITIES
// ============================================================================

export function getLuminance(hex: string): number {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 0;
  
  const [r, g, b] = [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function isWCAGAACompliant(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

export function isWCAGAAACompliant(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

// ============================================================================
// TOKEN EXPORT UTILITIES
// ============================================================================

export interface DesignTokens {
  colors: SemanticColors;
  surfaces: {
    light: SurfaceColors;
    dark: SurfaceColors;
  };
  borders: {
    light: BorderColors;
    dark: BorderColors;
  };
  typography: TypographyScale;
  spacing: typeof spacing;
  semanticSpacing: typeof semanticSpacing;
  borderRadius: typeof borderRadius;
  elevation: typeof elevation;
  fontWeights: typeof fontWeights;
}

export function createDesignTokens(customColors?: Partial<{
  primary: string;
  secondary: string;
  accent: string;
}>): DesignTokens {
  const colors: SemanticColors = {
    primary: customColors?.primary ? generateColorScale(customColors.primary) : defaultColors.primary,
    secondary: customColors?.secondary ? generateColorScale(customColors.secondary) : defaultColors.secondary,
    accent: customColors?.accent ? generateColorScale(customColors.accent) : defaultColors.accent,
    neutral: defaultColors.neutral,
    success: defaultColors.success,
    warning: defaultColors.warning,
    error: defaultColors.error,
    info: defaultColors.info,
  };
  
  return {
    colors,
    surfaces: {
      light: lightSurfaces,
      dark: darkSurfaces,
    },
    borders: {
      light: lightBorders,
      dark: darkBorders,
    },
    typography,
    spacing,
    semanticSpacing,
    borderRadius,
    elevation,
    fontWeights,
  };
}

export const defaultTokens = createDesignTokens();
