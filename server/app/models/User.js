import { getAllTimezones, getCountry } from "countries-and-timezones";
import mongoosePaginate from "mongoose-paginate-v2";
import validator from "validator";

import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        // Wrap validator.isEmail to only pass the email value.
        validator: value => validator.isEmail(value),
        message: "{VALUE} is not a valid email",
      },
    },
    password: { type: String, required: true },
    firstName: { type: String, required: true, lowercase: true },
    lastName: { type: String, required: true, lowercase: true },
    settings: {
      language: {
        type: String,
        enum: ["en", "de"], // Example language options
        default: "en",
      },
      theme: {
        type: String,
        enum: ["light", "dark"], // Example theme options
        default: "dark",
      },
      timezone: {
        type: String,
        enum: Object.keys(getAllTimezones()),
        default: getCountry("DE").timezones[0],
        required: true,
      },
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    deleted: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true },
);

UserSchema.methods = {
  immutableAttributes: function () {
    let attributes = ["userName", "email"];

    if (this.isExternal()) {
      attributes.push("firstName", "lastName", "role");
    }

    return attributes;
  },

  toObjectWithImmutableAttributes: function () {
    const immutableAttributes = this.immutableAttributes();
    return {
      ...this.toObject(),
      immutableAttributes,
    };
  },
};

UserSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", UserSchema);
export default User;
