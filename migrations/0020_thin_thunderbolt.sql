DO $$ BEGIN
 ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "is_viewer";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "last_active_ip";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "last_sign_in_email_send_at";