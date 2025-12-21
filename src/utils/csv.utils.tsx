import ClientLogger from "@/lib/client-logger";
import { Student } from "@/types/db";
import i18n from "i18next";

import { formatGermanDate } from "./date.utils";
import { errorNotification, successNotification } from "./notification.utils";

export interface ParsedStudentAddress {
  street?: string;
  city?: string;
  zip?: string;
}

export interface ParsedContactPerson {
  type?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  mobile?: string;
  address?: ParsedStudentAddress;
}

export interface ParsedEmployer {
  companyName?: string;
  address?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactSalutation?: string;
}

export interface ParsedStudent {
  // Required fields
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  // Optional fields from comprehensive CSV
  birthName?: string;
  gender?: string;
  birthCountry?: string;
  birthplace?: string;
  religion?: string;
  nationality?: string;
  secondNationality?: string;
  originCountry?: string;
  immigrationYear?: string;
  familyLanguage?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  address?: ParsedStudentAddress;
  schoolEntryDate?: string;
  className?: string;
  previousSchool?: string;
  previousSchoolLevel?: string;
  previousSchoolType?: string;
  degrees?: string;
  profession?: string;
  trainingStartDate?: string;
  employer?: ParsedEmployer;
  contactPersons?: ParsedContactPerson[];
}

// German CSV header to English field mapping
const CSV_HEADER_MAP: Record<string, string> = {
  schueler_eintritt_aktuelleSchule: "schoolEntryDate",
  klassen_klassenbezeichnung: "className",
  schueler_vorname: "firstName",
  schueler_nachname: "lastName",
  schueler_geburtsname: "birthName",
  schueler_geschlecht: "gender",
  schueler_geburtsdatum: "dateOfBirth",
  schueler_geburtsland: "birthCountry",
  schueler_geburtsort: "birthplace",
  schueler_konfession: "religion",
  schueler_staatsangehoerigkeit1: "nationality",
  schueler_staatsangehoerigkeit2: "secondNationality",
  schueler_herkunftsland: "originCountry",
  schueler_zuzugsjahr: "immigrationYear",
  schueler_familiensprache: "familyLanguage",
  schueler_postleitzahl: "address.zip",
  schueler_ort: "address.city",
  schueler_straße: "address.street",
  schueler_telefon1: "phone",
  schueler_mobil: "mobile",
  schueler_email: "email",
  ansprechpartner_art: "contactPerson.type",
  ansprechpartner_1_vorname: "contactPerson.firstName",
  ansprechpartner_1_nachname: "contactPerson.lastName",
  ansprechpartner_1_plz: "contactPerson.address.zip",
  ansprechpartner_1_ort: "contactPerson.address.city",
  ansprechpartner_1_straße: "contactPerson.address.street",
  ansprechpartner_1_telefon1: "contactPerson.phone",
  ansprechpartner_mobil: "contactPerson.mobile",
  schueler_vorhergehende_schule: "previousSchool",
  schueler_vorhergehende_stufe: "previousSchoolLevel",
  schueler_vorhergehende_schulform: "previousSchoolType",
  schueler_abschlüsse: "degrees",
  schueler_beruf: "profession",
  betrieb_eintritt: "trainingStartDate",
  betrieb_name: "employer.companyName",
  betrieb_ansprechpartner_anrede: "employer.contactSalutation",
  betrieb_ap_name: "employer.contactName",
  betrieb_ap_telefon1: "employer.contactPhone",
  betrieb_straße: "employer.street",
  betrieb_plzort: "employer.zipCity",
  betrieb_telefon1: "employer.phone",
  betrieb_email: "employer.contactEmail",
  // Legacy simple format support
  firstname: "firstName",
  lastname: "lastName",
  dateofbirth: "dateOfBirth",
};

/**
 * Detect delimiter (comma or semicolon) from header line
 */
function detectDelimiter(headerLine: string): "," | ";" {
  const commaCount = (headerLine.match(/,/g) || []).length;
  const semicolonCount = (headerLine.match(/;/g) || []).length;
  return commaCount > semicolonCount ? "," : ";";
}

/**
 * Split a CSV line by delimiter, respecting quoted fields
 */
function splitCSVLine(line: string, delimiter: "," | ";"): string[] {
  const out: string[] = [];
  let buf = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      // toggle quotes; handle doubled quotes "" as escaped quote
      if (inQuotes && line[i + 1] === '"') {
        buf += '"';
        i += 1; // skip the escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      out.push(buf);
      buf = "";
    } else {
      buf += ch;
    }
  }
  out.push(buf);
  return out;
}

/**
 * Normalize header name for mapping lookup
 */
function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/"/g, "").trim().replace(/\s+/g, "_");
}

/**
 * Map gender value from German to English
 */
function mapGender(value: string): string | undefined {
  const v = value.toLowerCase().trim();
  if (v === "m" || v === "männlich" || v === "male") return "male";
  if (v === "w" || v === "f" || v === "weiblich" || v === "female")
    return "female";
  if (v === "d" || v === "divers" || v === "diverse") return "diverse";
  return undefined;
}

/**
 * Set a nested property on an object using dot notation
 */
function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: string,
): void {
  const parts = path.split(".");
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current)) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }

  current[parts[parts.length - 1]] = value;
}

/**
 * Parse a row of CSV data into a ParsedStudent object
 */
function parseCSVRow(
  fields: string[],
  headerMapping: { index: number; englishField: string }[],
): ParsedStudent {
  const result: Record<string, unknown> = {};
  const contactPerson: Record<string, unknown> = {};
  const employer: Record<string, unknown> = {};
  const address: Record<string, unknown> = {};

  headerMapping.forEach(({ index, englishField }) => {
    const rawValue = fields[index]?.replace(/(^"|"$)/g, "").trim() || "";
    if (!rawValue) return;

    // Handle special field mappings
    if (englishField === "gender") {
      const mapped = mapGender(rawValue);
      if (mapped) result.gender = mapped;
    } else if (englishField.startsWith("contactPerson.")) {
      const subPath = englishField.replace("contactPerson.", "");
      setNestedValue(contactPerson, subPath, rawValue);
    } else if (englishField.startsWith("employer.")) {
      const subPath = englishField.replace("employer.", "");
      // Handle special employer.zipCity field (combine zip and city)
      if (subPath === "zipCity") {
        employer.address = rawValue;
      } else if (subPath === "street") {
        // Append street to address
        const existing = (employer.address as string) || "";
        employer.address = existing ? `${rawValue}, ${existing}` : rawValue;
      } else {
        setNestedValue(employer, subPath, rawValue);
      }
    } else if (englishField.startsWith("address.")) {
      const subPath = englishField.replace("address.", "");
      setNestedValue(address, subPath, rawValue);
    } else {
      result[englishField] = rawValue;
    }
  });

  // Attach nested objects if they have data
  if (Object.keys(contactPerson).length > 0) {
    // Only add contact person if they have at least firstName or lastName
    if (contactPerson.firstName || contactPerson.lastName) {
      result.contactPersons = [contactPerson];
    }
  }
  if (Object.keys(employer).length > 0) {
    // Only add employer if they have at least companyName
    if (employer.companyName) {
      result.employer = employer;
    }
  }
  if (Object.keys(address).length > 0) {
    result.address = address;
  }

  return result as unknown as ParsedStudent;
}

/**
 * Check if the CSV uses the comprehensive German format
 */
function isComprehensiveFormat(headers: string[]): boolean {
  const normalizedHeaders = headers.map(normalizeHeader);
  // Check for at least a few German-specific headers
  const germanHeaders = [
    "schueler_vorname",
    "schueler_nachname",
    "schueler_geburtsdatum",
    "klassen_klassenbezeichnung",
  ];
  return germanHeaders.some((h) => normalizedHeaders.includes(h));
}

/**
 * Parse a CSV file with student data
 * Supports both simple format (firstName;lastName;dateOfBirth) and
 * comprehensive German format (43 columns)
 *
 * @param file The File object from an <input type="file">
 * @param setData Optional callback to receive parsed rows
 * @returns Promise<ParsedStudent[] | void>
 */
export function parseCSVFile(
  file: File,
  setData?: (rows: ParsedStudent[]) => void,
): Promise<ParsedStudent[] | void> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const errors: string[] = [];

    const addError = (msg: string, details?: unknown) => {
      errors.push(msg);
      if (details !== undefined) ClientLogger.error(details);
    };

    reader.onload = () => {
      try {
        const raw = reader.result;
        const text =
          typeof raw === "string"
            ? raw
            : raw instanceof ArrayBuffer
              ? new TextDecoder("utf-8").decode(raw)
              : "";

        const trimmed = text.replace(/^\uFEFF/, "").trim(); // strip BOM + trim

        if (!trimmed) {
          addError(
            i18n.t("settings.csv.CSV data is empty"),
            "File content is empty",
          );
        } else {
          // Normalize CRLF to LF and remove trailing blank lines
          const lines = trimmed
            .replace(/\r\n/g, "\n")
            .split("\n")
            .filter((l) => l.trim().length > 0);

          if (lines.length < 2) {
            addError(
              i18n.t(
                "settings.csv.CSV data should contain both headers and data rows",
              ),
              "Insufficient data rows in CSV",
            );
          } else {
            const delimiter = detectDelimiter(lines[0]);
            const headerFields = splitCSVLine(lines[0], delimiter).map((h) =>
              h.replace(/"/g, "").trim(),
            );

            const isComprehensive = isComprehensiveFormat(headerFields);

            // Build header mapping
            const headerMapping: { index: number; englishField: string }[] = [];
            headerFields.forEach((header, index) => {
              const normalized = normalizeHeader(header);
              const englishField = CSV_HEADER_MAP[normalized];
              if (englishField) {
                headerMapping.push({ index, englishField });
              }
            });

            // Validate we have the minimum required fields
            const mappedFields = headerMapping.map((m) => m.englishField);
            const hasFirstName = mappedFields.includes("firstName");
            const hasLastName = mappedFields.includes("lastName");
            const hasDateOfBirth = mappedFields.includes("dateOfBirth");

            if (!hasFirstName || !hasLastName || !hasDateOfBirth) {
              const missing: string[] = [];
              if (!hasFirstName) missing.push("firstName/Schueler_Vorname");
              if (!hasLastName) missing.push("lastName/Schueler_Nachname");
              if (!hasDateOfBirth)
                missing.push("dateOfBirth/Schueler_Geburtsdatum");

              addError(
                i18n.t("settings.csv.Missing required headers", {
                  headers: missing.join(", "),
                }),
                `Missing required headers: ${missing.join(", ")}. Found: ${headerFields.join(", ")}`,
              );
            } else {
              const data: ParsedStudent[] = [];

              lines.slice(1).forEach((line, idx) => {
                const rowNum = idx + 2; // +2 (1-based + header row)
                const fields = splitCSVLine(line, delimiter);

                // Parse row using the comprehensive parser
                const student = parseCSVRow(fields, headerMapping);

                // Validate required fields
                if (!student.firstName || !student.lastName) {
                  addError(
                    i18n.t("settings.csv.Invalid row format", { row: rowNum }),
                    `Row ${rowNum} missing firstName or lastName`,
                  );
                  return;
                }

                // dateOfBirth might be empty for some import scenarios
                if (!student.dateOfBirth) {
                  addError(
                    i18n.t("settings.csv.Invalid row format", { row: rowNum }),
                    `Row ${rowNum} missing dateOfBirth`,
                  );
                  return;
                }

                data.push(student);
              });

              if (data.length === 0) {
                addError(
                  i18n.t("settings.csv.CSV file has no valid data"),
                  "No valid data rows after filtering",
                );
              } else {
                try {
                  if (setData) setData(data);
                  const formatType = isComprehensive
                    ? "comprehensive"
                    : "simple";
                  ClientLogger.info(
                    `Parsed ${data.length} students from ${formatType} CSV format`,
                  );
                  successNotification(
                    i18n.t("settings.csv.CSV uploaded and parsed successfully"),
                  );
                  resolve(data);
                } catch (err) {
                  const error = err as Error;
                  addError(
                    i18n.t("settings.csv.Error while parsing CSV"),
                    `Exception during setData: ${error.message}`,
                  );
                  ClientLogger.error("Error parsing CSV:", err);
                }
              }
            }
          }
        }
      } catch (err) {
        addError(
          i18n.t("settings.csv.Error while parsing CSV"),
          (err as Error).message,
        );
      } finally {
        if (errors.length > 0) {
          // No JSX here — pass a single formatted string
          const formatted = errors.map((m, i) => `${i + 1}. ${m}`).join("\n");
          errorNotification(formatted);
        }
        resolve();
      }
    };

    reader.onerror = () => {
      const reason = reader.error?.message ?? "Unknown FileReader error";
      errors.push(i18n.t("settings.csv.Error while reading file"));
      ClientLogger.error(reason);
      errorNotification(errors.join("\n"));
      resolve();
    };

    // Read as ArrayBuffer to properly handle BOM via TextDecoder
    reader.readAsArrayBuffer(file);
  });
}

type ExportSettings = {
  includeEmptyFields?: boolean;
  locale?: string;
};

function escapeCSVField(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const str = String(value);

  if (str.includes(";") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

function buildCSVRow(
  student: Student,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  includeEmptyFields: boolean,
): string[] {
  const getClassName = () => {
    // Use cached class name if available, otherwise current class ID
    return student.currentClassName || student.currentClass || "";
  };

  const cp1 = student.contactPersons?.[0];
  const cp2 = student.contactPersons?.[1];
  const cp3 = student.contactPersons?.[2];

  const row = [
    student.firstName || "",
    student.lastName || "",
    student.birthName || "",
    formatGermanDate(student.dateOfBirth) || "",
    student.gender || "",
    student.religion || "",
    student.email || "",
    student.phone || "", // Mobile/Phone merged
    student.phone || "",
    student.address?.street || "",
    "", // House number not stored separately
    student.address?.zip || "",
    student.address?.city || "",
    student.birthplace || "",
    student.birthCountry || "",
    student.nationality || "",
    student.secondNationality || "",
    student.immigrationYear || "",
    student.familyLanguage || "",
    cp1?.type || "",
    cp1?.firstName || "",
    cp1?.lastName || "",
    cp1?.address?.street || "",
    "", // House number not stored separately
    cp1?.address?.zip || "",
    cp1?.address?.city || "",
    cp1?.mobile || "",
    cp1?.phone || "",
    cp2?.type || "",
    cp2?.firstName || "",
    cp2?.lastName || "",
    cp2?.address?.street || "",
    "", // House number not stored separately
    cp2?.address?.zip || "",
    cp2?.address?.city || "",
    cp2?.mobile || "",
    cp2?.phone || "",
    cp3?.type || "",
    cp3?.firstName || "",
    cp3?.lastName || "",
    cp3?.address?.street || "",
    "", // House number not stored separately
    cp3?.address?.zip || "",
    cp3?.address?.city || "",
    cp3?.mobile || "",
    cp3?.phone || "",
    student.previousSchool || "",
    student.previousSchoolType || "",
    student.previousSchoolLevel || "",
    student.degrees || "",
    student.profession || "",
    student.employer?.companyName || "",
    student.employer?.contactName || "",
    student.employer?.contactPhone || "",
    student.employer?.contactEmail || "",
    student.employer?.address || "", // Full address string
    "", // House number not stored separately
    "", // Postal code not stored separately
    "", // City not stored separately
    formatGermanDate(student.trainingStartDate) || "",
    student.agreements?.dataProtection ? "true" : "false",
    student.agreements?.classParticipation ? "true" : "false",
    student.agreements?.schoolRules ? "true" : "false",
    student.agreements?.imageRights ? "true" : "false",
    student.agreements?.teamsUsage ? "true" : "false",
    getClassName(),
    student._id || "",
    student.status || "",
    String(student.onboardingStep ?? ""),
  ];

  return row.map((v) => escapeCSVField(v));
}

function getCSVHeaders(): string[] {
  return [
    "firstName",
    "lastName",
    "birthName",
    "dateOfBirth",
    "gender",
    "religion",
    "email",
    "mobile",
    "phone",
    "street",
    "houseNumber",
    "postalCode",
    "city",
    "birthPlace",
    "birthCountry",
    "nationality",
    "nationality2",
    "immigrationYear",
    "familyLanguage",
    "cp1_type",
    "cp1_firstName",
    "cp1_lastName",
    "cp1_street",
    "cp1_houseNumber",
    "cp1_postalCode",
    "cp1_city",
    "cp1_mobile",
    "cp1_phone",
    "cp2_type",
    "cp2_firstName",
    "cp2_lastName",
    "cp2_street",
    "cp2_houseNumber",
    "cp2_postalCode",
    "cp2_city",
    "cp2_mobile",
    "cp2_phone",
    "cp3_type",
    "cp3_firstName",
    "cp3_lastName",
    "cp3_street",
    "cp3_houseNumber",
    "cp3_postalCode",
    "cp3_city",
    "cp3_mobile",
    "cp3_phone",
    "previousSchool",
    "previousSchoolType",
    "previousGrade",
    "degrees",
    "trainingOccupation",
    "employer_name",
    "employer_contactName",
    "employer_phone",
    "employer_email",
    "employer_street",
    "employer_houseNumber",
    "employer_postalCode",
    "employer_city",
    "employer_startDate",
    "agreement_dataProtection",
    "agreement_classParticipation",
    "agreement_schoolRules",
    "agreement_imageRights",
    "agreement_teamsUsage",
    "className",
    "studentId",
    "status",
    "onboardingStep",
  ];
}

export async function buildStudentDataCsv(
  student: Student,
  settings: ExportSettings = {},
): Promise<Blob> {
  const { includeEmptyFields = false } = settings;

  const headers = getCSVHeaders();
  const dataRow = buildCSVRow(student, includeEmptyFields);

  const csvLines = [headers.join(";"), dataRow.join(";")];

  const csvContent = "\uFEFF" + csvLines.join("\n");

  return new Blob([csvContent], { type: "text/csv;charset=utf-8" });
}

export async function buildCombinedStudentDataCsv(
  students: Student[],
  settings: ExportSettings = {},
): Promise<Blob> {
  const { includeEmptyFields = false } = settings;

  const headers = getCSVHeaders();
  const dataRows = students.map((s) => buildCSVRow(s, includeEmptyFields));

  const csvLines = [headers.join(";"), ...dataRows.map((row) => row.join(";"))];

  const csvContent = "\uFEFF" + csvLines.join("\n");

  return new Blob([csvContent], { type: "text/csv;charset=utf-8" });
}
