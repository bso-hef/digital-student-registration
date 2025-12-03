import { Student as FullStudent } from "@/types/db";
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
  const qrData = await makeQrDataUrl(wizUrl);
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

  const displayValue =
    value && value.toString().trim() !== "" ? value.toString() : "—";

  const labelWidth = 70;
  const maxValueWidth =
    layout.pageWidth - layout.leftMargin - layout.rightMargin - labelWidth - 3;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`${label}:`, layout.leftMargin, y);

  doc.setFont("helvetica", "normal");
  const valueLines = doc.splitTextToSize(displayValue, maxValueWidth);
  doc.text(valueLines, layout.leftMargin + labelWidth, y);

  return y + layout.fieldRowHeight * valueLines.length;
}

function checkPageBreak(
  doc: jsPDF,
  currentY: number,
  layout: LayoutConfig,
  requiredSpace: number = 30,
): number {
  if (currentY + requiredSpace > layout.pageHeight - layout.bottomMargin) {
    doc.addPage();
    return layout.contentStart;
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
    student.gender,
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
    t("onboarding.origin.familyLanguage"),
    student.familyLanguage,
    y,
    layout,
    includeEmptyFields,
  );
  y = renderField(
    doc,
    t("onboarding.origin.immigrationYear"),
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
      `${t("onboarding.legalGuardian.contactPerson")} ${index + 1}`,
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
    y = renderField(
      doc,
      t("onboarding.legalGuardian.phone"),
      person.phone,
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
    y = checkPageBreak(doc, y, layout);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(t("onboarding.training.company"), layout.leftMargin + 2, y);
    y += 6;

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

    if (student.employer.contactName) {
      y += 3;
      y = checkPageBreak(doc, y, layout);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(
        t("onboarding.summary.companyContact"),
        layout.leftMargin + 2,
        y,
      );
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      y = renderField(
        doc,
        t("onboarding.companyContact.salutation"),
        student.employer.contactSalutation,
        y,
        layout,
        includeEmptyFields,
      );
      y = renderField(
        doc,
        t("onboarding.general.name"),
        student.employer.contactName,
        y,
        layout,
        includeEmptyFields,
      );
      y = renderField(
        doc,
        t("onboarding.companyContact.phone"),
        student.employer.contactPhone,
        y,
        layout,
        includeEmptyFields,
      );
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

  const agreementsList = [
    { key: "dataProtection", value: student.agreements.dataProtection },
    { key: "classParticipation", value: student.agreements.classParticipation },
    { key: "schoolRules", value: student.agreements.schoolRules },
    { key: "imageRights", value: student.agreements.imageRights },
    { key: "teamsUsage", value: student.agreements.teamsUsage },
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  agreementsList.forEach(({ key, value }) => {
    const label = t(`onboarding.agreements.${key}`);
    const status = value ? "✓" : "✗";
    const statusText = value ? t("general.Accepted") : t("general.NotAccepted");

    doc.text(`${status} ${label}:`, layout.leftMargin + 4, y);
    doc.setFont("helvetica", "italic");
    doc.text(statusText, layout.leftMargin + 100, y);
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
    bottomMargin: 25,
    contentStart: 38,
    sectionGap: 10,
    fieldRowHeight: 7,
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(pdfTitle, layout.leftMargin, layout.topMargin + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    `${student.firstName} ${student.lastName}`,
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
    doc.text(dateText, layout.leftMargin, pageH - 10, { align: "left" });

    const pageText = `${i} / ${totalPages}`;
    doc.text(pageText, pageW - layout.rightMargin, pageH - 10, {
      align: "right",
    });
  }

  return doc.output("blob");
}
