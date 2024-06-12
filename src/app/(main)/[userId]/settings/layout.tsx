"use client";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { SidebarNav } from "./components/sidebar-nav";
interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { user } = useSupabaseUser();
  if (!user) return null;
  const sidebarNavItems = [
    {
      title: "Profile",
      href: `/${user.id}/settings`,
    },
    {
      title: "Account",
      href: `/${user.id}/settings/account`,
    },
    {
      title: "Appearance",
      href: `/${user.id}/settings/appearance`,
    },
    {
      title: "Notifications",
      href: `/${user.id}/settings/notification`,
    },
    {
      title: "Display",
      href: `/${user.id}/settings/display`,
    },
  ];
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5 flex justify-start">
          <WorkspaceNavbar
            isShowTabs={false}
            items={[{ href: "/dashboard", label: "Home" }]}
          />
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
