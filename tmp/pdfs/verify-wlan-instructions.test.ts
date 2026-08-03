import de from "@/locales/de.json";
import { buildNewRegistrationPdf, buildPdfForStudent } from "@/utils/pdf.utils";
import i18next from "i18next";
import { writeFile } from "node:fs/promises";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/utils/qr.utils", () => {
  const placeholderPng =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

  return {
    makeQrDataUrl: vi.fn().mockResolvedValue(placeholderPng),
    makeStudentQrDataUrl: vi.fn().mockResolvedValue(placeholderPng),
    makeWlanQrDataUrl: vi.fn().mockResolvedValue(placeholderPng),
  };
});

const wlanSettings = {
  enabled: true,
  ssid: "Schulnetz-Test",
  password: "Sicheres-Testpasswort-2026",
  securityType: "WPA2" as const,
  hidden: false,
};

async function saveBlob(blob: Blob, path: string) {
  await writeFile(path, Buffer.from(await blob.arrayBuffer()));
}

describe("WLAN registration PDF visual fixtures", () => {
  beforeAll(async () => {
    await i18next.init({
      lng: "de",
      fallbackLng: "de",
      resources: { de: { translation: de } },
    });
  });

  it("generates the student registration fixture", async () => {
    const pdf = await buildPdfForStudent(
      {
        _id: "507f1f77bcf86cd799439011",
        firstName: "Erika",
        lastName: "Mustermann",
        className: "10A",
        verificationCode: "ABC123",
      },
      {
        pageSize: "A5",
        orientation: "landscape",
        includeClass: true,
        shortenId: false,
        wizardUrlTemplate: "https://registration.example/student/{short-id}",
        locale: "de",
        hidePageLabel: true,
        includeWlan: true,
        wlanSettings,
      },
    );

    await saveBlob(pdf, "tmp/pdfs/wlan-student-registration.pdf");
    expect(pdf.size).toBeGreaterThan(0);
  });

  it("generates the new registration fixture", async () => {
    const pdf = await buildNewRegistrationPdf({
      pageSize: "A5",
      orientation: "landscape",
      wizardUrlTemplate: "https://registration.example/student/{short-id}",
      locale: "de",
      includeWlan: true,
      wlanSettings,
    });

    await saveBlob(pdf, "tmp/pdfs/wlan-new-registration.pdf");
    expect(pdf.size).toBeGreaterThan(0);
  });
});
