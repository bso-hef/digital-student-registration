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
  },
  { versionKey: false, timestamps: true },
);

ClassSchema.pre("validate", function (next) {
  const from = this.get("schoolYearFrom") as Date | undefined;
  const to = this.get("schoolYearTo") as Date | undefined;

  if (!from || !to)
    return next(
      new Error("schoolYearFrom und schoolYearTo sind erforderlich."),
    );
  if (to <= from)
    return next(new Error("schoolYearTo muss NACH schoolYearFrom liegen."));
  next();
});

ClassSchema.index(
  { schoolYearFrom: 1, schoolYearTo: 1, name: 1 },
  { unique: true },
);
ClassSchema.plugin(mongoosePaginate);

const ClassModel =
  mongoose.models.Class || mongoose.model(SCHEMA.CLASS, ClassSchema);

export default ClassModel;
