export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  class?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    timezone?: string;
  };
  status: "imported" | "invited" | "onboarded";
  isValid?: boolean;
  touched?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
