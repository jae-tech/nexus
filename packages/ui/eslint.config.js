import { base } from "@nexus/eslint-config";

export default [
  ...base,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // 라이브러리 특화 규칙
      "@typescript-eslint/explicit-function-return-type": "warn",
    },
  },
];
