import { columns } from "@/components/files-table/column";
import { DataTable } from "@/components/files-table/data-table";
import { getAllFiles } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";

const CollectionsPage: React.FC = async () => {
	const { data, error } = await getAllFiles();
	if (error || !data.length) redirect("/dashboard");
	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={data} />
		</div>
	);
};

export default CollectionsPage;
