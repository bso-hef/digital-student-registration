// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import storybook from "eslint-plugin-storybook";

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
  // eslint-config-next 16 ships native flat configs; import them directly
  // instead of bridging the legacy shareable configs through FlatCompat.
  ...nextCoreWebVitals,
  ...nextTypescript,
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
      // Tests use the `const { field, ...rest } = obj` idiom to omit a field;
      // ignoreRestSiblings keeps those intentional bindings from being flagged.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { ignoreRestSiblings: true },
      ],
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
