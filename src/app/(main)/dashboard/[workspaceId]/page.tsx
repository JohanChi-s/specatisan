export const dynamic = "force-dynamic";

import QuillEditor from "@/components/quill-editor/quill-editor";
import { getWorkspaceDetails } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import React from "react";

const Workspace = async ({ params }: { params: { workspaceId: string } }) => {
  const { data, error } = await getWorkspaceDetails(params.workspaceId);
  if (error || !data.length) redirect("/dashboard");
  return (
    <div className="relative">
      {/* <QuillEditor
				dirType="workspace"
				fileId={params.workspaceId}
				dirDetails={data[0] || {}}
			/> */}
      Workspace
      {/* <EditorProvider>
				<div className="app">
					<Sidebar />
					<div className="main-content">
						<TopBar />
						<EditorContainer />
					</div>
				</div>
			</EditorProvider> */}
    </div>
  );
};

export default Workspace;
