export const onlyInitials = (line: string) => {
  const name = line;
  const rgx = /(\p{L}{1})\p{L}+/gu;

  const initials = [...name.matchAll(rgx)];

  const result = (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "");

  return result.toUpperCase();
};

export const userInitials = (firstName: string, lastName: string) => {
  if (!firstName && lastName) return onlyInitials(lastName);
  if (firstName && !lastName) return onlyInitials(firstName);
  if (!firstName && !lastName) return " ";

  return `${onlyInitials(firstName)}${onlyInitials(lastName)}`;
};

type User = {
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  deviceName?: string;
  name?: string;
};

export const getName = (user: User) => {
  let name = "";
  if (user && user.firstName) {
    name = `${user.firstName} ${user.lastName ? user.lastName : ""}`;
  } else if (user && user.userName) {
    name = user.userName;
  } else if (user && user.email) {
    name = user.email;
  } else if (user && user.deviceName) {
    name = user.deviceName;
  } else if (user && user.name) {
    name = user.name;
  } else {
    name = "";
  }

  return name;
};

export const copyText = async (value: string) => {
  if (!value) return;
  if (typeof window === "undefined" || !navigator.clipboard) {
    console.warn("Clipboard API not available");
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    console.log("Text successfully copied to clipboard");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

export function uuid_v4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function sanitizeFilename(input = ""): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w.-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}
