import { SCHEMA } from "@/constants/db.constants";
import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const AuditLogSchema = new Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "student.create",
        "student.update",
        "student.delete",
        "student.assign_to_class",
        "student.remove_from_class",

        "class.create",
        "class.update",
        "class.delete",
        "class.activate",
        "class.deactivate",

        "settings.update_onboarding",
        "settings.update_agreements",
        "settings.update_integrations",
        "settings.update_audit",
        "settings.update_general",

        "system.clear_audit_logs",

        "auth.login",
        "auth.logout",
        "auth.permission_change",
        "auth.profile_update",
        "auth.password_change",
      ],
      index: true,
    },

    userId: { type: String, default: "system" },
    userName: { type: String, default: "System" },
    userEmail: { type: String },

    ipAddress: { type: String },
    userAgent: { type: String },

    status: {
      type: String,
      enum: ["success", "failure", "partial"],
      default: "success",
      required: true,
      index: true,
    },

    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },

    category: {
      type: String,
      enum: ["student", "class", "settings", "auth", "system"],
      required: true,
      index: true,
    },

    timestamp: { type: Date, default: Date.now, required: true },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "timestamp", updatedAt: false },
  },
);

AuditLogSchema.index({ category: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ status: 1, timestamp: -1 });

AuditLogSchema.index(
  { timestamp: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90 },
);

AuditLogSchema.plugin(mongoosePaginate);

export default mongoose.models.AuditLog ||
  mongoose.model(SCHEMA.AUDIT_LOG, AuditLogSchema);
