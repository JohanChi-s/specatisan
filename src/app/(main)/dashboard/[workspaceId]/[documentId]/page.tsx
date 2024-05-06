export const dynamic = "force-dynamic";

import React from "react";
import { getDocumentDetails } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { Room } from "@/app/Room";
import MainEditor from "@/components/editor/Editor";
import { ValueId } from "@/config/customizer-plugins";

export default async function DocumentDetailPage({
  params,
}: {
  params: { documentId: string };
}) {
  const { data, error } = await getDocumentDetails(params.documentId);
  if (error || data?.id === undefined) {
    console.log("error", error);
    redirect("/dashboard");
  }
  return (
    <div className="max-w-[1336px] w-full rounded-lg border bg-background shadow over">
      <MainEditor documentId={data?.id} />
    </div>
  );
}
