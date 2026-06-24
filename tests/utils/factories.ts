import type { ClassInterface } from "@/types/class";

/**
 * Test data factories for generating mock entities
 */

/**
 * Counter for generating unique IDs
 */
let studentIdCounter = 1;
let classIdCounter = 1;

/**
 * Reset all factory counters (useful between tests)
 */
export function resetFactoryCounters() {
  studentIdCounter = 1;
  classIdCounter = 1;
}

/**
 * Generate a mock MongoDB ObjectId
 */
export function createMockObjectId(counter?: number): string {
  const count = counter || Math.floor(Math.random() * 1000000);
  return count.toString(16).padStart(24, "0");
}

/**
 * Create a mock Student entity
 */
interface CreateMockStudentOptions {
  _id?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  email?: string;
  phone?: string;
  status?: "imported" | "invited" | "onboarded";
  currentClass?: string | null;
  active?: boolean;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    timezone?: string;
  };
  employer?: {
    companyName?: string;
    address?: string;
    contactName?: string;
    contactEmail?: string;
    verified?: boolean;
  };
}

export function createMockStudent(options: CreateMockStudentOptions = {}): any {
  const id = studentIdCounter++;
  const firstName = options.firstName || `FirstName${id}`;
  const lastName = options.lastName || `LastName${id}`;

  return {
    _id: options._id || createMockObjectId(id),
    firstName,
    lastName,
    dateOfBirth: options.dateOfBirth || new Date("2005-01-15"),
    firstNameNorm: firstName.toLowerCase(),
    lastNameNorm: lastName.toLowerCase(),
    email: options.email || `student${id}@test.com`,
    phone: options.phone || `+49123456${id.toString().padStart(4, "0")}`,
    address: options.address || {
      street: "Test Street",
      city: "Test City",
      state: "Test State",
      zip: "12345",
      country: "DE",
      timezone: "Europe/Berlin",
    },
    collisionGroup: null,
    ordinal: 1,
    status: options.status || "imported",
    currentClass: options.currentClass || null,
    classHistory: [],
    employer: options.employer || undefined,
    active: options.active !== undefined ? options.active : true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Create multiple mock Students
 */
export function createMockStudents(
  count: number,
  baseOptions: CreateMockStudentOptions = {},
): any[] {
  return Array.from({ length: count }, (_, index) =>
    createMockStudent({
      ...baseOptions,
      firstName: baseOptions.firstName || `Student${index + 1}`,
      lastName: baseOptions.lastName || `Last${index + 1}`,
    }),
  );
}

/**
 * Create a mock Class entity
 */
interface CreateMockClassOptions {
  _id?: string;
  schoolYearFrom?: Date | null;
  schoolYearTo?: Date | null;
  name?: string;
  grade?: number | null;
  isVocational?: boolean;
  requiresEmployerInfo?: boolean;
  active?: boolean;
  studentCount?: number;
  students?: any[];
}

export function createMockClass(
  options: CreateMockClassOptions = {},
): ClassInterface {
  const id = classIdCounter++;
  const currentYear = new Date().getFullYear();

  return {
    _id: options._id || createMockObjectId(id),
    schoolYearFrom: options.schoolYearFrom || new Date(`${currentYear}-09-01`),
    schoolYearTo: options.schoolYearTo || new Date(`${currentYear + 1}-07-31`),
    name: options.name || `Class ${id}A`,
    grade: options.grade !== undefined ? options.grade : id,
    isVocational: options.isVocational || false,
    requiresEmployerInfo: options.requiresEmployerInfo || false,
    active: options.active !== undefined ? options.active : true,
    studentCount: options.studentCount || 0,
    students: options.students || [],
  };
}

/**
 * Create multiple mock Classes
 */
export function createMockClasses(
  count: number,
  baseOptions: CreateMockClassOptions = {},
): ClassInterface[] {
  return Array.from({ length: count }, (_, index) =>
    createMockClass({
      ...baseOptions,
      name: baseOptions.name || `Class ${index + 1}A`,
      grade: baseOptions.grade !== undefined ? baseOptions.grade : index + 1,
    }),
  );
}

/**
 * Create a mock Dashboard Stats response
 */
export function createMockDashboardStats() {
  return {
    totalStudents: 150,
    totalClasses: 12,
    activeStudents: 145,
    inactiveStudents: 5,
    studentsOnboarded: 120,
    studentsInvited: 25,
    studentsImported: 5,
    vocationalClasses: 4,
    regularClasses: 8,
    averageClassSize: 12.5,
    studentsByGrade: {
      "1": 15,
      "2": 14,
      "3": 13,
      "4": 12,
      "5": 11,
      "6": 10,
      "7": 10,
      "8": 12,
      "9": 13,
      "10": 14,
      "11": 13,
      "12": 8,
      "13": 5,
    },
    registrationTrend: [
      { date: "2025-01-01", count: 10 },
      { date: "2025-02-01", count: 15 },
      { date: "2025-03-01", count: 20 },
      { date: "2025-04-01", count: 25 },
      { date: "2025-05-01", count: 22 },
      { date: "2025-06-01", count: 18 },
    ],
  };
}

/**
 * Create a mock Dashboard Health response
 */
export function createMockDashboardHealth(healthy = true) {
  return {
    status: healthy ? "healthy" : "unhealthy",
    database: {
      connected: healthy,
      latency: healthy ? 15 : 5000,
    },
    api: {
      responsive: healthy,
      latency: healthy ? 25 : 3000,
    },
    uptime: 86400000, // 1 day in milliseconds
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create mock StudentData for forms
 */
export function createMockStudentData(overrides: Partial<any> = {}): any {
  return {
    klassenname: "Test Class",
    vorname: "John",
    nachname: "Doe",
    geburtsname: "Doe",
    straße: "Main Street",
    hausNr: "123",
    postleitzahl: "12345",
    ort: "Berlin",
    geburtsort: "Berlin",
    geburtsland: "Germany",
    zuzugsjahr: "2000",
    mobil: "+491234567890",
    telefon1: "+491234567891",
    email: "john.doe@test.com",
    religion: "None",
    familiensprache: "German",
    geburtsdatum: "2005-01-15",
    geschlecht: "male",
    staatsangehoerigkeit1: "German",
    staatsangehoerigkeit2: "",
    beruf: "",
    eintrittschule: "2025-09-01",
    abschlüsse: "High School",
    vorhergehendeSchule: "Previous School",
    vorhergehendeSchulform: "Gymnasium",
    vorhergehendeStufe: "10",
    betriebApAnrede: "",
    betriebApVorname: "",
    betriebApNachname: "",
    betriebApTelefon1: "",
    betriebEintritt: "",
    betriebName: "",
    betriebStraße: "",
    betriebHausNr: "",
    betriebPlz: "",
    betriebOrt: "",
    betriebTelefon1: "",
    betriebEmail: "",
    ansprechpartner1Art: "Mother",
    ansprechpartner1Vorname: "Jane",
    ansprechpartner1Nachname: "Doe",
    ansprechpartner1Straße: "Main Street",
    ansprechpartner1HausNr: "123",
    ansprechpartner1Plz: "12345",
    ansprechpartner1Ort: "Berlin",
    ansprechpartner1Mobil: "+491234567892",
    ansprechpartner1Telefon1: "+491234567893",
    datenschutz: true,
    teilnahmeunterricht: true,
    schulordnung: true,
    personenabbildung: true,
    teamsnutzung: true,
    ...overrides,
  };
}

/**
 * Create mock pagination response
 */
export function createMockPaginationResponse<T>(
  docs: T[],
  options: {
    page?: number;
    limit?: number;
    totalDocs?: number;
  } = {},
) {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const totalDocs = options.totalDocs || docs.length;
  const totalPages = Math.ceil(totalDocs / limit);

  return {
    docs,
    totalDocs,
    limit,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
    pagingCounter: (page - 1) * limit + 1,
  };
}

/**
 * Create mock API error response
 */
export function createMockApiError(
  message = "An error occurred",
  statusCode = 500,
) {
  return {
    message,
    statusCode,
    error: "Internal Server Error",
    timestamp: new Date().toISOString(),
  };
}
