import { SCHEMA } from "@/constants/db.constants";
import { generateUniqueVerificationCode } from "@/utils/verification.utils";
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

export interface ContactPerson {
  type: string;
  firstName: string;
  lastName: string;
  phone?: string;
  mobile?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    timezone?: string;
  };
}

const ContactPersonSchema = new Schema(
  {
    type: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    mobile: { type: String },
    address: { type: AddressSchema, default: undefined },
  },
  { _id: false },
);

interface Employer {
  companyName: string;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  contactSalutation?: string;
  verified: boolean;
}

const EmployerSchema = new Schema(
  {
    companyName: { type: String, default: "" },
    address: { type: String, default: "" },
    contactName: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    contactSalutation: { type: String, default: "" },
    verified: { type: Boolean, default: false },
  },
  { _id: false },
);

const AgreementsSchema = new Schema(
  {
    dataProtection: { type: Boolean, required: true },
    classParticipation: { type: Boolean, required: true },
    schoolRules: { type: Boolean, required: true },
    imageRights: { type: Boolean, required: true },
    teamsUsage: { type: Boolean, required: true },
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
    birthName: { type: String, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "diverse"],
      default: undefined,
    },
    birthplace: { type: String, trim: true },
    birthCountry: { type: String, trim: true },
    religion: { type: String, trim: true },

    nationality: { type: String, trim: true },
    secondNationality: { type: String, trim: true },

    familyLanguage: { type: String, trim: true },
    immigrationYear: { type: Number },

    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    address: { type: AddressSchema, default: undefined },

    currentClass: {
      type: ObjectId,
      ref: SCHEMA.CLASS,
      default: null,
    },
    currentClassName: { type: String, trim: true },
    schoolEntryDate: { type: Date },
    classHistory: { type: [ClassHistoryItemSchema], default: [] },

    previousSchool: { type: String, trim: true },
    previousSchoolType: { type: String, trim: true },
    previousSchoolLevel: { type: String, trim: true },
    degrees: { type: String, trim: true },

    profession: { type: String, trim: true },
    trainingStartDate: { type: Date },

    employer: { type: EmployerSchema, default: undefined },

    contactPersons: { type: [ContactPersonSchema], default: [] },

    agreements: { type: AgreementsSchema, default: undefined },

    onboardingStep: { type: Number, default: 0 },
    previousStep: { type: Number, default: null },

    firstNameNorm: { type: String, required: true, index: true },
    lastNameNorm: { type: String, required: true, index: true },
    collisionGroup: { type: String, index: true },
    ordinal: { type: Number, default: 1, index: true },
    status: {
      type: String,
      enum: ["imported", "invited", "onboarded"],
      default: "imported",
    },
    verificationCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true,
      uppercase: true,
      match: /^[0-9A-Z]{6}$/,
    },

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
      verificationCode?: string;
    },
  ) {
    if (!this.verificationCode) {
      const checkExists = async (code: string): Promise<boolean> => {
        const Model = this.constructor as mongoose.Model<mongoose.Document>;
        const existing = await Model.findOne({
          verificationCode: code,
        }).lean();
        return !!existing;
      };
      this.verificationCode = await generateUniqueVerificationCode(checkExists);
    }
  },
);

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
