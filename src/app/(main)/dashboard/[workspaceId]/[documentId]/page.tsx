export const dynamic = "force-dynamic";

import { Room } from "@/app/Room";
import CollaborativeEditor from "@/components/editor/CollaborativeEditor";
import MainEditor from "@/components/editor/Editor";
import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
import { ValueId } from "@/config/customizer-plugins";
import { getDocumentDetails } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";

export default async function DocumentDetailPage({
  params,
}: {
  params: { documentId: string };
}) {
  const { data, error } = await getDocumentDetails(params.documentId);
  if (error || data?.id === undefined) {
    redirect("/dashboard");
  }
  return (
    <div className="max-w-[1336px] w-full rounded-lg border bg-background shadow over">
      <WorkspaceNavbar
        documentId={data?.id}
        title={data.title}
        isShowTabs={false}
      />
      {/* <Room documentId={data.id}>
        <CollaborativeEditor />
      </Room> */}
      <MainEditor documentId={data?.id} />
    </div>
  );
}
