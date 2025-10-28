import { SCHEMA } from "@/constants/db.constants";
import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Dropdown option schema with enabled/disabled state
const DropdownOptionSchema = new Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

// Field configuration schema
const FieldConfigSchema = new Schema(
  {
    required: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    allowCustom: { type: Boolean, default: false },
  },
  { _id: false },
);

// Agreements settings schema
const AgreementSettingsSchema = new Schema(
  {
    privacyPolicyEnabled: { type: Boolean, default: false },
    termsOfServiceEnabled: { type: Boolean, default: false },
    parentalConsentEnabled: { type: Boolean, default: true },
    dataProcessingAgreementEnabled: { type: Boolean, default: false },
  },
  { _id: false },
);

// Integration settings schema
const IntegrationSettingsSchema = new Schema(
  {
    emailServiceEnabled: { type: Boolean, default: false },
    emailServiceProvider: { type: String, default: "" },
    smsServiceEnabled: { type: Boolean, default: false },
    smsServiceProvider: { type: String, default: "" },
    calendarSyncEnabled: { type: Boolean, default: false },
  },
  { _id: false },
);

// Audit settings schema
const AuditSettingsSchema = new Schema(
  {
    logStudentChanges: { type: Boolean, default: true },
    logClassChanges: { type: Boolean, default: true },
    logSettingsChanges: { type: Boolean, default: true },
    retentionPeriodDays: { type: Number, default: 90 },
    exportEnabled: { type: Boolean, default: false },
  },
  { _id: false },
);

const AppSettingsSchema = new Schema(
  {
    onboarding: {
      // Dropdown Options
      genderOptions: {
        type: [DropdownOptionSchema],
        default: [
          { value: "männlich", label: "Männlich", enabled: true, order: 0 },
          { value: "weiblich", label: "Weiblich", enabled: true, order: 1 },
          { value: "divers", label: "Divers", enabled: true, order: 2 },
        ],
      },
      salutationOptions: {
        type: [DropdownOptionSchema],
        default: [
          { value: "Herr", label: "Herr", enabled: true, order: 0 },
          { value: "Frau", label: "Frau", enabled: true, order: 1 },
          { value: "Divers", label: "Divers", enabled: true, order: 2 },
        ],
      },
      religionOptions: {
        type: [DropdownOptionSchema],
        default: [
          {
            value: "katholisch",
            label: "Katholisch",
            enabled: true,
            order: 0,
          },
          {
            value: "evangelisch",
            label: "Evangelisch",
            enabled: true,
            order: 1,
          },
          { value: "islamisch", label: "Islamisch", enabled: true, order: 2 },
          { value: "jüdisch", label: "Jüdisch", enabled: true, order: 3 },
          { value: "keine", label: "Keine", enabled: true, order: 4 },
          { value: "andere", label: "Andere", enabled: true, order: 5 },
        ],
      },
      contactPersonTypeOptions: {
        type: [DropdownOptionSchema],
        default: [
          { value: "Mutter", label: "Mutter", enabled: true, order: 0 },
          { value: "Vater", label: "Vater", enabled: true, order: 1 },
          { value: "Vormund", label: "Vormund", enabled: true, order: 2 },
          { value: "Andere", label: "Andere", enabled: true, order: 3 },
        ],
      },
      schoolLevelOptions: {
        type: [DropdownOptionSchema],
        default: [
          { value: "Klasse 5", label: "Klasse 5", enabled: true, order: 0 },
          { value: "Klasse 6", label: "Klasse 6", enabled: true, order: 1 },
          { value: "Klasse 7", label: "Klasse 7", enabled: true, order: 2 },
          { value: "Klasse 8", label: "Klasse 8", enabled: true, order: 3 },
          { value: "Klasse 9", label: "Klasse 9", enabled: true, order: 4 },
          { value: "Klasse 10", label: "Klasse 10", enabled: true, order: 5 },
          { value: "Klasse 11", label: "Klasse 11", enabled: true, order: 6 },
          { value: "Klasse 12", label: "Klasse 12", enabled: true, order: 7 },
          { value: "Klasse 13", label: "Klasse 13", enabled: true, order: 8 },
        ],
      },
      schoolTypeOptions: {
        type: [DropdownOptionSchema],
        default: [
          {
            value: "Grundschule",
            label: "Grundschule",
            enabled: true,
            order: 0,
          },
          {
            value: "Hauptschule",
            label: "Hauptschule",
            enabled: true,
            order: 1,
          },
          {
            value: "Realschule",
            label: "Realschule",
            enabled: true,
            order: 2,
          },
          { value: "Gymnasium", label: "Gymnasium", enabled: true, order: 3 },
          {
            value: "Gesamtschule",
            label: "Gesamtschule",
            enabled: true,
            order: 4,
          },
          {
            value: "Berufsschule",
            label: "Berufsschule",
            enabled: true,
            order: 5,
          },
        ],
      },
      degreeOptions: {
        type: [DropdownOptionSchema],
        default: [
          {
            value: "Hauptschulabschluss",
            label: "Hauptschulabschluss",
            enabled: true,
            order: 0,
          },
          {
            value: "Realschulabschluss",
            label: "Realschulabschluss",
            enabled: true,
            order: 1,
          },
          {
            value: "Fachabitur",
            label: "Fachabitur",
            enabled: true,
            order: 2,
          },
          { value: "Abitur", label: "Abitur", enabled: true, order: 3 },
          { value: "Kein", label: "Kein Abschluss", enabled: true, order: 4 },
        ],
      },
      languageOptions: {
        type: [DropdownOptionSchema],
        default: [
          { value: "Deutsch", label: "Deutsch", enabled: true, order: 0 },
          { value: "Englisch", label: "Englisch", enabled: true, order: 1 },
          { value: "Türkisch", label: "Türkisch", enabled: true, order: 2 },
          { value: "Arabisch", label: "Arabisch", enabled: true, order: 3 },
          { value: "Polnisch", label: "Polnisch", enabled: true, order: 4 },
          { value: "Russisch", label: "Russisch", enabled: true, order: 5 },
          { value: "Andere", label: "Andere", enabled: true, order: 6 },
        ],
      },
      professionOptions: {
        type: [DropdownOptionSchema],
        default: [
          {
            value: "Kaufmann/-frau für Büromanagement",
            label: "Kaufmann/-frau für Büromanagement",
            enabled: true,
            order: 0,
          },
          {
            value: "Industriekaufmann/-frau",
            label: "Industriekaufmann/-frau",
            enabled: true,
            order: 1,
          },
          {
            value: "Elektroniker/-in",
            label: "Elektroniker/-in",
            enabled: true,
            order: 2,
          },
          {
            value: "KFZ-Mechatroniker/-in",
            label: "KFZ-Mechatroniker/-in",
            enabled: true,
            order: 3,
          },
          {
            value: "Fachinformatiker/-in",
            label: "Fachinformatiker/-in",
            enabled: true,
            order: 4,
          },
        ],
      },

      // Field Configurations
      fieldConfigs: {
        geschlecht: {
          type: FieldConfigSchema,
          default: { required: true, visible: true, allowCustom: false },
        },
        religion: {
          type: FieldConfigSchema,
          default: { required: false, visible: true, allowCustom: true },
        },
        staatsangehoerigkeit2: {
          type: FieldConfigSchema,
          default: { required: false, visible: true, allowCustom: false },
        },
        herkunftsland: {
          type: FieldConfigSchema,
          default: { required: true, visible: true, allowCustom: false },
        },
        familiensprache: {
          type: FieldConfigSchema,
          default: { required: true, visible: true, allowCustom: true },
        },
        vorhergehendeStufe: {
          type: FieldConfigSchema,
          default: { required: true, visible: true, allowCustom: false },
        },
        vorhergehendeSchulform: {
          type: FieldConfigSchema,
          default: { required: true, visible: true, allowCustom: false },
        },
        abschluesse: {
          type: FieldConfigSchema,
          default: { required: false, visible: true, allowCustom: true },
        },
        beruf: {
          type: FieldConfigSchema,
          default: { required: true, visible: true, allowCustom: true },
        },
        ansprechpartnerArt: {
          type: FieldConfigSchema,
          default: { required: true, visible: true, allowCustom: false },
        },
      },

      // Form Step Visibility
      formSteps: {
        welcomeStep: { type: Boolean, default: true },
        generalStep: { type: Boolean, default: true },
        originStep: { type: Boolean, default: true },
        addressStep: { type: Boolean, default: true },
        parentsStep: { type: Boolean, default: true },
        preEducationStep: { type: Boolean, default: true },
        trainingStep: { type: Boolean, default: true },
        companyContactStep: { type: Boolean, default: true },
        summaryStep: { type: Boolean, default: true },
      },
    },
    agreements: {
      type: AgreementSettingsSchema,
      default: {
        privacyPolicyEnabled: false,
        termsOfServiceEnabled: false,
        parentalConsentEnabled: true,
        dataProcessingAgreementEnabled: false,
      },
    },
    integrations: {
      type: IntegrationSettingsSchema,
      default: {
        emailServiceEnabled: false,
        emailServiceProvider: "",
        smsServiceEnabled: false,
        smsServiceProvider: "",
        calendarSyncEnabled: false,
      },
    },
    audit: {
      type: AuditSettingsSchema,
      default: {
        logStudentChanges: true,
        logClassChanges: true,
        logSettingsChanges: true,
        retentionPeriodDays: 90,
        exportEnabled: false,
      },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false, timestamps: true },
);

AppSettingsSchema.plugin(mongoosePaginate);

export default mongoose.models.AppSettings ||
  mongoose.model(SCHEMA.APP_SETTINGS, AppSettingsSchema);
