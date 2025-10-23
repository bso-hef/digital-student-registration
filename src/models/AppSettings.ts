import { SCHEMA } from "@/constants/db.constants";
import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const AppSettingsSchema = new Schema(
  {
    dropdownOptions: {
      genderOptions: {
        type: [String],
        enum: ["male", "female", "diverse", ""],
        default: "",
      },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false, timestamps: true },
);

AppSettingsSchema.plugin(mongoosePaginate);

export default mongoose.model(SCHEMA.APP_SETTINGS, AppSettingsSchema);
