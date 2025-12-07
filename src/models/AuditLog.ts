import { SCHEMA } from "@/constants/db.constants";
import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const AuditLogSchema = new Schema(
  {
    // Action information
    action: {
      type: String,
      required: true,
      enum: [
        // Student actions
        "student.create",
        "student.update",
        "student.delete",
        "student.assign_to_class",
        "student.remove_from_class",

        // Class actions
        "class.create",
        "class.update",
        "class.delete",
        "class.activate",
        "class.deactivate",

        // Settings actions
        "settings.update_onboarding",
        "settings.update_agreements",
        "settings.update_integrations",
        "settings.update_audit",
        "settings.update_general",

        // System actions
        "system.clear_audit_logs",

        // Auth actions (future)
        "auth.login",
        "auth.logout",
        "auth.permission_change",
        "auth.profile_update",
        "auth.password_change",
      ],
      index: true,
    },

    // User information (placeholder for auth)
    userId: { type: String, default: "system" },
    userName: { type: String, default: "System" },
    userEmail: { type: String },

    // Request information
    ipAddress: { type: String },
    userAgent: { type: String },

    // Status
    status: {
      type: String,
      enum: ["success", "failure", "partial"],
      default: "success",
      required: true,
      index: true,
    },

    // Details
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },

    // Categorization
    category: {
      type: String,
      enum: ["student", "class", "settings", "auth", "system"],
      required: true,
      index: true,
    },

    // Timestamp (automatic)
    timestamp: { type: Date, default: Date.now, required: true },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "timestamp", updatedAt: false },
  },
);

// Compound indexes for common queries
AuditLogSchema.index({ category: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ status: 1, timestamp: -1 });

// TTL index for automatic cleanup based on retention period (90 days default)
// This will be managed via a separate cleanup job or manual deletion
AuditLogSchema.index(
  { timestamp: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90 },
);

AuditLogSchema.plugin(mongoosePaginate);

export default mongoose.models.AuditLog ||
  mongoose.model(SCHEMA.AUDIT_LOG, AuditLogSchema);
