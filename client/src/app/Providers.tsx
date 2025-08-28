"use client";

import { useEffect } from "react";

import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import * as AppInitializerService from "@/lib/config/AppInitializer";

import ThemeWrapper from "@/theme/ThemeWrapper";

import i18n from "../lib/config/i18n";
import { persistor, store } from "../store/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AppInitializerService.trapApplicationTouched();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <I18nextProvider i18n={i18n}>
          <ThemeWrapper>{children}</ThemeWrapper>
        </I18nextProvider>
      </PersistGate>
    </Provider>
  );
}
