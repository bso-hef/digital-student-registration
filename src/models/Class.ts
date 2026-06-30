import { SCHEMA } from "@/constants/db.constants";
import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ClassSchema = new Schema(
  {
    schoolYearFrom: { type: Date, required: true },
    schoolYearTo: { type: Date, required: true },

    name: { type: String, required: true },
    grade: { type: Number, default: null },

    isVocational: { type: Boolean, default: false },
    requiresEmployerInfo: { type: Boolean, default: false },

    studentCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true, required: true },
    incomplete: { type: Boolean, default: false, index: true },
  },
  { versionKey: false, timestamps: true },
);

// Auto-calculate incomplete field based on grade
ClassSchema.pre("save", function () {
  // Set incomplete to true if grade is null, otherwise false
  this.incomplete = this.grade === null || this.grade === undefined;
});

ClassSchema.pre("validate", function () {
  const from = this.get("schoolYearFrom") as Date | undefined;
  const to = this.get("schoolYearTo") as Date | undefined;

  if (!from || !to)
    throw new Error("schoolYearFrom und schoolYearTo sind erforderlich.");
  if (to <= from)
    throw new Error("schoolYearTo muss NACH schoolYearFrom liegen.");
});

ClassSchema.index(
  { schoolYearFrom: 1, schoolYearTo: 1, name: 1 },
  { unique: true },
);
ClassSchema.plugin(mongoosePaginate);

const ClassModel =
  mongoose.models.Class || mongoose.model(SCHEMA.CLASS, ClassSchema);

export default ClassModel;
