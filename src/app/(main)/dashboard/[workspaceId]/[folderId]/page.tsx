export const dynamic = "force-dynamic";

import React from "react";
import QuillEditor from "@/components/quill-editor/quill-editor";
import { getCollectionDetails } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";

const Collection = async ({ params }: { params: { collectionId: string } }) => {
  const { data, error } = await getCollectionDetails(params.collectionId);
  if (error || !data.length) {
    console.log("error", error);
    redirect("/dasboard");
  }

  return (
    <div className="relative ">
      {/* <QuillEditor
        dirType="collection"
        fileId={params.collectionId}
        dirDetails={data[0] || {}}
      /> */}
      Workspace
    </div>
  );
};

export default Collection;
