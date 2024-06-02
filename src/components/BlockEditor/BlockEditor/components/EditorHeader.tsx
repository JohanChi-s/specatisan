import { Icon } from "@/components/BlockEditor/ui/Icon";
import { Toolbar } from "@/components/BlockEditor/ui/Toolbar";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";
import TurndownService from "turndown";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WebSocketStatus } from "@hocuspocus/provider";
import { FileText } from "lucide-react";
import { EditorUser } from "../types";
import { EditorInfo } from "./EditorInfo";

export type EditorHeaderProps = {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
  isSidebarThreadOpen?: boolean;
  toggleSidebarThread?: () => void;
  characters: number;
  words: number;
  collabState: WebSocketStatus;
  users: EditorUser[];
};

export const EditorHeader = ({
  characters,
  collabState,
  users,
  words,
  isSidebarOpen,
  toggleSidebar,
  isSidebarThreadOpen,
  toggleSidebarThread,
}: EditorHeaderProps) => {
  const exportToPDF = () => {
    const element = document.getElementById("editor-content"); // Replace 'document' with the ID of your document container
    html2pdf().from(element).save();
  };
  const exportToMarkdown = () => {
    const element = document.getElementById("editor-content");
    if (element) {
      const turndownService = new TurndownService();
      const markdown = turndownService.turndown(element.innerHTML);
      const blob = new Blob([markdown], {
        type: "text/markdown;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  return (
    <div className="flex flex-row items-center justify-between flex-none py-2 pl-6 pr-3 text-black bg-white border-b border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-800">
      <div className="flex flex-row gap-x-1.5 items-center">
        <div className="flex items-center gap-x-1.5">
          <Toolbar.Button
            tooltip={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            onClick={toggleSidebar}
            active={isSidebarOpen}
            className={isSidebarOpen ? "bg-transparent" : ""}
          >
            <Icon name={isSidebarOpen ? "PanelLeftClose" : "PanelLeft"} />
          </Toolbar.Button>
          <Toolbar.Button
            tooltip={isSidebarThreadOpen ? "Close Comments" : "Open Comments"}
            onClick={toggleSidebarThread}
            active={isSidebarThreadOpen}
            className={isSidebarThreadOpen ? "bg-transparent" : ""}
          >
            <Icon name="MessagesSquare" />
          </Toolbar.Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="smallIcon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-ellipsis text-slate-600"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={exportToPDF}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Export to PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToMarkdown}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Export to Markdown</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <EditorInfo
        characters={characters}
        words={words}
        collabState={collabState}
        users={users}
      />
    </div>
  );
};
