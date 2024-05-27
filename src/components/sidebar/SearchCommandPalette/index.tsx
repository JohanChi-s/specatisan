import { CommandIcon, SearchIcon } from "lucide-react";
import { CommandMenu } from "./CommandMenu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchCommandPalette: React.FC = () => {
  return (
    <Button
      variant="secondary"
      className="relative items-center flex w-full md:flex md:justify-cente rounded-md group"
    >
      <div className="absolute top-2 left-2 z-[1]">
        <SearchIcon size="24" className="" />
      </div>
      <span className="relative pl-10">Quick search</span>
      <div className="inline-flex justify-center items-center ml-auto">
        <CommandIcon size={16} className="" />
        <kbd className="text-lg">K</kbd>
      </div>
      <CommandMenu />
    </Button>
  );
};

export default SearchCommandPalette;
