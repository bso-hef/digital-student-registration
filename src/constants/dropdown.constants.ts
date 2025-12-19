import { DropdownOption } from "@/types/settings";

export const GENDER_OPTIONS: DropdownOption[] = [
  { value: "männlich", label: "Männlich", enabled: true, order: 0 },
  { value: "weiblich", label: "Weiblich", enabled: true, order: 1 },
  { value: "divers", label: "Divers", enabled: true, order: 2 },
];

export const SALUTATION_OPTIONS: DropdownOption[] = [
  { value: "Herr", label: "Herr", enabled: true, order: 0 },
  { value: "Frau", label: "Frau", enabled: true, order: 1 },
  { value: "Divers", label: "Divers", enabled: true, order: 2 },
];

export const RELIGION_OPTIONS: DropdownOption[] = [
  { value: "katholisch", label: "Katholisch", enabled: true, order: 0 },
  { value: "evangelisch", label: "Evangelisch", enabled: true, order: 1 },
  { value: "islamisch", label: "Islamisch", enabled: true, order: 2 },
  { value: "jüdisch", label: "Jüdisch", enabled: true, order: 3 },
  { value: "keine", label: "Keine", enabled: true, order: 4 },
  { value: "andere", label: "Andere", enabled: true, order: 5 },
];

export const CONTACT_PERSON_TYPE_OPTIONS: DropdownOption[] = [
  { value: "Mutter", label: "Mutter", enabled: true, order: 0 },
  { value: "Vater", label: "Vater", enabled: true, order: 1 },
  { value: "Vormund", label: "Vormund", enabled: true, order: 2 },
  { value: "Andere", label: "Andere", enabled: true, order: 3 },
];

export const SCHOOL_LEVEL_OPTIONS: DropdownOption[] = [
  { value: "Klasse 5", label: "Klasse 5", enabled: true, order: 0 },
  { value: "Klasse 6", label: "Klasse 6", enabled: true, order: 1 },
  { value: "Klasse 7", label: "Klasse 7", enabled: true, order: 2 },
  { value: "Klasse 8", label: "Klasse 8", enabled: true, order: 3 },
  { value: "Klasse 9", label: "Klasse 9", enabled: true, order: 4 },
  { value: "Klasse 10", label: "Klasse 10", enabled: true, order: 5 },
  { value: "Klasse 11", label: "Klasse 11", enabled: true, order: 6 },
  { value: "Klasse 12", label: "Klasse 12", enabled: true, order: 7 },
  { value: "Klasse 13", label: "Klasse 13", enabled: true, order: 8 },
  { value: "Klasse 14", label: "Klasse 14", enabled: true, order: 9 },
];

export const SCHOOL_TYPE_OPTIONS: DropdownOption[] = [
  { value: "Grundschule", label: "Grundschule", enabled: true, order: 0 },
  { value: "Hauptschule", label: "Hauptschule", enabled: true, order: 1 },
  { value: "Realschule", label: "Realschule", enabled: true, order: 2 },
  { value: "Gymnasium", label: "Gymnasium", enabled: true, order: 3 },
  { value: "Gesamtschule", label: "Gesamtschule", enabled: true, order: 4 },
  { value: "Berufsschule", label: "Berufsschule", enabled: true, order: 5 },
];

export const DEGREE_OPTIONS: DropdownOption[] = [
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
  { value: "Fachabitur", label: "Fachabitur", enabled: true, order: 2 },
  { value: "Abitur", label: "Abitur", enabled: true, order: 3 },
  { value: "Kein", label: "Kein Abschluss", enabled: true, order: 4 },
];

export const LANGUAGE_OPTIONS: DropdownOption[] = [
  { value: "Deutsch", label: "Deutsch", enabled: true, order: 0 },
  { value: "Englisch", label: "Englisch", enabled: true, order: 1 },
  { value: "Türkisch", label: "Türkisch", enabled: true, order: 2 },
  { value: "Arabisch", label: "Arabisch", enabled: true, order: 3 },
  { value: "Polnisch", label: "Polnisch", enabled: true, order: 4 },
  { value: "Russisch", label: "Russisch", enabled: true, order: 5 },
  { value: "Andere", label: "Andere", enabled: true, order: 6 },
];

export const PROFESSION_OPTIONS: DropdownOption[] = [
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
];

export const getEnabledOptions = (
  options: DropdownOption[],
): DropdownOption[] =>
  options.filter((opt) => opt.enabled).sort((a, b) => a.order - b.order);

export const getOptionValues = (options: DropdownOption[]): string[] =>
  getEnabledOptions(options).map((opt) => opt.value);
