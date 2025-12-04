import { Student } from "@/types/db";

type ExportSettings = {
  includeEmptyFields?: boolean;
  locale?: string;
};

function removeEmptyFields(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return undefined;
  }

  if (Array.isArray(obj)) {
    const filtered = obj
      .map((item) => removeEmptyFields(item))
      .filter((item) => item !== undefined);
    return filtered.length > 0 ? filtered : undefined;
  }

  if (typeof obj === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === "" || value === null || value === undefined) {
        continue;
      }
      const cleanedValue = removeEmptyFields(value);
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    }
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }

  return obj;
}

export async function buildStudentDataJson(
  student: Student,
  settings: ExportSettings = {},
): Promise<Blob> {
  const { includeEmptyFields = false } = settings;

  let data: Record<string, unknown> | unknown = {
    id: student._id,
    personalInfo: {
      firstName: student.firstName,
      lastName: student.lastName,
      birthName: student.birthName,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      religion: student.religion,
    },
    contact: {
      email: student.email,
      phone: student.phone,
    },
    address: student.address
      ? {
          street: student.address.street,
          zip: student.address.zip,
          city: student.address.city,
          country: student.address.country,
          state: student.address.state,
          timezone: student.address.timezone,
        }
      : undefined,
    origin: {
      birthplace: student.birthplace,
      birthCountry: student.birthCountry,
      nationality: student.nationality,
      secondNationality: student.secondNationality,
      immigrationYear: student.immigrationYear,
      familyLanguage: student.familyLanguage,
    },
    contactPersons: student.contactPersons?.map((cp) => ({
      type: cp.type,
      firstName: cp.firstName,
      lastName: cp.lastName,
      address: cp.address
        ? {
            street: cp.address.street,
            zip: cp.address.zip,
            city: cp.address.city,
            country: cp.address.country,
            state: cp.address.state,
            timezone: cp.address.timezone,
          }
        : undefined,
      mobile: cp.mobile,
      phone: cp.phone,
    })),
    education: {
      previousSchool: student.previousSchool,
      previousSchoolType: student.previousSchoolType,
      previousSchoolLevel: student.previousSchoolLevel,
      degrees: student.degrees,
    },
    vocationalTraining: {
      profession: student.profession,
      trainingStartDate: student.trainingStartDate,
    },
    employer: student.employer
      ? {
          companyName: student.employer.companyName,
          contactName: student.employer.contactName,
          contactPhone: student.employer.contactPhone,
          contactEmail: student.employer.contactEmail,
          contactSalutation: student.employer.contactSalutation,
          address: student.employer.address,
          verified: student.employer.verified,
        }
      : undefined,
    agreements: student.agreements
      ? {
          dataProtection: student.agreements.dataProtection,
          classParticipation: student.agreements.classParticipation,
          schoolRules: student.agreements.schoolRules,
          imageRights: student.agreements.imageRights,
          teamsUsage: student.agreements.teamsUsage,
        }
      : undefined,
    class: student.currentClass
      ? {
          id: student.currentClass,
          name: student.currentClassName,
        }
          : undefined,
    metadata: {
      status: student.status,
      onboardingStep: student.onboardingStep,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    },
  };

  if (!includeEmptyFields) {
    data = removeEmptyFields(data);
  }

  const jsonString = JSON.stringify(data, null, 2);
  return new Blob([jsonString], { type: "application/json" });
}
