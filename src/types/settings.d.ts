// Settings types for Admin Onboarding Configuration

export interface DropdownOption {
  value: string;
  label: string;
  enabled: boolean;
  order: number;
}

export interface FieldConfig {
  required: boolean;
  visible: boolean;
  allowCustom: boolean;
}

export interface FormSteps {
  welcomeStep: boolean;
  generalStep: boolean;
  originStep: boolean;
  addressStep: boolean;
  parentsStep: boolean;
  preEducationStep: boolean;
  trainingStep: boolean;
  companyContactStep: boolean;
  summaryStep: boolean;
}

export interface OnboardingSettings {
  // Dropdown Options
  genderOptions: DropdownOption[];
  salutationOptions: DropdownOption[];
  religionOptions: DropdownOption[];
  contactPersonTypeOptions: DropdownOption[];
  schoolLevelOptions: DropdownOption[];
  schoolTypeOptions: DropdownOption[];
  degreeOptions: DropdownOption[];
  languageOptions: DropdownOption[];
  professionOptions: DropdownOption[];

  // Field Configurations
  fieldConfigs: {
    geschlecht: FieldConfig;
    religion: FieldConfig;
    staatsangehoerigkeit2: FieldConfig;
    herkunftsland: FieldConfig;
    familiensprache: FieldConfig;
    vorhergehendeStufe: FieldConfig;
    vorhergehendeSchulform: FieldConfig;
    abschluesse: FieldConfig;
    beruf: FieldConfig;
    ansprechpartnerArt: FieldConfig;
  };

  // Form Step Visibility
  formSteps: FormSteps;
}

// Agreement Item (individual configurable agreement)
export interface AgreementItem {
  id: string;
  key: string;
  enabled: boolean;
  required: boolean;
  order: number;
  labels: {
    en: string;
    de: string;
  };
}

// Agreements Settings (for consent forms, privacy policies, etc.)
export interface AgreementSettings {
  agreements: AgreementItem[];
  // Old fields kept for migration
  privacyPolicyEnabled?: boolean;
  termsOfServiceEnabled?: boolean;
  parentalConsentEnabled?: boolean;
  dataProcessingAgreementEnabled?: boolean;
}

// Integration Settings (for third-party integrations)
export interface IntegrationSettings {
  emailServiceEnabled: boolean;
  emailServiceProvider: string;
  smsServiceEnabled: boolean;
  smsServiceProvider: string;
  calendarSyncEnabled: boolean;
}

// Audit Settings (for logging and monitoring)
export interface AuditSettings {
  logStudentChanges: boolean;
  logClassChanges: boolean;
  logSettingsChanges: boolean;
  retentionPeriodDays: number;
  exportEnabled: boolean;
}

export interface AppSettings {
  _id?: string;
  onboarding: OnboardingSettings;
  agreements: AgreementSettings;
  integrations: IntegrationSettings;
  audit: AuditSettings;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Request/Response types
export interface UpdateOnboardingSettingsRequest {
  onboarding: Partial<OnboardingSettings>;
}

export interface SettingsResponse {
  success: boolean;
  data: AppSettings;
}

export interface SettingsErrorResponse {
  success: boolean;
  error: string;
  details?: string;
}
