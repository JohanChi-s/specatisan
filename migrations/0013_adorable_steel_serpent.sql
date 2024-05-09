ALTER TABLE "documents" DROP CONSTRAINT "documents_collection_id_collections_id_fk";
--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "collection_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "icon_id";