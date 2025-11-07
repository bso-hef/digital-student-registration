/**
 * Model Registry
 *
 * This file imports all Mongoose models to ensure they are registered
 * before any database operations occur. This is critical for populate
 * operations that reference models by name (e.g., Student.populate("currentClass")).
 *
 * All models must be imported here using side-effect imports.
 */

import "./AppSettings";
import "./AuditLog";
import "./Class";
import "./Student";
import "./User";

export {};
