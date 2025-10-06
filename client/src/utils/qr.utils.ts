import QRCode from "qrcode";

export async function makeQrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: "M",
    margin: 0,
    scale: 6,
  });
}
