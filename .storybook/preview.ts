import type { Preview } from "@storybook/nextjs-vite";
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

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },

    // Add Next.js router mock
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },

  // Global decorators to wrap all stories
  decorators: [
    (Story) =>
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(
          I18nextProvider,
          { i18n },
          React.createElement(
            LocalizationProvider,
            { dateAdapter: AdapterDayjs },
            React.createElement(
              ThemeProvider,
              { theme: getTheme("light", { highContrast: false, dyslexiaFont: false }) },
              React.createElement(React.Fragment, null, [
                React.createElement(CssBaseline, { key: "css-baseline" }),
                React.createElement(Story, { key: "story" }),
              ])
            )
          )
        )
      ),
  ],
};

export default preview;
