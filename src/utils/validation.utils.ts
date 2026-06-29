export const EMAIL_REGEX = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export const PASSWORD_REGEX = {
  MIN_LENGTH: /.{8,}/,

  UPPERCASE: /[A-Z]/,

  LOWERCASE: /[a-z]/,

  NUMBER: /[0-9]/,

  SPECIAL_CHAR: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/,

  NO_SPACES: /^\S*$/,

  STRONG:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:,.<>?]).{8,}$/,
};

export const RECOVERY_CODE_REGEX =
  /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

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

export const isValidRecoveryCode = (code: string): boolean => {
  return RECOVERY_CODE_REGEX.test(code);
};

export const STUDENT_NAME_MAX_LENGTH = 100;

export const STUDENT_MIN_BIRTH_YEAR = 1900;

/**
 * A student name is valid when it is a non-empty string within the length cap.
 * Pass the already-trimmed value.
 */
export const isValidStudentName = (name: string): boolean => {
  return name.length > 0 && name.length <= STUDENT_NAME_MAX_LENGTH;
};

/**
 * A birth date is valid when it is not in the future and not implausibly old.
 * The UI date picker enforces `disableFuture`, but a direct API caller must not
 * be trusted to — so this is enforced server-side too.
 */
export const isValidBirthDate = (date: Date): boolean => {
  return (
    date.getTime() <= Date.now() && date.getFullYear() >= STUDENT_MIN_BIRTH_YEAR
  );
};

export const calculatePasswordStrength = (password: string): number => {
  const checks = validatePasswordStrength(password);
  let strength = 0;

  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;

  if (checks.hasUppercase && checks.hasLowercase) strength += 20;
  if (checks.hasNumber) strength += 20;
  if (checks.hasSpecialChar) strength += 20;

  return Math.min(strength, 100);
};
