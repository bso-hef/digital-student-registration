import * as Yup from "yup";

// Profile data validation schema
export const validateProfileData = Yup.object({
  firstName: Yup.string()
    .trim()
    .max(100, "First name must be at most 100 characters"),
  lastName: Yup.string()
    .trim()
    .max(100, "Last name must be at most 100 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string().trim().max(30, "Phone must be at most 30 characters"),
  jobTitle: Yup.string()
    .trim()
    .max(100, "Job title must be at most 100 characters"),
  timezone: Yup.string().trim(),
});

// Password change validation schema
export const validatePasswordChange = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

// Avatar validation helper (for client-side)
export interface AvatarValidationResult {
  valid: boolean;
  error?: string;
}

export const validateAvatar = (file: File): AvatarValidationResult => {
  const maxSize = 1 * 1024 * 1024; // 1MB
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPEG, PNG, GIF, and WebP images are allowed",
    };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "Image size must be less than 1MB" };
  }

  return { valid: true };
};
