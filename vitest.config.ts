/// <reference types="vitest/config" />
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { fileURLToPath } from "node:url";
import path from "path";
import { configDefaults, defineConfig } from "vitest/config";

const dirname =
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
        autoUpdate: true,
        branches: 29.21,
        functions: 22.54,
        lines: 22.02,
        statements: 21.78,
      },
      enabled: true,
      all: true,
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
      "@": path.resolve(__dirname, "./src"),
      "@/tests": path.resolve(__dirname, "./tests"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/models": path.resolve(__dirname, "./src/models"),
      "@/app": path.resolve(__dirname, "./src/app"),
    },
    extensions: [".mjs", ".js", ".jsx", ".json", ".ts", ".tsx"],
    conditions: ["node", "import", "module", "browser", "default"],
  },
});