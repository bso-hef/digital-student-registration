// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { FlatCompat } from "@eslint/eslintrc";
import storybook from "eslint-plugin-storybook";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      ".storybook-static/**",
      "storybook-static/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...storybook.configs["flat/recommended"],
  {
    files: [
      "tests/**/*.ts",
      "tests/**/*.tsx",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    files: ["**/*.stories.tsx", "**/*.stories.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

export default eslintConfig;
