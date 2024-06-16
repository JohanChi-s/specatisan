export const dynamic = "force-dynamic";

import { getWorkspaceDetails } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";

const Workspace = async ({ params }: { params: { workspaceId: string } }) => {
  const { error } = await getWorkspaceDetails(params.workspaceId);
  if (error) {
    console.log("error", error);
    return redirect("/auth/login");
  }
  return redirect(`/dashboard/${params.workspaceId}/alldocs`);
};

export default Workspace;
