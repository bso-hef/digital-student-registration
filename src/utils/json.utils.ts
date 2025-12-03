import { Student } from "@/types/db";

type ExportSettings = {
  includeEmptyFields?: boolean;
  locale?: string;
};

function removeEmptyFields(obj: any): any {
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
    const cleaned: any = {};
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

  let data: any = {
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
      mobile: student.mobile,
      phone: student.phone,
    },
    address: student.address
      ? {
          street: student.address.street,
          houseNumber: student.address.houseNumber,
          postalCode: student.address.postalCode,
          city: student.address.city,
          country: student.address.country,
          timezone: student.address.timezone,
        }
      : undefined,
    origin: {
      birthPlace: student.birthPlace,
      birthCountry: student.birthCountry,
      nationality: student.nationality,
      nationality2: student.nationality2,
      immigrationYear: student.immigrationYear,
      familyLanguage: student.familyLanguage,
    },
    contactPersons: student.contactPersons?.map((cp) => ({
      type: cp.type,
      firstName: cp.firstName,
      lastName: cp.lastName,
      street: cp.street,
      houseNumber: cp.houseNumber,
      postalCode: cp.postalCode,
      city: cp.city,
      mobile: cp.mobile,
      phone: cp.phone,
    })),
    education: {
      previousSchool: student.previousSchool,
      previousSchoolType: student.previousSchoolType,
      previousGrade: student.previousGrade,
      degrees: student.degrees,
      trainingOccupation: student.trainingOccupation,
    },
    employer: student.employer
      ? {
          name: student.employer.name,
          contactName: student.employer.contactName,
          phone: student.employer.phone,
          email: student.employer.email,
          street: student.employer.street,
          houseNumber: student.employer.houseNumber,
          postalCode: student.employer.postalCode,
          city: student.employer.city,
          startDate: student.employer.startDate,
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
    class:
      student.currentClass && typeof student.currentClass === "object"
        ? {
            id: student.currentClass._id,
            name: student.currentClass.name,
          }
        : student.currentClass
          ? { id: student.currentClass }
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
