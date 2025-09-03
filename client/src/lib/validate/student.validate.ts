import * as Yup from "yup";

// Step 1: Allgemeine Daten
export const validateGeneralStudentData = Yup.object({
  eintrittschule: Yup.string().required("Eintrittsschule ist erforderlich"),
  klassenname: Yup.string().required("Klassenname ist erforderlich"),
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

// Step 2: Herkunft (Optional)
export const validateStudentOriginData = Yup.object({
  herkunftsland: Yup.string().required("Herkunftsland ist erforderlich"),
  zuzugjahr: Yup.number()
    .typeError("Zuzugsjahr muss eine Zahl sein")
    .integer("Zuzugsjahr muss eine ganze Zahl sein")
    .min(1900, "Ungültiges Jahr")
    .max(
      new Date().getFullYear(),
      "Zuzugsjahr darf nicht in der Zukunft liegen",
    )
    .required("Zuzugsjahr ist erforderlich"),
  familiensprache: Yup.string().required("Familiensprache ist erforderlich"),
});

// Step 3: Adresse
export const validateStudentAddressData = Yup.object({
  straße: Yup.string().required("Straße ist erforderlich"),
  hausnr: Yup.string().required("Hausnummer ist erforderlich"),
  plz: Yup.string()
    .matches(/^\d{5}$/, "PLZ muss 5 Ziffern haben")
    .required("PLZ ist erforderlich"),
  ort: Yup.string().required("Ort ist erforderlich"),
  mobil: Yup.string()
    .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Mobilnummer")
    .nullable(),
  tel: Yup.string()
    .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Telefonnummer")
    .nullable(),
  mail: Yup.string()
    .email("Ungültige E-Mail-Adresse")
    .required("E-Mail ist erforderlich"),
});

// Step 4: Ansprechpartner:
export const validateStudentContactPersonData = Yup.object({
  ansprechpartnerArt: Yup.string().required(
    "Art des Ansprechpartners ist erforderlich",
  ),
  ansprechpartnerVorname: Yup.string().required(
    "Vorname des Ansprechpartners ist erforderlich",
  ),
  ansprechpartnerNachname: Yup.string().required(
    "Nachname des Ansprechpartners ist erforderlich",
  ),
  ansprechpartnerPlz: Yup.string()
    .matches(/^\d{5}$/, "PLZ muss 5 Ziffern haben")
    .required("PLZ ist erforderlich"),
  ansprechpartnerOrt: Yup.string().required("Ort ist erforderlich"),
  ansprechpartnerStraße: Yup.string().required("Straße ist erforderlich"),
  ansprechpartnerHausNr: Yup.string().required("Hausnummer ist erforderlich"),
  ansprechpartnerMobil: Yup.string()
    .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Mobilnummer")
    .nullable(),
  ansprechpartnerTelefon: Yup.string()
    .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Telefonnummer")
    .nullable(),
});

// Step 5: Vorbildung
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

// Step 6: Betrieb
export const validateStudentCompanyData = Yup.object({
  beruf: Yup.string().required("Beruf ist erforderlich"),
  betriebEintritt: Yup.date()
    .typeError("Ungültiges Datum")
    .required("Eintrittsdatum ist erforderlich"),
  betriebName: Yup.string().required("Name des Betriebs ist erforderlich"),
  betriebStraße: Yup.string().required("Straße ist erforderlich"),
  betriebHausNr: Yup.string().required("Hausnummer ist erforderlich"),
  betriebPlz: Yup.string()
    .matches(/^\d{5}$/, "PLZ muss 5 Ziffern haben")
    .required("PLZ ist erforderlich"),
  betriebOrt: Yup.string().required("Ort ist erforderlich"),
  betriebTel: Yup.string()
    .matches(/^\+?[0-9 ]{6,20}$/, "Ungültige Telefonnummer")
    .nullable(),
  betriebMail: Yup.string().email("Ungültige E-Mail-Adresse").nullable(),
});

// Step 7: Betriebskontakt
export const validateStudentCompanyContactData = Yup.object({
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
