import QRCode from "qrcode";

export async function makeQrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: "M",
    margin: 0,
    scale: 6,
  });
}

/**
 * WiFi icon as SVG path for embedding in QR code (grey color)
 */
const WIFI_ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#666666">
  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
</svg>
`;

/**
 * Student/Person icon as SVG path for embedding in QR code (grey color)
 */
const STUDENT_ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#666666">
  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
</svg>
`;

/**
 * Generates a WiFi QR code string in standard format
 */
export function generateWifiQrString(
  ssid: string,
  password: string,
  securityType: string,
  hidden: boolean = false,
): string {
  // Escape special characters in SSID and password
  const escapeSpecialChars = (str: string): string => {
    return str.replace(/[\\;,:""]/g, (match) => `\\${match}`);
  };

  const escapedSsid = escapeSpecialChars(ssid);
  const escapedPassword = escapeSpecialChars(password);

  // Map security type to WiFi QR format
  // WPA2 and WPA3 are both represented as WPA in the QR format
  const securityMap: Record<string, string> = {
    WPA: "WPA",
    WPA2: "WPA",
    WPA3: "WPA",
    WEP: "WEP",
    nopass: "nopass",
  };
  const security = securityMap[securityType] || "WPA";

  return `WIFI:T:${security};S:${escapedSsid};P:${escapedPassword};H:${hidden};;`;
}

/**
 * Creates a QR code with a WiFi icon overlay in the center
 */
export async function makeWlanQrDataUrl(
  ssid: string,
  password: string,
  securityType: string,
  hidden: boolean = false,
): Promise<string> {
  const wifiString = generateWifiQrString(ssid, password, securityType, hidden);

  // Generate QR code with high error correction to allow for logo overlay
  const qrDataUrl = await QRCode.toDataURL(wifiString, {
    errorCorrectionLevel: "H", // High error correction (30% recovery)
    margin: 1,
    scale: 8,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  // Check if we're in a browser environment with canvas support
  if (typeof document === "undefined") {
    // Server-side: return QR without icon overlay
    return qrDataUrl;
  }

  return new Promise((resolve) => {
    const qrImage = new Image();
    qrImage.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(qrDataUrl);
        return;
      }

      canvas.width = qrImage.width;
      canvas.height = qrImage.height;

      // Draw QR code
      ctx.drawImage(qrImage, 0, 0);

      // Calculate center position for icon (about 20% of QR size)
      const iconSize = Math.floor(qrImage.width * 0.22);
      const iconX = (qrImage.width - iconSize) / 2;
      const iconY = (qrImage.height - iconSize) / 2;

      // Draw white circular background
      ctx.beginPath();
      ctx.arc(
        qrImage.width / 2,
        qrImage.height / 2,
        iconSize / 2 + 4,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Draw WiFi icon using base64 data URL for better browser compatibility
      const iconImage = new Image();
      const svgBase64 = btoa(WIFI_ICON_SVG);
      const svgUrl = `data:image/svg+xml;base64,${svgBase64}`;

      iconImage.onload = () => {
        ctx.drawImage(iconImage, iconX, iconY, iconSize, iconSize);
        resolve(canvas.toDataURL("image/png"));
      };

      iconImage.onerror = () => {
        resolve(canvas.toDataURL("image/png"));
      };

      iconImage.src = svgUrl;
    };

    qrImage.onerror = () => {
      resolve(qrDataUrl);
    };

    qrImage.src = qrDataUrl;
  });
}

/**
 * Creates a QR code with a student/person icon overlay in the center
 * Used when WLAN QR is present to differentiate the student QR code
 */
export async function makeStudentQrDataUrl(text: string): Promise<string> {
  // Generate QR code with high error correction to allow for logo overlay
  const qrDataUrl = await QRCode.toDataURL(text, {
    errorCorrectionLevel: "H", // High error correction (30% recovery)
    margin: 0,
    scale: 8,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  // Check if we're in a browser environment with canvas support
  if (typeof document === "undefined") {
    // Server-side: return QR without icon overlay
    return qrDataUrl;
  }

  return new Promise((resolve) => {
    const qrImage = new Image();
    qrImage.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(qrDataUrl);
        return;
      }

      canvas.width = qrImage.width;
      canvas.height = qrImage.height;

      // Draw QR code
      ctx.drawImage(qrImage, 0, 0);

      // Calculate center position for icon (about 20% of QR size)
      const iconSize = Math.floor(qrImage.width * 0.22);
      const iconX = (qrImage.width - iconSize) / 2;
      const iconY = (qrImage.height - iconSize) / 2;

      // Draw white circular background
      ctx.beginPath();
      ctx.arc(
        qrImage.width / 2,
        qrImage.height / 2,
        iconSize / 2 + 4,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Draw student icon using base64 data URL for better browser compatibility
      const iconImage = new Image();
      const svgBase64 = btoa(STUDENT_ICON_SVG);
      const svgUrl = `data:image/svg+xml;base64,${svgBase64}`;

      iconImage.onload = () => {
        ctx.drawImage(iconImage, iconX, iconY, iconSize, iconSize);
        resolve(canvas.toDataURL("image/png"));
      };

      iconImage.onerror = () => {
        resolve(canvas.toDataURL("image/png"));
      };

      iconImage.src = svgUrl;
    };

    qrImage.onerror = () => {
      resolve(qrDataUrl);
    };

    qrImage.src = qrDataUrl;
  });
}
