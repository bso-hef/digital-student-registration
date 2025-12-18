export enum OnboardingErrorCode {
  INVALID_STUDENT_ID = "INVALID_STUDENT_ID",
  STUDENT_NOT_FOUND = "STUDENT_NOT_FOUND",
  NO_CLASS_ASSIGNED = "NO_CLASS_ASSIGNED",
  CLASS_INACTIVE = "CLASS_INACTIVE",
  ALREADY_ONBOARDED = "ALREADY_ONBOARDED",
  GENERIC_ERROR = "GENERIC_ERROR",
}

export class ValidationError extends Error {
  code: OnboardingErrorCode;

  constructor(message: string, code: OnboardingErrorCode) {
    super(message);
    this.name = "ValidationError";
    this.code = code;
  }
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}
