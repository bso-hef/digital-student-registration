import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { vi } from 'vitest';

// Import reducers
import uiReducer from '@/store/reducers/ui';
import studentReducer from '@/store/reducers/student';
import classReducer from '@/store/reducers/class';
import dashboardReducer from '@/store/reducers/dashboard';
import appSettingsReducer from '@/store/reducers/appSettings';
import authReducer from '@/store/reducers/auth';
import auditLogReducer from '@/store/reducers/auditLog';

// Import ThemeWrapper for proper theme context
import ThemeWrapper from '@/theme/ThemeWrapper';

/**
 * Mock i18n instance for testing
 */
export const mockI18n = i18n.createInstance();

mockI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['translation'],
  defaultNS: 'translation',
  resources: {
    en: {
      translation: {
        // Add minimal translations for testing
        'actions.success': 'Success',
        'actions.failed': 'Failed',
        'actions.classAddSuccess': 'Class added successfully',
        'actions.classFetchFailed': 'Failed to fetch classes',
        'common.submit': 'Submit',
        'common.cancel': 'Cancel',
        'common.save': 'Save',
        'common.delete': 'Delete',
        // Navigation translations
        'navigation.dashboard': 'Dashboard',
        'navigation.management': 'Management',
        'navigation.studentManagement': 'Students',
        'navigation.classManagement': 'Classes',
        'navigation.settings': 'Settings',
        'navigation.onboardingSettings': 'Onboarding',
        'navigation.welcomeLabel': 'Welcome',
        'navigation.logoutButton': 'Logout',
        'navigation.Browse settings': 'Browse settings',
        'navigation.welcome': 'Welcome, {{name}}',
      },
    },
    de: {
      translation: {
        'actions.success': 'Erfolgreich',
        'actions.failed': 'Fehlgeschlagen',
        'actions.classAddSuccess': 'Klasse erfolgreich hinzugefügt',
        'actions.classFetchFailed': 'Klassen konnten nicht abgerufen werden',
        'common.submit': 'Absenden',
        'common.cancel': 'Abbrechen',
        'common.save': 'Speichern',
        'common.delete': 'Löschen',
        // Navigation translations
        'navigation.dashboard': 'Dashboard',
        'navigation.management': 'Verwaltung',
        'navigation.studentManagement': 'Schüler',
        'navigation.classManagement': 'Klassen',
        'navigation.settings': 'Einstellungen',
        'navigation.onboardingSettings': 'Onboarding',
        'navigation.welcomeLabel': 'Willkommen',
        'navigation.logoutButton': 'Abmelden',
        'navigation.Browse settings': 'Einstellungen durchsuchen',
        'navigation.welcome': 'Willkommen, {{name}}',
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

/**
 * Root reducer combining all slices
 */
const rootReducer = combineReducers({
  appSettings: appSettingsReducer,
  auditLog: auditLogReducer,
  auth: authReducer,
  class: classReducer,
  dashboard: dashboardReducer,
  student: studentReducer,
  ui: uiReducer,
});

/**
 * Create a mock Redux store for testing
 */
export function createMockStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
  });
}

/**
 * Mock Next.js router
 */
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  route: '/',
  basePath: '',
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
};

/**
 * Mock Next.js useRouter hook
 */
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockRouter.pathname,
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

/**
 * Mock window.matchMedia for responsive tests
 */
export function mockMatchMedia(matches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

/**
 * Mock IntersectionObserver
 */
export function mockIntersectionObserver() {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
    unobserve() {}
  } as any;
}

/**
 * Mock ResizeObserver
 */
export function mockResizeObserver() {
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

/**
 * All Providers wrapper for testing
 */
interface AllProvidersProps {
  children: React.ReactNode;
  store?: ReturnType<typeof createMockStore>;
  i18nInstance?: typeof mockI18n;
}

export function AllProviders({
  children,
  store: providedStore,
  i18nInstance = mockI18n,
}: AllProvidersProps) {
  const store = providedStore || createMockStore();

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18nInstance}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeWrapper>{children}</ThemeWrapper>
        </LocalizationProvider>
      </I18nextProvider>
    </Provider>
  );
}

/**
 * Custom render function that includes all necessary providers
 */
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof createMockStore>;
  i18nInstance?: typeof mockI18n;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store: providedStore,
    i18nInstance = mockI18n,
    ...renderOptions
  }: ExtendedRenderOptions = {}
): RenderResult & { store: ReturnType<typeof createMockStore>; i18nInstance: typeof mockI18n } {
  const store = providedStore || createMockStore(preloadedState);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <AllProviders store={store} i18nInstance={i18nInstance}>
        {children}
      </AllProviders>
    );
  }

  return {
    store,
    i18nInstance,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * Utility to wait for async state updates
 */
export const waitForStateUpdate = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Re-export everything from React Testing Library
 */
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
