DROP TABLE "collaborators";--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "created" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "current_period_start" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "current_period_end" DROP NOT NULL;