import { 
  DesignTokens, 
  ColorScale, 
  typography, 
  spacing, 
  borderRadius, 
  elevation,
  semanticSpacing,
  fontWeights
} from './tokens';

// ============================================================================
// CSS CUSTOM PROPERTIES EXPORT
// ============================================================================

export function exportToCSS(tokens: DesignTokens): string {
  const lines: string[] = [
    '/* ============================================================================',
    ' * DESIGN SYSTEM CSS CUSTOM PROPERTIES',
    ' * Generated automatically - do not edit manually',
    ' * ============================================================================ */',
    '',
    ':root {',
  ];

  // Color scales
  const colorNames = ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'] as const;
  
  lines.push('  /* Color Scales */');
  for (const colorName of colorNames) {
    const scale = tokens.colors[colorName] as ColorScale;
    for (const [shade, value] of Object.entries(scale)) {
      lines.push(`  --color-${colorName}-${shade}: ${value};`);
    }
    lines.push('');
  }

  // Light mode surfaces
  lines.push('  /* Surface Colors - Light Mode */');
  for (const [key, value] of Object.entries(tokens.surfaces.light)) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    lines.push(`  --surface-${cssKey}: ${value};`);
  }
  lines.push('');

  // Light mode borders
  lines.push('  /* Border Colors - Light Mode */');
  for (const [key, value] of Object.entries(tokens.borders.light)) {
    lines.push(`  --border-${key}: ${value};`);
  }
  lines.push('');

  // Typography
  lines.push('  /* Typography - Font Weights */');
  for (const [key, value] of Object.entries(fontWeights)) {
    lines.push(`  --font-weight-${key}: ${value};`);
  }
  lines.push('');

  // Spacing
  lines.push('  /* Spacing Scale */');
  for (const [key, value] of Object.entries(spacing)) {
    lines.push(`  --spacing-${key}: ${value};`);
  }
  lines.push('');

  // Border Radius
  lines.push('  /* Border Radius */');
  for (const [key, value] of Object.entries(borderRadius)) {
    lines.push(`  --radius-${key}: ${value};`);
  }
  lines.push('');

  // Elevation - Light
  lines.push('  /* Elevation - Light Mode */');
  for (const [level, shadows] of Object.entries(elevation)) {
    lines.push(`  --shadow-${level}: ${shadows.light};`);
  }
  lines.push('');

  lines.push('}');
  lines.push('');

  // Dark mode
  lines.push('.dark, [data-theme="dark"] {');
  
  lines.push('  /* Surface Colors - Dark Mode */');
  for (const [key, value] of Object.entries(tokens.surfaces.dark)) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    lines.push(`  --surface-${cssKey}: ${value};`);
  }
  lines.push('');

  lines.push('  /* Border Colors - Dark Mode */');
  for (const [key, value] of Object.entries(tokens.borders.dark)) {
    lines.push(`  --border-${key}: ${value};`);
  }
  lines.push('');

  lines.push('  /* Elevation - Dark Mode */');
  for (const [level, shadows] of Object.entries(elevation)) {
    lines.push(`  --shadow-${level}: ${shadows.dark};`);
  }
  
  lines.push('}');
  lines.push('');

  // Typography classes
  lines.push('/* Typography Utility Classes */');
  
  // Display styles
  for (const [size, style] of Object.entries(typography.display)) {
    lines.push(`.text-display-${size} {`);
    lines.push(`  font-size: ${style.fontSize};`);
    lines.push(`  line-height: ${style.lineHeight};`);
    lines.push(`  letter-spacing: ${style.letterSpacing};`);
    lines.push(`  font-weight: ${style.fontWeight};`);
    lines.push('}');
  }

  // Heading styles
  for (const [level, style] of Object.entries(typography.heading)) {
    lines.push(`.text-${level} {`);
    lines.push(`  font-size: ${style.fontSize};`);
    lines.push(`  line-height: ${style.lineHeight};`);
    lines.push(`  letter-spacing: ${style.letterSpacing};`);
    lines.push(`  font-weight: ${style.fontWeight};`);
    lines.push('}');
  }

  // Body styles
  for (const [size, style] of Object.entries(typography.body)) {
    lines.push(`.text-body-${size} {`);
    lines.push(`  font-size: ${style.fontSize};`);
    lines.push(`  line-height: ${style.lineHeight};`);
    lines.push(`  letter-spacing: ${style.letterSpacing};`);
    lines.push(`  font-weight: ${style.fontWeight};`);
    lines.push('}');
  }

  lines.push('.text-caption {');
  lines.push(`  font-size: ${typography.caption.fontSize};`);
  lines.push(`  line-height: ${typography.caption.lineHeight};`);
  lines.push(`  letter-spacing: ${typography.caption.letterSpacing};`);
  lines.push(`  font-weight: ${typography.caption.fontWeight};`);
  lines.push('}');

  lines.push('.text-overline {');
  lines.push(`  font-size: ${typography.overline.fontSize};`);
  lines.push(`  line-height: ${typography.overline.lineHeight};`);
  lines.push(`  letter-spacing: ${typography.overline.letterSpacing};`);
  lines.push(`  font-weight: ${typography.overline.fontWeight};`);
  lines.push('  text-transform: uppercase;');
  lines.push('}');

  return lines.join('\n');
}

// ============================================================================
// TAILWIND CONFIG EXPORT
// ============================================================================

export function exportToTailwind(tokens: DesignTokens): string {
  const colorNames = ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'] as const;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colors: Record<string, any> = {};
  for (const colorName of colorNames) {
    colors[colorName] = { ...tokens.colors[colorName] };
  }

  const config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
        colors: {
          ...colors,
          background: 'var(--surface-background)',
          foreground: 'var(--surface-foreground)',
          card: {
            DEFAULT: 'var(--surface-card)',
            foreground: 'var(--surface-card-foreground)',
          },
          popover: {
            DEFAULT: 'var(--surface-popover)',
            foreground: 'var(--surface-popover-foreground)',
          },
          muted: {
            DEFAULT: 'var(--surface-muted)',
            foreground: 'var(--surface-muted-foreground)',
          },
          border: {
            DEFAULT: 'var(--border-default)',
            muted: 'var(--border-muted)',
            strong: 'var(--border-strong)',
            focus: 'var(--border-focus)',
          },
        },
        spacing: Object.fromEntries(
          Object.entries(spacing).map(([key, value]) => [key, value])
        ),
        borderRadius: borderRadius,
        boxShadow: {
          '1': 'var(--shadow-1)',
          '2': 'var(--shadow-2)',
          '3': 'var(--shadow-3)',
          '4': 'var(--shadow-4)',
          '5': 'var(--shadow-5)',
        },
        fontSize: {
          'display-xl': [typography.display.xl.fontSize, { lineHeight: typography.display.xl.lineHeight, letterSpacing: typography.display.xl.letterSpacing }],
          'display-lg': [typography.display.lg.fontSize, { lineHeight: typography.display.lg.lineHeight, letterSpacing: typography.display.lg.letterSpacing }],
          'display-md': [typography.display.md.fontSize, { lineHeight: typography.display.md.lineHeight, letterSpacing: typography.display.md.letterSpacing }],
          'display-sm': [typography.display.sm.fontSize, { lineHeight: typography.display.sm.lineHeight, letterSpacing: typography.display.sm.letterSpacing }],
          'h1': [typography.heading.h1.fontSize, { lineHeight: typography.heading.h1.lineHeight, letterSpacing: typography.heading.h1.letterSpacing }],
          'h2': [typography.heading.h2.fontSize, { lineHeight: typography.heading.h2.lineHeight, letterSpacing: typography.heading.h2.letterSpacing }],
          'h3': [typography.heading.h3.fontSize, { lineHeight: typography.heading.h3.lineHeight, letterSpacing: typography.heading.h3.letterSpacing }],
          'h4': [typography.heading.h4.fontSize, { lineHeight: typography.heading.h4.lineHeight, letterSpacing: typography.heading.h4.letterSpacing }],
          'h5': [typography.heading.h5.fontSize, { lineHeight: typography.heading.h5.lineHeight, letterSpacing: typography.heading.h5.letterSpacing }],
          'h6': [typography.heading.h6.fontSize, { lineHeight: typography.heading.h6.lineHeight, letterSpacing: typography.heading.h6.letterSpacing }],
          'body-xl': [typography.body.xl.fontSize, { lineHeight: typography.body.xl.lineHeight }],
          'body-lg': [typography.body.lg.fontSize, { lineHeight: typography.body.lg.lineHeight }],
          'body-md': [typography.body.md.fontSize, { lineHeight: typography.body.md.lineHeight }],
          'body-sm': [typography.body.sm.fontSize, { lineHeight: typography.body.sm.lineHeight }],
          'body-xs': [typography.body.xs.fontSize, { lineHeight: typography.body.xs.lineHeight }],
          'caption': [typography.caption.fontSize, { lineHeight: typography.caption.lineHeight, letterSpacing: typography.caption.letterSpacing }],
          'overline': [typography.overline.fontSize, { lineHeight: typography.overline.lineHeight, letterSpacing: typography.overline.letterSpacing }],
        },
        fontWeight: fontWeights,
      },
    },
  };

  return `// tailwind.config.ts
// Design System Tailwind Configuration
// Generated automatically - customize as needed

import type { Config } from 'tailwindcss';

const config: Config = ${JSON.stringify(config, null, 2)};

export default config;`;
}

// ============================================================================
// FIGMA JSON EXPORT
// ============================================================================

interface FigmaVariable {
  name: string;
  type: 'COLOR' | 'FLOAT' | 'STRING';
  valuesByMode: {
    light?: string | number;
    dark?: string | number;
  };
}

interface FigmaVariableCollection {
  name: string;
  modes: string[];
  variables: FigmaVariable[];
}

export function exportToFigmaJSON(tokens: DesignTokens): string {
  const collections: FigmaVariableCollection[] = [];

  // Color collection
  const colorVariables: FigmaVariable[] = [];
  const colorNames = ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'] as const;
  
  for (const colorName of colorNames) {
    const scale = tokens.colors[colorName] as ColorScale;
    for (const [shade, value] of Object.entries(scale)) {
      colorVariables.push({
        name: `color/${colorName}/${shade}`,
        type: 'COLOR',
        valuesByMode: { light: value, dark: value },
      });
    }
  }

  // Surface colors
  for (const [key, lightValue] of Object.entries(tokens.surfaces.light)) {
    const darkValue = tokens.surfaces.dark[key as keyof typeof tokens.surfaces.dark];
    const formattedKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    colorVariables.push({
      name: `surface/${formattedKey}`,
      type: 'COLOR',
      valuesByMode: { light: lightValue, dark: darkValue },
    });
  }

  // Border colors
  for (const [key, lightValue] of Object.entries(tokens.borders.light)) {
    const darkValue = tokens.borders.dark[key as keyof typeof tokens.borders.dark];
    colorVariables.push({
      name: `border/${key}`,
      type: 'COLOR',
      valuesByMode: { light: lightValue, dark: darkValue },
    });
  }

  collections.push({
    name: 'Colors',
    modes: ['light', 'dark'],
    variables: colorVariables,
  });

  // Spacing collection
  const spacingVariables: FigmaVariable[] = [];
  for (const [key, value] of Object.entries(spacing)) {
    spacingVariables.push({
      name: `spacing/${key}`,
      type: 'FLOAT',
      valuesByMode: { light: parseFloat(value) },
    });
  }

  // Semantic spacing
  for (const [density, scales] of Object.entries(semanticSpacing)) {
    for (const [size, value] of Object.entries(scales)) {
      spacingVariables.push({
        name: `spacing/${density}/${size}`,
        type: 'FLOAT',
        valuesByMode: { light: parseFloat(value as string) },
      });
    }
  }

  collections.push({
    name: 'Spacing',
    modes: ['light'],
    variables: spacingVariables,
  });

  // Border radius collection
  const radiusVariables: FigmaVariable[] = [];
  for (const [key, value] of Object.entries(borderRadius)) {
    radiusVariables.push({
      name: `radius/${key}`,
      type: 'FLOAT',
      valuesByMode: { light: parseFloat(value) || (value === '9999px' ? 9999 : 0) },
    });
  }

  collections.push({
    name: 'Border Radius',
    modes: ['light'],
    variables: radiusVariables,
  });

  // Typography collection (as strings for reference)
  const typographyVariables: FigmaVariable[] = [];
  
  for (const [weight, value] of Object.entries(fontWeights)) {
    typographyVariables.push({
      name: `font-weight/${weight}`,
      type: 'FLOAT',
      valuesByMode: { light: value },
    });
  }

  // Display
  for (const [size, style] of Object.entries(typography.display)) {
    typographyVariables.push({
      name: `typography/display/${size}/font-size`,
      type: 'FLOAT',
      valuesByMode: { light: parseFloat(style.fontSize) },
    });
    typographyVariables.push({
      name: `typography/display/${size}/line-height`,
      type: 'FLOAT',
      valuesByMode: { light: parseFloat(style.lineHeight) },
    });
  }

  // Headings
  for (const [level, style] of Object.entries(typography.heading)) {
    typographyVariables.push({
      name: `typography/heading/${level}/font-size`,
      type: 'FLOAT',
      valuesByMode: { light: parseFloat(style.fontSize) },
    });
    typographyVariables.push({
      name: `typography/heading/${level}/line-height`,
      type: 'FLOAT',
      valuesByMode: { light: parseFloat(style.lineHeight) },
    });
  }

  // Body
  for (const [size, style] of Object.entries(typography.body)) {
    typographyVariables.push({
      name: `typography/body/${size}/font-size`,
      type: 'FLOAT',
      valuesByMode: { light: parseFloat(style.fontSize) },
    });
    typographyVariables.push({
      name: `typography/body/${size}/line-height`,
      type: 'FLOAT',
      valuesByMode: { light: parseFloat(style.lineHeight) },
    });
  }

  collections.push({
    name: 'Typography',
    modes: ['light'],
    variables: typographyVariables,
  });

  const figmaExport = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    collections,
  };

  return JSON.stringify(figmaExport, null, 2);
}

// ============================================================================
// TYPESCRIPT THEME OBJECT EXPORT
// ============================================================================

export function exportToTypeScript(tokens: DesignTokens): string {
  return `// Design System Theme Object
// Generated automatically - do not edit manually

export const theme = ${JSON.stringify(tokens, null, 2)} as const;

export type Theme = typeof theme;
export type ColorScale = typeof theme.colors.primary;
export type SemanticColors = typeof theme.colors;
export type SurfaceColors = typeof theme.surfaces.light;
export type BorderColors = typeof theme.borders.light;
export type TypographyScale = typeof theme.typography;
export type SpacingScale = typeof theme.spacing;
export type BorderRadiusScale = typeof theme.borderRadius;
export type ElevationScale = typeof theme.elevation;

// Utility types for component props
export type ColorName = keyof SemanticColors;
export type ColorShade = keyof ColorScale;
export type SpacingKey = keyof SpacingScale;
export type RadiusKey = keyof BorderRadiusScale;
export type ElevationLevel = keyof ElevationScale;

export default theme;
`;
}

// ============================================================================
// COMBINED EXPORT
// ============================================================================

export interface ExportBundle {
  css: string;
  tailwind: string;
  figmaJSON: string;
  typescript: string;
}

export function exportAllFormats(tokens: DesignTokens): ExportBundle {
  return {
    css: exportToCSS(tokens),
    tailwind: exportToTailwind(tokens),
    figmaJSON: exportToFigmaJSON(tokens),
    typescript: exportToTypeScript(tokens),
  };
}
