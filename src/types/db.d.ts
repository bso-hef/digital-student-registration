export interface ContactPerson {
  type: string;
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
  // Second contact (optional)
  contact2Name?: string;
  contact2Email?: string;
  contact2Phone?: string;
  contact2Salutation?: string;
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

  firstName: string;
  lastName: string;
  birthName?: string;
  dateOfBirth: Date | null;
  gender?: "male" | "female" | "diverse";
  birthplace?: string;
  birthCountry?: string;
  religion?: string;

  nationality?: string;
  secondNationality?: string;

  familyLanguage?: string;
  immigrationYear?: number;

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

  class?: string;
  currentClass?: string;
  currentClassName?: string;
  schoolEntryDate?: Date;

  previousSchool?: string;
  previousSchoolType?: string;
  previousSchoolLevel?: string;
  degrees?: string;

  profession?: string;
  trainingStartDate?: Date;

  employer?: Employer;

  contactPersons?: ContactPerson[];

  agreements?: Agreements;

  onboardingStep?: number;

  collisionGroup?: string;
  ordinal?: number;
  status: "imported" | "invited" | "onboarded";
  verificationCode?: string;
  active?: boolean;

  isValid?: boolean;
  touched?: boolean;
  createdAt: Date;
  updatedAt: Date;

  firstNameNorm?: string;
  lastNameNorm?: string;
}
