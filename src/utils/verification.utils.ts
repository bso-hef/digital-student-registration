/**
 * Verification code utilities for student authentication
 * Generates and validates 6-character codes (0-9, A-Z)
 */

/**
 * Character set for verification codes: digits and uppercase letters only
 * Total: 36 characters (10 digits + 26 letters) = 2,176,782,336 possible combinations
 */
const VERIFICATION_CODE_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const VERIFICATION_CODE_LENGTH = 6;

/**
 * Regular expression to validate verification code format
 * Must be exactly 6 characters: digits (0-9) or uppercase letters (A-Z)
 */
const VERIFICATION_CODE_REGEX = /^[0-9A-Z]{6}$/;

/**
 * Generates a random 6-character verification code
 * @returns {string} A random code like "A1B2C3", "123ABC", etc.
 */
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

/**
 * Validates verification code format
 * @param {string} code - The code to validate
 * @returns {boolean} True if valid format (6 chars, 0-9 and A-Z only)
 */
export function isValidVerificationCode(code: string): boolean {
  if (!code || typeof code !== "string") {
    return false;
  }
  return VERIFICATION_CODE_REGEX.test(code);
}

/**
 * Normalizes verification code to uppercase for comparison
 * @param {string} code - The code to normalize
 * @returns {string} Uppercase version of the code
 */
export function normalizeVerificationCode(code: string): string {
  return code.toUpperCase().trim();
}

/**
 * Generates a unique verification code by checking against existing codes
 * @param {Function} checkExists - Async function that checks if a code exists in the database
 * @param {number} maxAttempts - Maximum attempts to generate a unique code (default: 10)
 * @returns {Promise<string>} A unique verification code
 * @throws {Error} If unable to generate unique code after maxAttempts
 */
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
