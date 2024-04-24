import { pgEnum } from "drizzle-orm/pg-core";

export const userPreferences = pgEnum("user_preferences", [
  "rememberLastPath",
  "useCursorPointer",
  "codeBlockLineNumbers",
  "seamlessEdit",
  "fullWidthDocuments",
]);

export const keyStatus = pgEnum("key_status", ["default", "valid", "invalid", "expired"]);
export const keyType = pgEnum("key_type", [
  "aead-ietf",
  "aead-det",
  "hmacsha512",
  "hmacsha256",
  "auth",
  "shorthash",
  "generichash",
  "kdf",
  "secretbox",
  "secretstream",
  "stream_xchacha20",
]);
export const factorType = pgEnum("factor_type", ["totp", "webauthn"]);
export const factorStatus = pgEnum("factor_status", ["unverified", "verified"]);
export const aalLevel = pgEnum("aal_level", ["aal1", "aal2", "aal3"]);
export const codeChallengeMethod = pgEnum("code_challenge_method", ["s256", "plain"]);
export const equalityOp = pgEnum("equality_op", ["eq", "neq", "lt", "lte", "gt", "gte", "in"]);
export const action = pgEnum("action", ["INSERT", "UPDATE", "DELETE", "TRUNCATE", "ERROR"]);
export const pricingType = pgEnum("pricing_type", ["one_time", "recurring"]);
export const pricingPlanInterval = pgEnum("pricing_plan_interval", [
  "day",
  "week",
  "month",
  "year",
]);
export const subscriptionStatus = pgEnum("subscription_status", [
  "trialing",
  "active",
  "canceled",
  "incomplete",
  "incomplete_expired",
  "past_due",
  "unpaid",
]);

export const userFlags = pgEnum("user_flags", [
  "inviteSent",
  "inviteReminderSent",
  "desktop",
  "desktopWeb",
  "mobileWeb",
]);

export const CollectionPermission = pgEnum("collection_permission", [
  "read",
  "read_write",
  "admin",
]);
export const DocumentPermission = pgEnum("document_permission", ["read", "read_write"]);

export const ActivityEvent = pgEnum("activity_event", [
  "collections.create",
  "collections.delete",
  "collections.move",
  "collections.permission_changed",
  "collections.add_user",
  "collections.remove_user",
  "documents.publish",
  "documents.unpublish",
  "documents.archive",
  "documents.unarchive",
  "documents.move",
  "documents.delete",
  "documents.permanent_delete",
  "documents.restore",
  "documents.add_user",
  "documents.remove_user",
  "revisions.create",
  "users.create",
  "users.demote",
  "userMemberships.update",
]);

export const AuditEvent = pgEnum("audit_event", [
  "api_keys.create",
  "api_keys.delete",
  "authenticationProviders.update",
  "collections.create",
  "collections.update",
  "collections.permission_changed",
  "collections.move",
  "collections.add_user",
  "collections.remove_user",
  "collections.add_group",
  "collections.remove_group",
  "collections.delete",
  "documents.create",
  "documents.publish",
  "documents.update",
  "documents.archive",
  "documents.unarchive",
  "documents.move",
  "documents.delete",
  "documents.permanent_delete",
  "documents.restore",
  "documents.add_user",
  "documents.remove_user",
  "groups.create",
  "groups.update",
  "groups.delete",
  "pins.create",
  "pins.update",
  "pins.delete",
  "revisions.create",
  "shares.create",
  "shares.update",
  "shares.revoke",
  "teams.update",
  "users.create",
  "users.update",
  "users.signin",
  "users.signout",
  "users.promote",
  "users.demote",
  "users.invite",
  "users.suspend",
  "users.activate",
  "users.delete",
  "fileOperations.create",
  "fileOperations.delete",
  "webhookSubscriptions.create",
  "webhookSubscriptions.delete",
]);
