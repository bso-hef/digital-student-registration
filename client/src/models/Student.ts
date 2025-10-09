import { SCHEMA } from "@/constants/db.constants";
import { getAllTimezones, getCountry } from "countries-and-timezones";
import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { ObjectId } = Schema.Types;

const AddressSchema = new Schema(
  {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
    timezone: {
      type: String,
      enum: Object.keys(getAllTimezones()),
      default: getCountry("DE").timezones[0],
    },
  },
  { _id: false },
);

interface Employer {
  companyName: string;
  address: string;
  contactName: string;
  contactEmail: string;
  verified: boolean;
}

const EmployerSchema = new Schema(
  {
    companyName: { type: String, default: "" },
    address: { type: String, default: "" },
    contactName: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    verified: { type: Boolean, default: false },
  },
  { _id: false },
);

const ClassHistoryItemSchema = new Schema(
  {
    classId: { type: ObjectId, ref: SCHEMA.CLASS, required: true },
    schoolYear: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    note: { type: String, default: "" },
  },
  { _id: false },
);

const StudentSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },

    firstNameNorm: { type: String, required: true, index: true },
    lastNameNorm: { type: String, required: true, index: true },

    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    address: { type: AddressSchema, default: undefined },

    collisionGroup: { type: String, index: true },
    ordinal: { type: Number, default: 1, index: true },
    status: {
      type: String,
      enum: ["imported", "invited", "onboarded"],
      default: "imported",
    },

    currentClass: {
      type: ObjectId,
      ref: SCHEMA.CLASS,
      index: true,
      default: null,
    },

    classHistory: { type: [ClassHistoryItemSchema], default: [] },

    employer: { type: EmployerSchema, default: undefined },

    active: { type: Boolean, default: true },
  },
  { versionKey: false, timestamps: true },
);

StudentSchema.index({ firstNameNorm: 1, lastNameNorm: 1, dateOfBirth: 1 });
StudentSchema.index(
  { currentClass: 1 },
  { partialFilterExpression: { active: true } },
);

StudentSchema.plugin(mongoosePaginate);

StudentSchema.pre(
  "save",
  async function (
    this: mongoose.Document & {
      currentClass?: mongoose.Types.ObjectId;
      employer?: Employer;
    },
  ) {
    if (!this.currentClass) return;
    const ClassModel = mongoose.model(SCHEMA.CLASS);
    const classDoc = await ClassModel.findById(this.currentClass).lean();
    if (classDoc && !Array.isArray(classDoc) && classDoc.requiresEmployerInfo) {
      const e = (this.employer || {}) as Employer;
      const ok = e.companyName && e.contactName && e.contactEmail;
      if (!ok) {
        throw new Error("Employer info required for this class");
      }
    }
  },
);

export default mongoose.models.Student ||
  mongoose.model(SCHEMA.STUDENT, StudentSchema);
