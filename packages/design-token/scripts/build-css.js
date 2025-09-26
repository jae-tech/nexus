#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import design tokens
import { colors, spacing, typography, borderRadius, boxShadow, animation } from '../dist/index.js';

// Generate CSS custom properties
const generateCSSTokens = () => {
  let css = `:root {
  /* Colors */
`;

  // Add color tokens
  Object.entries(colors).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        css += `  --color-${key}-${subKey}: ${subValue};\n`;
      });
    } else {
      css += `  --color-${key}: ${value};\n`;
    }
  });

  css += `
  /* Spacing */
`;

  // Add spacing tokens
  Object.entries(spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value};\n`;
  });

  css += `
  /* Typography */
`;

  // Add typography tokens
  Object.entries(typography.fontSize).forEach(([key, value]) => {
    const [size, config] = Array.isArray(value) ? value : [value, {}];
    css += `  --font-size-${key}: ${size};\n`;
    if (config.lineHeight) {
      css += `  --line-height-${key}: ${config.lineHeight};\n`;
    }
  });

  css += `
  /* Border Radius */
`;

  Object.entries(borderRadius).forEach(([key, value]) => {
    css += `  --radius-${key}: ${value};\n`;
  });

  css += `
  /* Box Shadow */
`;

  Object.entries(boxShadow).forEach(([key, value]) => {
    css += `  --shadow-${key}: ${value};\n`;
  });

  css += `}`;

  return css;
};

try {
  const cssContent = generateCSSTokens();
  const outputPath = join(__dirname, '..', 'dist', 'tokens.css');
  writeFileSync(outputPath, cssContent);
  console.log('✅ CSS tokens generated successfully at', outputPath);
} catch (error) {
  console.error('❌ Failed to generate CSS tokens:', error.message);
  process.exit(1);
}