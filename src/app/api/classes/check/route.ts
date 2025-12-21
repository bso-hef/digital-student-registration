import { auth } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
import Class from "@/models/Class";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Classes Check");

interface CheckClassesResponse {
  existing: string[];
  missing: string[];
  classMap: Record<string, string>;
}

// ---------- POST (Check which classes exist) ----------
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const classNames: string[] = body?.classNames;

    // Validate input
    if (!Array.isArray(classNames)) {
      return NextResponse.json(
        { message: "Invalid request body: classNames must be an array" },
        { status: 400 },
      );
    }

    // Filter out empty strings and trim whitespace
    const cleanedNames = classNames
      .filter(
        (name): name is string =>
          typeof name === "string" && name.trim() !== "",
      )
      .map((name) => name.trim());

    // If no valid class names, return empty results
    if (cleanedNames.length === 0) {
      const response: CheckClassesResponse = {
        existing: [],
        missing: [],
        classMap: {},
      };
      return NextResponse.json(response, { status: 200 });
    }

    // Get unique class names
    const uniqueNames = [...new Set(cleanedNames)];

    // Find existing classes by name
    const existingClasses = await Class.find(
      { name: { $in: uniqueNames } },
      { name: 1, _id: 1 },
    ).lean<{ name: string; _id: { toString(): string } }[]>();

    // Build the response
    const existingNames = new Set(existingClasses.map((c) => c.name));
    const classMap: Record<string, string> = {};

    existingClasses.forEach((c) => {
      classMap[c.name] = c._id.toString();
    });

    const response: CheckClassesResponse = {
      existing: Array.from(existingNames),
      missing: uniqueNames.filter((name) => !existingNames.has(name)),
      classMap,
    };

    logger.info(
      `Checked ${uniqueNames.length} classes: ${response.existing.length} existing, ${response.missing.length} missing`,
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    logger.error(
      "Failed to check classes",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
