import { http, HttpResponse } from 'msw';
import {
  createMockStudent,
  createMockStudents,
  createMockClass,
  createMockClasses,
  createMockDashboardStats,
  createMockDashboardHealth,
  createMockPaginationResponse,
  createMockApiError,
} from '../utils/factories';

/**
 * MSW handlers for mocking API routes in tests
 */

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * In-memory data stores for mock API
 */
let mockStudents = createMockStudents(10);
let mockClasses = createMockClasses(5);

/**
 * Reset mock data (useful between tests)
 */
export function resetMockData() {
  mockStudents = createMockStudents(10);
  mockClasses = createMockClasses(5);
}

/**
 * Get mock students
 */
export function getMockStudents() {
  return mockStudents;
}

/**
 * Get mock classes
 */
export function getMockClasses() {
  return mockClasses;
}

/**
 * Set mock students
 */
export function setMockStudents(students: any[]) {
  mockStudents = students;
}

/**
 * Set mock classes
 */
export function setMockClasses(classes: any[]) {
  mockClasses = classes;
}

export const handlers = [
  // ========== Students API ==========

  // GET /api/students - Get all students with pagination
  http.get(`${baseURL}/api/students`, ({ request }) => {
    const url = new URL(request.url);
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const paginatedStudents = mockStudents.slice(skip, skip + limit);
    const response = createMockPaginationResponse(paginatedStudents, {
      page: Math.floor(skip / limit) + 1,
      limit,
      totalDocs: mockStudents.length,
    });

    return HttpResponse.json(response);
  }),

  // POST /api/students - Create students
  http.post(`${baseURL}/api/students`, async ({ request }) => {
    const body = (await request.json()) as any;
    const students = Array.isArray(body) ? body : [body];

    const createdStudents = students.map((s) =>
      createMockStudent({
        firstName: s.firstName,
        lastName: s.lastName,
        dateOfBirth: new Date(s.dateOfBirth),
      })
    );

    mockStudents.push(...createdStudents);

    return HttpResponse.json({
      created: createdStudents,
      invalid: [],
      message: `Created ${createdStudents.length} students`,
    });
  }),

  // DELETE /api/students - Delete students
  http.delete(`${baseURL}/api/students`, async ({ request }) => {
    const body = (await request.json()) as any;
    const ids = body.ids || [];

    mockStudents = mockStudents.filter((s) => !ids.includes(s._id));

    return HttpResponse.json({
      deletedCount: ids.length,
      message: `Deleted ${ids.length} students`,
    });
  }),

  // ========== Classes API ==========

  // GET /api/classes - Get all classes with pagination
  http.get(`${baseURL}/api/classes`, ({ request }) => {
    const url = new URL(request.url);
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const paginatedClasses = mockClasses.slice(skip, skip + limit);
    const response = createMockPaginationResponse(paginatedClasses, {
      page: Math.floor(skip / limit) + 1,
      limit,
      totalDocs: mockClasses.length,
    });

    return HttpResponse.json(response);
  }),

  // POST /api/classes - Create classes
  http.post(`${baseURL}/api/classes`, async ({ request }) => {
    const body = (await request.json()) as any;
    const classes = Array.isArray(body) ? body : [body];

    const createdClasses = classes.map((c) =>
      createMockClass({
        name: c.name,
        grade: c.grade,
        schoolYearFrom: new Date(c.schoolYearFrom),
        schoolYearTo: new Date(c.schoolYearTo),
        isVocational: c.isVocational,
        requiresEmployerInfo: c.requiresEmployerInfo,
        active: c.active,
      })
    );

    mockClasses.push(...createdClasses);

    return HttpResponse.json({
      created: createdClasses,
      invalid: [],
      message: `Created ${createdClasses.length} classes`,
    });
  }),

  // DELETE /api/classes - Delete classes
  http.delete(`${baseURL}/api/classes`, async ({ request }) => {
    const body = (await request.json()) as any;
    const ids = body.ids || [];

    mockClasses = mockClasses.filter((c) => !ids.includes(c._id));

    return HttpResponse.json({
      deletedCount: ids.length,
      message: `Deleted ${ids.length} classes`,
    });
  }),

  // GET /api/classes/:classId - Get single class
  http.get(`${baseURL}/api/classes/:classId`, ({ params }) => {
    const { classId } = params;
    const classItem = mockClasses.find((c) => c._id === classId);

    if (!classItem) {
      return HttpResponse.json(
        createMockApiError('Class not found', 404),
        { status: 404 }
      );
    }

    return HttpResponse.json(classItem);
  }),

  // PATCH /api/classes/:classId - Update class
  http.patch(`${baseURL}/api/classes/:classId`, async ({ params, request }) => {
    const { classId } = params;
    const body = (await request.json()) as any;
    const classIndex = mockClasses.findIndex((c) => c._id === classId);

    if (classIndex === -1) {
      return HttpResponse.json(
        createMockApiError('Class not found', 404),
        { status: 404 }
      );
    }

    mockClasses[classIndex] = { ...mockClasses[classIndex], ...body };

    return HttpResponse.json({
      class: mockClasses[classIndex],
      message: 'Class updated successfully',
    });
  }),

  // DELETE /api/classes/:classId - Delete single class
  http.delete(`${baseURL}/api/classes/:classId`, ({ params }) => {
    const { classId } = params;
    const classIndex = mockClasses.findIndex((c) => c._id === classId);

    if (classIndex === -1) {
      return HttpResponse.json(
        createMockApiError('Class not found', 404),
        { status: 404 }
      );
    }

    mockClasses.splice(classIndex, 1);

    return HttpResponse.json({
      deletedCount: 1,
      message: 'Class deleted successfully',
    });
  }),

  // GET /api/classes/:classId/students - Get students in class
  http.get(`${baseURL}/api/classes/:classId/students`, ({ params, request }) => {
    const { classId } = params;
    const url = new URL(request.url);
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const classStudents = mockStudents.filter((s) => s.currentClass === classId);
    const paginatedStudents = classStudents.slice(skip, skip + limit);

    const response = createMockPaginationResponse(paginatedStudents, {
      page: Math.floor(skip / limit) + 1,
      limit,
      totalDocs: classStudents.length,
    });

    return HttpResponse.json(response);
  }),

  // POST /api/classes/:classId/students - Add students to class
  http.post(`${baseURL}/api/classes/:classId/students`, async ({ params, request }) => {
    const { classId } = params;
    const body = (await request.json()) as any;
    const studentIds = body.studentIds || [];

    studentIds.forEach((studentId: string) => {
      const student = mockStudents.find((s) => s._id === studentId);
      if (student) {
        student.currentClass = classId;
      }
    });

    return HttpResponse.json({
      addedCount: studentIds.length,
      message: `Added ${studentIds.length} students to class`,
    });
  }),

  // DELETE /api/classes/:classId/students - Remove students from class
  http.delete(`${baseURL}/api/classes/:classId/students`, async ({ params, request }) => {
    const { classId } = params;
    const body = (await request.json()) as any;
    const studentIds = body.studentIds || [];

    studentIds.forEach((studentId: string) => {
      const student = mockStudents.find((s) => s._id === studentId);
      if (student && student.currentClass === classId) {
        student.currentClass = null;
      }
    });

    return HttpResponse.json({
      removedCount: studentIds.length,
      message: `Removed ${studentIds.length} students from class`,
    });
  }),

  // ========== Dashboard API ==========

  // GET /api/dashboard/stats - Get dashboard statistics
  http.get(`${baseURL}/api/dashboard/stats`, () => {
    return HttpResponse.json(createMockDashboardStats());
  }),

  // ========== Health API ==========

  // GET /api/health/live - Liveness check
  http.get(`${baseURL}/api/health/live`, () => {
    return HttpResponse.json({ status: 'alive', timestamp: new Date().toISOString() });
  }),

  // GET /api/health/full - Full health check
  http.get(`${baseURL}/api/health/full`, () => {
    return HttpResponse.json(createMockDashboardHealth(true));
  }),
];

/**
 * Error handlers for testing error scenarios
 */
export const errorHandlers = {
  // Students API errors
  studentsGetError: http.get(`${baseURL}/api/students`, () => {
    return HttpResponse.json(
      createMockApiError('Failed to fetch students', 500),
      { status: 500 }
    );
  }),

  studentsPostError: http.post(`${baseURL}/api/students`, () => {
    return HttpResponse.json(
      createMockApiError('Failed to create students', 500),
      { status: 500 }
    );
  }),

  // Classes API errors
  classesGetError: http.get(`${baseURL}/api/classes`, () => {
    return HttpResponse.json(
      createMockApiError('Failed to fetch classes', 500),
      { status: 500 }
    );
  }),

  classesPostError: http.post(`${baseURL}/api/classes`, () => {
    return HttpResponse.json(
      createMockApiError('Failed to create classes', 500),
      { status: 500 }
    );
  }),

  // Dashboard API errors
  dashboardStatsError: http.get(`${baseURL}/api/dashboard/stats`, () => {
    return HttpResponse.json(
      createMockApiError('Failed to fetch dashboard stats', 500),
      { status: 500 }
    );
  }),

  // Health API errors
  healthFullError: http.get(`${baseURL}/api/health/full`, () => {
    return HttpResponse.json(createMockDashboardHealth(false));
  }),
};
