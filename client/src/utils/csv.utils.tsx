import ClientLogger from "@/lib/client-logger";
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
