ALTER TABLE "tags_to_documents" DROP CONSTRAINT "tags_to_documents_document_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags_to_documents" ADD CONSTRAINT "tags_to_documents_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
