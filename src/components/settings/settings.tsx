import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import clsx from "clsx";
import SettingsForm from "./setting-form";

interface SettingsProps {
  children: React.ReactNode;
  className?: string;
}

const Settings: React.FC<SettingsProps> = ({ children, className }) => {
  return (
    <Dialog>
      <DialogTrigger className={clsx("", className)} asChild>
        {children}
      </DialogTrigger>
      <DialogContent
        className="
        block
        max-h-[1000px]
        !h-[800px]
        max-w-[1350px]
        sm:h-[440px]
        overflow-scroll
        w-full
      "
      >
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Your Settings</DialogDescription>
        </DialogHeader>
        <SettingsForm />
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
