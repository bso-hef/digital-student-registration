import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
import Student from "@/models/Student";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Student Onboarding");

/**
 * GET /api/students/[id]/onboarding
 * Loads student data for onboarding (no auth required for students)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 },
      );
    }

    // Find student by ID
    const student = await Student.findById(id).populate("currentClass").lean();

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Check if student has already completed onboarding
    if ((student as unknown as { status?: string }).status === "onboarded") {
      logger.info(`Student ${id} has already completed onboarding`);
    }

    logger.info(`Loaded student data for onboarding: ${id}`);

    return NextResponse.json(
      {
        data: student,
        message: "Student data loaded successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error loading student for onboarding:", error);
    return NextResponse.json(
      {
        error: "Failed to load student data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/students/[id]/onboarding
 * Updates student onboarding data (auto-save or final submission)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const { finalSubmit, onboardingStep, ...updateData } = body as {
      finalSubmit?: boolean;
      onboardingStep?: number;
    } & Record<string, unknown>;

    // Find student by ID
    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Step validation: User can only advance one step at a time
    const studentDoc = student as unknown as {
      onboardingStep?: number;
      status?: string;
    };
    const currentStep = studentDoc.onboardingStep || 0;

    if (onboardingStep !== undefined) {
      // Allow going back to previous steps
      if (onboardingStep > currentStep + 1) {
        logger.warn(
          `Student ${id} attempted to skip steps: ${currentStep} -> ${onboardingStep}`,
        );
        return NextResponse.json(
          {
            error: "Invalid step progression",
            message: "You must complete steps in order",
          },
          { status: 400 },
        );
      }
    }

    // Update student fields
    Object.keys(updateData).forEach((key) => {
      if (key !== "_id" && key !== "createdAt" && key !== "updatedAt") {
        // Treat student as a generic record to avoid using `any` while allowing dynamic updates
        (student as unknown as Record<string, unknown>)[key] = updateData[key];
      }
    });

    // Update onboarding step if provided
    if (onboardingStep !== undefined) {
      (student as unknown as Record<string, unknown>)["onboardingStep"] =
        onboardingStep;
    }

    // If final submit, change status to "onboarded"
    if (finalSubmit) {
      student.status = "onboarded";
      logger.info(`Student ${id} completed onboarding`);
    } else {
      logger.info(`Auto-saved progress for student ${id}`);
    }

    // Save student
    await student.save();

    // Populate currentClass for response
    await student.populate("currentClass");

    return NextResponse.json(
      {
        data: student,
        message: finalSubmit
          ? "Onboarding completed successfully"
          : "Progress saved successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error updating student onboarding:", error);

    // Check if it's a validation error
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update onboarding data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
