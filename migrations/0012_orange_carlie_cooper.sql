ALTER TABLE "comments" RENAME COLUMN "create_by_id" TO "created_by_id";--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_create_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_parrent_comment_id_comments_id_fk";
--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_template_id_documents_id_fk";
--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_folder_id_collections_id_fk";
--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_collection_id_collections_id_fk";
--> statement-breakpoint
ALTER TABLE "collections" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "views" ALTER COLUMN "last_editing_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "banner_url" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "collections" DROP COLUMN IF EXISTS "team_id";--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN IF EXISTS "parrent_comment_id";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "template_id";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "folder_id";