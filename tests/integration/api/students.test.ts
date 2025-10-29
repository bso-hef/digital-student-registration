import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { GET, POST, DELETE } from "@/app/api/students/route";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import Student from "@/models/Student";
import Class from "@/models/Class";
import { dbConnect } from "@/lib/config/mongo";

describe("Students API Routes", () => {
  beforeAll(async () => {
    await dbConnect();
  });

  beforeEach(async () => {
    // Clean up test data before each test
    await Student.deleteMany({ firstName: /Test/ });
    await Class.deleteMany({ name: /Test/ });
  });

  afterAll(async () => {
    // Clean up test data after all tests
    await Student.deleteMany({ firstName: /Test/ });
    await Class.deleteMany({ name: /Test/ });
    // Connection will be closed automatically after all integration tests complete
  });

  describe("GET /api/students", () => {
    it("should return paginated students", async () => {
      // Create test students
      await Student.create([
        {
          firstName: "Test1",
          lastName: "Student",
          dateOfBirth: new Date("2000-01-01"),
          firstNameNorm: "test1",
          lastNameNorm: "student",
          status: "imported",
        },
        {
          firstName: "Test2",
          lastName: "Student",
          dateOfBirth: new Date("2000-01-02"),
          firstNameNorm: "test2",
          lastNameNorm: "student",
          status: "imported",
        },
      ]);

      const request = new NextRequest(
        "http://localhost:3000/api/students?page=1&limit=25",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("students");
      expect(data).toHaveProperty("page", 1);
      expect(data).toHaveProperty("limit", 25);
      expect(data).toHaveProperty("total");
      expect(data.students.length).toBeGreaterThanOrEqual(2);
    });

    it("should return only unassigned students when flag is true", async () => {
      // Create a test class
      const testClass = await Class.create({
        name: "Test Class",
        schoolYearFrom: new Date("2024-01-01"),
        schoolYearTo: new Date("2025-01-01"),
        grade: 1,
        isVocational: false,
        requiresEmployerInfo: false,
        active: true,
      });

      // Create assigned and unassigned students
      await Student.create([
        {
          firstName: "TestAssigned",
          lastName: "Student",
          dateOfBirth: new Date("2000-01-01"),
          firstNameNorm: "testassigned",
          lastNameNorm: "student",
          status: "imported",
          currentClass: testClass._id,
          active: true,
        },
        {
          firstName: "TestUnassigned",
          lastName: "Student",
          dateOfBirth: new Date("2000-01-02"),
          firstNameNorm: "testunassigned",
          lastNameNorm: "student",
          status: "imported",
          currentClass: null,
          active: true,
        },
      ]);

      const request = new NextRequest(
        "http://localhost:3000/api/students?unassigned=true",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.students).toBeDefined();
      // All returned students should not have currentClass
      data.students.forEach((student: { currentClass: unknown }) => {
        expect(student.currentClass).toBeNull();
      });
    });

    it("should respect pagination parameters", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/students?page=1&limit=10",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.limit).toBe(10);
      expect(data.page).toBe(1);
      expect(data.students.length).toBeLessThanOrEqual(10);
    });
  });

  describe("POST /api/students", () => {
    it("should create valid students", async () => {
      const studentsData = [
        {
          firstName: "TestCreate1",
          lastName: "Student",
          dateOfBirth: "2000-01-01",
        },
        {
          firstName: "TestCreate2",
          lastName: "Student",
          dateOfBirth: "2000-01-02",
        },
      ];

      const request = new NextRequest("http://localhost:3000/api/students", {
        method: "POST",
        body: JSON.stringify({ students: studentsData }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.createdCount).toBe(2);
      expect(data.invalidCount).toBe(0);
      expect(data.created).toHaveLength(2);
      expect(data.created[0]).toHaveProperty("firstName", "TestCreate1");
    });

    it("should reject invalid student data", async () => {
      const invalidData = [
        {
          firstName: "", // Empty first name
          lastName: "Student",
          dateOfBirth: "2000-01-01",
        },
      ];

      const request = new NextRequest("http://localhost:3000/api/students", {
        method: "POST",
        body: JSON.stringify({ students: invalidData }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toContain("No valid students");
    });

    it("should handle mixed valid and invalid data", async () => {
      const mixedData = [
        {
          firstName: "TestValid",
          lastName: "Student",
          dateOfBirth: "2000-01-01",
        },
        {
          firstName: "", // Invalid
          lastName: "Student",
          dateOfBirth: "2000-01-02",
        },
      ];

      const request = new NextRequest("http://localhost:3000/api/students", {
        method: "POST",
        body: JSON.stringify({ students: mixedData }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.createdCount).toBe(1);
      expect(data.invalidCount).toBe(1);
    });

    it("should return 400 for empty array", async () => {
      const request = new NextRequest("http://localhost:3000/api/students", {
        method: "POST",
        body: JSON.stringify({ students: [] }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Invalid request body");
    });

    it("should normalize student names", async () => {
      const studentsData = [
        {
          firstName: "Müller",
          lastName: "Schröder",
          dateOfBirth: "2000-01-01",
        },
      ];

      const request = new NextRequest("http://localhost:3000/api/students", {
        method: "POST",
        body: JSON.stringify({ students: studentsData }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.created[0]).toHaveProperty("firstNameNorm");
      expect(data.created[0]).toHaveProperty("lastNameNorm");
    });
  });

  describe("DELETE /api/students", () => {
    it("should delete students by IDs", async () => {
      // Create test students
      const students = await Student.create([
        {
          firstName: "TestDelete1",
          lastName: "Student",
          dateOfBirth: new Date("2000-01-01"),
          firstNameNorm: "testdelete1",
          lastNameNorm: "student",
          status: "imported",
        },
        {
          firstName: "TestDelete2",
          lastName: "Student",
          dateOfBirth: new Date("2000-01-02"),
          firstNameNorm: "testdelete2",
          lastNameNorm: "student",
          status: "imported",
        },
      ]);

      const ids = students.map((s) => s._id.toString());

      const request = new NextRequest("http://localhost:3000/api/students", {
        method: "DELETE",
        body: JSON.stringify({ ids }),
      });
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.deletedCount).toBe(2);

      // Verify students were actually deleted
      const remaining = await Student.find({ _id: { $in: ids } });
      expect(remaining).toHaveLength(0);
    });

    it("should return 400 for empty ids array", async () => {
      const request = new NextRequest("http://localhost:3000/api/students", {
        method: "DELETE",
        body: JSON.stringify({ ids: [] }),
      });
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Invalid request body");
    });

    it("should handle non-existent IDs gracefully", async () => {
      const fakeIds = [
        new mongoose.Types.ObjectId().toString(),
        new mongoose.Types.ObjectId().toString(),
      ];

      const request = new NextRequest("http://localhost:3000/api/students", {
        method: "DELETE",
        body: JSON.stringify({ ids: fakeIds }),
      });
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.deletedCount).toBe(0);
    });
  });
});
