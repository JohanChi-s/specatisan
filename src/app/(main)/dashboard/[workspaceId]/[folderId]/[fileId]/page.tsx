export const dynamic = "force-dynamic";

import React from "react";
import QuillEditor from "@/components/quill-editor/quill-editor";
import { getDocumentDetails } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { Room } from "@/app/Room";
import { CollaborativeEditor } from "@/components/editor/Editor";

export default function DocumentDetailPage() {
  return (
    <Room>
      <CollaborativeEditor />
    </Room>
  );
}
