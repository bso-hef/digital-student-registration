import { Student as FullStudent } from "@/types/db";
import { WlanSettings } from "@/types/settings";
import i18next from "i18next";
import { jsPDF } from "jspdf";

import {
  makeQrDataUrl,
  makeStudentQrDataUrl,
  makeWlanQrDataUrl,
} from "./qr.utils";

export type Student = {
  _id: string;
  firstName: string;
  lastName: string;
  className?: string;
  currentClassName?: string;
  currentClass?: { name?: string } | string | null;
  verificationCode?: string;
};

export type PdfSettings = {
  pageSize: "A4" | "A5";
  orientation: "portrait" | "landscape";
  includeClass: boolean;
  shortenId: boolean;
  wizardUrlTemplate: string; // z.B. WIZZARD_URL mit {short-id}
  locale?: string;
  hidePageLabel?: boolean; // Hide the page size label in actual PDF exports (keep in preview)
  includeWlan?: boolean; // Include WLAN QR code on PDF
  wlanSettings?: WlanSettings; // WLAN configuration
};

/**
 * Extracts the base URL from a wizard URL template.
 * E.g., "https://school.example.com/student/{short-id}" -> "https://school.example.com"
 */
function extractBaseUrl(wizardUrlTemplate: string): string {
  try {
    const url = new URL(wizardUrlTemplate.replace("{short-id}", "temp"));
    return `${url.protocol}//${url.host}`;
  } catch {
    // Fallback: just return the template without the path
    return wizardUrlTemplate.split("/student")[0] || wizardUrlTemplate;
  }
}

/**
 * Renders an instruction box on the PDF explaining how students can complete their registration.
 * Optionally includes a WLAN QR code inside the instruction box on the left side.
 */
function renderInstructionBox(
  doc: jsPDF,
  startY: number,
  pageW: number,
  pageH: number,
  pad: number,
  verificationCode: string,
  baseUrl: string,
  t: (key: string) => string,
  wlanQrDataUrl?: string,
): void {
  const boxPad = 4;
  const lineHeight = 5;

  // WLAN QR code dimensions (inside the box)
  const wlanQrSize = wlanQrDataUrl ? 26 : 0;
  const wlanInternalPad = wlanQrDataUrl ? wlanQrSize + 6 : 0;

  // Calculate positions - box spans full width
  const boxX = pad;
  const boxY = startY + 4;
  const boxW = pageW - pad * 2;

  // Calculate box height based on content
  const boxH = lineHeight * 8 + boxPad * 2;

  // Don't render if it would go past the page
  if (boxY + boxH > pageH - pad - 10) {
    return;
  }

  // Draw light gray background box for instructions
  doc.setFillColor(245, 245, 245);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, "FD");

  // Render WLAN QR code inside the box on the left
  if (wlanQrDataUrl) {
    const wlanQrX = boxX + boxPad;
    const wlanQrY = boxY + (boxH - wlanQrSize) / 2; // Center vertically

    doc.addImage(
      wlanQrDataUrl,
      "PNG",
      wlanQrX,
      wlanQrY,
      wlanQrSize,
      wlanQrSize,
    );
  }

  // Text content starts after WLAN QR (if present)
  const textStartX = boxX + boxPad + wlanInternalPad;
  const textMaxW = boxW - boxPad * 2 - wlanInternalPad - 4;

  let y = boxY + boxPad + 4;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text(t("modals.generateQrModal.pdfInstructions.title"), textStartX, y);
  y += lineHeight + 1;

  // Option 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(
    t("modals.generateQrModal.pdfInstructions.option1Title"),
    textStartX,
    y,
  );
  y += lineHeight;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const option1Lines = doc.splitTextToSize(
    t("modals.generateQrModal.pdfInstructions.option1Text"),
    textMaxW,
  );
  doc.text(option1Lines, textStartX + 4, y);
  y += lineHeight * Math.max(option1Lines.length, 1) + 1;

  // Option 2
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(
    t("modals.generateQrModal.pdfInstructions.option2Title"),
    textStartX,
    y,
  );
  y += lineHeight;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  // Step 1: Visit URL
  doc.text(
    `1. ${t("modals.generateQrModal.pdfInstructions.option2Step1")} ${baseUrl}/student`,
    textStartX + 4,
    y,
  );
  y += lineHeight;

  // Step 2: Enter name
  doc.text(
    `2. ${t("modals.generateQrModal.pdfInstructions.option2Step2")}`,
    textStartX + 4,
    y,
  );
  y += lineHeight;

  // Step 3: Enter verification code
  doc.setFont("helvetica", "normal");
  doc.text(
    `3. ${t("modals.generateQrModal.pdfInstructions.option2Step3")} `,
    textStartX + 4,
    y,
  );
  // Add the code in bold
  const step3Text = `3. ${t("modals.generateQrModal.pdfInstructions.option2Step3")} `;
  const step3Width = doc.getTextWidth(step3Text);
  doc.setFont("helvetica", "bold");
  doc.text(verificationCode, textStartX + 4 + step3Width, y);
}

export async function buildPdfForStudent(
  s: Student,
  settings: PdfSettings,
): Promise<Blob> {
  const { locale = "en" } = settings;
  const t = (key: string) => i18next.t(key, { lng: locale });

  const isPortrait = settings.orientation === "portrait";
  const doc = new jsPDF({
    orientation: isPortrait ? "portrait" : "landscape",
    unit: "mm",
    format: settings.pageSize.toLowerCase(),
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const pad = 12;
  const innerH = pageH - pad * 2;
  const headerH = 10;
  const footerH = 8;
  const contentY = pad + headerH + 4;
  const contentH = innerH - headerH - footerH - 6;

  doc.setFontSize(11);
  doc.setFont("helvetica");
  doc.text(t("modals.generateQrModal.onboardingWizard"), pad, pad + 7);

  const sid = s._id || "";
  const wizUrl = settings.wizardUrlTemplate.replace(
    "{short-id}",
    settings.shortenId ? sid.slice(0, 8) : sid,
  );
  const qrSize = Math.min(isPortrait ? 45 : 35, contentH);
  const qrX = pad;
  const qrY = contentY;

  // Check if WLAN is enabled
  const hasWlan =
    settings.includeWlan &&
    settings.wlanSettings?.enabled &&
    settings.wlanSettings?.ssid;

  // Use student icon QR when WLAN is present to differentiate
  const qrData = hasWlan
    ? await makeStudentQrDataUrl(wizUrl)
    : await makeQrDataUrl(wizUrl);
  doc.addImage(qrData, "PNG", qrX, qrY, qrSize, qrSize);

  const textX = qrX + qrSize + 8;
  const textMaxW = pageW - pad - textX;

  doc.setFont("helvetica");
  doc.setFontSize(18);
  doc.text(`${s.firstName} ${s.lastName}`, textX, qrY + 6, {
    maxWidth: textMaxW,
  });

  doc.setFont("helvetica");
  doc.setFontSize(12);
  let ty = qrY + 14;

  const classNameToDisplay =
    s.currentClassName ||
    (s.currentClass && typeof s.currentClass === "object"
      ? s.currentClass.name
      : s.currentClass) ||
    s.className;
  if (
    settings.includeClass &&
    classNameToDisplay &&
    classNameToDisplay.trim()
  ) {
    doc.text(
      `${t("modals.generateQrModal.class")} ${classNameToDisplay}`,
      textX,
      ty,
      {
        maxWidth: textMaxW,
      },
    );
    ty += 7;
  }

  if (s.verificationCode) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text(
      `${t("modals.generateQrModal.verificationCode")} ${s.verificationCode}`,
      textX,
      ty,
    );
    ty += 8;
  }

  const shownId = settings.shortenId ? sid.slice(0, 8) : sid;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.setFontSize(8);
  doc.text(`${t("modals.generateQrModal.id")} ${shownId}`, textX, ty);
  ty += 6;

  doc.setTextColor(0);
  doc.setFontSize(9);
  const urlLines = doc.splitTextToSize(wizUrl, textMaxW);
  doc.text(urlLines, textX, ty);

  // Generate WLAN QR code if settings are provided
  let wlanQrDataUrl: string | undefined;
  if (hasWlan) {
    wlanQrDataUrl = await makeWlanQrDataUrl(
      settings.wlanSettings!.ssid,
      settings.wlanSettings!.password,
      settings.wlanSettings!.securityType,
      settings.wlanSettings!.hidden,
    );
  }

  // Render instruction box below the QR code section
  const instructionStartY = qrY + qrSize + 2;
  const baseUrl = extractBaseUrl(settings.wizardUrlTemplate);
  renderInstructionBox(
    doc,
    instructionStartY,
    pageW,
    pageH,
    pad,
    s.verificationCode || "",
    baseUrl,
    t,
    wlanQrDataUrl,
  );

  // Only show page label if not hidden (for preview purposes)
  if (!settings.hidePageLabel) {
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(
      `${settings.pageSize} • ${isPortrait ? t("modals.generateQrModal.portrait") : t("modals.generateQrModal.landscape")}`,
      pad,
      pageH - pad,
    );
  }
  const classNameForFilename =
    s.currentClassName ||
    (s.currentClass && typeof s.currentClass === "object"
      ? s.currentClass.name
      : s.currentClass) ||
    s.className;
  const filenameClass =
    settings.includeClass && classNameForFilename && classNameForFilename.trim()
      ? `_${classNameForFilename}`
      : "";
  doc.text(
    `${s.lastName}_${s.firstName}${filenameClass}.pdf`,
    pageW - pad,
    pageH - pad,
    { align: "right" },
  );

  return doc.output("blob");
}

/**
 * Renders a single student's QR content onto the current page of a jsPDF document.
 * This is an internal helper used by buildCombinedQrPdf to avoid code duplication.
 */
async function renderStudentQrContent(
  doc: jsPDF,
  s: Student,
  settings: PdfSettings,
): Promise<void> {
  const { locale = "en" } = settings;
  const t = (key: string) => i18next.t(key, { lng: locale });

  const isPortrait = settings.orientation === "portrait";
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const pad = 12;
  const innerH = pageH - pad * 2;
  const headerH = 10;
  const footerH = 8;
  const contentY = pad + headerH + 4;
  const contentH = innerH - headerH - footerH - 6;

  doc.setFontSize(11);
  doc.setFont("helvetica");
  doc.text(t("modals.generateQrModal.onboardingWizard"), pad, pad + 7);

  const sid = s._id || "";
  const wizUrl = settings.wizardUrlTemplate.replace(
    "{short-id}",
    settings.shortenId ? sid.slice(0, 8) : sid,
  );
  const qrSize = Math.min(isPortrait ? 45 : 35, contentH);
  const qrX = pad;
  const qrY = contentY;

  // Check if WLAN is enabled
  const hasWlan =
    settings.includeWlan &&
    settings.wlanSettings?.enabled &&
    settings.wlanSettings?.ssid;

  // Use student icon QR when WLAN is present to differentiate
  const qrData = hasWlan
    ? await makeStudentQrDataUrl(wizUrl)
    : await makeQrDataUrl(wizUrl);
  doc.addImage(qrData, "PNG", qrX, qrY, qrSize, qrSize);

  const textX = qrX + qrSize + 8;
  const textMaxW = pageW - pad - textX;

  doc.setFont("helvetica");
  doc.setFontSize(18);
  doc.text(`${s.firstName} ${s.lastName}`, textX, qrY + 6, {
    maxWidth: textMaxW,
  });

  doc.setFont("helvetica");
  doc.setFontSize(12);
  let ty = qrY + 14;

  const classNameToDisplay =
    s.currentClassName ||
    (s.currentClass && typeof s.currentClass === "object"
      ? s.currentClass.name
      : s.currentClass) ||
    s.className;
  if (
    settings.includeClass &&
    classNameToDisplay &&
    classNameToDisplay.trim()
  ) {
    doc.text(
      `${t("modals.generateQrModal.class")} ${classNameToDisplay}`,
      textX,
      ty,
      {
        maxWidth: textMaxW,
      },
    );
    ty += 7;
  }

  if (s.verificationCode) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text(
      `${t("modals.generateQrModal.verificationCode")} ${s.verificationCode}`,
      textX,
      ty,
    );
    ty += 8;
  }

  const shownId = settings.shortenId ? sid.slice(0, 8) : sid;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.setFontSize(8);
  doc.text(`${t("modals.generateQrModal.id")} ${shownId}`, textX, ty);
  ty += 6;

  doc.setTextColor(0);
  doc.setFontSize(9);
  const urlLines = doc.splitTextToSize(wizUrl, textMaxW);
  doc.text(urlLines, textX, ty);

  // Generate WLAN QR code if settings are provided
  let wlanQrDataUrl: string | undefined;
  if (hasWlan) {
    wlanQrDataUrl = await makeWlanQrDataUrl(
      settings.wlanSettings!.ssid,
      settings.wlanSettings!.password,
      settings.wlanSettings!.securityType,
      settings.wlanSettings!.hidden,
    );
  }

  // Render instruction box below the QR code section
  const instructionStartY = qrY + qrSize + 2;
  const baseUrl = extractBaseUrl(settings.wizardUrlTemplate);
  renderInstructionBox(
    doc,
    instructionStartY,
    pageW,
    pageH,
    pad,
    s.verificationCode || "",
    baseUrl,
    t,
    wlanQrDataUrl,
  );

  // Filename in bottom right
  const classNameForFilename =
    s.currentClassName ||
    (s.currentClass && typeof s.currentClass === "object"
      ? s.currentClass.name
      : s.currentClass) ||
    s.className;
  const filenameClass =
    settings.includeClass && classNameForFilename && classNameForFilename.trim()
      ? `_${classNameForFilename}`
      : "";
  doc.text(
    `${s.lastName}_${s.firstName}${filenameClass}.pdf`,
    pageW - pad,
    pageH - pad,
    { align: "right" },
  );
}

/**
 * Builds a single combined PDF with multiple students, one per page.
 * Used when exporting multiple students as a single printable document.
 */
export async function buildCombinedQrPdf(
  students: Student[],
  settings: PdfSettings,
  onProgress?: (percent: number) => void,
): Promise<Blob> {
  const isPortrait = settings.orientation === "portrait";
  const doc = new jsPDF({
    orientation: isPortrait ? "portrait" : "landscape",
    unit: "mm",
    format: settings.pageSize.toLowerCase(),
  });

  for (let i = 0; i < students.length; i++) {
    if (i > 0) {
      doc.addPage();
    }

    await renderStudentQrContent(doc, students[i], settings);

    if (onProgress) {
      onProgress(Math.round(((i + 1) / students.length) * 100));
    }
  }

  return doc.output("blob");
}

export type NewRegistrationPdfSettings = {
  pageSize: "A4" | "A5";
  orientation: "portrait" | "landscape";
  wizardUrlTemplate: string;
  locale?: string;
  includeWlan?: boolean;
  wlanSettings?: WlanSettings;
};

/**
 * Renders an instruction box for new student registration PDF.
 * Similar to renderInstructionBox but without verification code steps.
 * Optionally includes a WLAN QR code inside the instruction box on the left side.
 */
function renderNewRegistrationInstructionBox(
  doc: jsPDF,
  startY: number,
  pageW: number,
  pageH: number,
  pad: number,
  baseUrl: string,
  t: (key: string) => string,
  wlanQrDataUrl?: string,
): void {
  const boxPad = 4;
  const lineHeight = 5;

  // WLAN QR code dimensions (inside the box)
  const wlanQrSize = wlanQrDataUrl ? 26 : 0;
  const wlanInternalPad = wlanQrDataUrl ? wlanQrSize + 6 : 0;

  // Calculate positions - box spans full width
  const boxX = pad;
  const boxY = startY + 4;
  const boxW = pageW - pad * 2;

  // Calculate box height based on content (fewer lines than student version)
  const boxH = lineHeight * 6 + boxPad * 2;

  // Don't render if it would go past the page
  if (boxY + boxH > pageH - pad - 10) {
    return;
  }

  // Draw light gray background box
  doc.setFillColor(245, 245, 245);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, "FD");

  // Render WLAN QR code inside the box on the left
  if (wlanQrDataUrl) {
    const wlanQrX = boxX + boxPad;
    const wlanQrY = boxY + (boxH - wlanQrSize) / 2; // Center vertically

    doc.addImage(
      wlanQrDataUrl,
      "PNG",
      wlanQrX,
      wlanQrY,
      wlanQrSize,
      wlanQrSize,
    );
  }

  // Text content starts after WLAN QR (if present)
  const textStartX = boxX + boxPad + wlanInternalPad;
  const textMaxW = boxW - boxPad * 2 - wlanInternalPad - 4;

  let y = boxY + boxPad + 4;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text(
    t("modals.generateQrModal.newRegistration.pdfInstructions.title"),
    textStartX,
    y,
  );
  y += lineHeight + 1;

  // Option 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(
    t("modals.generateQrModal.newRegistration.pdfInstructions.option1Title"),
    textStartX,
    y,
  );
  y += lineHeight;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const option1Lines = doc.splitTextToSize(
    t("modals.generateQrModal.newRegistration.pdfInstructions.option1Text"),
    textMaxW,
  );
  doc.text(option1Lines, textStartX + 4, y);
  y += lineHeight * Math.max(option1Lines.length, 1) + 1;

  // Option 2
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(
    t("modals.generateQrModal.newRegistration.pdfInstructions.option2Title"),
    textStartX,
    y,
  );
  y += lineHeight;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  // Step 1: Visit URL
  doc.text(
    `1. ${t("modals.generateQrModal.newRegistration.pdfInstructions.option2Step1")} ${baseUrl}/student/new`,
    textStartX + 4,
    y,
  );
  y += lineHeight;

  // Step 2: Click to create
  doc.text(
    `2. ${t("modals.generateQrModal.newRegistration.pdfInstructions.option2Step2")}`,
    textStartX + 4,
    y,
  );
}

/**
 * Builds a PDF with a QR code for new student registration.
 * This PDF links directly to the new student creation flow.
 */
export async function buildNewRegistrationPdf(
  settings: NewRegistrationPdfSettings,
): Promise<Blob> {
  const { locale = "en" } = settings;
  const t = (key: string) => i18next.t(key, { lng: locale });

  const isPortrait = settings.orientation === "portrait";
  const doc = new jsPDF({
    orientation: isPortrait ? "portrait" : "landscape",
    unit: "mm",
    format: settings.pageSize.toLowerCase(),
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const pad = 12;
  const innerH = pageH - pad * 2;
  const headerH = 10;
  const footerH = 8;
  const contentY = pad + headerH + 4;
  const contentH = innerH - headerH - footerH - 6;

  // Header
  doc.setFontSize(11);
  doc.setFont("helvetica");
  doc.text(t("modals.generateQrModal.newRegistration.pdfTitle"), pad, pad + 7);

  // QR code URL opens the new student modal directly. The base /student page
  // remains the entry point for profiles that have already been created.
  const baseUrl = extractBaseUrl(settings.wizardUrlTemplate);
  const wizUrl = `${baseUrl}/student/new`;

  const qrSize = Math.min(isPortrait ? 45 : 35, contentH);
  const qrX = pad;
  const qrY = contentY;
  const qrData = await makeQrDataUrl(wizUrl);
  doc.addImage(qrData, "PNG", qrX, qrY, qrSize, qrSize);

  const textX = qrX + qrSize + 8;
  const textMaxW = pageW - pad - textX;

  // Title text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(
    t("modals.generateQrModal.newRegistration.pdfTitle"),
    textX,
    qrY + 6,
    {
      maxWidth: textMaxW,
    },
  );

  // Description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  let ty = qrY + 16;
  const descLines = doc.splitTextToSize(
    t("modals.generateQrModal.newRegistration.description"),
    textMaxW,
  );
  doc.text(descLines, textX, ty);
  ty += 6 * descLines.length + 4;

  // URL
  doc.setTextColor(0);
  doc.setFontSize(9);
  const urlLines = doc.splitTextToSize(wizUrl, textMaxW);
  doc.text(urlLines, textX, ty);

  // Generate WLAN QR code if settings are provided
  let wlanQrDataUrl: string | undefined;
  if (
    settings.includeWlan &&
    settings.wlanSettings?.enabled &&
    settings.wlanSettings?.ssid
  ) {
    wlanQrDataUrl = await makeWlanQrDataUrl(
      settings.wlanSettings.ssid,
      settings.wlanSettings.password,
      settings.wlanSettings.securityType,
      settings.wlanSettings.hidden,
    );
  }

  // Render instruction box below the QR code section
  const instructionStartY = qrY + qrSize + 2;
  renderNewRegistrationInstructionBox(
    doc,
    instructionStartY,
    pageW,
    pageH,
    pad,
    baseUrl,
    t,
    wlanQrDataUrl,
  );

  // Filename in bottom right
  const filename = t("modals.generateQrModal.newRegistration.filename");
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`${filename}.pdf`, pageW - pad, pageH - pad, { align: "right" });

  return doc.output("blob");
}

export type StudentDataPdfSettings = {
  pageSize: "A4" | "A5";
  orientation: "portrait" | "landscape";
  locale?: string;
  includeEmptyFields?: boolean;
  translations?: {
    title: string;
    generatedOn: string;
    pageOf: string;
  };
};

type LayoutConfig = {
  pageWidth: number;
  pageHeight: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  footerHeight: number;
  contentStart: number;
  sectionGap: number;
  fieldRowHeight: number;
};

type TranslateFunc = (key: string) => string;

function formatDate(
  date: Date | string | null | undefined,
  locale: string,
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Converts a string to Title Case (each word capitalized).
 * Excludes email addresses, phone numbers, and other non-name values.
 */
function toTitleCase(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  // Don't capitalize if it looks like an email, phone, or URL
  if (
    value.includes("@") ||
    value.includes("://") ||
    /^\+?\d[\d\s\-()]+$/.test(value)
  ) {
    return value;
  }
  return value
    .split(" ")
    .map((word) => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function renderField(
  doc: jsPDF,
  label: string,
  value: string | undefined | null,
  y: number,
  layout: LayoutConfig,
  includeEmptyFields: boolean = false,
): number {
  if (!includeEmptyFields && (!value || value.toString().trim() === "")) {
    return y;
  }

  // Apply Title Case to the value for proper capitalization
  const capitalizedValue = toTitleCase(value?.toString());
  const displayValue =
    capitalizedValue && capitalizedValue.trim() !== "" ? capitalizedValue : "—";

  // Calculate 50/50 split
  const availableWidth =
    layout.pageWidth - layout.leftMargin - layout.rightMargin;
  const splitPoint = layout.leftMargin + availableWidth / 2;
  const labelMaxWidth = availableWidth / 2 - 5; // 5mm padding
  const valueMaxWidth = availableWidth / 2 - 5; // 5mm padding

  const labelLines = doc.splitTextToSize(`${label}:`, labelMaxWidth);
  const valueLines = doc.splitTextToSize(displayValue, valueMaxWidth);
  const maxLines = Math.max(labelLines.length, valueLines.length);
  const requiredHeight = layout.fieldRowHeight * maxLines;
  const fieldY = checkPageBreak(doc, y, layout, requiredHeight);

  // Render label (left 50%)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(labelLines, layout.leftMargin, fieldY);

  // Render value (right 50%)
  doc.setFont("helvetica", "normal");
  doc.text(valueLines, splitPoint, fieldY);

  return fieldY + requiredHeight;
}

function checkPageBreak(
  doc: jsPDF,
  currentY: number,
  layout: LayoutConfig,
  requiredSpace: number = 20,
): number {
  const contentBottom =
    layout.pageHeight - layout.bottomMargin - layout.footerHeight;

  if (currentY + requiredSpace > contentBottom) {
    doc.addPage();
    // Use topMargin for subsequent pages (no header needed)
    return layout.topMargin + 5;
  }
  return currentY;
}

function renderGeneralSection(
  doc: jsPDF,
  student: FullStudent,
  t: TranslateFunc,
  startY: number,
  layout: LayoutConfig,
  includeEmptyFields: boolean,
): number {
  let y = checkPageBreak(doc, startY, layout);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(t("onboarding.summary.generalInfo"), layout.leftMargin, y);
  y += 8;

  y = renderField(
    doc,
    t("onboarding.general.firstName"),
    student.firstName,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.general.lastName"),
    student.lastName,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.general.birthName"),
    student.birthName,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.general.gender"),
    student.gender ? t(`gender.${student.gender}`) : undefined,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.general.birthDate"),
    formatDate(
      student.dateOfBirth,
      t("general.Language") === "English" ? "en" : "de",
    ),
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.general.birthPlace"),
    student.birthplace,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.general.birthCountry"),
    student.birthCountry,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.general.religion"),
    student.religion,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.general.nationality1"),
    student.nationality,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.general.nationality2"),
    student.secondNationality,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.general.schoolEntryDate"),
    formatDate(
      student.schoolEntryDate,
      t("general.Language") === "English" ? "en" : "de",
    ),
    y,
    layout,
    includeEmptyFields,
  );

  return y + layout.sectionGap;
}

function renderOriginSection(
  doc: jsPDF,
  student: FullStudent,
  t: TranslateFunc,
  startY: number,
  layout: LayoutConfig,
  includeEmptyFields: boolean,
): number {
  if (
    !includeEmptyFields &&
    !student.originCountry &&
    !student.birthCountry &&
    !student.familyLanguage &&
    !student.immigrationYear
  ) {
    return startY;
  }

  let y = checkPageBreak(doc, startY, layout);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(t("onboarding.summary.origin"), layout.leftMargin, y);
  y += 8;

  y = renderField(
    doc,
    t("onboarding.origin.countryOfOrigin"),
    student.originCountry || student.birthCountry,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.origin.familyLanguage"),
    student.familyLanguage,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.origin.yearOfImmigration"),
    student.immigrationYear?.toString(),
    y,
    layout,
    includeEmptyFields,
  );

  return y + layout.sectionGap;
}

function renderAddressSection(
  doc: jsPDF,
  student: FullStudent,
  t: TranslateFunc,
  startY: number,
  layout: LayoutConfig,
  includeEmptyFields: boolean,
): number {
  let y = checkPageBreak(doc, startY, layout);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(t("onboarding.summary.address"), layout.leftMargin, y);
  y += 8;

  const streetValue = student.address?.street;
  const cityValue =
    student.address?.zip && student.address?.city
      ? `${student.address.zip} ${student.address.city}`
      : student.address?.city;

  y = renderField(
    doc,
    t("onboarding.address.street"),
    streetValue,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.address.city"),
    cityValue,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.address.mobile"),
    student.mobile,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.address.phone"),
    student.phone,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.address.email"),
    student.email,
    y,
    layout,
    includeEmptyFields,
  );

  return y + layout.sectionGap;
}

function renderContactPersonsSection(
  doc: jsPDF,
  student: FullStudent,
  t: TranslateFunc,
  startY: number,
  layout: LayoutConfig,
  includeEmptyFields: boolean,
): number {
  if (!student.contactPersons || student.contactPersons.length === 0) {
    return startY;
  }

  let y = checkPageBreak(doc, startY, layout);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(t("onboarding.summary.contactPerson"), layout.leftMargin, y);
  y += 8;

  student.contactPersons.forEach((person, index) => {
    y = checkPageBreak(doc, y, layout);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(
      t(`onboarding.legalGuardian.contactPerson${index + 1}`),
      layout.leftMargin + 2,
      y,
    );
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    y = renderField(
      doc,
      t("onboarding.legalGuardian.type"),
      person.type,
      y,
      layout,
      includeEmptyFields,
    );
    const fullName = `${person.firstName} ${person.lastName}`;
    y = renderField(
      doc,
      t("onboarding.legalGuardian.name"),
      fullName,
      y,
      layout,
      includeEmptyFields,
    );
    y = renderField(
      doc,
      t("onboarding.legalGuardian.mobile"),
      person.mobile,
      y,
      layout,
      includeEmptyFields,
    );
    const landline =
      person.phone && person.phone !== person.mobile ? person.phone : undefined;
    y = renderField(
      doc,
      t("onboarding.legalGuardian.phone"),
      landline,
      y,
      layout,
      includeEmptyFields,
    );
    y = renderField(
      doc,
      t("onboarding.legalGuardian.email"),
      person.email,
      y,
      layout,
      includeEmptyFields,
    );

    if (person.address) {
      const fullAddress = [
        person.address.street,
        person.address.zip && person.address.city
          ? `${person.address.zip} ${person.address.city}`
          : person.address.city,
      ]
        .filter(Boolean)
        .join(", ");
      y = renderField(
        doc,
        t("onboarding.legalGuardian.address"),
        fullAddress,
        y,
        layout,
        includeEmptyFields,
      );
    }

    y += 3;
  });

  return y + layout.sectionGap;
}

function renderEducationSection(
  doc: jsPDF,
  student: FullStudent,
  t: TranslateFunc,
  startY: number,
  layout: LayoutConfig,
  includeEmptyFields: boolean,
): number {
  if (!includeEmptyFields && !student.previousSchool) {
    return startY;
  }

  let y = checkPageBreak(doc, startY, layout);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(t("onboarding.summary.education"), layout.leftMargin, y);
  y += 8;

  y = renderField(
    doc,
    t("onboarding.preEducation.previousSchool"),
    student.previousSchool,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.preEducation.schoolType"),
    student.previousSchoolType,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.preEducation.level"),
    student.previousSchoolLevel,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.preEducation.degrees"),
    student.degrees,
    y,
    layout,
    includeEmptyFields,
  );

  return y + layout.sectionGap;
}

function renderVocationalSection(
  doc: jsPDF,
  student: FullStudent,
  t: TranslateFunc,
  startY: number,
  layout: LayoutConfig,
  includeEmptyFields: boolean,
): number {
  if (!includeEmptyFields && !student.profession && !student.employer) {
    return startY;
  }

  let y = checkPageBreak(doc, startY, layout);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(t("onboarding.summary.training"), layout.leftMargin, y);
  y += 8;

  y = renderField(
    doc,
    t("onboarding.training.profession"),
    student.profession,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.training.startDate"),
    formatDate(
      student.trainingStartDate,
      t("general.Language") === "English" ? "en" : "de",
    ),
    y,
    layout,
    includeEmptyFields,
  );

  if (student.employer) {
    y += layout.sectionGap;
    y = checkPageBreak(doc, y, layout);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(t("onboarding.training.company"), layout.leftMargin, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    y = renderField(
      doc,
      t("onboarding.training.companyName"),
      student.employer.companyName,
      y,
      layout,
      includeEmptyFields,
    );
    y = renderField(
      doc,
      t("onboarding.address.street"),
      student.employer.address,
      y,
      layout,
      includeEmptyFields,
    );
    y = renderField(
      doc,
      t("onboarding.training.phone"),
      student.employer.contactPhone,
      y,
      layout,
      includeEmptyFields,
    );
    y = renderField(
      doc,
      t("onboarding.training.email"),
      student.employer.contactEmail,
      y,
      layout,
      includeEmptyFields,
    );

    const hasFirstCompanyContact = Boolean(
      student.employer.contactName ||
      student.employer.contactSalutation ||
      student.employer.contactPhone ||
      student.employer.contactEmail,
    );
    const hasSecondCompanyContact = Boolean(
      student.employer.contact2Name ||
      student.employer.contact2Salutation ||
      student.employer.contact2Phone ||
      student.employer.contact2Email,
    );

    if (hasFirstCompanyContact || hasSecondCompanyContact) {
      y += layout.sectionGap;
      y = checkPageBreak(doc, y, layout);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(t("onboarding.summary.companyContact"), layout.leftMargin, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const renderCompanyContact = (
        titleKey: string,
        salutation?: string,
        name?: string,
        phone?: string,
        email?: string,
      ) => {
        y = checkPageBreak(doc, y, layout);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(t(titleKey), layout.leftMargin + 2, y);
        y += 6;

        y = renderField(
          doc,
          t("onboarding.companyContact.salutation"),
          salutation,
          y,
          layout,
          includeEmptyFields,
        );
        y = renderField(
          doc,
          t("onboarding.general.name"),
          name,
          y,
          layout,
          includeEmptyFields,
        );
        y = renderField(
          doc,
          t("onboarding.companyContact.phone"),
          phone,
          y,
          layout,
          includeEmptyFields,
        );
        y = renderField(
          doc,
          t("onboarding.companyContact.email"),
          email,
          y,
          layout,
          includeEmptyFields,
        );
        y += 3;
      };

      if (hasFirstCompanyContact) {
        renderCompanyContact(
          "onboarding.companyContact.contact1Title",
          student.employer.contactSalutation,
          student.employer.contactName,
          student.employer.contactPhone,
          student.employer.contactEmail,
        );
      }

      if (hasSecondCompanyContact) {
        renderCompanyContact(
          "onboarding.companyContact.contact2Title",
          student.employer.contact2Salutation,
          student.employer.contact2Name,
          student.employer.contact2Phone,
          student.employer.contact2Email,
        );
      }
    }
  }

  return y + layout.sectionGap;
}

function renderAgreementsSection(
  doc: jsPDF,
  student: FullStudent,
  t: TranslateFunc,
  startY: number,
  layout: LayoutConfig,
): number {
  if (!student.agreements) {
    return startY;
  }

  let y = checkPageBreak(doc, startY, layout);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(t("onboarding.summary.agreements"), layout.leftMargin, y);
  y += 8;

  // Map database keys to translation keys
  const agreementKeyMap: Record<string, string> = {
    dataProtection: "datenschutz",
    classParticipation: "teilnahmeunterricht",
    schoolRules: "schulordnung",
    imageRights: "personenabbildung",
    teamsUsage: "teamsnutzung",
  };

  const agreementsList = [
    { key: "dataProtection", value: student.agreements.dataProtection },
    { key: "classParticipation", value: student.agreements.classParticipation },
    { key: "schoolRules", value: student.agreements.schoolRules },
    { key: "imageRights", value: student.agreements.imageRights },
    { key: "teamsUsage", value: student.agreements.teamsUsage },
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  // Calculate 50/50 split for consistent layout
  const availableWidth =
    layout.pageWidth - layout.leftMargin - layout.rightMargin;
  const splitPoint = layout.leftMargin + availableWidth / 2;

  agreementsList.forEach(({ key, value }) => {
    y = checkPageBreak(doc, y, layout);

    const translationKey = agreementKeyMap[key] || key;
    const label = t(`onboarding.agreements.${translationKey}`);

    // Explicit boolean check to ensure correct status
    const isAccepted = value === true;
    const statusText = isAccepted
      ? t("general.Accepted")
      : t("general.NotAccepted");

    // Render label (left 50%) without Unicode character
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, layout.leftMargin, y);

    // Render status (right 50%) with visual distinction
    doc.setFont("helvetica", isAccepted ? "bold" : "normal");
    doc.text(statusText, splitPoint, y);

    doc.setFont("helvetica", "normal");
    y += layout.fieldRowHeight;
  });

  return y + layout.sectionGap;
}

export async function buildStudentDataPdf(
  student: FullStudent,
  settings: StudentDataPdfSettings,
): Promise<Blob> {
  const { locale = "en", translations } = settings;
  const t = (key: string) => i18next.t(key, { lng: locale });

  const pdfTitle =
    translations?.title && !translations.title.includes("pdf.")
      ? translations.title
      : locale === "de"
        ? "Schüler-Anmeldedokument"
        : "Student Onboarding Document";

  const generatedOnLabel =
    translations?.generatedOn && !translations.generatedOn.includes("pdf.")
      ? translations.generatedOn
      : locale === "de"
        ? "Erstellt am"
        : "Generated on";

  const isPortrait = settings.orientation === "portrait";
  const doc = new jsPDF({
    orientation: isPortrait ? "portrait" : "landscape",
    unit: "mm",
    format: settings.pageSize.toLowerCase(),
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const layout: LayoutConfig = {
    pageWidth: pageW,
    pageHeight: pageH,
    leftMargin: 15,
    rightMargin: 15,
    topMargin: 15,
    bottomMargin: 10,
    footerHeight: 10,
    contentStart: 38,
    sectionGap: 8,
    fieldRowHeight: 7,
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(pdfTitle, layout.leftMargin, layout.topMargin + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    `${student.firstName} ${student.lastName} (${student.currentClassName})`,
    layout.leftMargin,
    layout.topMargin + 12,
  );

  const includeEmpty = settings.includeEmptyFields ?? false;

  let currentY = layout.contentStart;

  currentY = renderGeneralSection(
    doc,
    student,
    t,
    currentY,
    layout,
    includeEmpty,
  );
  currentY = renderOriginSection(
    doc,
    student,
    t,
    currentY,
    layout,
    includeEmpty,
  );
  currentY = renderAddressSection(
    doc,
    student,
    t,
    currentY,
    layout,
    includeEmpty,
  );
  currentY = renderContactPersonsSection(
    doc,
    student,
    t,
    currentY,
    layout,
    includeEmpty,
  );
  currentY = renderEducationSection(
    doc,
    student,
    t,
    currentY,
    layout,
    includeEmpty,
  );
  currentY = renderVocationalSection(
    doc,
    student,
    t,
    currentY,
    layout,
    includeEmpty,
  );
  renderAgreementsSection(doc, student, t, currentY, layout);

  const totalPages = doc.internal.pages.length - 1;

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    doc.setFontSize(8);
    doc.setTextColor(120);

    const dateText = `${generatedOnLabel}: ${formatDate(new Date(), locale)}`;
    doc.text(dateText, layout.leftMargin, pageH - layout.bottomMargin, {
      align: "left",
    });

    const pageText = `${i} / ${totalPages}`;
    doc.text(
      pageText,
      pageW - layout.rightMargin,
      pageH - layout.bottomMargin,
      {
        align: "right",
      },
    );
  }

  return doc.output("blob");
}
