import { columns } from '@/components/files-table/column';
import { DataTable } from '@/components/files-table/data-table';
import WorkspaceBreadcumb from '@/components/workspace/WorkspaceBreadcumb';
import WorkspaceNavbar from '@/components/workspace/WorkspaceNavbar';
import { getAllFiles } from '@/lib/supabase/queries';
import router from 'next/navigation';

const CollectionsPage: React.FC = async () => {
  const { data, error } = await getAllFiles();
  if (error || !data.length) router.redirect('/dashboard');
  // Rest of the code...

  return (
    <div className="container mx-auto px-5">
      {/* Navbar */}
      <WorkspaceNavbar />
      {/* Breadcumb */}
      <WorkspaceBreadcumb />
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default CollectionsPage;
