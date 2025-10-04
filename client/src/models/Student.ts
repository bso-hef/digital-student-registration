import { getAllTimezones, getCountry } from "countries-and-timezones";
import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false, timestamps: true },
);

StudentSchema.index({ firstNameNorm: 1, lastNameNorm: 1, dateOfBirth: 1 });
StudentSchema.plugin(mongoosePaginate);

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
