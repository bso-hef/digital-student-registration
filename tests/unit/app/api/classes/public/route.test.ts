import { GET } from "@/app/api/classes/public/route";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  dbConnect: vi.fn(),
  find: vi.fn(),
  loggerError: vi.fn(),
}));

vi.mock("@/lib/config/mongo", () => ({
  dbConnect: mocks.dbConnect,
}));

vi.mock("@/lib/server-logger", () => ({
  default: function Logger() {
    return {
      error: mocks.loggerError,
    };
  },
}));

vi.mock("@/models/Class", () => ({
  default: {
    find: mocks.find,
  },
}));

const mockClassQuery = (classes: unknown[]) => {
  const lean = vi.fn().mockResolvedValue(classes);
  const sort = vi.fn(() => ({ lean }));
  const select = vi.fn(() => ({ sort }));

  mocks.find.mockReturnValue({ select });

  return { select, sort, lean };
};

describe("GET /api/classes/public", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return active classes sorted by name", async () => {
    const classes = [
      {
        _id: "class1",
        name: "10A",
        active: true,
        isVocational: false,
      },
    ];
    const query = mockClassQuery(classes);

    const response = await GET();
    const data = await response.json();

    expect(mocks.dbConnect).toHaveBeenCalledTimes(1);
    expect(mocks.find).toHaveBeenCalledWith({ active: true });
    expect(query.select).toHaveBeenCalledWith(
      "_id schoolYearFrom schoolYearTo name grade isVocational requiresEmployerInfo active incomplete studentCount",
    );
    expect(query.sort).toHaveBeenCalledWith({ name: 1 });
    expect(response.status).toBe(200);
    expect(data).toEqual({ classes });
  });

  it("should return 500 when class loading fails", async () => {
    const error = new Error("database unavailable");
    mocks.find.mockImplementation(() => {
      throw error;
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ message: "Internal server error" });
    expect(mocks.loggerError).toHaveBeenCalledWith(
      "Failed to retrieve public classes",
      "database unavailable",
    );
  });
});
