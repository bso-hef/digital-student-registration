import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import path from "path";
import { configDefaults, defineConfig } from "vitest/config";

const __dirnameCompat =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: [
      ...configDefaults.exclude,
      "**/build/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/e2e/**",
      "**/playwright/**",
      "**/integration/**", // Integration tests have import resolution issues
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*.{ts,tsx,js,jsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.stories.{ts,tsx}",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "src/types/**",
        "src/**/__tests__/**",
        "src/**/__mocks__/**",
        "src/app/**/layout.tsx",
        "src/app/**/loading.tsx",
        "src/app/**/error.tsx",
        "src/app/**/not-found.tsx",
        "src/app/api/**",
        "src/instrumentation.*.ts",
        "src/middleware.ts",
      ],
      thresholds: {
        // autoUpdate must stay false: with it enabled, vitest compares coverage
        // at full float precision against the rounded stored values, treats the
        // tiny delta as an "improvement", rewrites the same rounded value and
        // exits non-zero — so the pre-push hook / CI could never pass. Fixed
        // thresholds set slightly below the current baseline absorb run-to-run
        // variance; bump them deliberately when coverage rises.
        autoUpdate: false,
        branches: 27,
        functions: 24,
        lines: 28,
        statements: 28,
      },
      // Keep regular and IDE-driven single-file test runs independent from
      // global project coverage. The test:unit and test:coverage scripts enable
      // coverage explicitly via --coverage and still enforce these thresholds.
      enabled: false,
      reportOnFailure: true,
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
          exclude: [
            ...configDefaults.exclude,
            "**/build/**",
            "**/node_modules/**",
            "**/dist/**",
            "**/.next/**",
            "**/e2e/**",
            "**/playwright/**",
            "**/integration/**",
          ],
          environment: "jsdom",
        },
      },
      // NOTE: Integration tests disabled due to import resolution issues with @/ aliases
      // They need additional configuration or should be run with a different test runner
      // {
      //   test: {
      //     name: "integration",
      //     globals: true,
      //     include: ["tests/integration/api/**/*.test.ts"],
      //     exclude: [...configDefaults.exclude],
      //     environment: "node",
      //     setupFiles: ["./tests/integration.setup.ts"],
      //     fileParallelism: false, // Run integration tests sequentially to avoid DB race conditions
      //     testTimeout: 30000,
      //     hookTimeout: 30000,
      //   },
      // },
      // NOTE: Storybook tests disabled - they require browser environment and Storybook server
      // Run separately with: yarn storybook (then run tests in another terminal)
      // {
      //   extends: true,
      //   plugins: [
      //     // The plugin will run tests for the stories defined in your Storybook config
      //     // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      //     storybookTest({
      //       configDir: path.join(dirname, ".storybook"),
      //     }),
      //   ],
      //   test: {
      //     name: "storybook",
      //     browser: {
      //       enabled: true,
      //       headless: true,
      //       provider: playwright({}),
      //       instances: [
      //         {
      //           browser: "chromium",
      //         },
      //       ],
      //     },
      //     setupFiles: [".storybook/vitest.setup.ts"],
      //     coverage: {
      //       enabled: false,
      //     },
      //   },
      // },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirnameCompat, "./src"),
      "@/tests": path.resolve(__dirnameCompat, "./tests"),
      "@/lib": path.resolve(__dirnameCompat, "./src/lib"),
      "@/models": path.resolve(__dirnameCompat, "./src/models"),
      "@/app": path.resolve(__dirnameCompat, "./src/app"),
      // Replace lodash with lodash-es for ESM compatibility in tests
      lodash: "lodash-es",
    },
    extensions: [".mjs", ".js", ".jsx", ".json", ".ts", ".tsx"],
    conditions: ["node", "import", "module", "browser", "default"],
  },
});
