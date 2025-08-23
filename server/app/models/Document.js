import mongoosePaginate from "mongoose-paginate-v2";
import validator from "validator";

import mongoose from "mongoose";

const DocumentSchema = new Schema(
  {
    name: { type: String, required: true },
    extension: { type: String, required: false },
    size: { type: String, required: false },
    s3Name: { type: String, required: false },
    type: { type: String, required: false },
    status: { type: Boolean, required: false },
    objectKey: { type: String, required: false },
    link: {
      type: String,
      required: true,
      validate: {
        // Wrap the validator so only the value is passed.
        validator: value => validator.isURL(value),
        message: "URL_IS_NOT_VALID",
      },
    },
    uploadFrom: {
      type: String,
      enum: [
        "user-account",
        "user-documents",
        "application-settings-appearance",
      ],
      required: false,
    },
    uploadDate: { type: Date, required: false },
    uploadBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
    isSigned: { type: Boolean, default: false },
    isUsed: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true },
);

DocumentSchema.plugin(mongoosePaginate);

const DocumentModel = mongoose.model("Document", DocumentSchema);
export default DocumentModel;
