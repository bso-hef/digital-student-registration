import { SCHEMA } from "@/constants/db.constants";
import bcrypt from "bcryptjs";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  recoveryCode: string;
  isSetup: boolean;
  role: string;
  active: boolean;
  lastLogin: Date | null;
  firstName: string;
  lastName: string;
  avatar: string | null;
  phone: string;
  jobTitle: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
  verifyPassword(candidatePassword: string): Promise<boolean>;
  verifyRecoveryCode(candidateCode: string): Promise<boolean>;
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    recoveryCode: {
      type: String,
      required: true,
    },
    isSetup: {
      type: Boolean,
      default: true,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    firstName: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },
    lastName: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },
    avatar: {
      type: String,
      default: null,
      validate: {
        validator: function (v: string | null) {
          if (!v) return true;
          return v.length <= 1400000;
        },
        message: "Avatar image size exceeds 1MB limit",
      },
    },
    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 30,
    },
    jobTitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },
    timezone: {
      type: String,
      default: "Europe/Berlin",
      trim: true,
    },
  },
  { versionKey: false, timestamps: true },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre("save", async function () {
  if (!this.isModified("recoveryCode")) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.recoveryCode = await bcrypt.hash(this.recoveryCode, salt);
});

UserSchema.methods.verifyPassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch {
    return false;
  }
};

UserSchema.methods.verifyRecoveryCode = async function (
  candidateCode: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidateCode, this.recoveryCode);
  } catch {
    return false;
  }
};

export default mongoose.models.User ||
  mongoose.model<IUser>(SCHEMA.USER, UserSchema);
