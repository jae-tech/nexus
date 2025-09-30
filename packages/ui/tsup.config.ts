import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: false, // Temporarily disabled due to path resolution issues
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
