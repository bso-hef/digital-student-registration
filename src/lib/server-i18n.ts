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
          updatedStudent: "Updated student: {{name}}",
          failedUpdateStudent: "Failed to update student",
          deletedStudents: "Deleted {{count}} student(s)",
          deletedStudent: "Deleted student: {{name}}",
          failedDeleteStudents: "Failed to delete students",
          failedDeleteStudent: "Failed to delete student",

          // Class descriptions
          createdClasses: "Created {{count}} class(es)",
          failedCreateClasses: "Failed to create classes",
          deletedClasses: "Deleted {{count}} class(es)",
          failedDeleteClasses: "Failed to delete classes",
          updatedClass: "Updated class: {{name}}",
          failedUpdateClass: "Failed to update class",

          // Settings descriptions
          updatedGeneralSettings: "Updated general settings",
          failedUpdateGeneralSettings: "Failed to update general settings",
          updatedAgreementSettings: "Updated agreement settings",
          failedUpdateAgreementSettings: "Failed to update agreement settings",
          updatedOnboardingSettings: "Updated onboarding settings",
          failedUpdateOnboardingSettings:
            "Failed to update onboarding settings",

          // Auth descriptions
          updatedProfile: "Updated user profile",
          failedUpdateProfile: "Failed to update user profile",
          changedPassword: "Changed account password",
          failedPasswordChange: "Failed to change password",

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
          failedCreateStudents: "Fehler beim Erstellen der Schüler",
          updatedStudent: "Schüler aktualisiert: {{name}}",
          failedUpdateStudent: "Fehler beim Aktualisieren des Schülers",
          deletedStudents: "{{count}} Schüler gelöscht",
          deletedStudent: "Schüler gelöscht: {{name}}",
          failedDeleteStudents: "Fehler beim Löschen der Schüler",
          failedDeleteStudent: "Fehler beim Löschen des Schülers",

          // Class descriptions
          createdClasses: "{{count}} Klasse(n) erstellt",
          failedCreateClasses: "Fehler beim Erstellen der Klassen",
          deletedClasses: "{{count}} Klasse(n) gelöscht",
          failedDeleteClasses: "Fehler beim Löschen der Klassen",
          updatedClass: "Klasse aktualisiert: {{name}}",
          failedUpdateClass: "Fehler beim Aktualisieren der Klasse",

          // Settings descriptions
          updatedGeneralSettings: "Allgemeine Einstellungen aktualisiert",
          failedUpdateGeneralSettings:
            "Fehler beim Aktualisieren der allgemeinen Einstellungen",
          updatedAgreementSettings: "Vereinbarungseinstellungen aktualisiert",
          failedUpdateAgreementSettings:
            "Fehler beim Aktualisieren der Vereinbarungseinstellungen",
          updatedOnboardingSettings: "Onboarding-Einstellungen aktualisiert",
          failedUpdateOnboardingSettings:
            "Fehler beim Aktualisieren der Onboarding-Einstellungen",

          // Auth descriptions
          updatedProfile: "Benutzerprofil aktualisiert",
          failedUpdateProfile: "Fehler beim Aktualisieren des Benutzerprofils",
          changedPassword: "Kontopasswort geändert",
          failedPasswordChange: "Fehler beim Ändern des Passworts",

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
