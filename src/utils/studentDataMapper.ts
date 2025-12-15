import type { Student } from "@/types/db";
import type { StudentData } from "@/types/student.d";

export function mapFormDataToModel(
  formData: Partial<StudentData>,
  maxContactPersons: number = 3,
): Partial<Student> {
  const mapped: Partial<Student> = {};

  if (formData.vorname) mapped.firstName = formData.vorname;
  if (formData.nachname) mapped.lastName = formData.nachname;
  if (formData.geburtsname) mapped.birthName = formData.geburtsname;
  if (formData.geburtsdatum) {
    mapped.dateOfBirth =
      typeof formData.geburtsdatum === "string"
        ? new Date(formData.geburtsdatum)
        : formData.geburtsdatum;
  }
  if (formData.geschlecht) {
    const genderMap: { [key: string]: "male" | "female" | "diverse" } = {
      männlich: "male",
      weiblich: "female",
      divers: "diverse",
      male: "male",
      female: "female",
      diverse: "diverse",
    };
    mapped.gender = genderMap[formData.geschlecht] || undefined;
  }
  if (formData.geburtsort) mapped.birthplace = formData.geburtsort;
  if (formData.geburtsland) mapped.birthCountry = formData.geburtsland;
  if (formData.religion) mapped.religion = formData.religion;

  if (formData.staatsangehoerigkeit1)
    mapped.nationality = formData.staatsangehoerigkeit1;
  if (formData.staatsangehoerigkeit2)
    mapped.secondNationality = formData.staatsangehoerigkeit2;

  if (formData.familiensprache)
    mapped.familyLanguage = formData.familiensprache;
  if (formData.zuzugsjahr) {
    mapped.immigrationYear =
      typeof formData.zuzugsjahr === "string"
        ? parseInt(formData.zuzugsjahr, 10)
        : formData.zuzugsjahr;
  }

  if (formData.email) mapped.email = formData.email;
  if (formData.mobil) mapped.phone = formData.mobil;

  if (
    formData.straße ||
    formData.hausNr ||
    formData.postleitzahl ||
    formData.ort
  ) {
    mapped.address = {
      street:
        formData.straße && formData.hausNr
          ? `${formData.straße} ${formData.hausNr}`
          : formData.straße || "",
      city: formData.ort || "",
      zip: formData.postleitzahl || "",
      state: "",
      country: "DE",
      timezone: "Europe/Berlin",
    };
  }

  if (formData.eintrittschule) {
    mapped.schoolEntryDate =
      typeof formData.eintrittschule === "string"
        ? new Date(formData.eintrittschule)
        : formData.eintrittschule;
  }
  if (formData.klassenname) mapped.currentClassName = formData.klassenname;

  if (formData.vorhergehendeSchule)
    mapped.previousSchool = formData.vorhergehendeSchule;
  if (formData.vorhergehendeSchulform)
    mapped.previousSchoolType = formData.vorhergehendeSchulform;
  if (formData.vorhergehendeStufe)
    mapped.previousSchoolLevel = formData.vorhergehendeStufe;
  if (formData.abschluesse) mapped.degrees = formData.abschluesse;

  if (formData.beruf) mapped.profession = formData.beruf;
  if (formData.betriebEintritt) {
    mapped.trainingStartDate =
      typeof formData.betriebEintritt === "string"
        ? new Date(formData.betriebEintritt)
        : formData.betriebEintritt;
  }

  if (formData.betriebName) {
    mapped.employer = {
      companyName: formData.betriebName || "",
      address: [
        formData.betriebStraße,
        formData.betriebHausNr,
        formData.betriebPlz,
        formData.betriebOrt,
      ]
        .filter(Boolean)
        .join(" "),
      contactName: [formData.betriebApVorname, formData.betriebApNachname]
        .filter(Boolean)
        .join(" "),
      contactEmail:
        formData.betriebEmail ||
        ((formData as Record<string, unknown>).betriebMail as string) ||
        "",
      contactPhone:
        formData.betriebTelefon1 ||
        ((formData as Record<string, unknown>).betriebTel as string) ||
        formData.betriebApTelefon1 ||
        "",
      contactSalutation: formData.betriebApAnrede || "",
      verified: false,
    };
  }

  const contactPersons: Array<{
    type: string;
    firstName: string;
    lastName: string;
    phone: string;
    mobile: string;
    address: {
      street: string;
      city: string;
      zip: string;
      state: string;
      country: string;
      timezone: string;
    };
  }> = [];

  for (let i = 1; i <= maxContactPersons; i++) {
    const vorname = formData[`ansprechpartner${i}Vorname` as keyof StudentData];
    const nachname =
      formData[`ansprechpartner${i}Nachname` as keyof StudentData];

    if (vorname || nachname) {
      contactPersons.push({
        type:
          (formData[`ansprechpartner${i}Art` as keyof StudentData] as string) ||
          "parent",
        firstName: (vorname as string) || "",
        lastName: (nachname as string) || "",
        phone:
          (formData[
            `ansprechpartner${i}Mobil` as keyof StudentData
          ] as string) ||
          (formData[
            `ansprechpartner${i}Telefon1` as keyof StudentData
          ] as string) ||
          "",
        mobile:
          (formData[
            `ansprechpartner${i}Mobil` as keyof StudentData
          ] as string) || "",
        address: {
          street: [
            formData[`ansprechpartner${i}Straße` as keyof StudentData],
            formData[`ansprechpartner${i}HausNr` as keyof StudentData],
          ]
            .filter(Boolean)
            .join(" "),
          city:
            (formData[
              `ansprechpartner${i}Ort` as keyof StudentData
            ] as string) || "",
          zip:
            (formData[
              `ansprechpartner${i}Plz` as keyof StudentData
            ] as string) || "",
          state: "",
          country: "DE",
          timezone: "Europe/Berlin",
        },
      });
    }
  }

  if (contactPersons.length > 0) {
    mapped.contactPersons = contactPersons;
  }

  if (
    formData.datenschutz !== undefined ||
    formData.teilnahmeunterricht !== undefined ||
    formData.schulordnung !== undefined ||
    formData.personenabbildung !== undefined ||
    formData.teamsnutzung !== undefined
  ) {
    mapped.agreements = {
      dataProtection: formData.datenschutz || false,
      classParticipation: formData.teilnahmeunterricht || false,
      schoolRules: formData.schulordnung || false,
      imageRights: formData.personenabbildung || false,
      teamsUsage: formData.teamsnutzung || false,
    };
  }

  return mapped;
}

export function mapModelToFormData(
  student: Partial<Student>,
  maxContactPersons: number = 3,
): Partial<StudentData> {
  console.log("[mapModelToFormData] Input student:", {
    firstName: student.firstName,
    lastName: student.lastName,
    dateOfBirth: student.dateOfBirth,
  });

  const mapped: Partial<StudentData> = {};

  // Basic personal information
  if (student.firstName) mapped.vorname = student.firstName;
  if (student.lastName) mapped.nachname = student.lastName;
  if (student.birthName) mapped.geburtsname = student.birthName;
  if (student.dateOfBirth) {
    mapped.geburtsdatum =
      student.dateOfBirth instanceof Date
        ? student.dateOfBirth.toISOString().split("T")[0]
        : new Date(student.dateOfBirth).toISOString().split("T")[0];
  }

  console.log("[mapModelToFormData] Mapped basic fields:", {
    vorname: mapped.vorname,
    nachname: mapped.nachname,
    geburtsdatum: mapped.geburtsdatum,
  });
  if (student.gender) {
    const genderMap: Record<string, string> = {
      male: "männlich",
      female: "weiblich",
      diverse: "divers",
    };
    mapped.geschlecht = genderMap[student.gender] || student.gender;
  }
  if (student.birthplace) mapped.geburtsort = student.birthplace;
  if (student.birthCountry) mapped.geburtsland = student.birthCountry;
  if (student.religion) mapped.religion = student.religion;

  if (student.nationality) mapped.staatsangehoerigkeit1 = student.nationality;
  if (student.secondNationality)
    mapped.staatsangehoerigkeit2 = student.secondNationality;

  if (student.familyLanguage) mapped.familiensprache = student.familyLanguage;
  if (student.immigrationYear)
    mapped.zuzugsjahr = student.immigrationYear.toString();

  if (student.email) mapped.email = student.email;
  if (student.phone) mapped.mobil = student.phone;

  if (student.address) {
    const addressParts = student.address.street?.split(" ") || [];
    const hausNr = addressParts.pop() || "";
    const straße = addressParts.join(" ");

    mapped.straße = straße;
    mapped.hausNr = hausNr;
    mapped.postleitzahl = student.address.zip || "";
    mapped.ort = student.address.city || "";
  }

  if (student.schoolEntryDate) {
    mapped.eintrittschule =
      student.schoolEntryDate instanceof Date
        ? student.schoolEntryDate.toISOString().split("T")[0]
        : new Date(student.schoolEntryDate).toISOString().split("T")[0];
  }
  if (student.currentClassName) mapped.klassenname = student.currentClassName;

  if (student.previousSchool)
    mapped.vorhergehendeSchule = student.previousSchool;
  if (student.previousSchoolType)
    mapped.vorhergehendeSchulform = student.previousSchoolType;
  if (student.previousSchoolLevel)
    mapped.vorhergehendeStufe = student.previousSchoolLevel;
  if (student.degrees) mapped.abschluesse = student.degrees;

  if (student.profession) mapped.beruf = student.profession;
  if (student.trainingStartDate) {
    mapped.betriebEintritt =
      student.trainingStartDate instanceof Date
        ? student.trainingStartDate.toISOString().split("T")[0]
        : new Date(student.trainingStartDate).toISOString().split("T")[0];
  }

  if (student.employer) {
    mapped.betriebName = student.employer.companyName || "";

    mapped.betriebStraße = student.employer.address || "";

    const nameParts = student.employer.contactName?.split(" ") || [];
    mapped.betriebApVorname = nameParts[0] || "";
    mapped.betriebApNachname = nameParts.slice(1).join(" ") || "";

    mapped.betriebEmail = student.employer.contactEmail || "";
    mapped.betriebTelefon1 = student.employer.contactPhone || "";
    mapped.betriebApAnrede = student.employer.contactSalutation || "";
  }

  if (student.contactPersons && student.contactPersons.length > 0) {
    student.contactPersons.forEach((contact, index) => {
      if (index >= maxContactPersons) return;

      const contactNumber = index + 1;
      const prefix = `ansprechpartner${contactNumber}` as
        | "ansprechpartner1"
        | "ansprechpartner2"
        | "ansprechpartner3";

      mapped[`${prefix}Art`] = contact.type || "";
      mapped[`${prefix}Vorname`] = contact.firstName || "";
      mapped[`${prefix}Nachname`] = contact.lastName || "";
      mapped[`${prefix}Mobil`] = contact.mobile || "";
      mapped[`${prefix}Telefon1`] = contact.phone || "";

      if (contact.address) {
        const addressParts = contact.address.street?.split(" ") || [];
        const hausNr = addressParts.pop() || "";
        const straße = addressParts.join(" ");

        mapped[`${prefix}Straße`] = straße;
        mapped[`${prefix}HausNr`] = hausNr;
        mapped[`${prefix}Plz`] = contact.address.zip || "";
        mapped[`${prefix}Ort`] = contact.address.city || "";
      }
    });
  }

  if (student.agreements) {
    mapped.datenschutz = student.agreements.dataProtection || false;
    mapped.teilnahmeunterricht = student.agreements.classParticipation || false;
    mapped.schulordnung = student.agreements.schoolRules || false;
    mapped.personenabbildung = student.agreements.imageRights || false;
    mapped.teamsnutzung = student.agreements.teamsUsage || false;
  }

  return mapped;
}

export function validateOnboardingData(student: Partial<Student>): string[] {
  const requiredFields: (keyof Student)[] = [
    "firstName",
    "lastName",
    "dateOfBirth",
    "gender",
    "birthplace",
    "birthCountry",
    "nationality",
    "email",
    "address",
  ];

  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!student[field]) {
      missingFields.push(field);
    }
  }

  if (student.address) {
    if (!student.address.street) missingFields.push("address.street");
    if (!student.address.city) missingFields.push("address.city");
    if (!student.address.zip) missingFields.push("address.zip");
  }

  return missingFields;
}
