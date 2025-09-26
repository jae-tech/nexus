import nexusConfig from "@nexus/eslint-config";

export default [
  ...nexusConfig,
  {
    ignores: [
      "apps/*/dist/**",
      "packages/*/dist/**",
      "packages/*/build/**",
      "**/node_modules/**",
      "**/.turbo/**",
    ],
  },
  {
    files: ["scripts/**/*.{js,cjs}"],
    languageOptions: {
      globals: {
        __dirname: "readonly",
        __filename: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        process: "readonly",
      },
    },
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
