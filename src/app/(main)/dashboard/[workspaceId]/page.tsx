export const dynamic = "force-dynamic";

import { Room } from "@/app/Room";
import PlateEditor from "@/components/editor/Editor";

import { getWorkspaceDetails } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import React from "react";

const Workspace = async ({ params }: { params: { workspaceId: string } }) => {
  const { data, error } = await getWorkspaceDetails(params.workspaceId);
  if (error) {
    console.log("error", error);
    redirect("/login");
  }
  return (
    // <Room>
    //   <CollaborativeEditor />
    // </Room>
    <div className="max-w-[1336px] w-full rounded-lg border bg-background shadow over">
      <PlateEditor />
    </div>
  );
};

export default Workspace;
