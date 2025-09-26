export const colors = {
  // Semantic colors
  background: {
    primary: "hsl(0 0% 100%)",
    secondary: "hsl(210 40% 98%)",
    muted: "hsl(210 40% 96%)",
  },
  foreground: {
    primary: "hsl(222.2 84% 4.9%)",
    secondary: "hsl(215.4 16.3% 46.9%)",
    muted: "hsl(215.4 16.3% 46.9%)",
  },
  primary: {
    50: "hsl(214 100% 97%)",
    100: "hsl(214 95% 93%)",
    200: "hsl(213 97% 87%)",
    300: "hsl(212 96% 78%)",
    400: "hsl(213 94% 68%)",
    500: "hsl(217 91% 60%)",
    600: "hsl(221 83% 53%)",
    700: "hsl(224 76% 48%)",
    800: "hsl(226 71% 40%)",
    900: "hsl(224 64% 33%)",
    950: "hsl(226 55% 21%)",
    DEFAULT: "hsl(217 91% 60%)",
    foreground: "hsl(210 40% 98%)",
  },
  secondary: {
    DEFAULT: "hsl(210 40% 96%)",
    foreground: "hsl(222.2 84% 4.9%)",
  },
  destructive: {
    DEFAULT: "hsl(0 72% 51%)",
    foreground: "hsl(210 40% 98%)",
  },
  muted: {
    DEFAULT: "hsl(210 40% 96%)",
    foreground: "hsl(215.4 16.3% 46.9%)",
  },
  accent: {
    DEFAULT: "hsl(210 40% 96%)",
    foreground: "hsl(222.2 84% 4.9%)",
  },
  border: "hsl(214.3 31.8% 91.4%)",
  input: "hsl(214.3 31.8% 91.4%)",
  ring: "hsl(217 91% 60%)",
} as const;

export const spacing = {
  0: "0px",
  px: "1px",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  11: "2.75rem", // 44px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  28: "7rem", // 112px
  32: "8rem", // 128px
  36: "9rem", // 144px
  40: "10rem", // 160px
  44: "11rem", // 176px
  48: "12rem", // 192px
  52: "13rem", // 208px
  56: "14rem", // 224px
  60: "15rem", // 240px
  64: "16rem", // 256px
  72: "18rem", // 288px
  80: "20rem", // 320px
  96: "24rem", // 384px
} as const;

export const typography = {
  fontFamily: {
    sans: [
      "Inter Variable",
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ],
    mono: [
      "JetBrains Mono Variable",
      "JetBrains Mono",
      "Fira Code",
      "Monaco",
      "Cascadia Code",
      "Consolas",
      "monospace",
    ],
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
    base: ["1rem", { lineHeight: "1.5rem" }], // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
    "5xl": ["3rem", { lineHeight: "1" }], // 48px
    "6xl": ["3.75rem", { lineHeight: "1" }], // 60px
    "7xl": ["4.5rem", { lineHeight: "1" }], // 72px
    "8xl": ["6rem", { lineHeight: "1" }], // 96px
    "9xl": ["8rem", { lineHeight: "1" }], // 128px
  },
  fontWeight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },
} as const;

export const borderRadius = {
  none: "0px",
  sm: "0.125rem", // 2px
  DEFAULT: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

export const boxShadow = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  none: "none",
} as const;

export const animation = {
  none: "none",
  spin: "spin 1s linear infinite",
  ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
  pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  bounce: "bounce 1s infinite",
  "fade-in": "fadeIn 0.5s ease-in-out",
  "fade-out": "fadeOut 0.5s ease-in-out",
  "slide-in-left": "slideInLeft 0.3s ease-out",
  "slide-in-right": "slideInRight 0.3s ease-out",
  "slide-in-up": "slideInUp 0.3s ease-out",
  "slide-in-down": "slideInDown 0.3s ease-out",
} as const;

export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type BorderRadius = typeof borderRadius;
export type BoxShadow = typeof boxShadow;
export type Animation = typeof animation;
