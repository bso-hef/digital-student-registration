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
  genderOptions: DropdownOption[];
  salutationOptions: DropdownOption[];
  religionOptions: DropdownOption[];
  contactPersonTypeOptions: DropdownOption[];
  schoolLevelOptions: DropdownOption[];
  schoolTypeOptions: DropdownOption[];
  degreeOptions: DropdownOption[];
  languageOptions: DropdownOption[];
  professionOptions: DropdownOption[];
  countryOptions: DropdownOption[];

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

  formSteps: FormSteps;
}

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
  description?: {
    en: string;
    de: string;
  };
  icon?: string;
}

export interface AgreementSettings {
  agreements: AgreementItem[];
  privacyPolicyEnabled?: boolean;
  termsOfServiceEnabled?: boolean;
  parentalConsentEnabled?: boolean;
  dataProcessingAgreementEnabled?: boolean;
}

export interface IntegrationSettings {
  emailServiceEnabled: boolean;
  emailServiceProvider: string;
  smsServiceEnabled: boolean;
  smsServiceProvider: string;
  calendarSyncEnabled: boolean;
}

export interface AuditSettings {
  logStudentChanges: boolean;
  logClassChanges: boolean;
  logSettingsChanges: boolean;
  retentionPeriodDays: number;
  exportEnabled: boolean;
}

export interface SystemSettings {
  mobileBlockerEnabled: boolean;
}

export interface AppSettings {
  _id?: string;
  onboarding: OnboardingSettings;
  agreements: AgreementSettings;
  integrations: IntegrationSettings;
  audit: AuditSettings;
  system: SystemSettings;
  createdAt?: Date;
  updatedAt?: Date;
}

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
