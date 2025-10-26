// @ts-expect-error: no types available for @fontsource/inter
import "@fontsource/inter";
// @ts-expect-error: no types available for @fontsource/opendyslexic
import "@fontsource/opendyslexic";

import type { Preview } from "@storybook/nextjs-vite";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { configureStore } from "@reduxjs/toolkit";
import React from "react";

// Import reducers and configuration
import rootReducer from "../src/store/reducers";
import i18n from "../src/lib/config/i18n";
import getTheme from "../src/theme";

// Create a mock store for Storybook (without persistence)
const mockStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

// Define theme options
const lightTheme = getTheme("light", { highContrast: false, dyslexiaFont: false });
const darkTheme = getTheme("dark", { highContrast: false, dyslexiaFont: false });
const highContrastLight = getTheme("light", { highContrast: true, dyslexiaFont: false });
const highContrastDark = getTheme("dark", { highContrast: true, dyslexiaFont: false });

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: "todo",
    },

    // Configure backgrounds to sync with theme
    backgrounds: {
      disable: true, // Disable default Storybook backgrounds
    },

    // Add Next.js router mock
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
        push: () => {},
        replace: () => {},
        back: () => {},
        forward: () => {},
        refresh: () => {},
        prefetch: () => {},
      },
    },
  },

  // Global types for custom toolbar controls
  globalTypes: {
    locale: {
      description: "Internationalization locale",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "de", title: "Deutsch" },
        ],
        title: "Language",
        dynamicTitle: true,
      },
    },
  },

  // Initial global values
  initialGlobals: {
    locale: "en",
    theme: "light",
  },

  // Global decorators to wrap all stories
  decorators: [
    // Language switcher decorator
    (Story, context) => {
      const locale = context.globals.locale || "en";

      // Change i18n language when locale changes
      React.useEffect(() => {
        i18n.changeLanguage(locale);
      }, [locale]);

      return React.createElement(Story);
    },

    // Background color decorator - changes canvas background with theme
    (Story, context) => {
      const themeMode = context.globals.theme || "light";

      // Select appropriate theme based on toolbar selection
      let selectedTheme = lightTheme;
      if (themeMode === "dark") {
        selectedTheme = darkTheme;
      } else if (themeMode === "high-contrast-light") {
        selectedTheme = highContrastLight;
      } else if (themeMode === "high-contrast-dark") {
        selectedTheme = highContrastDark;
      }

      // Get background color from theme
      const backgroundColor = selectedTheme.palette.background.default;
      const textColor = selectedTheme.palette.text.primary;

      // Apply background to Storybook canvas
      React.useEffect(() => {
        const docsRoot = document.querySelector('.docs-story');
        const canvasRoot = document.querySelector('#storybook-root');

        if (docsRoot) {
          (docsRoot as HTMLElement).style.backgroundColor = backgroundColor;
          (docsRoot as HTMLElement).style.color = textColor;
        }

        if (canvasRoot) {
          (canvasRoot as HTMLElement).style.backgroundColor = backgroundColor;
          (canvasRoot as HTMLElement).style.color = textColor;
        }

        // Also set body background for full coverage
        document.body.style.backgroundColor = backgroundColor;
        document.body.style.color = textColor;
      }, [backgroundColor, textColor]);

      return React.createElement(Story);
    },

    // Theme and providers decorator
    (Story, context) => {
      // Get theme from context
      const themeMode = context.globals.theme || "light";

      // Select appropriate theme based on toolbar selection
      let selectedTheme = lightTheme;
      if (themeMode === "dark") {
        selectedTheme = darkTheme;
      } else if (themeMode === "high-contrast-light") {
        selectedTheme = highContrastLight;
      } else if (themeMode === "high-contrast-dark") {
        selectedTheme = highContrastDark;
      }

      return React.createElement(
        Provider,
        ({ store: mockStore } as React.ComponentProps<typeof Provider>),
        React.createElement(
          I18nextProvider,
          { i18n },
          React.createElement(
            LocalizationProvider,
            { dateAdapter: AdapterDayjs },
            React.createElement(
              ThemeProvider,
              { theme: selectedTheme },
              React.createElement(
                React.Fragment,
                null,
                React.createElement(CssBaseline, { key: "css-baseline" }),
                React.createElement(Story, { key: "story" })
              )
            )
          )
        )
      );
    },

    // Theme addon decorator for toolbar
    withThemeFromJSXProvider({
      themes: {
        light: lightTheme,
        dark: darkTheme,
        "high-contrast-light": highContrastLight,
        "high-contrast-dark": highContrastDark,
      },
      defaultTheme: "light",
      Provider: ThemeProvider,
    }),
  ],
};

export default preview;
