import React from "react";

import { useAgreementSettings } from "@/hooks/useAgreementSettings";
import { AgreementItem } from "@/types/settings";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  AllProviders,
  createMockStore,
  mockI18n,
  renderHook,
} from "../../utils/test-utils";

vi.mock("@/lib/services/settingsService", () => ({
  default: {
    getAgreements: vi.fn(),
  },
}));

describe("useAgreementSettings", () => {
  const agreement: AgreementItem = {
    id: "datenschutz",
    key: "datenschutz",
    enabled: true,
    required: true,
    order: 0,
    labels: {
      en: "Data Protection Agreement",
      de: "Datenschutzvereinbarung",
    },
    description: {
      en: "English description",
      de: "Deutsche Beschreibung",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fall back from de-DE to de for agreement texts", async () => {
    await mockI18n.changeLanguage("de-DE");
    const store = createMockStore({
      appSettings: {
        data: {
          agreements: {
            agreements: [agreement],
          },
        },
        loading: false,
        error: null,
      },
    });

    const { result } = renderHook(() => useAgreementSettings(), {
      wrapper: ({ children }) => (
        <AllProviders store={store} i18nInstance={mockI18n}>
          {children}
        </AllProviders>
      ),
    });

    expect(result.current.getAgreementLabel(agreement)).toBe(
      "Datenschutzvereinbarung",
    );
    expect(result.current.getAgreementDescription(agreement)).toBe(
      "Deutsche Beschreibung",
    );
  });

  it("should fall back to English when no matching language exists", async () => {
    await mockI18n.changeLanguage("fr-FR");
    const store = createMockStore({
      appSettings: {
        data: {
          agreements: {
            agreements: [agreement],
          },
        },
        loading: false,
        error: null,
      },
    });

    const { result } = renderHook(() => useAgreementSettings(), {
      wrapper: ({ children }) => (
        <AllProviders store={store} i18nInstance={mockI18n}>
          {children}
        </AllProviders>
      ),
    });

    expect(result.current.getAgreementLabel(agreement)).toBe(
      "Data Protection Agreement",
    );
    expect(result.current.getAgreementDescription(agreement)).toBe(
      "English description",
    );
  });
});
