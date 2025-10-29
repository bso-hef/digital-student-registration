import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { GET, POST, DELETE } from "@/app/api/classes/route";
import {
  GET as GETById,
  PATCH,
} from "@/app/api/classes/[classId]/route";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import Class from "@/models/Class";
import { dbConnect } from "@/lib/config/mongo";

describe("Classes API Routes", () => {
  beforeAll(async () => {
    await dbConnect();
  });

  beforeEach(async () => {
    // Clean up test data before each test
    await Class.deleteMany({ name: /Test/ });
  });

  afterAll(async () => {
    // Clean up test data after all tests
    await Class.deleteMany({ name: /Test/ });
  });

  describe("GET /api/classes", () => {
    it("should return paginated classes", async () => {
      // Create test classes
      await Class.create([
        {
          name: "Test Class 1A",
          schoolYearFrom: new Date("2024-01-01"),
          schoolYearTo: new Date("2025-01-01"),
          grade: 1,
          isVocational: false,
          requiresEmployerInfo: false,
          active: true,
        },
        {
          name: "Test Class 2A",
          schoolYearFrom: new Date("2024-01-01"),
          schoolYearTo: new Date("2025-01-01"),
          grade: 2,
          isVocational: false,
          requiresEmployerInfo: false,
          active: true,
        },
      ]);

      const request = new NextRequest(
        "http://localhost:3000/api/classes?page=1&limit=25",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("classes");
      expect(data).toHaveProperty("page", 1);
      expect(data).toHaveProperty("limit", 25);
      expect(data).toHaveProperty("total");
      expect(data.classes.length).toBeGreaterThanOrEqual(2);
    });

    it("should respect pagination parameters", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/classes?page=1&limit=5",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.limit).toBe(5);
      expect(data.page).toBe(1);
      expect(data.classes.length).toBeLessThanOrEqual(5);
    });
  });

  describe("POST /api/classes", () => {
    it("should create valid classes", async () => {
      const classesData = [
        {
          name: "Test New Class 1",
          schoolYearFrom: "2024-09-01",
          schoolYearTo: "2025-07-31",
          grade: 1,
          isVocational: false,
          requiresEmployerInfo: false,
          active: true,
        },
      ];

      const request = new NextRequest("http://localhost:3000/api/classes", {
        method: "POST",
        body: JSON.stringify({ classes: classesData }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.createdCount).toBe(1);
      expect(data.invalidCount).toBe(0);
      expect(data.classes).toHaveLength(1);
      expect(data.classes[0]).toHaveProperty("name", "Test New Class 1");
    });

    it("should reject classes with invalid date ranges", async () => {
      const invalidData = [
        {
          name: "Test Invalid Class",
          schoolYearFrom: "2025-01-01",
          schoolYearTo: "2024-01-01", // To before From
          grade: 1,
        },
      ];

      const request = new NextRequest("http://localhost:3000/api/classes", {
        method: "POST",
        body: JSON.stringify({ classes: invalidData }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toContain("No valid classes");
      expect(data.invalidCount).toBe(1);
    });

    it("should reject classes with invalid grade", async () => {
      const invalidData = [
        {
          name: "Test Invalid Grade",
          schoolYearFrom: "2024-01-01",
          schoolYearTo: "2025-01-01",
          grade: 99, // Invalid grade
        },
      ];

      const request = new NextRequest("http://localhost:3000/api/classes", {
        method: "POST",
        body: JSON.stringify({ classes: invalidData }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.invalidCount).toBe(1);
    });

    it("should accept null grade", async () => {
      const classData = [
        {
          name: "Test Null Grade Class",
          schoolYearFrom: "2024-01-01",
          schoolYearTo: "2025-01-01",
          grade: null,
        },
      ];

      const request = new NextRequest("http://localhost:3000/api/classes", {
        method: "POST",
        body: JSON.stringify({ classes: classData }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.createdCount).toBe(1);
      expect(data.classes[0].grade).toBeNull();
    });

    it("should return 400 for empty array", async () => {
      const request = new NextRequest("http://localhost:3000/api/classes", {
        method: "POST",
        body: JSON.stringify({ classes: [] }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Invalid request body");
    });
  });

  describe("GET /api/classes/[classId]", () => {
    it("should return a specific class by ID", async () => {
      const testClass = await Class.create({
        name: "Test Specific Class",
        schoolYearFrom: new Date("2024-01-01"),
        schoolYearTo: new Date("2025-01-01"),
        grade: 5,
        isVocational: false,
        requiresEmployerInfo: false,
        active: true,
      });

      const request = new NextRequest(
        `http://localhost:3000/api/classes/${testClass._id}`,
      );
      const response = await GETById(request, {
        params: Promise.resolve({ classId: testClass._id.toString() }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe("Test Specific Class");
      expect(data.grade).toBe(5);
    });

    it("should return 400 for invalid ID format", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/classes/invalid-id",
      );
      const response = await GETById(request, {
        params: Promise.resolve({ classId: "invalid-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Invalid Class ID");
    });

    it("should return 404 for non-existent class", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const request = new NextRequest(
        `http://localhost:3000/api/classes/${fakeId}`,
      );
      const response = await GETById(request, {
        params: Promise.resolve({ classId: fakeId }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe("Class not found");
    });
  });

  describe("PATCH /api/classes/[classId]", () => {
    it("should update a class", async () => {
      const testClass = await Class.create({
        name: "Test Update Class",
        schoolYearFrom: new Date("2024-01-01"),
        schoolYearTo: new Date("2025-01-01"),
        grade: 3,
        isVocational: false,
        requiresEmployerInfo: false,
        active: true,
      });

      const updateData = {
        name: "Test Updated Class Name",
        grade: 4,
      };

      const request = new NextRequest(
        `http://localhost:3000/api/classes/${testClass._id}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateData),
        },
      );
      const response = await PATCH(request, {
        params: Promise.resolve({ classId: testClass._id.toString() }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe("Test Updated Class Name");
      expect(data.grade).toBe(4);
    });

    it("should return 404 for non-existent class", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const request = new NextRequest(
        `http://localhost:3000/api/classes/${fakeId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ name: "New Name" }),
        },
      );
      const response = await PATCH(request, {
        params: Promise.resolve({ classId: fakeId }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe("Class not found");
    });
  });

  describe("DELETE /api/classes", () => {
    it("should delete classes by IDs", async () => {
      const classes = await Class.create([
        {
          name: "Test Delete Class 1",
          schoolYearFrom: new Date("2024-01-01"),
          schoolYearTo: new Date("2025-01-01"),
          grade: 1,
        },
        {
          name: "Test Delete Class 2",
          schoolYearFrom: new Date("2024-01-01"),
          schoolYearTo: new Date("2025-01-01"),
          grade: 2,
        },
      ]);

      const ids = classes.map((c) => c._id.toString());

      const request = new NextRequest("http://localhost:3000/api/classes", {
        method: "DELETE",
        body: JSON.stringify({ ids }),
      });
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.deletedCount).toBe(2);

      // Verify classes were deleted
      const remaining = await Class.find({ _id: { $in: ids } });
      expect(remaining).toHaveLength(0);
    });

    it("should delete a single class using batch endpoint", async () => {
      const testClass = await Class.create({
        name: "Test Single Delete Class",
        schoolYearFrom: new Date("2024-01-01"),
        schoolYearTo: new Date("2025-01-01"),
        grade: 1,
      });

      const request = new NextRequest("http://localhost:3000/api/classes", {
        method: "DELETE",
        body: JSON.stringify({ ids: [testClass._id.toString()] }),
      });
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.deletedCount).toBe(1);

      // Verify class was deleted
      const found = await Class.findById(testClass._id);
      expect(found).toBeNull();
    });
  });
});
