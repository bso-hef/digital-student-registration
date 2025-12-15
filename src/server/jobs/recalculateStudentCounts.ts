import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
import Class from "@/models/Class";
import Student from "@/models/Student";

const logger = new Logger("Recalculate Student Counts Job");

export interface RecalculateResult {
  success: boolean;
  updated: number;
  errors: string[];
}

export async function recalculateStudentCounts(): Promise<RecalculateResult> {
  const result: RecalculateResult = {
    success: true,
    updated: 0,
    errors: [],
  };

  try {
    await dbConnect();

    const classes = await Class.find({ active: true });

    logger.info(`Recalculating student counts for ${classes.length} classes`);

    for (const classDoc of classes) {
      try {
        const studentCount = await Student.countDocuments({
          currentClass: classDoc._id,
          active: true,
        });

        if (classDoc.studentCount !== studentCount) {
          classDoc.studentCount = studentCount;
          await classDoc.save();
          result.updated++;
          logger.info(
            `Updated class ${classDoc.name}: ${classDoc.studentCount} -> ${studentCount}`,
          );
        }
      } catch (error) {
        const errorMessage = `Failed to update class ${classDoc.name}: ${error}`;
        logger.error(errorMessage);
        result.errors.push(errorMessage);
        result.success = false;
      }
    }

    logger.info(
      `Recalculation complete: ${result.updated} classes updated, ${result.errors.length} errors`,
    );
  } catch (error) {
    const errorMessage = `Failed to recalculate student counts: ${error}`;
    logger.error(errorMessage);
    result.errors.push(errorMessage);
    result.success = false;
  }

  return result;
}
