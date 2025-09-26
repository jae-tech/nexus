import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/preload.ts"],
  format: ["esm"],
  dts: false, // Temporarily disable DTS generation for electron package
  sourcemap: true,
  clean: true,
  external: ["electron", "electron-updater"],
  esbuildOptions: (options) => {
    options.conditions = ["module"];
  },
});