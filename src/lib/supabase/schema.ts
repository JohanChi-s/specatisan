import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const userPreferences = pgEnum("user_preferences", [
  "rememberLastPath",
  "useCursorPointer",
  "codeBlockLineNumbers",
  "seamlessEdit",
  "fullWidthDocuments",
]);

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
export const DocumentPermission = pgEnum("document_permission", [
  "read",
  "read_write",
]);

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

export const NotificationEventType = pgEnum("notification_event_type", [
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

export const NotificationChannelType = pgEnum("notification_channel_type", [
  "app",
  "email",
  "chat",
]);

// Define tables

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .default(sql`now()`)
    .notNull(),
  title: text("title").notNull(),
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
  data: text("data"),
  collaboratorIds: text("collaborator_ids").array(),
  inTrash: text("in_trash").default(sql`ARRAY[]::text[]`),
  bannerUrl: text("banner_url"),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  collectionId: uuid("collection_id"),
});

export const stars = pgTable("stars", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  index: text("index"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .default(sql`now()`)
    .notNull(),
  documentId: uuid("document_id").references(() => documents.id, {
    onDelete: "cascade",
  }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
});

export const memberShip = pgTable("user_permissions", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .default(sql`now()`)
    .notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  permission: text("permission").notNull(),
});

export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .default(sql`now()`)
    .notNull(),
  urlId: text("url_id").unique(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  index: text("index"),
  permission: text("permission"),
  maintainerApprovalRequired: boolean("maintainer_approval_required").default(
    false
  ),
  documentStructure: jsonb("document_structure"),
  sharing: boolean("sharing").default(true),
  inTrash: text("in_trash"),
  importId: uuid("import_id"),
  createdById: uuid("created_by_id"),
  bannerUrl: text("banner_url"),
  // Define foreign key constraint
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
});

export const collaborators = pgTable("collaborators", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .default(sql`now()`)
    .notNull(),
  userId: uuid("user_id").notNull(),
});

export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .default(sql`now()`)
    .notNull(),
  workspaceOwner: uuid("workspace_owner").notNull(),
  title: text("title").notNull(),
  iconId: text("icon_id").notNull(),
  data: text("data"),
  inTrash: text("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
  email: text("email"),
  language: text("language"),
  preferences: jsonb("preferences"),
  notificationSettings: jsonb("notification_settings"),
  isViewer: boolean("is_viewer"),
  lastActiveAt: timestamp("last_active_at", {
    withTimezone: true,
    mode: "string",
  }),
  lastActiveIp: text("last_active_ip"),
  lastSignInEmailSendAt: timestamp("last_sign_in_email_send_at", {
    withTimezone: true,
    mode: "string",
  }),
  suspendedAt: timestamp("suspended_at", {
    withTimezone: true,
    mode: "string",
  }),
  billingAddress: jsonb("billing_address"),
  paymentMethod: jsonb("payment_method"),
});

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .default(sql`now()`)
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
  created: timestamp("created", { withTimezone: true, mode: "string" }).default(
    sql`now()`
  ),
  currentPeriodStart: timestamp("current_period_start", {
    withTimezone: true,
    mode: "string",
  }).default(sql`now()`),
  currentPeriodEnd: timestamp("current_period_end", {
    withTimezone: true,
    mode: "string",
  }).default(sql`now()`),
  endedAt: timestamp("ended_at", {
    withTimezone: true,
    mode: "string",
  }).default(sql`now()`),
  cancelAt: timestamp("cancel_at", {
    withTimezone: true,
    mode: "string",
  }).default(sql`now()`),
  canceledAt: timestamp("canceled_at", {
    withTimezone: true,
    mode: "string",
  }).default(sql`now()`),
  trialStart: timestamp("trial_start", {
    withTimezone: true,
    mode: "string",
  }).default(sql`now()`),
  trialEnd: timestamp("trial_end", {
    withTimezone: true,
    mode: "string",
  }).default(sql`now()`),
});

export const fileOperations = pgTable("file_operations", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .default(sql`now()`)
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
    .default(sql`now()`)
    .notNull(),
  readAt: timestamp("read_at", { withTimezone: true, mode: "string" }),
  archivedAt: timestamp("archived_at", { withTimezone: true, mode: "string" }),
  actoId: uuid("actor_id").references(() => users.id),
  type: text("type").notNull(),
  commentId: uuid("comment_id").references(() => comments.id),
  event: NotificationEventType("event"),
  data: jsonb("data"),
  userId: uuid("user_id").references(() => users.id),
  documentId: uuid("document_id").references(() => documents.id),
  collectionId: uuid("collection_id").references(() => collections.id),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
  content: jsonb("content").notNull(),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => users.id, {}),
  resolvedById: uuid("resolved_by_id").references(() => users.id, {}),
  documentId: uuid("document_id")
    .notNull()
    .references(() => collections.id, {
      onDelete: "cascade",
    }),
});

export const policies = pgTable("policies", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .default(sql`now()`)
    .notNull(),
  name: text("name").notNull(),
  abilities: jsonb("abilities").notNull(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
});

export const shares = pgTable("shares", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .default(sql`now()`)
    .notNull(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  urlId: text("url_id").notNull().unique(),
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
});

export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull().unique(),
  color: text("color"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .default(sql`now()`)
    .notNull(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
});

export const tagsToDocuments = pgTable("tags_to_documents", {
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  tagsToDocuments: many(tagsToDocuments),
}));

export const tagsToDocumentsRelations = relations(
  tagsToDocuments,
  ({ one }) => ({
    tag: one(tags, {
      fields: [tagsToDocuments.tagId],
      references: [tags.id],
    }),
    document: one(documents, {
      fields: [tagsToDocuments.documentId],
      references: [documents.id],
    }),
  })
);

export const documentsRelation = relations(documents, ({ many }) => ({
  tagsToDocuments: many(tagsToDocuments),
}));
//Dont Delete!!!
export const productsRelations = relations(products, ({ many }) => ({
  prices: many(prices),
}));

export const pricesRelations = relations(prices, ({ one }) => ({
  product: one(products, {
    fields: [prices.productId],
    references: [products.id],
  }),
}));
