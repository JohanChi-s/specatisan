"use client";
import { columns } from "@/components/files-table/column";
import { DataTable } from "@/components/files-table/data-table";
import WorkspaceBreadcumb from "@/components/workspace/WorkspaceBreadcumb";
import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
import { useAppState } from "@/lib/providers/state-provider";
import { getAllFiles } from "@/lib/supabase/queries";
import type { File } from "@/lib/supabase/supabase.types";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const AllDocsPage = () => {
  const [data, setData] = useState<File[] | []>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { state, folderId, dispatch, workspaceId } = useAppState();

  if (!workspaceId) redirect("/dashboard");
  // Rest of the code...
  const breadCrumbs = useMemo(() => {
    if (!pathname || !state.workspaces || !workspaceId) return;
    const segments = pathname
      .split("/")
      .filter((val) => val !== "dashboard" && val);
    const workspaceDetails = state.workspaces.find(
      (workspace) => workspace.id === workspaceId
    );
    const workspaceBreadCrumb = workspaceDetails
      ? `${workspaceDetails.iconId} ${workspaceDetails.title}`
      : "";
    if (segments.length === 1) {
      return workspaceBreadCrumb;
    }

    const folderSegment = segments[1];
    const folderDetails = workspaceDetails?.folders.find(
      (folder) => folder.id === folderSegment
    );
    const folderBreadCrumb = folderDetails
      ? `/ ${folderDetails.iconId} ${folderDetails.title}`
      : "";

    if (segments.length === 2) {
      return `${workspaceBreadCrumb} ${folderBreadCrumb}`;
    }

    const fileSegment = segments[2];
    const fileDetails = folderDetails?.files.find(
      (file) => file.id === fileSegment
    );
    const fileBreadCrumb = fileDetails
      ? `/ ${fileDetails.iconId} ${fileDetails.title}`
      : "";

    console.log(
      "BREADCRUMN:",
      workspaceBreadCrumb,
      folderBreadCrumb,
      fileBreadCrumb
    );

    return `${workspaceBreadCrumb} ${folderBreadCrumb} ${fileBreadCrumb}`;
  }, [state, pathname, workspaceId]);

  // get files data with useEffect
  useEffect(() => {
    if (!workspaceId) return;
    getAllFiles().then((files) => {
      return setData(files.data);
    });
  }, [workspaceId]);

  return (
    <div className="container mx-auto px-5">
      {/* Navbar */}
      <WorkspaceNavbar workspaceId={workspaceId} />
      {/* Breadcumb */}
      <WorkspaceBreadcumb />
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default AllDocsPage;
