export const dynamic = "force-dynamic";

import React from "react";
import QuillEditor from "@/components/quill-editor/quill-editor";
import { getDocumentDetails } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";

const Document = async ({ params }: { params: { fileId: string } }) => {
  const { data, error } = await getDocumentDetails(params.fileId);
  if (error || !data.length) redirect("/dashboard");

  return (
    <div className="relative ">
      Document
      {/* <QuillEditor
        dirType="document"
        fileId={params.fileId}
        dirDetails={data[0] || {}}
      /> */}
    </div>
  );
};

export default Document;
