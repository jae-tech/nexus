/**
 * Beauty Manager Design Tokens
 * Readdy 원본 디자인을 기반으로 한 통합 디자인 시스템
 */

export const designTokens = {
  // Colors - Readdy 원본 기반 색상 팔레트
  colors: {
    // Primary Colors (Blue)
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // main primary
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },

    // Success Colors (Green)
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },

    // Warning Colors (Yellow/Orange)
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },

    // Danger Colors (Red)
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },

    // Gray Colors (Neutral)
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Special Colors
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '9999px',
  },

  // Border Width
  borderWidth: {
    none: '0',
    thin: '1px',
    medium: '2px',
    thick: '3px',
  },

  // Shadows - Readdy 스타일 그림자
  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },

  // Spacing
  spacing: {
    0: '0',
    px: '1px',
    0.5: '2px',
    1: '4px',
    1.5: '6px',
    2: '8px',
    2.5: '10px',
    3: '12px',
    3.5: '14px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    11: '44px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px',
    24: '96px',
    28: '112px',
    32: '128px',
  },

  // Typography
  typography: {
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // Transitions
  transitions: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    timing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Z-Index
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
  },
};

// Component Tokens - 컴포넌트별 특화된 토큰
export const componentTokens = {
  // Button Component Tokens
  button: {
    // Primary Button
    primary: {
      background: designTokens.colors.primary[600],
      backgroundHover: designTokens.colors.primary[700],
      color: designTokens.colors.white,
      border: 'none',
      borderRadius: designTokens.borderRadius.lg,
      shadow: designTokens.shadows.sm,
      fontSize: {
        sm: designTokens.typography.fontSize.xs,
        md: designTokens.typography.fontSize.sm,
        lg: designTokens.typography.fontSize.base,
      },
      padding: {
        sm: `${designTokens.spacing[1.5]} ${designTokens.spacing[3]}`,
        md: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
        lg: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
      },
    },

    // Secondary/Outline Button
    outline: {
      background: designTokens.colors.white,
      backgroundHover: designTokens.colors.gray[50],
      color: designTokens.colors.gray[700],
      border: `${designTokens.borderWidth.thin} solid ${designTokens.colors.gray[200]}`,
      borderRadius: designTokens.borderRadius.lg,
      shadow: 'none',
      fontSize: {
        sm: designTokens.typography.fontSize.xs,
        md: designTokens.typography.fontSize.sm,
        lg: designTokens.typography.fontSize.base,
      },
      padding: {
        sm: `${designTokens.spacing[1.5]} ${designTokens.spacing[3]}`,
        md: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
        lg: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
      },
    },

    // Ghost Button
    ghost: {
      background: 'transparent',
      backgroundHover: designTokens.colors.gray[100],
      color: designTokens.colors.gray[700],
      border: 'none',
      borderRadius: designTokens.borderRadius.lg,
      shadow: 'none',
    },

    // Success Button
    success: {
      background: designTokens.colors.success[600],
      backgroundHover: designTokens.colors.success[700],
      color: designTokens.colors.white,
      border: 'none',
      borderRadius: designTokens.borderRadius.lg,
      shadow: designTokens.shadows.sm,
    },

    // Danger Button
    danger: {
      background: designTokens.colors.danger[600],
      backgroundHover: designTokens.colors.danger[700],
      color: designTokens.colors.white,
      border: 'none',
      borderRadius: designTokens.borderRadius.lg,
      shadow: designTokens.shadows.sm,
    },
  },

  // Card Component Tokens
  card: {
    background: designTokens.colors.white,
    border: `${designTokens.borderWidth.thin} solid ${designTokens.colors.gray[100]}`,
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing[5],
    shadow: designTokens.shadows.sm,
    shadowHover: designTokens.shadows.md,
  },

  // Input Component Tokens
  input: {
    background: designTokens.colors.white,
    border: `${designTokens.borderWidth.thin} solid ${designTokens.colors.gray[200]}`,
    borderFocus: `${designTokens.borderWidth.thin} solid ${designTokens.colors.primary[500]}`,
    borderRadius: designTokens.borderRadius.lg,
    padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
    fontSize: designTokens.typography.fontSize.sm,
    color: designTokens.colors.gray[900],
    placeholder: designTokens.colors.gray[400],
  },

  // Badge/Tag Component Tokens
  badge: {
    primary: {
      background: designTokens.colors.primary[600],
      color: designTokens.colors.white,
      borderRadius: designTokens.borderRadius.full,
      padding: `${designTokens.spacing[1]} ${designTokens.spacing[4]}`,
      fontSize: designTokens.typography.fontSize.sm,
      fontWeight: designTokens.typography.fontWeight.medium,
      border: `${designTokens.borderWidth.thin} solid ${designTokens.colors.primary[600]}`,
    },
    secondary: {
      background: designTokens.colors.gray[100],
      color: designTokens.colors.gray[700],
      borderRadius: designTokens.borderRadius.full,
      padding: `${designTokens.spacing[1]} ${designTokens.spacing[4]}`,
      fontSize: designTokens.typography.fontSize.sm,
      fontWeight: designTokens.typography.fontWeight.medium,
      border: `${designTokens.borderWidth.thin} solid ${designTokens.colors.gray[200]}`,
    },
    success: {
      background: designTokens.colors.success[100],
      color: designTokens.colors.success[700],
      borderRadius: designTokens.borderRadius.full,
      padding: `${designTokens.spacing[1]} ${designTokens.spacing[4]}`,
      fontSize: designTokens.typography.fontSize.sm,
      fontWeight: designTokens.typography.fontWeight.medium,
      border: `${designTokens.borderWidth.thin} solid transparent`,
    },
  },

  // Dropdown Component Tokens
  dropdown: {
    background: designTokens.colors.white,
    border: `${designTokens.borderWidth.thin} solid ${designTokens.colors.gray[200]}`,
    borderRadius: designTokens.borderRadius.lg,
    padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
    shadow: designTokens.shadows.lg,
    fontSize: designTokens.typography.fontSize.sm,
    color: designTokens.colors.gray[900],
  },
};

// Utility function to create CSS custom properties
export const createCSSVariables = () => {
  const cssVars: Record<string, string> = {};

  // Colors
  Object.entries(designTokens.colors).forEach(([colorName, colorValue]) => {
    if (typeof colorValue === 'string') {
      cssVars[`--color-${colorName}`] = colorValue;
    } else {
      Object.entries(colorValue).forEach(([shade, value]) => {
        cssVars[`--color-${colorName}-${shade}`] = value;
      });
    }
  });

  // Spacing
  Object.entries(designTokens.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value;
  });

  // Border Radius
  Object.entries(designTokens.borderRadius).forEach(([key, value]) => {
    cssVars[`--border-radius-${key}`] = value;
  });

  // Shadows
  Object.entries(designTokens.shadows).forEach(([key, value]) => {
    cssVars[`--shadow-${key}`] = value;
  });

  return cssVars;
};

export default designTokens;