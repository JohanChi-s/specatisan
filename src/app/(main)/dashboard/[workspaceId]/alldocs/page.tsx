import { columns } from "@/components/documents-table/column";
import { DataTable } from "@/components/documents-table/data-table";
import WorkspaceBreadcumb from "@/components/workspace/WorkspaceBreadcumb";
import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
import { getDocumentByWorkspaceId } from "@/lib/supabase/queries";
import router from "next/navigation";

type AllDocsPageProps = {
  workspaceId: string;
};

const AllDocsPage: React.FC<AllDocsPageProps> = async ({ workspaceId }) => {
  const { data, error } = await getDocumentByWorkspaceId(workspaceId);
  if (error || !data?.length) router.redirect("/dashboard");
  // Rest of the code...

  return (
    <div className="container mx-auto px-5">
      {/* Navbar */}
      <WorkspaceNavbar workspaceId={workspaceId} />
      {/* Breadcumb */}
      <WorkspaceBreadcumb />
      {/* <DataTable columns={columns} data={data} /> */}
    </div>
  );
};

export default AllDocsPage;
