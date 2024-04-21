'use client';
import {
  getCollaboratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSubscriptionStatus,
} from '@/lib/supabase/queries';
import { cn } from '@/lib/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import WorkspaceSwitcher from './WorkspaceSwitcher';

import AccountInfo from './AccountInfo';
import SearchCommandPalette from './SearchCommandPalette';
import { Separator } from '../ui/separator';
import { Folder, workspace } from '@/lib/supabase/supabase.types';
import { Button, buttonVariants } from '../ui/button';
import {
  Calendar,
  Download,
  FolderIcon,
  Plus,
  Settings,
  Trash,
} from 'lucide-react';
import FoldersDropdownList from './folders-dropdown-list';

interface SidebarProps {
  params: { workspaceId: string };
  isCollapsed: boolean;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ params, isCollapsed }) => {
  const router = useRouter();

  const [workspaceFolderData, setWorkspaceFolderData] = useState<Folder | any>(
    []
  );
  const [privateWorkspaces, setPrivateWorkspaces] = useState<workspace | any>(
    []
  );
  const [collaboratingWorkspaces, setCollaboratingWorkspaces] = useState<
    workspace | any
  >([]);
  const [sharedWorkspaces, setSharedWorkspaces] = useState<workspace | any>([]);

  useEffect(() => {
    const supabase = createClientComponentClient();

    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login'); // Redirect to login if user is not authenticated
          return;
        }

        // setUser(user);

        const { data: workspaceFolderData, error: foldersError } =
          await getFolders(params.workspaceId);
        if (workspaceFolderData) setWorkspaceFolderData(workspaceFolderData);
        if (foldersError) {
          router.push('/dashboard'); // Redirect to dashboard on folders error
          return;
        }

        const [privateWs, collabWs, sharedWs] = await Promise.all([
          getPrivateWorkspaces(user.id),
          getCollaboratingWorkspaces(user.id),
          getSharedWorkspaces(user.id),
        ]);
        setPrivateWorkspaces(privateWs);
        setCollaboratingWorkspaces(collabWs);
        setSharedWorkspaces(sharedWs);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [params.workspaceId, router]);

  return (
    <aside
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 w-full py-2 data-[collapsed=true]:py-2"
    >
      <div className="p-2 w-full">
        <div className="flex w-full items-center justify-between">
          <WorkspaceSwitcher
            privateWorkspaces={privateWorkspaces}
            collaboratingWorkspaces={collaboratingWorkspaces}
            sharedWorkspaces={sharedWorkspaces}
            defaultWorkspace={[
              ...privateWorkspaces,
              ...sharedWorkspaces,
              collaboratingWorkspaces,
            ].find((workspace) => workspace?.id === params.workspaceId)}
          />
          <AccountInfo />
        </div>
        {/* Quick Search */}
        <Separator orientation="horizontal" className="my-6" />

        <SearchCommandPalette />

        <ul className="w-full mt-2 gap-2">
          {/* All Docs */}
          <li className="flex items-center">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'dark:bg-muted w-full justify-start items-center dark:text-white dark:hover:bg-muted dark:hover:text-white'
              )}
            >
              <FolderIcon className="mr-2 h-4 w-4" />
              <span>All docs</span>
            </Link>
          </li>
          <li className="flex items-center">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'dark:bg-muted w-full justify-start items-center dark:text-white dark:hover:bg-muted dark:hover:text-white'
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Setting</span>
            </Link>
          </li>
          <li className="flex items-center text-base">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'dark:bg-muted w-full justify-start items-center dark:text-white dark:hover:bg-muted dark:hover:text-white'
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span>Journal</span>
            </Link>
          </li>
        </ul>
        {/* Collections */}
        <FoldersDropdownList
          workspaceFolders={workspaceFolderData}
          workspaceId={params.workspaceId}
        />

        <Separator orientation="horizontal" className="my-2" />
        {/* Others */}
        <ul className="w-full mt-2 gap-2">
          {/* All Docs */}
          <span
            className="text-Neutrals-8 
        font-bold 
        text-xs"
          >
            Others
          </span>
          <li className="flex items-center">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'dark:bg-muted w-full justify-start items-center dark:text-white dark:hover:bg-muted dark:hover:text-white'
              )}
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Trash</span>
            </Link>
          </li>
          <li className="flex items-center">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'dark:bg-muted w-full justify-start items-center dark:text-white dark:hover:bg-muted dark:hover:text-white'
              )}
            >
              <Download className="mr-2 h-4 w-4" />
              <span>Import</span>
            </Link>
          </li>
        </ul>
      </div>

      <Button className="mt-auto p-4 flex items-center" variant="default">
        <Plus size={24} className="mr-2" />
        Create Docs
      </Button>
      <div className="flex flex-col items-center justify-center w-full h-10">
        <span className="text-Neutrals-8 text-xs">© 2024 Specatisan</span>
      </div>
    </aside>
  );
};

export default Sidebar;
