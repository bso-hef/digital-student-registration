export interface ContactPerson {
  type: string; // parent, guardian, emergency contact, etc.
  firstName: string;
  lastName: string;
  phone?: string;
  mobile?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    timezone?: string;
  };
}

export interface Employer {
  companyName: string;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  contactSalutation?: string;
  verified: boolean;
}

export interface Agreements {
  dataProtection: boolean;
  classParticipation: boolean;
  schoolRules: boolean;
  imageRights: boolean;
  teamsUsage: boolean;
}

export interface Student {
  _id: string;

  // Basic personal information
  firstName: string;
  lastName: string;
  birthName?: string;
  dateOfBirth: Date | null;
  gender?: "male" | "female" | "diverse";
  birthplace?: string;
  birthCountry?: string;
  religion?: string;

  // Nationality
  nationality?: string;
  secondNationality?: string;

  // Origin/Immigration
  familyLanguage?: string;
  immigrationYear?: number;

  // Contact information
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

  // School information
  class?: string; // Deprecated: use currentClass
  currentClass?: string; // Reference to Class _id
  currentClassName?: string; // Cached class name
  schoolEntryDate?: Date;

  // Previous education
  previousSchool?: string;
  previousSchoolType?: string;
  previousSchoolLevel?: string;
  degrees?: string;

  // Vocational training
  profession?: string;
  trainingStartDate?: Date;

  // Employer information (for vocational students)
  employer?: Employer;

  // Contact persons (parents, guardians)
  contactPersons?: ContactPerson[];

  // Agreements and consents
  agreements?: Agreements;

  // System fields
  collisionGroup?: string;
  ordinal?: number;
  status: "imported" | "invited" | "onboarded";
  active?: boolean;

  // Metadata
  isValid?: boolean;
  touched?: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Normalized fields for search (auto-generated)
  firstNameNorm?: string;
  lastNameNorm?: string;
}
