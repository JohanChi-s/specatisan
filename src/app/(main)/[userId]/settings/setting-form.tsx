"use clients";
import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
import { Separator } from "@radix-ui/react-select";
import React from "react";

type Props = {};

const SettingForm: React.FC<Props> = (props) => {
  return (
    <div className="flex gap-4 flex-col w-full">
      <WorkspaceNavbar isShowTabs={false} />
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5"></aside>
        </div>
      </div>
    </div>
  );
};

export default SettingForm;
