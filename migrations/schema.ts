import {
  pgTable,
  foreignKey,
  unique,
  pgEnum,
  uuid,
  timestamp,
  text,
  boolean,
  jsonb,
  integer,
  bigint,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";
export const keyStatus = pgEnum("key_status", [
  "default",
  "valid",
  "invalid",
  "expired",
]);
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
export const codeChallengeMethod = pgEnum("code_challenge_method", [
  "s256",
  "plain",
]);
export const equalityOp = pgEnum("equality_op", [
  "eq",
  "neq",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
]);
export const action = pgEnum("action", [
  "INSERT",
  "UPDATE",
  "DELETE",
  "TRUNCATE",
  "ERROR",
]);
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
export const activityEvent = pgEnum("activity_event", [
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
export const auditEvent = pgEnum("audit_event", [
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
export const collectionPermission = pgEnum("collection_permission", [
  "read",
  "read_write",
  "admin",
  "view",
  "edit",
]);
export const documentPermission = pgEnum("document_permission", [
  "read",
  "read_write",
]);
export const notificationChannelType = pgEnum("notification_channel_type", [
  "app",
  "email",
  "chat",
]);
export const notificationEventType = pgEnum("notification_event_type", [
  "documents.publish",
  "documents.update",
  "documents.add_user",
  "collections.add_user",
  "revisions.create",
  "collections.create",
  "comments.create",
  "documents.mentioned",
  "comments.mentioned",
  "emails.invite_accepted",
  "emails.onboarding",
  "emails.features",
  "emails.export_completed",
]);
export const userFlags = pgEnum("user_flags", [
  "inviteSent",
  "inviteReminderSent",
  "desktop",
  "desktopWeb",
  "mobileWeb",
]);
export const userPreferences = pgEnum("user_preferences", [
  "rememberLastPath",
  "useCursorPointer",
  "codeBlockLineNumbers",
  "seamlessEdit",
  "fullWidthDocuments",
]);
export const oneTimeTokenType = pgEnum("one_time_token_type", [
  "confirmation_token",
  "reauthentication_token",
  "recovery_token",
  "email_change_token_new",
  "email_change_token_current",
  "phone_change_token",
]);
export const workspacePermission = pgEnum("workspace_permission", [
  "read",
  "edit",
  "admin",
]);

export const collections = pgTable(
  "collections",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    name: text("name").notNull(),
    icon: text("icon"),
    inTrash: text("in_trash"),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    urlId: text("url_id"),
    description: text("description"),
    color: text("color"),
    index: text("index"),
    permission: text("permission"),
    maintainerApprovalRequired: boolean("maintainer_approval_required").default(
      false
    ),
    documentStructure: jsonb("document_structure"),
    sharing: boolean("sharing").default(true),
    importId: uuid("import_id"),
    createdById: uuid("created_by_id"),
    bannerUrl: text("banner_url"),
  },
  (table) => {
    return {
      collectionsUrlIdUnique: unique("collections_url_id_unique").on(
        table.urlId
      ),
    };
  }
);

export const shares = pgTable(
  "shares",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    urlId: text("url_id").notNull(),
    isPublished: boolean("is_published").default(false),
    domain: text("domain"),
    documentTitle: text("document_title"),
    documentUrl: text("document_url"),
    lastAccessAt: timestamp("last_access_at", {
      withTimezone: true,
      mode: "string",
    }),
    url: text("url"),
    userId: uuid("user_id").references(() => users.id),
    includeChildDocuments: boolean("include_child_documents").default(false),
  },
  (table) => {
    return {
      sharesUrlIdUnique: unique("shares_url_id_unique").on(table.urlId),
    };
  }
);

export const stars = pgTable("stars", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  index: text("index"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  documentId: uuid("document_id").references(() => documents.id, {
    onDelete: "cascade",
  }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, {
    onDelete: "cascade",
  }),
});

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  title: text("title").notNull(),
  data: text("data"),
  inTrash: text("in_trash"),
  bannerUrl: text("banner_url"),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  summary: text("summary"),
  fullwidth: boolean("fullwidth").default(false),
  emoji: text("emoji"),
  text: text("text"),
  content: jsonb("content"),
  archivedAt: timestamp("archived_at", { withTimezone: true, mode: "string" }),
  publishedAt: timestamp("published_at", {
    withTimezone: true,
    mode: "string",
  }),
  template: boolean("template").default(false),
  sourceMetadata: jsonb("source_metadata"),
  parentDocumentId: uuid("parent_document_id"),
  lastModifiedById: uuid("last_modified_by_id").references(() => users.id),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => users.id),
  collectionId: uuid("collection_id"),
  collaboratorIds: text("collaborator_ids").array(),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  content: jsonb("content").notNull(),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => users.id),
  resolvedById: uuid("resolved_by_id").references(() => users.id),
  documentId: uuid("document_id")
    .notNull()
    .references(() => collections.id, { onDelete: "cascade" }),
});

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  type: text("type").notNull(),
  modelId: uuid("model_id").notNull(),
  name: text("name").notNull(),
  ip: text("ip"),
  changes: jsonb("changes"),
  data: jsonb("data"),
  userId: uuid("user_id").references(() => users.id),
  actorId: uuid("actor_id").references(() => users.id),
  workspaceId: uuid("workspace_id").references(() => workspaces.id),
  documentId: uuid("document_id").references(() => documents.id),
});

export const fileOperations = pgTable("file_operations", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  state: text("state").notNull(),
  error: text("error"),
  size: integer("size"),
  type: text("type"),
  format: text("format"),
  data: jsonb("data"),
  userId: uuid("user_id").references(() => users.id),
  documentId: uuid("document_id").references(() => documents.id),
  collectionId: uuid("collection_id").references(() => collections.id),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  readAt: timestamp("read_at", { withTimezone: true, mode: "string" }),
  archivedAt: timestamp("archived_at", { withTimezone: true, mode: "string" }),
  actorId: uuid("actor_id").references(() => users.id),
  type: text("type").notNull(),
  commentId: uuid("comment_id").references(() => comments.id),
  event: notificationEventType("event"),
  data: jsonb("data"),
  userId: uuid("user_id").references(() => users.id),
  documentId: uuid("document_id").references(() => documents.id),
  collectionId: uuid("collection_id").references(() => collections.id),
});

export const policies = pgTable("policies", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  abilities: jsonb("abilities").notNull(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
});

export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  workspaceOwner: uuid("workspace_owner").notNull(),
  title: text("title").notNull(),
  iconId: text("icon_id").notNull(),
  data: text("data"),
  inTrash: text("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
});

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: text("name").notNull(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    color: text("color"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      tagsNameUnique: unique("tags_name_unique").on(table.name),
    };
  }
);

export const tagsToDocuments = pgTable("tags_to_documents", {
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
  email: text("email"),
  billingAddress: jsonb("billing_address"),
  paymentMethod: jsonb("payment_method"),
  language: text("language"),
  preferences: jsonb("preferences"),
  notificationSettings: jsonb("notification_settings"),
  lastActiveAt: timestamp("last_active_at", {
    withTimezone: true,
    mode: "string",
  }),
  suspendedAt: timestamp("suspended_at", {
    withTimezone: true,
    mode: "string",
  }),
});

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().notNull(),
  stripeCustomerId: text("stripe_customer_id"),
});

export const products = pgTable("products", {
  id: text("id").primaryKey().notNull(),
  active: boolean("active"),
  name: text("name"),
  description: text("description"),
  image: text("image"),
  metadata: jsonb("metadata"),
});

export const prices = pgTable("prices", {
  id: text("id").primaryKey().notNull(),
  productId: text("product_id").references(() => products.id),
  active: boolean("active"),
  description: text("description"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  unitAmount: bigint("unit_amount", { mode: "number" }),
  currency: text("currency"),
  type: pricingType("type"),
  interval: pricingPlanInterval("interval"),
  intervalCount: integer("interval_count"),
  trialPeriodDays: integer("trial_period_days"),
  metadata: jsonb("metadata"),
});

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  status: subscriptionStatus("status"),
  metadata: jsonb("metadata"),
  priceId: text("price_id").references(() => prices.id),
  quantity: integer("quantity"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end"),
  created: timestamp("created", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  currentPeriodStart: timestamp("current_period_start", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  currentPeriodEnd: timestamp("current_period_end", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  endedAt: timestamp("ended_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  cancelAt: timestamp("cancel_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  canceledAt: timestamp("canceled_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  trialStart: timestamp("trial_start", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  trialEnd: timestamp("trial_end", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export const collaborators = pgTable("collaborators", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  permission: collectionPermission("permission").default("edit").notNull(),
});
