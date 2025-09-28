import { defineConfig } from "tsup";
export default defineConfig({
    entry: ["electron/main.ts"],
    outDir: "dist/electron",
    format: ["esm"],
    target: "node18",
    platform: "node",
    sourcemap: true,
    clean: true,
    external: ["electron"],
    banner: {
        js: `
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
    `.trim(),
    },
});
