import i18next from "i18next";

// Translation resources for server-side use
const resources = {
  en: {
    translation: {
      audit: {
        descriptions: {
          // Student descriptions
          createdStudents: "Created {{count}} student(s)",
          failedCreateStudents: "Failed to create students",
          deletedStudents: "Deleted {{count}} student(s)",
          failedDeleteStudents: "Failed to delete students",

          // Class descriptions
          createdClasses: "Created {{count}} class(es)",
          failedCreateClasses: "Failed to create classes",
          deletedClasses: "Deleted {{count}} class(es)",
          failedDeleteClasses: "Failed to delete classes",
          updatedClass: "Updated class: {{name}}",
          failedUpdateClass: "Failed to update class",

          // Settings descriptions
          updatedGeneralSettings: "Updated general application settings",
          failedUpdateGeneralSettings: "Failed to update general settings",
          updatedOnboardingSettings: "Updated onboarding settings",
          failedUpdateOnboardingSettings:
            "Failed to update onboarding settings",

          // Audit log descriptions
          clearedAuditLogs: "Cleared {{count}} audit log entries",
          failedClearAuditLogs: "Failed to clear audit logs",
        },
      },
    },
  },
  de: {
    translation: {
      audit: {
        descriptions: {
          // Student descriptions
          createdStudents: "{{count}} Schüler erstellt",
          failedCreateStudents: "Fehler beim Erstellen von Schülern",
          deletedStudents: "{{count}} Schüler gelöscht",
          failedDeleteStudents: "Fehler beim Löschen von Schülern",

          // Class descriptions
          createdClasses: "{{count}} Klasse(n) erstellt",
          failedCreateClasses: "Fehler beim Erstellen von Klassen",
          deletedClasses: "{{count}} Klasse(n) gelöscht",
          failedDeleteClasses: "Fehler beim Löschen von Klassen",
          updatedClass: "Klasse aktualisiert: {{name}}",
          failedUpdateClass: "Fehler beim Aktualisieren der Klasse",

          // Settings descriptions
          updatedGeneralSettings:
            "Allgemeine Anwendungseinstellungen aktualisiert",
          failedUpdateGeneralSettings:
            "Fehler beim Aktualisieren der allgemeinen Einstellungen",
          updatedOnboardingSettings: "Onboarding-Einstellungen aktualisiert",
          failedUpdateOnboardingSettings:
            "Fehler beim Aktualisieren der Onboarding-Einstellungen",

          // Audit log descriptions
          clearedAuditLogs: "{{count}} Audit-Protokolleinträge gelöscht",
          failedClearAuditLogs: "Fehler beim Löschen der Audit-Protokolle",
        },
      },
    },
  },
};

// Initialize i18next for server-side use
if (!i18next.isInitialized) {
  i18next.init({
    lng: "en", // Default language
    fallbackLng: "en",
    resources,
    interpolation: {
      escapeValue: false,
    },
  });
}

/**
 * Server-side translation function
 * @param key - Translation key
 * @param options - Interpolation options
 * @param language - Language code (defaults to 'en')
 */
export function tServer(
  key: string,
  options: Record<string, unknown> = {},
  language = "en",
): string {
  // Clone the i18next instance or change language temporarily
  const currentLang = i18next.language;
  i18next.changeLanguage(language);
  const translation = i18next.t(key, options);
  i18next.changeLanguage(currentLang);

  return translation;
}

const serverI18n = { tServer };

export default serverI18n;
