import i18next from "i18next";
import { jsPDF } from "jspdf";

import { makeQrDataUrl } from "./qr.utils";

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
};

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _innerW = pageW - pad * 2; // Reserved for future use
  const innerH = pageH - pad * 2;
  const headerH = 10;
  const footerH = 8;
  const contentY = pad + headerH + 4;
  const contentH = innerH - headerH - footerH - 6;

  // Header
  doc.setFontSize(11);
  doc.setFont("helvetica");
  doc.text(t("modals.generateQrModal.onboardingWizard"), pad, pad + 7);

  // URL + QR
  const sid = s._id || "";
  const wizUrl = settings.wizardUrlTemplate.replace(
    "{short-id}",
    settings.shortenId ? sid.slice(0, 8) : sid,
  );
  const qrSize = Math.min(isPortrait ? 45 : 35, contentH);
  const qrX = pad;
  const qrY = contentY;
  const qrData = await makeQrDataUrl(wizUrl);
  doc.addImage(qrData, "PNG", qrX, qrY, qrSize, qrSize);

  // Text rechts
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

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(
    `${settings.pageSize} • ${isPortrait ? t("modals.generateQrModal.portrait") : t("modals.generateQrModal.landscape")}`,
    pad,
    pageH - pad,
  );
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
