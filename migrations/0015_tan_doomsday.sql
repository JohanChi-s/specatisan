DROP TABLE "revisions";--> statement-breakpoint
ALTER TABLE "stars" DROP CONSTRAINT "stars_collection_id_collections_id_fk";
--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "revision_count";--> statement-breakpoint
ALTER TABLE "stars" DROP COLUMN IF EXISTS "collection_id";