import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: false, // Disabled due to path resolution issues with @/ imports
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  banner: {
    js: '"use client"',
  },
  esbuildOptions: (options) => {
    options.conditions = ["module"];
    options.alias = {
      "@": "./src",
    };
  },
});
