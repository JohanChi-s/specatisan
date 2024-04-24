import {
  pgTable,
  foreignKey,
  uuid,
  timestamp,
  text,
  jsonb,
  boolean,
  bigint,
  integer,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";
import { pricingPlanInterval, pricingType, subscriptionStatus } from "./enum";
import { NotificationEventType } from "@/shared/types";

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  fullwidth: boolean("fullwidth").default(false),
  emoji: text("emoji"),
  text: text("text"),
  contenct: jsonb("content"),
  revisionCount: integer("revision_count").default(0),
  archivedAt: timestamp("archived_at", { withTimezone: true, mode: "string" }),
  publishedAt: timestamp("published_at", { withTimezone: true, mode: "string" }),
  template: boolean("template").default(false),
  sourceMetadata: jsonb("source_metadata"),
  parentDocumentId: uuid("parent_document_id"),
  lastModifiedById: uuid("last_modified_by_id").references(() => users.id),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => users.id),
  templateId: uuid("template_id").references(() => documents.id),
  collectionId: uuid("collection_id")
    .notNull()
    .references(() => collections.id),
  iconId: text("icon_id").notNull(),
  data: text("data"),
  collaboratorIds: text("collaborator_ids").array(),
  inTrash: text("in_trash").default(sql`ARRAY[]::text[]`),
  bannerUrl: text("banner_url"),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  folderId: uuid("folder_id")
    .notNull()
    .references(() => collections.id, { onDelete: "cascade" }),
});

export const views = pgTable("views", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  count: integer("count").default(0),
  lastEditingAt: timestamp("last_editing_at", { withTimezone: true, mode: "string" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const stars = pgTable("stars", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  index: text("index"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  documentId: uuid("document_id").references(() => documents.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  collectionId: uuid("collection_id").references(() => collections.id, { onDelete: "cascade" }),
});

export const memberShip = pgTable("user_permissions", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
  urlId: text("url_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  index: text("index"),
  permission: text("permission"),
  maintainerApprovalRequired: boolean("maintainer_approval_required").default(false),
  documentStructure: jsonb("document_structure"),
  sharing: boolean("sharing").default(true),
  inTrash: text("in_trash"),
  importId: uuid("import_id"),
  createdById: uuid("created_by_id").notNull(),
  teamId: uuid("team_id").notNull(),
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
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  userId: uuid("user_id").notNull(),
});

export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
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
  isViewer: boolean("is_viewer"),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true, mode: "string" }),
  lastActiveIp: text("last_active_ip"),
  lastSignInEmailSendAt: timestamp("last_sign_in_email_send_at", {
    withTimezone: true,
    mode: "string",
  }),
  suspendedAt: timestamp("suspended_at", { withTimezone: true, mode: "string" }),
  billingAddress: jsonb("billing_address"),
  paymentMethod: jsonb("payment_method"),
});

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
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
  created: timestamp("created", { withTimezone: true, mode: "string" }).default(sql`now()`),
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

export const FileOperation = pgTable("file_operations", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
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

export const Notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  readAt: timestamp("read_at", { withTimezone: true, mode: "string" }),
  archivedAt: timestamp("archived_at", { withTimezone: true, mode: "string" }),
  actoId: uuid("actor_id").references(() => users.id),
  type: text("type").notNull(),
  commentId: uuid("comment_id").references(() => comments.id),
  event: text("event"),
  data: jsonb("data"),
  userId: uuid("user_id").references(() => users.id),
  documentId: uuid("document_id").references(() => documents.id),
  collectionId: uuid("collection_id").references(() => collections.id),
});
