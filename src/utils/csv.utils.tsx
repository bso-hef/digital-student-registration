import ClientLogger from "@/lib/client-logger";
import { Student } from "@/types/db";
import i18n from "i18next";

import { errorNotification, successNotification } from "./notification.utils";

export interface ParsedStudent {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

/**
 * Parse a semicolon-delimited CSV with expected headers: firstName;lastName;dateOfBirth
 * - Accepts quoted fields
 * - Trims values and strips double quotes
 * - Validates headers and rows
 *
 * @param file The File object from an <input type="file">
 * @param setData Optional callback to receive parsed rows
 * @returns Promise<void> (notifications are shown inside)
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

    // Minimal parser for semicolon-separated lines with quotes.
    // Splits on ';' only when not inside quotes.
    const splitSemicolons = (line: string): string[] => {
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
        } else if (ch === ";" && !inQuotes) {
          out.push(buf);
          buf = "";
        } else {
          buf += ch;
        }
      }
      out.push(buf);
      return out;
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
            const headerFields = splitSemicolons(lines[0]).map((h) =>
              h.replace(/"/g, "").trim(),
            );

            const expected = ["firstname", "lastname", "dateofbirth"];
            const headerValid =
              expected.length === headerFields.length &&
              expected.every(
                (f, i) => headerFields[i].toLowerCase().trim() === f,
              );

            if (!headerValid) {
              const expectedHeaderString = expected.join(", ");
              addError(
                i18n.t("settings.csv.Invalid CSV headers", {
                  headers: expectedHeaderString,
                }),
                `Expected: ${expectedHeaderString}; Found: ${headerFields.join(
                  ", ",
                )}`,
              );
            } else {
              const data: ParsedStudent[] = [];

              lines.slice(1).forEach((line, idx) => {
                const rowNum = idx + 2; // +2 (1-based + header row)
                const fields = splitSemicolons(line).map((v) => v.trim());

                if (fields.length < expected.length) {
                  addError(
                    i18n.t("settings.csv.Invalid row format", { row: rowNum }),
                    `Row ${rowNum} is malformed: ${line}`,
                  );
                  return;
                }

                const firstName =
                  fields[0]?.replace(/(^"|"$)/g, "").trim() || "";
                const lastName =
                  fields[1]?.replace(/(^"|"$)/g, "").trim() || "";
                const dateOfBirth =
                  fields[2]?.replace(/(^"|"$)/g, "").trim() || "";

                data.push({ firstName, lastName, dateOfBirth });
              });

              if (data.length === 0) {
                addError(
                  i18n.t("settings.csv.CSV file has no valid data"),
                  "No valid data rows after filtering",
                );
              } else {
                try {
                  if (setData) setData(data);
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
    student.dateOfBirth || "",
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
    student.trainingStartDate || "",
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
