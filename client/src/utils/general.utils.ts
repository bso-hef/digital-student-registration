import Logger from "@/lib/logger";
import { saveAs } from "file-saver";
import Cookies from "js-cookie";

export type FileResponse = {
  data: BlobPart;
  name: string;
  extension: string;
};

export interface UserDocument {
  name: string;
  extension: string;
}

const wordMimeTypes = new Set([
  "msword",
  "vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

/** Wandelt einen MIME‑Typ in eine Anzeige‑Dateiendung um */
export function getDisplayFileExtension(mimeType: string): string {
  if (mimeType === "plain") return "txt";
  if (wordMimeTypes.has(mimeType)) return "docx";
  return mimeType;
}

/** Extrahiert die Dateiendung aus einem Dateinamen */
export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return getDisplayFileExtension(parts.pop() ?? "");
}

/** Entfernt die Endung aus einem Dateinamen */
export function getFileName(fullFileName: string): string {
  return fullFileName.replace(/\.[^/.]+$/, "");
}

/** Sicheres Lowercasing */
export function toLowerCase(text?: string): string {
  return typeof text === "string" ? text.toLowerCase() : "";
}

/** Kompletter Dateiname mit kleingeschriebener Endung */
export function fullFileNameWithLowerCaseExtension(
  fullFileName: string,
): string {
  const name = getFileName(fullFileName);
  const ext = toLowerCase(getFileExtension(fullFileName));
  return `${name}.${ext}`;
}

/** Prüft, ob ein String eine valide URL ist */
export function isValidURL(url: string): boolean {
  try {
    // URL-Konstruktor wirft bei ungültigen URLs
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/** Wandelt URLs im Text in anklickbare Links um */
export function linkify(text: string): string {
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
  return text.replace(
    urlRegex,
    (url) =>
      `<a href="${url}" target="_blank" rel="noreferrer noopener">${url}</a>`,
  );
}

/** Formatiert Millisekunden in "HH:MM:SS" */
export function msToTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

/** Verzögert asynchrone Ausführung um ms Millisekunden */
export function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

/** Löst einen Download aus, indem ein Blob als Textdatei gespeichert wird */
export async function downloadFileFromText(text: string): Promise<void> {
  try {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const filename = `file_${Math.floor(Math.random() * 1_000_000)}.txt`;
    saveAs(blob, filename);
  } catch (error) {
    Logger.error("Fehler beim Herunterladen der Textdatei:", error);
  }
}

export function getCookie(name: string): string | undefined {
  return Cookies.get(name);
}

export function setCookie(name: string, value: string): void {
  Cookies.set(name, value, {
    expires: process.env.NODE_ENV === "production" ? 7 : 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function removeCookie(name: string): void {
  Cookies.remove(name, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function downloadDocument(
  response: FileResponse,
  doc: UserDocument,
): void {
  const blob = new Blob([response.data]);
  const url = URL.createObjectURL(blob);
  let fileName = doc.name;
  if (!fileName.includes(".")) {
    fileName += `.${doc.extension}`;
  }
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
