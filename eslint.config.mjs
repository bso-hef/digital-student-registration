// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
//
// NOTE: `eslint` is intentionally pinned to ^9 (not ^10) in package.json.
// eslint-config-next@16 peer-requires eslint >=9 but bundles
// eslint-plugin-react@7.37.x, which still calls the `context.getFilename()`
// API removed in ESLint 10 and crashes under it. No ESLint-10-compatible
// eslint-plugin-react exists yet, so ESLint 10 is not viable for the Next lint
// stack. Revisit once eslint-plugin-react ships ESLint 10 support.
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
    // Allow intentionally-unused arguments/variables prefixed with `_`
    // (e.g. interface methods that must keep a parameter for signature
    // compatibility, like the SSR noop redux-persist storage).
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
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
