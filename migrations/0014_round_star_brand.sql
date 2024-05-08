DROP TABLE "views";--> statement-breakpoint
ALTER TABLE "collections" ALTER COLUMN "url_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "collections" ALTER COLUMN "created_by_id" DROP NOT NULL;