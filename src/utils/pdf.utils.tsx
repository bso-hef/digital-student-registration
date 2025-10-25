import { jsPDF } from "jspdf";

import { makeQrDataUrl } from "./qr.utils";

export type Student = {
  _id: string;
  firstName: string;
  lastName: string;
  className?: string;
};

export type PdfSettings = {
  pageSize: "A4" | "A5";
  orientation: "portrait" | "landscape";
  includeClass: boolean;
  shortenId: boolean;
  wizardUrlTemplate: string; // z.B. WIZZARD_URL mit {short-id}
};

export async function buildPdfForStudent(
  s: Student,
  settings: PdfSettings,
): Promise<Blob> {
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
  doc.setFont("helvetica", "bold");
  doc.text("Onboarding-Wizard", pad, pad + 7);

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

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(`${s.firstName} ${s.lastName}`, textX, qrY + 6, {
    maxWidth: textMaxW,
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  let ty = qrY + 14;

  if (settings.includeClass && s.className) {
    doc.text(`Klasse: ${s.className}`, textX, ty, { maxWidth: textMaxW });
    ty += 7;
  }

  const shownId = settings.shortenId ? sid.slice(0, 8) : sid;
  doc.setTextColor(120);
  doc.setFontSize(10);
  doc.text(`ID: ${shownId}`, textX, ty);
  ty += 7;

  doc.setTextColor(0);
  doc.setFontSize(9);
  const urlLines = doc.splitTextToSize(wizUrl, textMaxW);
  doc.text(urlLines, textX, ty);

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(
    `${settings.pageSize} • ${isPortrait ? "Hochformat" : "Querformat"}`,
    pad,
    pageH - pad,
  );
  doc.text(
    `${s.lastName}_${s.firstName}${settings.includeClass ? `_${s.className ?? ""}` : ""}.pdf`,
    pageW - pad,
    pageH - pad,
    { align: "right" },
  );

  return doc.output("blob");
}
