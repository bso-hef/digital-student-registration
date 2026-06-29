import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  RECOVERY_CODE_REGEX,
  STUDENT_NAME_MAX_LENGTH,
  calculatePasswordStrength,
  isValidBirthDate,
  isValidEmail,
  isValidRecoveryCode,
  isValidStudentName,
  validatePasswordStrength,
} from "@/utils/validation.utils";
import { describe, expect, it } from "vitest";

/**
 * Tests for validation utility functions
 * @file tests/unit/utils/validation.utils.test.ts
 */

describe("validation.utils", () => {
  describe("EMAIL_REGEX", () => {
    it("should match valid emails", () => {
      expect(EMAIL_REGEX.test("test@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user.name@domain.org")).toBe(true);
      expect(EMAIL_REGEX.test("user+tag@domain.co")).toBe(true);
      expect(EMAIL_REGEX.test("user-name@sub.domain.com")).toBe(true);
      expect(EMAIL_REGEX.test("user_name@domain.de")).toBe(true);
    });

    it("should not match invalid emails", () => {
      expect(EMAIL_REGEX.test("invalid")).toBe(false);
      expect(EMAIL_REGEX.test("@domain.com")).toBe(false);
      expect(EMAIL_REGEX.test("user@")).toBe(false);
      expect(EMAIL_REGEX.test("user@domain")).toBe(false);
      expect(EMAIL_REGEX.test("user domain.com")).toBe(false);
    });
  });

  describe("PASSWORD_REGEX", () => {
    describe("MIN_LENGTH", () => {
      it("should match passwords with 8+ characters", () => {
        expect(PASSWORD_REGEX.MIN_LENGTH.test("12345678")).toBe(true);
        expect(PASSWORD_REGEX.MIN_LENGTH.test("longpassword")).toBe(true);
      });

      it("should not match passwords with less than 8 characters", () => {
        expect(PASSWORD_REGEX.MIN_LENGTH.test("1234567")).toBe(false);
        expect(PASSWORD_REGEX.MIN_LENGTH.test("short")).toBe(false);
      });
    });

    describe("UPPERCASE", () => {
      it("should match strings with uppercase letters", () => {
        expect(PASSWORD_REGEX.UPPERCASE.test("Password")).toBe(true);
        expect(PASSWORD_REGEX.UPPERCASE.test("ABC")).toBe(true);
      });

      it("should not match strings without uppercase letters", () => {
        expect(PASSWORD_REGEX.UPPERCASE.test("password")).toBe(false);
        expect(PASSWORD_REGEX.UPPERCASE.test("123456")).toBe(false);
      });
    });

    describe("LOWERCASE", () => {
      it("should match strings with lowercase letters", () => {
        expect(PASSWORD_REGEX.LOWERCASE.test("password")).toBe(true);
        expect(PASSWORD_REGEX.LOWERCASE.test("ABC123abc")).toBe(true);
      });

      it("should not match strings without lowercase letters", () => {
        expect(PASSWORD_REGEX.LOWERCASE.test("PASSWORD")).toBe(false);
        expect(PASSWORD_REGEX.LOWERCASE.test("123456")).toBe(false);
      });
    });

    describe("NUMBER", () => {
      it("should match strings with numbers", () => {
        expect(PASSWORD_REGEX.NUMBER.test("password1")).toBe(true);
        expect(PASSWORD_REGEX.NUMBER.test("123")).toBe(true);
      });

      it("should not match strings without numbers", () => {
        expect(PASSWORD_REGEX.NUMBER.test("password")).toBe(false);
        expect(PASSWORD_REGEX.NUMBER.test("ABC")).toBe(false);
      });
    });

    describe("SPECIAL_CHAR", () => {
      it("should match strings with special characters", () => {
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass!word")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("test@123")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass#word")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("test$123")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass%word")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("test^123")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass&word")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("test*123")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass(word)")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass_word")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass+word")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass-word")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass=word")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass[word]")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass{word}")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass|word")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass;word")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass:word")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass,word")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass.word")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass<word>")).toBe(true);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("pass?word")).toBe(true);
      });

      it("should not match strings without special characters", () => {
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("password")).toBe(false);
        expect(PASSWORD_REGEX.SPECIAL_CHAR.test("Password123")).toBe(false);
      });
    });

    describe("NO_SPACES", () => {
      it("should match strings without spaces", () => {
        expect(PASSWORD_REGEX.NO_SPACES.test("password")).toBe(true);
        expect(PASSWORD_REGEX.NO_SPACES.test("Pass123!")).toBe(true);
      });

      it("should not match strings with spaces", () => {
        expect(PASSWORD_REGEX.NO_SPACES.test("pass word")).toBe(false);
        expect(PASSWORD_REGEX.NO_SPACES.test(" password")).toBe(false);
        expect(PASSWORD_REGEX.NO_SPACES.test("password ")).toBe(false);
      });
    });

    describe("STRONG", () => {
      it("should match strong passwords", () => {
        expect(PASSWORD_REGEX.STRONG.test("Password1!")).toBe(true);
        expect(PASSWORD_REGEX.STRONG.test("MyP@ssw0rd")).toBe(true);
        expect(PASSWORD_REGEX.STRONG.test("Str0ng!Pass")).toBe(true);
      });

      it("should not match weak passwords", () => {
        expect(PASSWORD_REGEX.STRONG.test("password")).toBe(false);
        expect(PASSWORD_REGEX.STRONG.test("PASSWORD1!")).toBe(false); // no lowercase
        expect(PASSWORD_REGEX.STRONG.test("password1!")).toBe(false); // no uppercase
        expect(PASSWORD_REGEX.STRONG.test("Password!!")).toBe(false); // no number
        expect(PASSWORD_REGEX.STRONG.test("Password12")).toBe(false); // no special
        expect(PASSWORD_REGEX.STRONG.test("Pass1!")).toBe(false); // too short
      });
    });
  });

  describe("RECOVERY_CODE_REGEX", () => {
    it("should match valid recovery codes", () => {
      expect(RECOVERY_CODE_REGEX.test("ABCD-1234-WXYZ-5678")).toBe(true);
      expect(RECOVERY_CODE_REGEX.test("0000-0000-0000-0000")).toBe(true);
      expect(RECOVERY_CODE_REGEX.test("ZZZZ-9999-AAAA-1111")).toBe(true);
    });

    it("should not match invalid recovery codes", () => {
      expect(RECOVERY_CODE_REGEX.test("ABCD-1234-WXYZ-567")).toBe(false); // too short
      expect(RECOVERY_CODE_REGEX.test("ABCD-1234-WXYZ-56789")).toBe(false); // too long
      expect(RECOVERY_CODE_REGEX.test("abcd-1234-wxyz-5678")).toBe(false); // lowercase
      expect(RECOVERY_CODE_REGEX.test("ABCD1234WXYZ5678")).toBe(false); // no dashes
      expect(RECOVERY_CODE_REGEX.test("ABCD-1234-WXYZ")).toBe(false); // missing segment
    });
  });

  describe("isValidEmail", () => {
    it("should return true for valid emails", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.org")).toBe(true);
      expect(isValidEmail("user+tag@domain.co")).toBe(true);
    });

    it("should return false for invalid emails", () => {
      expect(isValidEmail("invalid")).toBe(false);
      expect(isValidEmail("@domain.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("validatePasswordStrength", () => {
    it("should validate a strong password", () => {
      const result = validatePasswordStrength("Password1!");

      expect(result.minLength).toBe(true);
      expect(result.hasUppercase).toBe(true);
      expect(result.hasLowercase).toBe(true);
      expect(result.hasNumber).toBe(true);
      expect(result.hasSpecialChar).toBe(true);
      expect(result.isStrong).toBe(true);
    });

    it("should detect missing minimum length", () => {
      const result = validatePasswordStrength("Pass1!");

      expect(result.minLength).toBe(false);
      expect(result.isStrong).toBe(false);
    });

    it("should detect missing uppercase", () => {
      const result = validatePasswordStrength("password1!");

      expect(result.hasUppercase).toBe(false);
      expect(result.isStrong).toBe(false);
    });

    it("should detect missing lowercase", () => {
      const result = validatePasswordStrength("PASSWORD1!");

      expect(result.hasLowercase).toBe(false);
      expect(result.isStrong).toBe(false);
    });

    it("should detect missing number", () => {
      const result = validatePasswordStrength("Password!!");

      expect(result.hasNumber).toBe(false);
      expect(result.isStrong).toBe(false);
    });

    it("should detect missing special character", () => {
      const result = validatePasswordStrength("Password12");

      expect(result.hasSpecialChar).toBe(false);
      expect(result.isStrong).toBe(false);
    });

    it("should handle empty password", () => {
      const result = validatePasswordStrength("");

      expect(result.minLength).toBe(false);
      expect(result.hasUppercase).toBe(false);
      expect(result.hasLowercase).toBe(false);
      expect(result.hasNumber).toBe(false);
      expect(result.hasSpecialChar).toBe(false);
      expect(result.isStrong).toBe(false);
    });
  });

  describe("isValidRecoveryCode", () => {
    it("should return true for valid recovery codes", () => {
      expect(isValidRecoveryCode("ABCD-1234-WXYZ-5678")).toBe(true);
      expect(isValidRecoveryCode("0000-0000-0000-0000")).toBe(true);
    });

    it("should return false for invalid recovery codes", () => {
      expect(isValidRecoveryCode("invalid")).toBe(false);
      expect(isValidRecoveryCode("ABCD-1234-WXYZ")).toBe(false);
      expect(isValidRecoveryCode("")).toBe(false);
    });
  });

  describe("calculatePasswordStrength", () => {
    it("should return 0 for empty password", () => {
      expect(calculatePasswordStrength("")).toBe(0);
    });

    it("should add 20 points for 8+ characters", () => {
      expect(calculatePasswordStrength("aaaaaaaa")).toBe(20);
    });

    it("should add 10 more points for 12+ characters", () => {
      expect(calculatePasswordStrength("aaaaaaaaaaaa")).toBe(30);
    });

    it("should add 10 more points for 16+ characters", () => {
      expect(calculatePasswordStrength("aaaaaaaaaaaaaaaa")).toBe(40);
    });

    it("should add 20 points for mixed case", () => {
      expect(calculatePasswordStrength("AAAAAAAaa")).toBeGreaterThanOrEqual(40);
    });

    it("should add 20 points for numbers", () => {
      const base = calculatePasswordStrength("aaaaaaaA");
      const withNumber = calculatePasswordStrength("aaaaaaA1");
      expect(withNumber).toBe(base + 20);
    });

    it("should add 20 points for special characters", () => {
      const base = calculatePasswordStrength("aaaaaaaA");
      const withSpecial = calculatePasswordStrength("aaaaaaA!");
      expect(withSpecial).toBe(base + 20);
    });

    it("should cap at 100", () => {
      const veryStrongPassword = "VeryStrongP@ssw0rd!!123";
      expect(calculatePasswordStrength(veryStrongPassword)).toBeLessThanOrEqual(
        100,
      );
    });

    it("should return 100 for perfect password", () => {
      // 16+ chars (40) + mixed case (20) + number (20) + special (20) = 100
      expect(calculatePasswordStrength("VeryStrongP@ssw0")).toBe(100);
    });

    it("should handle short passwords with special chars", () => {
      const result = calculatePasswordStrength("Pass1!");
      // Less than 8 chars, so no length bonus
      // Has mixed case (20), number (20), special (20) = 60
      expect(result).toBe(60);
    });
  });

  describe("isValidStudentName", () => {
    it("should accept a normal name", () => {
      expect(isValidStudentName("Mara")).toBe(true);
    });

    it("should reject an empty string", () => {
      expect(isValidStudentName("")).toBe(false);
    });

    it("should accept a name exactly at the length cap", () => {
      expect(isValidStudentName("a".repeat(STUDENT_NAME_MAX_LENGTH))).toBe(
        true,
      );
    });

    it("should reject a name longer than the cap", () => {
      expect(isValidStudentName("a".repeat(STUDENT_NAME_MAX_LENGTH + 1))).toBe(
        false,
      );
    });
  });

  describe("isValidBirthDate", () => {
    it("should accept a plausible past date", () => {
      expect(isValidBirthDate(new Date("2005-05-05"))).toBe(true);
    });

    it("should reject a future date", () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      expect(isValidBirthDate(future)).toBe(false);
    });

    it("should reject an implausibly old date", () => {
      expect(isValidBirthDate(new Date("1800-01-01"))).toBe(false);
    });
  });
});
