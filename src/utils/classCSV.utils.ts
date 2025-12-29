import ClientLogger from "@/lib/client-logger";
import { ClassCreateInput, ClassInterface } from "@/types/class";
import i18n from "i18next";

import { errorNotification, successNotification } from "./notification.utils";

export interface ParsedClass {
  // Required fields
  name: string;
  schoolYearFrom: string | Date;
  schoolYearTo: string | Date;
  // Optional fields
  grade: number | null;
  isVocational: boolean;
  requiresEmployerInfo: boolean;
  active: boolean;
  incomplete: boolean;
  // Validation status
  isValid?: boolean;
  validationErrors?: string[];
}

export interface ClassCSVRow extends ParsedClass {
  id: string;
  touched?: boolean;
}

/**
 * Extract grade from class name (e.g., "12InfoA" → 12, "7A" → 7, "BFS" → null)
 */
export function extractGradeFromName(name: string): number | null {
  const match = name.match(/^(\d{1,2})/);
  if (match) {
    const grade = parseInt(match[1], 10);
    if (grade >= 1 && grade <= 14) return grade;
  }
  return null;
}

// Header mapping for both English and German headers
const CLASS_CSV_HEADER_MAP: Record<string, string> = {
  // English headers
  name: "name",
  classname: "name",
  class_name: "name",
  class: "name",
  schoolyearfrom: "schoolYearFrom",
  school_year_from: "schoolYearFrom",
  yearfrom: "schoolYearFrom",
  year_from: "schoolYearFrom",
  from: "schoolYearFrom",
  schoolyearto: "schoolYearTo",
  school_year_to: "schoolYearTo",
  yearto: "schoolYearTo",
  year_to: "schoolYearTo",
  to: "schoolYearTo",
  grade: "grade",
  stufe: "grade",
  isvocational: "isVocational",
  is_vocational: "isVocational",
  vocational: "isVocational",
  requiresemployerinfo: "requiresEmployerInfo",
  requires_employer_info: "requiresEmployerInfo",
  employerinfo: "requiresEmployerInfo",
  employer_info: "requiresEmployerInfo",
  active: "active",
  status: "active",
  // German headers
  klasse: "name",
  klassenname: "name",
  schuljahr_von: "schoolYearFrom",
  schuljahrvon: "schoolYearFrom",
  schuljahr_bis: "schoolYearTo",
  schuljahrbis: "schoolYearTo",
  berufsschule: "isVocational",
  berufsklasse: "isVocational",
  betriebspflicht: "requiresEmployerInfo",
  betriebsinfo: "requiresEmployerInfo",
  aktiv: "active",
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
      if (inQuotes && line[i + 1] === '"') {
        buf += '"';
        i += 1;
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
 * Parse a boolean value from string
 */
function parseBoolean(value: string, defaultValue: boolean): boolean {
  const v = value.toLowerCase().trim();
  if (v === "" || v === "undefined" || v === "null") return defaultValue;
  if (v === "true" || v === "1" || v === "yes" || v === "ja") return true;
  if (v === "false" || v === "0" || v === "no" || v === "nein") return false;
  return defaultValue;
}

/**
 * Parse a date value - supports YYYY, YYYY-MM-DD, DD.MM.YYYY formats
 */
function parseDateValue(value: string): Date | null {
  if (!value || value.trim() === "") return null;

  const trimmed = value.trim();

  // Try YYYY format (just year)
  if (/^\d{4}$/.test(trimmed)) {
    const year = parseInt(trimmed, 10);
    return new Date(year, 0, 1); // January 1st of that year
  }

  // Try YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d;
  }

  // Try DD.MM.YYYY format (German)
  const germanMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (germanMatch) {
    const [, day, month, year] = germanMatch;
    const d = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
    );
    if (!isNaN(d.getTime())) return d;
  }

  // Try ISO format
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) return d;

  return null;
}

/**
 * Parse a grade value - supports numbers 1-14 or empty
 */
function parseGrade(value: string): number | null {
  if (!value || value.trim() === "" || value === "-" || value === "–") {
    return null;
  }

  const n = parseInt(value.trim(), 10);
  if (Number.isFinite(n) && n >= 1 && n <= 14) {
    return n;
  }

  return null;
}

/**
 * Validate a parsed class and return validation errors
 * Only name is required - other fields are auto-computed
 */
function validateParsedClass(parsedClass: ParsedClass): string[] {
  const errors: string[] = [];

  if (!parsedClass.name || parsedClass.name.trim() === "") {
    errors.push("Name is required");
  }

  return errors;
}

/**
 * Parse a row of CSV data into a ParsedClass object
 * Auto-computes defaults for missing fields (like QuickManage modal)
 */
function parseClassCSVRow(
  fields: string[],
  headerMapping: { index: number; englishField: string }[],
): ParsedClass {
  const currentYear = new Date().getFullYear();

  const result: Record<string, unknown> = {
    name: "",
    schoolYearFrom: new Date(currentYear, 0, 1),
    schoolYearTo: new Date(currentYear + 1, 0, 1),
    grade: null,
    isVocational: false,
    requiresEmployerInfo: false,
    active: true,
    incomplete: false,
  };

  headerMapping.forEach(({ index, englishField }) => {
    const rawValue = fields[index]?.replace(/(^"|"$)/g, "").trim() || "";
    if (!rawValue) return;

    switch (englishField) {
      case "name":
        result.name = rawValue;
        break;
      case "schoolYearFrom":
        result.schoolYearFrom =
          parseDateValue(rawValue) || result.schoolYearFrom;
        break;
      case "schoolYearTo":
        result.schoolYearTo = parseDateValue(rawValue) || result.schoolYearTo;
        break;
      case "grade":
        result.grade = parseGrade(rawValue);
        break;
      case "isVocational":
        result.isVocational = parseBoolean(rawValue, false);
        break;
      case "requiresEmployerInfo":
        result.requiresEmployerInfo = parseBoolean(rawValue, false);
        break;
      case "active":
        result.active = parseBoolean(rawValue, true);
        break;
    }
  });

  // Auto-extract grade from name if not provided
  if (result.grade === null && result.name) {
    result.grade = extractGradeFromName(result.name as string);
  }

  // Set incomplete status based on whether grade exists
  result.incomplete = result.grade === null;

  const parsedClass = result as unknown as ParsedClass;
  const validationErrors = validateParsedClass(parsedClass);
  parsedClass.isValid = validationErrors.length === 0;
  parsedClass.validationErrors = validationErrors;

  return parsedClass;
}

/**
 * Parse a CSV file with class data
 *
 * @param file The File object from an <input type="file">
 * @param setData Optional callback to receive parsed rows
 * @returns Promise<ParsedClass[] | void>
 */
export function parseClassCSVFile(
  file: File,
  setData?: (rows: ParsedClass[]) => void,
): Promise<ParsedClass[] | void> {
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

        const trimmed = text.replace(/^\uFEFF/, "").trim();

        if (!trimmed) {
          addError(
            i18n.t("settings.csv.CSV data is empty"),
            "File content is empty",
          );
        } else {
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

            // Build header mapping
            const headerMapping: { index: number; englishField: string }[] = [];
            headerFields.forEach((header, index) => {
              const normalized = normalizeHeader(header);
              const englishField = CLASS_CSV_HEADER_MAP[normalized];
              if (englishField) {
                headerMapping.push({ index, englishField });
              }
            });

            // Validate we have the minimum required fields (only name required)
            const mappedFields = headerMapping.map((m) => m.englishField);
            const hasName = mappedFields.includes("name");

            if (!hasName) {
              addError(
                i18n.t("settings.csv.Missing required headers", {
                  headers: "name/klasse",
                }),
                `Missing required header: name. Found: ${headerFields.join(", ")}`,
              );
            } else {
              const data: ParsedClass[] = [];

              lines.slice(1).forEach((line, idx) => {
                const rowNum = idx + 2;
                const fields = splitCSVLine(line, delimiter);
                const parsedClass = parseClassCSVRow(fields, headerMapping);

                if (!parsedClass.name) {
                  addError(
                    i18n.t("settings.csv.Invalid row format", { row: rowNum }),
                    `Row ${rowNum} missing name`,
                  );
                  return;
                }

                data.push(parsedClass);
              });

              if (data.length === 0) {
                addError(
                  i18n.t("settings.csv.CSV file has no valid data"),
                  "No valid data rows after filtering",
                );
              } else {
                try {
                  if (setData) setData(data);
                  ClientLogger.info(`Parsed ${data.length} classes from CSV`);
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

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Escape a CSV field value
 */
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

/**
 * Get CSV headers for class export (name only)
 */
function getClassCSVHeaders(): string[] {
  return ["name"];
}

/**
 * Build a CSV row from a class object (name only)
 */
function buildClassCSVRow(classItem: ClassInterface): string[] {
  return [escapeCSVField(classItem.name || "")];
}

/**
 * Build a CSV blob from an array of classes
 *
 * @param classes Array of ClassInterface objects to export
 * @returns Blob containing CSV data
 */
export function buildClassDataCsv(classes: ClassInterface[]): Blob {
  const headers = getClassCSVHeaders();
  const dataRows = classes.map((c) => buildClassCSVRow(c));

  const csvLines = [headers.join(";"), ...dataRows.map((row) => row.join(";"))];

  const csvContent = "\uFEFF" + csvLines.join("\n");

  return new Blob([csvContent], { type: "text/csv;charset=utf-8" });
}

/**
 * Convert ParsedClass array to ClassCreateInput array for API submission
 */
export function convertToClassCreateInput(
  parsedClasses: ParsedClass[],
): ClassCreateInput[] {
  return parsedClasses
    .filter((pc) => pc.isValid)
    .map((pc) => {
      const fromDate =
        pc.schoolYearFrom instanceof Date
          ? pc.schoolYearFrom
          : parseDateValue(pc.schoolYearFrom as string);

      const toDate =
        pc.schoolYearTo instanceof Date
          ? pc.schoolYearTo
          : parseDateValue(pc.schoolYearTo as string);

      return {
        schoolYearFrom: fromDate,
        schoolYearTo: toDate,
        name: pc.name.trim(),
        grade: pc.grade,
        isVocational: pc.isVocational,
        requiresEmployerInfo: pc.requiresEmployerInfo,
        active: pc.active,
        incomplete: pc.incomplete,
      };
    });
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
