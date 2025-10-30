/**
 * Validation utilities for form validation
 * Contains regex patterns and validation helpers
 */

/**
 * Email validation regex
 * - Allows alphanumeric characters, dots, hyphens, underscores, and plus signs before @
 * - Requires @ symbol
 * - Allows alphanumeric characters and hyphens in domain
 * - Requires at least one dot in domain
 * - Domain extension must be 2-6 characters
 */
export const EMAIL_REGEX =
  /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

/**
 * Password validation regex patterns
 */
export const PASSWORD_REGEX = {
  /**
   * Minimum 8 characters
   */
  MIN_LENGTH: /.{8,}/,

  /**
   * At least one uppercase letter (A-Z)
   */
  UPPERCASE: /[A-Z]/,

  /**
   * At least one lowercase letter (a-z)
   */
  LOWERCASE: /[a-z]/,

  /**
   * At least one number (0-9)
   */
  NUMBER: /[0-9]/,

  /**
   * At least one special character
   * Allowed: !@#$%^&*()_+-=[]{}|;:,.<>?
   */
  SPECIAL_CHAR: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/,

  /**
   * Combined strong password regex
   * - Minimum 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   */
  STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:,.<>?]).{8,}$/,
};

/**
 * Recovery code format: XXXX-XXXX-XXXX-XXXX
 * - 4 groups of 4 characters
 * - Each group contains uppercase letters and numbers only
 * - Groups separated by hyphens
 */
export const RECOVERY_CODE_REGEX = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

/**
 * Helper function to validate email
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Helper function to validate password strength
 * Returns an object with individual requirement checks
 */
export const validatePasswordStrength = (password: string) => {
  return {
    minLength: PASSWORD_REGEX.MIN_LENGTH.test(password),
    hasUppercase: PASSWORD_REGEX.UPPERCASE.test(password),
    hasLowercase: PASSWORD_REGEX.LOWERCASE.test(password),
    hasNumber: PASSWORD_REGEX.NUMBER.test(password),
    hasSpecialChar: PASSWORD_REGEX.SPECIAL_CHAR.test(password),
    isStrong: PASSWORD_REGEX.STRONG.test(password),
  };
};

/**
 * Helper function to validate recovery code format
 */
export const isValidRecoveryCode = (code: string): boolean => {
  return RECOVERY_CODE_REGEX.test(code);
};

/**
 * Calculate password strength percentage (0-100)
 */
export const calculatePasswordStrength = (password: string): number => {
  const checks = validatePasswordStrength(password);
  let strength = 0;

  // Base points for length
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;

  // Points for character types
  if (checks.hasUppercase && checks.hasLowercase) strength += 20;
  if (checks.hasNumber) strength += 20;
  if (checks.hasSpecialChar) strength += 20;

  return Math.min(strength, 100);
};
