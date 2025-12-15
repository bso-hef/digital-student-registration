import { SCHEMA } from "@/constants/db.constants";
import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const DropdownOptionSchema = new Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const FieldConfigSchema = new Schema(
  {
    required: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    allowCustom: { type: Boolean, default: false },
  },
  { _id: false },
);

const AgreementItemSchema = new Schema(
  {
    id: { type: String, required: true },
    key: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    required: { type: Boolean, default: false },
    order: { type: Number, required: true },
    labels: {
      en: { type: String, required: true },
      de: { type: String, required: true },
    },
    description: {
      en: { type: String, default: "" },
      de: { type: String, default: "" },
    },
    icon: { type: String, default: "" },
  },
  { _id: false },
);

const AgreementSettingsSchema = new Schema(
  {
    agreements: {
      type: [AgreementItemSchema],
      default: [],
    },
    privacyPolicyEnabled: { type: Boolean, default: false },
    termsOfServiceEnabled: { type: Boolean, default: false },
    parentalConsentEnabled: { type: Boolean, default: true },
    dataProcessingAgreementEnabled: { type: Boolean, default: false },
  },
  { _id: false },
);

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

const SystemSettingsSchema = new Schema(
  {
    mobileBlockerEnabled: { type: Boolean, default: true },
  },
  { _id: false },
);

const AppSettingsSchema = new Schema(
  {
    isSystemSetup: { type: Boolean, default: false, required: true },
    onboarding: {
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
      countryOptions: {
        type: [DropdownOptionSchema],
        default: [
          { value: "AF", label: "Afghanistan", enabled: true, order: 0 },
          { value: "EG", label: "Ägypten", enabled: true, order: 1 },
          { value: "AL", label: "Albanien", enabled: true, order: 2 },
          { value: "DZ", label: "Algerien", enabled: true, order: 3 },
          { value: "AR", label: "Argentinien", enabled: true, order: 4 },
          { value: "AM", label: "Armenien", enabled: true, order: 5 },
          { value: "AU", label: "Australien", enabled: true, order: 6 },
          { value: "AT", label: "Österreich", enabled: true, order: 7 },
          { value: "AZ", label: "Aserbaidschan", enabled: true, order: 8 },
          { value: "BD", label: "Bangladesch", enabled: true, order: 9 },
          { value: "BY", label: "Belarus", enabled: true, order: 10 },
          { value: "BE", label: "Belgien", enabled: true, order: 11 },
          {
            value: "BA",
            label: "Bosnien und Herzegowina",
            enabled: true,
            order: 12,
          },
          { value: "BR", label: "Brasilien", enabled: true, order: 13 },
          { value: "BG", label: "Bulgarien", enabled: true, order: 14 },
          { value: "CA", label: "Kanada", enabled: true, order: 15 },
          { value: "CL", label: "Chile", enabled: true, order: 16 },
          { value: "CN", label: "China", enabled: true, order: 17 },
          { value: "CR", label: "Costa Rica", enabled: true, order: 18 },
          { value: "HR", label: "Kroatien", enabled: true, order: 19 },
          { value: "CZ", label: "Tschechien", enabled: true, order: 20 },
          { value: "DK", label: "Dänemark", enabled: true, order: 21 },
          { value: "DE", label: "Deutschland", enabled: true, order: 22 },
          { value: "EC", label: "Ecuador", enabled: true, order: 23 },
          { value: "EE", label: "Estland", enabled: true, order: 24 },
          { value: "ET", label: "Äthiopien", enabled: true, order: 25 },
          { value: "FI", label: "Finnland", enabled: true, order: 26 },
          { value: "FR", label: "Frankreich", enabled: true, order: 27 },
          { value: "GE", label: "Georgien", enabled: true, order: 28 },
          { value: "GH", label: "Ghana", enabled: true, order: 29 },
          { value: "GR", label: "Griechenland", enabled: true, order: 30 },
          { value: "HU", label: "Ungarn", enabled: true, order: 31 },
          { value: "IS", label: "Island", enabled: true, order: 32 },
          { value: "IN", label: "Indien", enabled: true, order: 33 },
          { value: "ID", label: "Indonesien", enabled: true, order: 34 },
          { value: "IR", label: "Iran", enabled: true, order: 35 },
          { value: "IQ", label: "Irak", enabled: true, order: 36 },
          { value: "IE", label: "Irland", enabled: true, order: 37 },
          { value: "IL", label: "Israel", enabled: true, order: 38 },
          { value: "IT", label: "Italien", enabled: true, order: 39 },
          { value: "JP", label: "Japan", enabled: true, order: 40 },
          { value: "JO", label: "Jordanien", enabled: true, order: 41 },
          { value: "KZ", label: "Kasachstan", enabled: true, order: 42 },
          { value: "KE", label: "Kenia", enabled: true, order: 43 },
          { value: "KR", label: "Südkorea", enabled: true, order: 44 },
          { value: "KP", label: "Nordkorea", enabled: true, order: 45 },
          { value: "XK", label: "Kosovo", enabled: true, order: 46 },
          { value: "KW", label: "Kuwait", enabled: true, order: 47 },
          { value: "LV", label: "Lettland", enabled: true, order: 48 },
          { value: "LB", label: "Libanon", enabled: true, order: 49 },
          { value: "LY", label: "Libyen", enabled: true, order: 50 },
          { value: "LT", label: "Litauen", enabled: true, order: 51 },
          { value: "MK", label: "Nordmazedonien", enabled: true, order: 52 },
          { value: "MY", label: "Malaysia", enabled: true, order: 53 },
          { value: "MX", label: "Mexiko", enabled: true, order: 54 },
          { value: "MD", label: "Moldau", enabled: true, order: 55 },
          { value: "MA", label: "Marokko", enabled: true, order: 56 },
          { value: "NL", label: "Niederlande", enabled: true, order: 57 },
          { value: "NZ", label: "Neuseeland", enabled: true, order: 58 },
          { value: "NG", label: "Nigeria", enabled: true, order: 59 },
          { value: "NO", label: "Norwegen", enabled: true, order: 60 },
          { value: "PK", label: "Pakistan", enabled: true, order: 61 },
          { value: "PE", label: "Peru", enabled: true, order: 62 },
          { value: "PH", label: "Philippinen", enabled: true, order: 63 },
          { value: "PL", label: "Polen", enabled: true, order: 64 },
          { value: "PT", label: "Portugal", enabled: true, order: 65 },
          { value: "RO", label: "Rumänien", enabled: true, order: 66 },
          { value: "RU", label: "Russland", enabled: true, order: 67 },
          { value: "SA", label: "Saudi-Arabien", enabled: true, order: 68 },
          { value: "RS", label: "Serbien", enabled: true, order: 69 },
          { value: "SG", label: "Singapur", enabled: true, order: 70 },
          { value: "SK", label: "Slowakei", enabled: true, order: 71 },
          { value: "SI", label: "Slowenien", enabled: true, order: 72 },
          { value: "ZA", label: "Südafrika", enabled: true, order: 73 },
          { value: "ES", label: "Spanien", enabled: true, order: 74 },
          { value: "SE", label: "Schweden", enabled: true, order: 75 },
          { value: "CH", label: "Schweiz", enabled: true, order: 76 },
          { value: "SY", label: "Syrien", enabled: true, order: 77 },
          { value: "TW", label: "Taiwan", enabled: true, order: 78 },
          { value: "TH", label: "Thailand", enabled: true, order: 79 },
          { value: "TN", label: "Tunesien", enabled: true, order: 80 },
          { value: "TR", label: "Türkei", enabled: true, order: 81 },
          { value: "UA", label: "Ukraine", enabled: true, order: 82 },
          {
            value: "AE",
            label: "Vereinigte Arabische Emirate",
            enabled: true,
            order: 83,
          },
          {
            value: "GB",
            label: "Vereinigtes Königreich",
            enabled: true,
            order: 84,
          },
          { value: "US", label: "USA", enabled: true, order: 85 },
          { value: "UY", label: "Uruguay", enabled: true, order: 86 },
          { value: "VE", label: "Venezuela", enabled: true, order: 87 },
          { value: "VN", label: "Vietnam", enabled: true, order: 88 },
          { value: "YE", label: "Jemen", enabled: true, order: 89 },
        ],
      },

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
        agreements: [],
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
    system: {
      type: SystemSettingsSchema,
      default: {
        mobileBlockerEnabled: true,
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
