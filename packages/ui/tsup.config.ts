import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: false, // 일시적으로 비활성화 (개발 모드에서는 불필요)
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
