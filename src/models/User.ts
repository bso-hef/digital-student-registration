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
  },
  { versionKey: false, timestamps: true },
);

// Hash password before saving if it's modified
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate salt with 12 rounds (recommended for security)
    const salt = await bcrypt.genSalt(12);
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Hash recovery code before saving if it's modified
UserSchema.pre("save", async function (next) {
  // Only hash the recovery code if it has been modified (or is new)
  if (!this.isModified("recoveryCode")) {
    return next();
  }

  try {
    // Generate salt with 12 rounds
    const salt = await bcrypt.genSalt(12);
    // Hash the recovery code
    this.recoveryCode = await bcrypt.hash(this.recoveryCode, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Method to verify password
UserSchema.methods.verifyPassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch {
    return false;
  }
};

// Method to verify recovery code
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
