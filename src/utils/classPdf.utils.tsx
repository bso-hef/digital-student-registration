import { ClassInterface } from "@/types/class";
import i18next from "i18next";
import { jsPDF } from "jspdf";

import { PdfSettings, Student } from "./pdf.utils";
import {
  makeQrDataUrl,
  makeStudentQrDataUrl,
  makeWlanQrDataUrl,
} from "./qr.utils";
import { sanitizeFilename } from "./string.utils";
import { buildZip } from "./zip.utils";

/**
 * Represents a class with its associated students for PDF generation.
 */
export type ClassWithStudents = {
  classInfo: ClassInterface;
  students: Student[];
};

/**
 * Extended PDF settings for class-based QR code generation.
 */
export type ClassPdfSettings = PdfSettings & {
  includeCoverPages: boolean;
  includeNumbering: boolean;
  schoolLogo?: string; // Data URL of the school logo
};

/**
 * Extracts the base URL from a wizard URL template.
 */
function extractBaseUrl(wizardUrlTemplate: string): string {
  try {
    const url = new URL(wizardUrlTemplate.replace("{short-id}", "temp"));
    return `${url.protocol}//${url.host}`;
  } catch {
    return wizardUrlTemplate.split("/student")[0] || wizardUrlTemplate;
  }
}

/**
 * Formats a school year range for display on cover pages.
 * E.g., "2024/2025" from two Date objects.
 */
function formatSchoolYear(
  schoolYearFrom: Date | null,
  schoolYearTo: Date | null,
): string {
  if (!schoolYearFrom && !schoolYearTo) return "";

  const fromYear = schoolYearFrom
    ? new Date(schoolYearFrom).getFullYear()
    : null;
  const toYear = schoolYearTo ? new Date(schoolYearTo).getFullYear() : null;

  if (fromYear && toYear) {
    return `${fromYear}/${toYear}`;
  } else if (fromYear) {
    return fromYear.toString();
  } else if (toYear) {
    return toYear.toString();
  }
  return "";
}

/**
 * Renders a cover page for a class.
 * Layout:
 * - Optional school logo centered at top
 * - Class name large and centered (48pt)
 * - School year below (18pt)
 * - Student count (14pt)
 */
export async function renderClassCoverPage(
  doc: jsPDF,
  classInfo: ClassInterface,
  studentCount: number,
  settings: ClassPdfSettings,
  t: (key: string, options?: Record<string, unknown>) => string,
): Promise<void> {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const centerX = pageW / 2;

  let currentY = 40;

  // Render school logo if provided
  if (settings.schoolLogo) {
    try {
      const logoSize = 30;
      const logoX = centerX - logoSize / 2;
      doc.addImage(
        settings.schoolLogo,
        "PNG",
        logoX,
        currentY,
        logoSize,
        logoSize,
      );
      currentY += logoSize + 15;
    } catch {
      // Skip logo if it fails to load
      currentY += 10;
    }
  } else {
    currentY = pageH / 2 - 40;
  }

  // Class name - large and centered
  doc.setFont("helvetica", "bold");
  doc.setFontSize(48);
  doc.setTextColor(0);

  const classNameLines = doc.splitTextToSize(classInfo.name, pageW - 40);
  const lineHeight = 16;
  classNameLines.forEach((line: string, index: number) => {
    doc.text(line, centerX, currentY + index * lineHeight, { align: "center" });
  });
  currentY += classNameLines.length * lineHeight + 15;

  // School year
  const schoolYear = formatSchoolYear(
    classInfo.schoolYearFrom,
    classInfo.schoolYearTo,
  );
  if (schoolYear) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.setTextColor(80);
    doc.text(
      t("modals.generateClassQrModal.schoolYear", { year: schoolYear }),
      centerX,
      currentY,
      { align: "center" },
    );
    currentY += 12;
  }

  // Student count
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text(
    t("modals.generateClassQrModal.studentCount", { count: studentCount }),
    centerX,
    currentY,
    { align: "center" },
  );

  // Footer with page info
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text(
    t("modals.generateClassQrModal.coverPageLabel"),
    centerX,
    pageH - 15,
    {
      align: "center",
    },
  );
}

/**
 * Renders the instruction box for QR code pages.
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

  const wlanQrSize = wlanQrDataUrl ? 26 : 0;
  const wlanInternalPad = wlanQrDataUrl ? wlanQrSize + 6 : 0;

  const boxX = pad;
  const boxY = startY + 4;
  const boxW = pageW - pad * 2;
  const boxH = lineHeight * 8 + boxPad * 2;

  if (boxY + boxH > pageH - pad - 10) {
    return;
  }

  doc.setFillColor(245, 245, 245);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, "FD");

  if (wlanQrDataUrl) {
    const wlanQrX = boxX + boxPad;
    const wlanQrY = boxY + (boxH - wlanQrSize) / 2;
    doc.addImage(
      wlanQrDataUrl,
      "PNG",
      wlanQrX,
      wlanQrY,
      wlanQrSize,
      wlanQrSize,
    );
  }

  const textStartX = boxX + boxPad + wlanInternalPad;
  const textMaxW = boxW - boxPad * 2 - wlanInternalPad - 4;

  let y = boxY + boxPad + 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text(t("modals.generateQrModal.pdfInstructions.title"), textStartX, y);
  y += lineHeight + 1;

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
  doc.text(
    `1. ${t("modals.generateQrModal.pdfInstructions.option2Step1")} ${baseUrl}/student`,
    textStartX + 4,
    y,
  );
  y += lineHeight;

  doc.text(
    `2. ${t("modals.generateQrModal.pdfInstructions.option2Step2")}`,
    textStartX + 4,
    y,
  );
  y += lineHeight;

  doc.setFont("helvetica", "normal");
  doc.text(
    `3. ${t("modals.generateQrModal.pdfInstructions.option2Step3")} `,
    textStartX + 4,
    y,
  );
  const step3Text = `3. ${t("modals.generateQrModal.pdfInstructions.option2Step3")} `;
  const step3Width = doc.getTextWidth(step3Text);
  doc.setFont("helvetica", "bold");
  doc.text(verificationCode, textStartX + 4 + step3Width, y);
}

/**
 * Renders a single student's QR content with optional numbering in the footer.
 */
async function renderStudentQrContentWithNumbering(
  doc: jsPDF,
  s: Student,
  settings: ClassPdfSettings,
  numbering?: { current: number; total: number; className: string },
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

  const hasWlan =
    settings.includeWlan &&
    settings.wlanSettings?.enabled &&
    settings.wlanSettings?.ssid;

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

  let wlanQrDataUrl: string | undefined;
  if (hasWlan) {
    wlanQrDataUrl = await makeWlanQrDataUrl(
      settings.wlanSettings!.ssid,
      settings.wlanSettings!.password,
      settings.wlanSettings!.securityType,
      settings.wlanSettings!.hidden,
    );
  }

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

  // Footer with numbering
  doc.setFontSize(9);
  doc.setTextColor(100);

  if (settings.includeNumbering && numbering) {
    // Left side: numbering
    const numberingText = `${t("modals.generateClassQrModal.studentLabel")} ${numbering.current}/${numbering.total} - ${numbering.className}`;
    doc.text(numberingText, pad, pageH - pad);
  }

  // Right side: filename
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
 * Builds a PDF for a single class with optional cover page and student numbering.
 */
export async function buildSingleClassQrPdf(
  classData: ClassWithStudents,
  settings: ClassPdfSettings,
  onProgress?: (percent: number) => void,
): Promise<Blob> {
  const { locale = "en" } = settings;
  const t = (key: string, options?: Record<string, unknown>) =>
    i18next.t(key, { lng: locale, ...options });

  const isPortrait = settings.orientation === "portrait";
  const doc = new jsPDF({
    orientation: isPortrait ? "portrait" : "landscape",
    unit: "mm",
    format: settings.pageSize.toLowerCase(),
  });

  const students = classData.students;
  const totalStudents = students.length;
  let pageIndex = 0;

  // Render cover page if enabled
  if (settings.includeCoverPages) {
    await renderClassCoverPage(
      doc,
      classData.classInfo,
      totalStudents,
      settings,
      t,
    );
    pageIndex++;
  }

  // Render each student
  for (let i = 0; i < totalStudents; i++) {
    if (pageIndex > 0) {
      doc.addPage();
    }

    const numbering = settings.includeNumbering
      ? {
          current: i + 1,
          total: totalStudents,
          className: classData.classInfo.name,
        }
      : undefined;

    await renderStudentQrContentWithNumbering(
      doc,
      students[i],
      settings,
      numbering,
    );
    pageIndex++;

    if (onProgress) {
      const coverWeight = settings.includeCoverPages ? 1 : 0;
      const progress = Math.round(
        ((coverWeight + i + 1) / (coverWeight + totalStudents)) * 100,
      );
      onProgress(progress);
    }
  }

  return doc.output("blob");
}

/**
 * Builds a combined PDF with multiple classes.
 * Each class starts with a cover page (if enabled) followed by student QR pages.
 */
export async function buildMultiClassQrPdf(
  classesWithStudents: ClassWithStudents[],
  settings: ClassPdfSettings,
  onProgress?: (percent: number) => void,
): Promise<Blob> {
  const { locale = "en" } = settings;
  const t = (key: string, options?: Record<string, unknown>) =>
    i18next.t(key, { lng: locale, ...options });

  const isPortrait = settings.orientation === "portrait";
  const doc = new jsPDF({
    orientation: isPortrait ? "portrait" : "landscape",
    unit: "mm",
    format: settings.pageSize.toLowerCase(),
  });

  // Calculate total pages for progress
  let totalPages = 0;
  for (const classData of classesWithStudents) {
    if (settings.includeCoverPages) totalPages++;
    totalPages += classData.students.length;
  }

  let currentPage = 0;
  let isFirstPage = true;

  for (const classData of classesWithStudents) {
    const students = classData.students;
    const totalStudentsInClass = students.length;

    // Render cover page if enabled
    if (settings.includeCoverPages) {
      if (!isFirstPage) {
        doc.addPage();
      }
      await renderClassCoverPage(
        doc,
        classData.classInfo,
        totalStudentsInClass,
        settings,
        t,
      );
      isFirstPage = false;
      currentPage++;

      if (onProgress) {
        onProgress(Math.round((currentPage / totalPages) * 100));
      }
    }

    // Render each student
    for (let i = 0; i < totalStudentsInClass; i++) {
      if (!isFirstPage) {
        doc.addPage();
      }
      isFirstPage = false;

      const numbering = settings.includeNumbering
        ? {
            current: i + 1,
            total: totalStudentsInClass,
            className: classData.classInfo.name,
          }
        : undefined;

      await renderStudentQrContentWithNumbering(
        doc,
        students[i],
        settings,
        numbering,
      );
      currentPage++;

      if (onProgress) {
        onProgress(Math.round((currentPage / totalPages) * 100));
      }
    }
  }

  return doc.output("blob");
}

/**
 * Builds a ZIP file containing separate PDFs for each class.
 * Each PDF is named after the class.
 */
export async function buildClassZipExport(
  classesWithStudents: ClassWithStudents[],
  settings: ClassPdfSettings,
  onProgress?: (percent: number) => void,
): Promise<Blob> {
  const files: Array<{ name: string; blob: Blob }> = [];
  const totalClasses = classesWithStudents.length;

  for (let i = 0; i < totalClasses; i++) {
    const classData = classesWithStudents[i];

    // Build PDF for this class
    const pdf = await buildSingleClassQrPdf(
      classData,
      settings,
      (pdfProgress) => {
        if (onProgress) {
          // Scale progress: 0-95% for PDFs, 95-100% for ZIP
          const classProgress = (i + pdfProgress / 100) / totalClasses;
          onProgress(Math.round(classProgress * 95));
        }
      },
    );

    // Sanitize class name for filename
    const filename = `${sanitizeFilename(classData.classInfo.name)}.pdf`;
    files.push({ name: filename, blob: pdf });
  }

  // Build ZIP
  const zipBlob = await buildZip(files, (zipProgress) => {
    if (onProgress) {
      onProgress(95 + Math.round(zipProgress * 0.05));
    }
  });

  return zipBlob;
}

/**
 * Generates the export filename for ZIP or combined PDF.
 */
export function generateClassExportFilename(
  mode: "zip" | "combined",
  locale: string = "en",
): string {
  const today = new Date().toISOString().split("T")[0];
  const baseName = locale === "de" ? "klassen_qr_export" : "classes_qr_export";

  if (mode === "zip") {
    return `${baseName}_${today}.zip`;
  }
  return `${baseName}_${today}.pdf`;
}
