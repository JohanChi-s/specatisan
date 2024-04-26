export const dynamic = "force-dynamic";

import React from "react";
import QuillEditor from "@/components/quill-editor/quill-editor";
import { getDocumentDetails } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";

const Document = async ({ params }: { params: { documentId: string } }) => {
  const { data, error } = await getDocumentDetails(params.documentId);
  if (error || !data?.length) redirect("/dashboard");

  return (
    <div className="relative ">
      Document
      {/* <QuillEditor
        dirType="document"
        documentId={params.documentId}
        dirDetails={data[0] || {}}
      /> */}
    </div>
  );
};

export default Document;
