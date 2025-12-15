const VERIFICATION_CODE_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const VERIFICATION_CODE_LENGTH = 6;

const VERIFICATION_CODE_REGEX = /^[0-9A-Z]{6}$/;

export function generateVerificationCode(): string {
  let code = "";
  for (let i = 0; i < VERIFICATION_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(
      Math.random() * VERIFICATION_CODE_CHARSET.length,
    );
    code += VERIFICATION_CODE_CHARSET[randomIndex];
  }
  return code;
}

export function isValidVerificationCode(code: string): boolean {
  if (!code || typeof code !== "string") {
    return false;
  }
  return VERIFICATION_CODE_REGEX.test(code);
}

export function normalizeVerificationCode(code: string): string {
  return code.toUpperCase().trim();
}

export async function generateUniqueVerificationCode(
  checkExists: (code: string) => Promise<boolean>,
  maxAttempts = 10,
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const code = generateVerificationCode();
    const exists = await checkExists(code);
    if (!exists) {
      return code;
    }
  }
  throw new Error(
    `Failed to generate unique verification code after ${maxAttempts} attempts`,
  );
}
