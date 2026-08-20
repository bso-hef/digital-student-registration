import { FieldConfig } from "@/types/settings";
import dayjs from "dayjs";
import * as Yup from "yup";

// Verification Form Validation
export const validateVerificationForm = Yup.object({
  firstName: Yup.string()
    .required("Vorname ist erforderlich")
    .trim()
    .min(1, "Vorname darf nicht leer sein"),
  lastName: Yup.string()
    .required("Nachname ist erforderlich")
    .trim()
    .min(1, "Nachname darf nicht leer sein"),
  uniqueIdentifier: Yup.string()
    .required("Eindeutiger Bezeichner ist erforderlich")
    .trim()
    .length(6, "Der Code muss genau 6 Zeichen enthalten")
    .matches(
      /^[0-9A-Z]{6}$/i,
      "Der Code darf nur Zahlen (0-9) und Großbuchstaben (A-Z) enthalten",
    )
    .transform((value) => value.toUpperCase()),
});

// Manual Student Creation Validation
export const validateManualCreationForm = Yup.object({
  firstName: Yup.string()
    .required("Vorname ist erforderlich")
    .trim()
    .min(2, "Vorname muss mindestens 2 Zeichen lang sein")
    .max(50, "Vorname darf maximal 50 Zeichen lang sein"),
  lastName: Yup.string()
    .required("Nachname ist erforderlich")
    .trim()
    .min(2, "Nachname muss mindestens 2 Zeichen lang sein")
    .max(50, "Nachname darf maximal 50 Zeichen lang sein"),
  dateOfBirth: Yup.mixed()
    .required("Geburtsdatum ist erforderlich")
    .test("valid-date", "Ungültiges Datum", (value) => {
      if (!value) return false;
      if (dayjs.isDayjs(value)) {
        return value.isValid();
      }
      return false;
    })
    .test(
      "not-future",
      "Geburtsdatum darf nicht in der Zukunft liegen",
      (value) => {
        if (!value || !dayjs.isDayjs(value)) return false;
        return value.isBefore(dayjs()) || value.isSame(dayjs(), "day");
      },
    ),
});

// Dynamic validation schema builders
export const createGenderValidation = (
  allowedValues: string[],
  required = true,
  allowCustom = false,
) => {
  const schema = allowCustom
    ? Yup.string()
    : Yup.string().oneOf(allowedValues, "Ungültiges Geschlecht");
  return required
    ? schema.required("Geschlecht ist erforderlich")
    : schema.nullable();
};

export const createReligionValidation = (
  allowedValues: string[],
  required = false,
  allowCustom = true,
) => {
  if (allowCustom) {
    return required
      ? Yup.string().required("Religion ist erforderlich")
      : Yup.string().nullable();
  }
  const schema = Yup.string().oneOf(allowedValues, "Ungültige Religion");
  return required
    ? schema.required("Religion ist erforderlich")
    : schema.nullable();
};

export const createCountryValidation = (
  allowedValues: string[],
  required = true,
) => {
  const schema = Yup.string().oneOf(allowedValues, "Ungültiges Land");
  return required
    ? schema.required("Geburtsland ist erforderlich")
    : schema.nullable();
};

// Step 1: Allgemeine Daten
export const validateGeneralStudentData = Yup.object({
  currentClass: Yup.string().required("Klasse ist erforderlich"),
  eintrittschule: Yup.string().nullable(),
  klassenname: Yup.string().nullable(),
  vorname: Yup.string().required("Vorname ist erforderlich"),
  nachname: Yup.string().required("Nachname ist erforderlich"),
  geburtsname: Yup.string().nullable(),
  geschlecht: Yup.string()
    .oneOf(["männlich", "weiblich", "divers"], "Ungültiges Geschlecht")
    .required("Geschlecht ist erforderlich"),
  geburtsdatum: Yup.date()
    .typeError("Ungültiges Datum")
    .required("Geburtsdatum ist erforderlich"),
  geburtsland: Yup.string().required("Geburtsland ist erforderlich"),
  geburtsort: Yup.string().required("Geburtsort ist erforderlich"),
  religion: Yup.string().nullable(),
  staatsangehoerigkeit1: Yup.string().required(
    "Staatsangehörigkeit ist erforderlich",
  ),
  staatsangehoerigkeit2: Yup.string().nullable(),
});

// Dynamic version of general student data validation
export const createValidateGeneralStudentData = (
  genderOptions: string[],
  countryOptions: string[] = [],
  religionOptions: string[] = [],
  genderConfig: FieldConfig = {
    required: true,
    visible: true,
    allowCustom: false,
  },
  religionConfig: FieldConfig = {
    required: false,
    visible: true,
    allowCustom: true,
  },
) =>
  Yup.object({
    currentClass: Yup.string().required("Klasse ist erforderlich"),
    eintrittschule: Yup.string().nullable(),
    klassenname: Yup.string().nullable(),
    vorname: Yup.string().required("Vorname ist erforderlich"),
    nachname: Yup.string().required("Nachname ist erforderlich"),
    geburtsname: Yup.string().nullable(),
    geschlecht: genderConfig.visible
      ? createGenderValidation(
          genderOptions,
          genderConfig.required,
          genderConfig.allowCustom,
        )
      : Yup.string().nullable(),
    geburtsdatum: Yup.date()
      .typeError("Ungültiges Datum")
      .required("Geburtsdatum ist erforderlich"),
    geburtsland:
      countryOptions.length > 0
        ? createCountryValidation(countryOptions, true)
        : Yup.string().required("Geburtsland ist erforderlich"),
    geburtsort: Yup.string().required("Geburtsort ist erforderlich"),
    religion: religionConfig.visible
      ? createReligionValidation(
          religionOptions,
          religionConfig.required,
          religionConfig.allowCustom,
        )
      : Yup.string().nullable(),
    staatsangehoerigkeit1: Yup.string().required(
      "Staatsangehörigkeit ist erforderlich",
    ),
    staatsangehoerigkeit2: Yup.string().nullable(),
  });

// Step 2: Herkunft (Optional)
export const validateStudentOriginData = Yup.object({
  herkunftsland: Yup.string().required("Herkunftsland ist erforderlich"),
  zuzugsjahr: Yup.mixed()
    .nullable()
    .test("valid-year", "Ungültiges Jahr", (value) => {
      if (!value) return false; // Required field
      if (dayjs.isDayjs(value)) {
        const year = value.year();
        return year >= 1900 && year <= new Date().getFullYear();
      }
      return false;
    })
    .required("Zuzugsjahr ist erforderlich"),
  familiensprache: Yup.string().required("Familiensprache ist erforderlich"),
});

// Dynamic version with language options
export const createValidateStudentOriginData = (
  languageOptions: string[],
  allowCustom = true,
) => {
  const familienspracheValidation = allowCustom
    ? Yup.string().required("Familiensprache ist erforderlich")
    : Yup.string()
        .oneOf(languageOptions, "Ungültige Sprache")
        .required("Familiensprache ist erforderlich");

  return Yup.object({
    herkunftsland: Yup.string().required("Herkunftsland ist erforderlich"),
    zuzugsjahr: Yup.mixed()
      .nullable()
      .test("valid-year", "Ungültiges Jahr", (value) => {
        if (!value) return false; // Required field
        if (dayjs.isDayjs(value)) {
          const year = value.year();
          return year >= 1900 && year <= new Date().getFullYear();
        }
        return false;
      })
      .required("Zuzugsjahr ist erforderlich"),
    familiensprache: familienspracheValidation,
  });
};

// Step 3: Adresse
export const createValidateStudentAddressData = (
  phoneConfig: FieldConfig = {
    required: false,
    visible: true,
    allowCustom: false,
  },
) =>
  Yup.object({
    straße: Yup.string().required("Straße ist erforderlich"),
    hausnr: Yup.string().required("Hausnummer ist erforderlich"),
    plz: Yup.string()
      .matches(/^\d{5}$/, "PLZ muss 5 Ziffern haben")
      .required("PLZ ist erforderlich"),
    ort: Yup.string().required("Ort ist erforderlich"),
    mobil: Yup.string()
      .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Mobilnummer")
      .nullable(),
    tel: phoneConfig.visible
      ? phoneConfig.required
        ? Yup.string()
            .required("Telefonnummer ist erforderlich")
            .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Telefonnummer")
        : Yup.string()
            .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Telefonnummer")
            .nullable()
      : Yup.string().nullable(),
    mail: Yup.string()
      .email("Ungültige E-Mail-Adresse")
      .required("E-Mail ist erforderlich"),
  });

export const validateStudentAddressData = createValidateStudentAddressData();

// Step 4: Ansprechpartner: (Optional / Pflicht bei Minderjährigen < 18 / Checkbox > 18 Jahre)
// Fixed: Field names now match form (ansprechpartner1Art instead of ansprechpartnerArt)
export const validateStudentContactPersonData = Yup.object({
  ansprechpartner1Art: Yup.string().required(
    "Art des Ansprechpartners ist erforderlich",
  ),
  ansprechpartner1Vorname: Yup.string().required(
    "Vorname des Ansprechpartners ist erforderlich",
  ),
  ansprechpartner1Nachname: Yup.string().required(
    "Nachname des Ansprechpartners ist erforderlich",
  ),
  ansprechpartner1Plz: Yup.string()
    .matches(/^\d{5}$/, "PLZ muss 5 Ziffern haben")
    .required("PLZ ist erforderlich"),
  ansprechpartner1Ort: Yup.string().required("Ort ist erforderlich"),
  ansprechpartner1Straße: Yup.string().required("Straße ist erforderlich"),
  ansprechpartner1HausNr: Yup.string().required("Hausnummer ist erforderlich"),
  ansprechpartner1Mobil: Yup.string()
    .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Mobilnummer")
    .nullable(),
  ansprechpartner1Telefon1: Yup.string()
    .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Telefonnummer")
    .nullable(),
  ansprechpartner1Email: Yup.string()
    .email("Ungültige E-Mail-Adresse")
    .nullable(),
});

/**
 * Creates a dynamic validation schema for contact person data based on student age
 * For minors (age < 18): Contact person 1 is REQUIRED
 * For adults (age >= 18): Contact person fields are OPTIONAL unless partially filled
 * If any field is filled for a contact, firstName + lastName + type become required
 */
export const createValidateStudentContactPersonData = (age: number) => {
  const isAdult = age >= 18;

  if (isAdult) {
    // Adult: Optional unless any field is filled
    // Using .test() instead of .when() to avoid cyclic dependency errors
    const optionalFields = [
      "ansprechpartner1Plz",
      "ansprechpartner1Ort",
      "ansprechpartner1Straße",
      "ansprechpartner1HausNr",
      "ansprechpartner1Mobil",
      "ansprechpartner1Telefon1",
      "ansprechpartner1Email",
    ];

    // Helper to check if any field has a value
    const hasAnyValue = (fields: string[], parent: Record<string, unknown>) =>
      fields.some((field) => {
        const value = parent[field];
        return value && String(value).trim() !== "";
      });

    return Yup.object({
      // Using .test() instead of .when() to avoid circular dependencies
      ansprechpartner1Vorname: Yup.string().test(
        "conditional-required",
        "Vorname ist erforderlich wenn Kontakt ausgefüllt",
        function (value) {
          const parent = this.parent;
          const otherFields = [
            "ansprechpartner1Art",
            "ansprechpartner1Nachname",
            ...optionalFields,
          ];

          // If any other field has value, this field is required
          if (hasAnyValue(otherFields, parent)) {
            return !!value && String(value).trim() !== "";
          }
          return true; // Optional if no other fields filled
        },
      ),

      ansprechpartner1Nachname: Yup.string().test(
        "conditional-required",
        "Nachname ist erforderlich wenn Kontakt ausgefüllt",
        function (value) {
          const parent = this.parent;
          const otherFields = [
            "ansprechpartner1Art",
            "ansprechpartner1Vorname",
            ...optionalFields,
          ];

          if (hasAnyValue(otherFields, parent)) {
            return !!value && String(value).trim() !== "";
          }
          return true;
        },
      ),

      ansprechpartner1Art: Yup.string().test(
        "conditional-required",
        "Art ist erforderlich wenn Kontakt ausgefüllt",
        function (value) {
          const parent = this.parent;
          const otherFields = [
            "ansprechpartner1Vorname",
            "ansprechpartner1Nachname",
            ...optionalFields,
          ];

          if (hasAnyValue(otherFields, parent)) {
            return !!value && String(value).trim() !== "";
          }
          return true;
        },
      ),

      // Other fields remain optional
      ansprechpartner1Plz: Yup.string()
        .matches(/^\d{5}$/, "PLZ muss 5 Ziffern haben")
        .nullable(),
      ansprechpartner1Ort: Yup.string().nullable(),
      ansprechpartner1Straße: Yup.string().nullable(),
      ansprechpartner1HausNr: Yup.string().nullable(),
      ansprechpartner1Mobil: Yup.string()
        .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Mobilnummer")
        .nullable(),
      ansprechpartner1Telefon1: Yup.string()
        .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Telefonnummer")
        .nullable(),
      ansprechpartner1Email: Yup.string()
        .email("Ungültige E-Mail-Adresse")
        .nullable(),
      ansprechpartner2Email: Yup.string()
        .email("Ungültige E-Mail-Adresse")
        .nullable(),
      ansprechpartner3Email: Yup.string()
        .email("Ungültige E-Mail-Adresse")
        .nullable(),
    });
  }

  // Minor: Required
  return validateStudentContactPersonData.shape({
    ansprechpartner2Email: Yup.string()
      .email("Ungültige E-Mail-Adresse")
      .nullable(),
    ansprechpartner3Email: Yup.string()
      .email("Ungültige E-Mail-Adresse")
      .nullable(),
  });
};

// Step 5: Letzter Bildungsstand
export const validateStudentPreviousSchoolData = Yup.object({
  vorhergehendeSchule: Yup.string().required(
    "Vorhergehende Schule ist erforderlich",
  ),
  vorhergehendeStufe: Yup.string().required(
    "Vorhergehende Stufe ist erforderlich",
  ),
  vorhergehendeSchulform: Yup.string().required(
    "Vorhergehende Schulform ist erforderlich",
  ),
  abschluesse: Yup.string().nullable(),
});

// Dynamic version with school options
export const createValidateStudentPreviousSchoolData = (
  schoolLevelOptions: string[],
  schoolTypeOptions: string[],
  degreeOptions: string[],
  degreeConfig: FieldConfig = {
    required: false,
    visible: true,
    allowCustom: true,
  },
  schoolTypeConfig: FieldConfig = {
    required: true,
    visible: true,
    allowCustom: true,
  },
) => {
  const degreeSchema = degreeConfig.allowCustom
    ? Yup.string()
    : Yup.string().oneOf(degreeOptions, "Ungültiger Abschluss");
  const abschluesseValidation = !degreeConfig.visible
    ? Yup.string().nullable()
    : degreeConfig.required
      ? degreeSchema.required("Abschluss ist erforderlich")
      : degreeSchema.nullable();
  const schoolTypeSchema = schoolTypeConfig.allowCustom
    ? Yup.string()
    : Yup.string().oneOf(schoolTypeOptions, "Ungültige Schulform");
  const previousSchoolTypeValidation = !schoolTypeConfig.visible
    ? Yup.string().nullable()
    : schoolTypeConfig.required
      ? schoolTypeSchema.required("Vorhergehende Schulform ist erforderlich")
      : schoolTypeSchema.nullable();

  return Yup.object({
    vorhergehendeSchule: Yup.string().required(
      "Vorhergehende Schule ist erforderlich",
    ),
    vorhergehendeStufe: Yup.string()
      .oneOf(schoolLevelOptions, "Ungültige Stufe")
      .required("Vorhergehende Stufe ist erforderlich"),
    vorhergehendeSchulform: previousSchoolTypeValidation,
    abschluesse: abschluesseValidation,
  });
};

// Step 6a: Training/Betrieb Info (Company information only - no contact person)
// Used by TrainingForm
export const validateStudentTrainingData = Yup.object({
  beruf: Yup.string().required("Beruf ist erforderlich"),
  betriebEintritt: Yup.mixed()
    .nullable()
    .test("valid-date", "Ungültiges Datum", (value) => {
      if (!value) return false; // Required field
      if (dayjs.isDayjs(value)) {
        return value.isValid();
      }
      return false;
    })
    .required("Eintrittsdatum ist erforderlich"),
  betriebName: Yup.string().required("Name des Betriebs ist erforderlich"),
  betriebStraße: Yup.string().required("Straße ist erforderlich"),
  betriebHausNr: Yup.string().required("Hausnummer ist erforderlich"),
  betriebPlz: Yup.string()
    .matches(/^\d{5}$/, "PLZ muss 5 Ziffern haben")
    .required("PLZ ist erforderlich"),
  betriebOrt: Yup.string().required("Ort ist erforderlich"),
  betriebTelefon1: Yup.string()
    .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Telefonnummer")
    .nullable(),
  betriebEmail: Yup.string()
    .email("Ungültige E-Mail-Adresse")
    .required("E-Mail ist erforderlich für Betriebe"),
});

// Dynamic version for TrainingForm with profession options
export const createValidateStudentTrainingData = (
  professionOptions: string[],
  allowCustomProfession = true,
  isProfessionRequired = true,
) => {
  const professionSchema = allowCustomProfession
    ? Yup.string()
    : Yup.string().oneOf(
        isProfessionRequired ? professionOptions : ["", ...professionOptions],
        "Ungültiger Beruf",
      );

  const berufValidation = isProfessionRequired
    ? professionSchema.required("Beruf ist erforderlich")
    : professionSchema.nullable();

  return Yup.object({
    beruf: berufValidation,
    betriebEintritt: Yup.mixed()
      .nullable()
      .test("valid-date", "Ungültiges Datum", (value) => {
        if (!value) return false; // Required field
        if (dayjs.isDayjs(value)) {
          return value.isValid();
        }
        return false;
      })
      .required("Eintrittsdatum ist erforderlich"),
    betriebName: Yup.string().required("Name des Betriebs ist erforderlich"),
    betriebStraße: Yup.string().required("Straße ist erforderlich"),
    betriebHausNr: Yup.string().required("Hausnummer ist erforderlich"),
    betriebPlz: Yup.string()
      .matches(/^\d{5}$/, "PLZ muss 5 Ziffern haben")
      .required("PLZ ist erforderlich"),
    betriebOrt: Yup.string().required("Ort ist erforderlich"),
    betriebTelefon1: Yup.string()
      .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Telefonnummer")
      .nullable(),
    betriebEmail: Yup.string()
      .email("Ungültige E-Mail-Adresse")
      .required("E-Mail ist erforderlich für Betriebe"),
  });
};

// Step 6b: Full Company Data (includes contact person)
// Falls Betriebsangabe pflichtig ist, aber keiner existiert dann optional checkbox "Kein Betrieb vorhanden"
export const validateStudentCompanyData = Yup.object({
  beruf: Yup.string().required("Beruf ist erforderlich"),
  betriebEintritt: Yup.mixed()
    .nullable()
    .test("valid-date", "Ungültiges Datum", (value) => {
      if (!value) return false; // Required field
      if (dayjs.isDayjs(value)) {
        return value.isValid();
      }
      return false;
    })
    .required("Eintrittsdatum ist erforderlich"),
  betriebName: Yup.string().required("Name des Betriebs ist erforderlich"),
  betriebStraße: Yup.string().required("Straße ist erforderlich"),
  betriebHausNr: Yup.string().required("Hausnummer ist erforderlich"),
  betriebPlz: Yup.string()
    .matches(/^\d{5}$/, "PLZ muss 5 Ziffern haben")
    .required("PLZ ist erforderlich"),
  betriebOrt: Yup.string().required("Ort ist erforderlich"),
  betriebTelefon1: Yup.string()
    .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Telefonnummer")
    .nullable(),
  betriebEmail: Yup.string()
    .email("Ungültige E-Mail-Adresse")
    .required("E-Mail ist erforderlich für Betriebe"),
  // Betriebskontakt hinzufügen:
  betriebAnsprechpartnerAnrede: Yup.string()
    .oneOf(["Herr", "Frau", "Divers"], "Ungültige Anrede")
    .required("Anrede ist erforderlich"),
  betriebAnsprechpartnerVorname: Yup.string().required(
    "Vorname ist erforderlich",
  ),
  betriebAnsprechpartnerNachname: Yup.string().required(
    "Nachname ist erforderlich",
  ),
  betriebAnsprechpartnerTel: Yup.string()
    .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Telefonnummer")
    .required("Telefonnummer ist erforderlich"),
});

// Dynamic version with profession and salutation options
export const createValidateStudentCompanyData = (
  professionOptions: string[],
  salutationOptions: string[],
  allowCustomProfession = true,
) => {
  const berufValidation = allowCustomProfession
    ? Yup.string().required("Beruf ist erforderlich")
    : Yup.string()
        .oneOf(professionOptions, "Ungültiger Beruf")
        .required("Beruf ist erforderlich");

  return Yup.object({
    beruf: berufValidation,
    betriebEintritt: Yup.mixed()
      .nullable()
      .test("valid-date", "Ungültiges Datum", (value) => {
        if (!value) return false; // Required field
        if (dayjs.isDayjs(value)) {
          return value.isValid();
        }
        return false;
      })
      .required("Eintrittsdatum ist erforderlich"),
    betriebName: Yup.string().required("Name des Betriebs ist erforderlich"),
    betriebStraße: Yup.string().required("Straße ist erforderlich"),
    betriebHausNr: Yup.string().required("Hausnummer ist erforderlich"),
    betriebPlz: Yup.string()
      .matches(/^\d{5}$/, "PLZ muss 5 Ziffern haben")
      .required("PLZ ist erforderlich"),
    betriebOrt: Yup.string().required("Ort ist erforderlich"),
    betriebTelefon1: Yup.string()
      .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Telefonnummer")
      .nullable(),
    betriebEmail: Yup.string()
      .email("Ungültige E-Mail-Adresse")
      .required("E-Mail ist erforderlich für Betriebe"),
    betriebAnsprechpartnerAnrede: Yup.string()
      .oneOf(salutationOptions, "Ungültige Anrede")
      .required("Anrede ist erforderlich"),
    betriebAnsprechpartnerVorname: Yup.string().required(
      "Vorname ist erforderlich",
    ),
    betriebAnsprechpartnerNachname: Yup.string().required(
      "Nachname ist erforderlich",
    ),
    betriebAnsprechpartnerTel: Yup.string()
      .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Telefonnummer")
      .required("Telefonnummer ist erforderlich"),
  });
};

// Step 7: Company Contact Person(s) - separate validation for CompanyContactForm
// Contact 1 is always required, Contact 2 is conditional (all-or-nothing)
export const createValidateStudentCompanyContactData = (
  salutationOptions: string[],
) => {
  // Helper to check if any Contact 2 field has value
  const hasAnyContact2Value = (parent: Record<string, unknown>) => {
    return !!(
      parent.betriebAp2Anrede ||
      parent.betriebAp2Name ||
      parent.betriebAp2Telefon1 ||
      parent.betriebAp2Email
    );
  };

  return Yup.object({
    // Contact 1 - always required
    betriebApAnrede: Yup.string()
      .oneOf(salutationOptions, "Ungültige Anrede")
      .required("Anrede ist erforderlich"),
    betriebApName: Yup.string().required("Name ist erforderlich"),
    betriebApTelefon1: Yup.string()
      .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Telefonnummer")
      .required("Telefonnummer ist erforderlich"),
    betriebApEmail: Yup.string()
      .email("Ungültige E-Mail-Adresse")
      .required("E-Mail ist erforderlich"),

    // Contact 2 - conditional (all required if any field filled)
    betriebAp2Anrede: Yup.string().test(
      "conditional-required",
      "Anrede ist erforderlich",
      function (value) {
        if (hasAnyContact2Value(this.parent)) {
          return !!value && value.trim() !== "";
        }
        return true;
      },
    ),
    betriebAp2Name: Yup.string().test(
      "conditional-required",
      "Name ist erforderlich",
      function (value) {
        if (hasAnyContact2Value(this.parent)) {
          return !!value && value.trim() !== "";
        }
        return true;
      },
    ),
    betriebAp2Telefon1: Yup.string().test(
      "conditional-required",
      "Telefonnummer ist erforderlich",
      function (value) {
        if (hasAnyContact2Value(this.parent)) {
          return !!value && /^\+?[0-9 ]{6,20}$/.test(value || "");
        }
        return true;
      },
    ),
    betriebAp2Email: Yup.string().test(
      "conditional-required",
      "E-Mail ist erforderlich",
      function (value) {
        if (hasAnyContact2Value(this.parent)) {
          // Check if value exists and is a valid email
          if (!value || value.trim() === "") return false;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        return true;
      },
    ),
  });
};

// Step 8: Datenschutzbestimmungen
export const validateStudentMetaData = Yup.object({
  changedData: Yup.mixed().nullable(),
  schuelerId: Yup.string().required("Schüler-ID ist erforderlich"),
  datenschutz: Yup.boolean()
    .oneOf([true], "Datenschutz muss akzeptiert werden")
    .required(),
  personenabbild: Yup.boolean().required(
    "Angabe zu Personenabbild ist erforderlich",
  ),
  teams: Yup.boolean().required("Angabe zu Teams ist erforderlich"),
  unterricht: Yup.boolean().required("Angabe zum Unterricht ist erforderlich"),
  schulordnung: Yup.boolean()
    .oneOf([true], "Schulordnung muss akzeptiert werden")
    .required(),
});
