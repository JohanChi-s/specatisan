"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { Document, Collection, workspace } from "@/shared/supabase.types";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import {
  deleteDocument,
  deleteCollection,
  findUser,
  getDocumentDetails,
  getCollectionDetails,
  getWorkspaceDetails,
  updateDocument,
  updateCollection,
  updateWorkspace,
} from "@/server/api/queries";
import { usePathname, useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import EmojiPicker from "../global/emoji-picker";
import BannerUpload from "../banner-upload/banner-upload";
import { XCircleIcon } from "lucide-react";
import { useSocket } from "@/lib/providers/socket-provider";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";

interface QuillEditorProps {
  dirDetails: Document | Collection | workspace;
  documentId: string;
  dirType: "workspace" | "collection" | "document";
}
const TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const QuillEditor: React.FC<QuillEditorProps> = ({
  dirDetails,
  dirType,
  documentId,
}) => {
  const supabase = createClientComponentClient();
  const { state, workspaceId, collectionId, dispatch } = useAppState();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const { user } = useSupabaseUser();
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const pathname = usePathname();
  const [quill, setQuill] = useState<any>(null);
  const [collaborators, setCollaborators] = useState<
    { id: string; email: string; avatarUrl: string }[]
  >([]);
  const [deletingBanner, setDeletingBanner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localCursors, setLocalCursors] = useState<any>([]);

  const getSelectedDirectory = useCallback(() => {
    let selectedDir;
    if (dirType === "document") {
      selectedDir = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.collections.find((collection) => collection.id === collectionId)
        ?.documents.find((document) => document.id === documentId);
    }
    if (dirType === "collection") {
      selectedDir = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.collections.find((collection) => collection.id === documentId);
    }
    if (dirType === "workspace") {
      selectedDir = state.workspaces.find(
        (workspace) => workspace.id === documentId
      );
    }
    return (
      selectedDir ||
      ({
        title: dirDetails.title,
        iconId: dirDetails.iconId,
        createdAt: dirDetails.createdAt,
        data: dirDetails.data,
        inTrash: dirDetails.inTrash,
        bannerUrl: dirDetails.bannerUrl,
      } as workspace | Collection | Document)
    );
  }, [state, workspaceId, collectionId, documentId, dirType, dirDetails]);

  const details = useMemo(getSelectedDirectory, [getSelectedDirectory]);

  const generateBreadcrumbs = useCallback(() => {
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

    const collectionSegment = segments[1];
    const collectionDetails = workspaceDetails?.collections.find(
      (collection) => collection.id === collectionSegment
    );
    const collectionBreadCrumb = collectionDetails
      ? `/ ${collectionDetails.iconId} ${collectionDetails.title}`
      : "";

    if (segments.length === 2) {
      return `${workspaceBreadCrumb} ${collectionBreadCrumb}`;
    }

    const documentSegment = segments[2];
    const documentDetails = collectionDetails?.documents.find(
      (document) => document.id === documentSegment
    );
    const documentBreadCrumb = documentDetails
      ? `/ ${documentDetails.iconId} ${documentDetails.title}`
      : "";

    return `${workspaceBreadCrumb} ${collectionBreadCrumb} ${documentBreadCrumb}`;
  }, [state, pathname, workspaceId]);

  const breadCrumbs = useMemo(generateBreadcrumbs, [generateBreadcrumbs]);

  //
  const wrapperRef = useCallback(async (wrapper: any) => {
    if (typeof window !== "undefined") {
      if (wrapper === null) return;
      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const Quill = (await import("quill")).default;
      const QuillCursors = (await import("quill-cursors")).default;
      Quill.register("modules/cursors", QuillCursors);
      const q = new Quill(editor, {
        theme: "snow",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
          cursors: {
            transformOnTextChange: true,
          },
        },
      });
      setQuill(q);
    }
  }, []);

  const restoreDocumentHandler = async () => {
    if (dirType === "document") {
      if (!collectionId || !workspaceId) return;
      dispatch({
        type: "UPDATE_DOCUMENT",
        payload: {
          document: { inTrash: "" },
          documentId,
          collectionId,
          workspaceId,
        },
      });
      await updateDocument({ inTrash: "" }, documentId);
    }
    if (dirType === "collection") {
      if (!workspaceId) return;
      dispatch({
        type: "UPDATE_COLLECTION",
        payload: {
          collection: { inTrash: "" },
          collectionId: documentId,
          workspaceId,
        },
      });
      await updateCollection({ inTrash: "" }, documentId);
    }
  };

  const deleteDocumentHandler = async () => {
    if (dirType === "document") {
      if (!collectionId || !workspaceId) return;
      dispatch({
        type: "DELETE_DOCUMENT",
        payload: { documentId, collectionId, workspaceId },
      });
      try {
        await deleteDocument(documentId);
        router.replace(`/dashboard/${workspaceId}`);
      } catch (error) {
        console.error("Failed to delete document:", error);
      }
    }
    if (dirType === "collection") {
      if (!workspaceId) return;
      dispatch({
        type: "DELETE_COLLECTION",
        payload: { collectionId: documentId, workspaceId },
      });
      await deleteCollection(documentId);
      router.replace(`/dashboard/${workspaceId}`);
    }
  };

  const iconOnChange = async (icon: string) => {
    if (!documentId) return;
    if (dirType === "workspace") {
      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: { workspace: { iconId: icon }, workspaceId: documentId },
      });
      try {
        await updateWorkspace({ iconId: icon }, documentId);
      } catch (error) {
        console.error("Failed to update workspace icon:", error);
      }
    }
    if (dirType === "collection") {
      if (!workspaceId) return;
      dispatch({
        type: "UPDATE_COLLECTION",
        payload: {
          collection: { iconId: icon },
          workspaceId,
          collectionId: documentId,
        },
      });
      await updateCollection({ iconId: icon }, documentId);
    }
    if (dirType === "document") {
      if (!workspaceId || !collectionId) return;

      dispatch({
        type: "UPDATE_DOCUMENT",
        payload: {
          document: { iconId: icon },
          workspaceId,
          collectionId,
          documentId,
        },
      });
      await updateDocument({ iconId: icon }, documentId);
    }
  };

  const deleteBanner = async () => {
    if (!documentId) return;
    setDeletingBanner(true);
    if (dirType === "document") {
      if (!collectionId || !workspaceId) return;
      dispatch({
        type: "UPDATE_DOCUMENT",
        payload: {
          document: { bannerUrl: "" },
          documentId,
          collectionId,
          workspaceId,
        },
      });
      await supabase.storage
        .from("document-banners")
        .remove([`banner-${documentId}`]);
      await updateDocument({ bannerUrl: "" }, documentId);
    }
    if (dirType === "collection") {
      if (!workspaceId) return;
      dispatch({
        type: "UPDATE_COLLECTION",
        payload: {
          collection: { bannerUrl: "" },
          collectionId: documentId,
          workspaceId,
        },
      });
      await supabase.storage
        .from("document-banners")
        .remove([`banner-${documentId}`]);
      await updateCollection({ bannerUrl: "" }, documentId);
    }
    if (dirType === "workspace") {
      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: {
          workspace: { bannerUrl: "" },
          workspaceId: documentId,
        },
      });
      await supabase.storage
        .from("document-banners")
        .remove([`banner-${documentId}`]);
      await updateWorkspace({ bannerUrl: "" }, documentId);
    }
    setDeletingBanner(false);
  };

  const fetchAndSetEditorData = useCallback(async () => {
    if (!documentId) return;
    let selectedDir;
    const fetchInformation = async () => {
      if (dirType === "document") {
        const { data: selectedDir, error } = await getDocumentDetails(
          documentId
        );
        if (error || !selectedDir) {
          return router.replace("/dashboard");
        }

        if (!selectedDir[0]) {
          if (!workspaceId) return;
          return router.replace(`/dashboard/${workspaceId}`);
        }
        if (!workspaceId || quill === null) return;
        if (!selectedDir[0].data) return;
        quill.setContents(JSON.parse(selectedDir[0].data || ""));
        dispatch({
          type: "UPDATE_DOCUMENT",
          payload: {
            document: { data: selectedDir[0].data },
            documentId,
            collectionId: selectedDir[0].collectionId,
            workspaceId,
          },
        });
      }
      if (dirType === "collection") {
        const { data: selectedDir, error } = await getCollectionDetails(
          documentId
        );
        if (error || !selectedDir) {
          return router.replace("/dashboard");
        }

        if (!selectedDir[0]) {
          router.replace(`/dashboard/${workspaceId}`);
        }
        if (quill === null) return;
        if (!selectedDir[0].data) return;
        quill.setContents(JSON.parse(selectedDir[0].data || ""));
        dispatch({
          type: "UPDATE_COLLECTION",
          payload: {
            collectionId: documentId,
            collection: { data: selectedDir[0].data },
            workspaceId: selectedDir[0].workspaceId,
          },
        });
      }
      if (dirType === "workspace") {
        const { data: selectedDir, error } = await getWorkspaceDetails(
          documentId
        );
        if (error || !selectedDir) {
          return router.replace("/dashboard");
        }
        if (!selectedDir[0] || quill === null) return;
        if (!selectedDir[0].data) return;
        quill.setContents(JSON.parse(selectedDir[0].data || ""));
        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            workspace: { data: selectedDir[0].data },
            workspaceId: documentId,
          },
        });
      }
    };
    fetchInformation();
  }, [
    documentId,
    workspaceId,
    quill,
    dirType,
    getDocumentDetails,
    router,
    dispatch,
  ]);

  useEffect(fetchAndSetEditorData, [fetchAndSetEditorData]);

  useEffect(() => {
    if (
      quill === null ||
      socket === null ||
      !documentId ||
      !localCursors.length
    )
      return;
    const socketHandler = (range: any, roomId: string, cursorId: string) => {
      if (roomId === documentId) {
        const cursorToMove = localCursors.find(
          (c: any) => c.cursors()?.[0].id === cursorId
        );
        if (cursorToMove) {
          cursorToMove.moveCursor(cursorId, range);
        }
      }
    };
    socket.on("receive-cursor-move", socketHandler);
    return () => {
      socket.off("receive-cursor-move", socketHandler);
    };
  }, [quill, socket, documentId, localCursors]);

  //rooms
  useEffect(() => {
    if (socket === null || quill === null || !documentId) return;
    socket.emit("create-room", documentId);
  }, [socket, quill, documentId]);

  //Send quill changes to all clients
  useEffect(() => {
    if (quill === null || socket === null || !documentId || !user) return;

    const selectionChangeHandler = (cursorId: string) => {
      return (range: any, oldRange: any, source: any) => {
        if (source === "user" && cursorId) {
          socket.emit("send-cursor-move", range, documentId, cursorId);
        }
      };
    };
    const quillHandler = (delta: any, oldDelta: any, source: any) => {
      if (source !== "user") return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      setSaving(true);
      const contents = quill.getContents();
      const quillLength = quill.getLength();
      saveTimerRef.current = setTimeout(async () => {
        // if (contents && quillLength !== 1 && documentId) {
        //   if (dirType == 'workspace') {
        //     dispatch({
        //       type: 'UPDATE_WORKSPACE',
        //       payload: {
        //         workspace: { data: JSON.stringify(contents) },
        //         workspaceId: documentId,
        //       },
        //     });
        //     await updateWorkspace({ data: JSON.stringify(contents) }, documentId);
        //   }
        //   if (dirType == 'collection') {
        //     if (!workspaceId) return;
        //     dispatch({
        //       type: 'UPDATE_COLLECTION',
        //       payload: {
        //         collection: { data: JSON.stringify(contents) },
        //         workspaceId,
        //         collectionId: documentId,
        //       },
        //     });
        //     await updateCollection({ data: JSON.stringify(contents) }, documentId);
        //   }
        //   if (dirType == 'document') {
        //     if (!workspaceId || !collectionId) return;
        //     dispatch({
        //       type: 'UPDATE_DOCUMENT',
        //       payload: {
        //         document: { data: JSON.stringify(contents) },
        //         workspaceId,
        //         collectionId: collectionId,
        //         documentId,
        //       },
        //     });
        //     await updateDocument({ data: JSON.stringify(contents) }, documentId);
        //   }
        // }
        setSaving(false);
      }, 850);
      socket.emit("send-changes", delta, documentId);
    };
    quill.on("text-change", quillHandler);
    quill.on("selection-change", selectionChangeHandler(user.id));

    return () => {
      quill.off("text-change", quillHandler);
      quill.off("selection-change", selectionChangeHandler);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [
    quill,
    socket,
    documentId,
    user,
    details,
    collectionId,
    workspaceId,
    dispatch,
  ]);

  useEffect(() => {
    if (quill === null || socket === null) return;
    const socketHandler = (deltas: any, id: string) => {
      if (id === documentId) {
        quill.updateContents(deltas);
      }
    };
    socket.on("receive-changes", socketHandler);
    return () => {
      socket.off("receive-changes", socketHandler);
    };
  }, [quill, socket, documentId]);

  useEffect(() => {
    if (!documentId || quill === null) return;
    const room = supabase.channel(documentId);
    const subscription = room
      .on("presence", { event: "sync" }, () => {
        const newState = room.presenceState();
        const newCollaborators = Object.values(newState).flat() as any;
        setCollaborators(newCollaborators);
        if (user) {
          const allCursors: any = [];
          newCollaborators.forEach(
            (collaborator: { id: string; email: string; avatar: string }) => {
              if (collaborator.id !== user.id) {
                const userCursor = quill.getModule("cursors");
                userCursor.createCursor(
                  collaborator.id,
                  collaborator.email.split("@")[0],
                  `#${Math.random().toString(16).slice(2, 8)}`
                );
                allCursors.push(userCursor);
              }
            }
          );
          setLocalCursors(allCursors);
        }
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED" || !user) return;
        const response = await findUser(user.id);
        if (!response) return;

        room.track({
          id: user.id,
          email: user.email?.split("@")[0],
          avatarUrl: response.avatarUrl
            ? supabase.storage.from("avatars").getPublicUrl(response.avatarUrl)
                .data.publicUrl
            : "",
        });
      });
    return () => {
      supabase.removeChannel(room);
    };
  }, [documentId, quill, supabase, user]);

  return (
    <>
      <div className="relative">
        {details.inTrash && (
          <article
            className="py-2 
          z-40 
          bg-[#EB5757] 
          flex  
          md:flex-row 
          flex-col 
          justify-center 
          items-center 
          gap-4 
          flex-wrap"
          >
            <div
              className="flex 
            flex-col 
            md:flex-row 
            gap-2 
            justify-center 
            items-center"
            >
              <span className="text-white">
                This {dirType} is in the trash.
              </span>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent
                border-white
                text-white
                hover:bg-white
                hover:text-[#EB5757]
                "
                onClick={restoreDocumentHandler}
              >
                Restore
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="bg-transparent
                border-white
                text-white
                hover:bg-white
                hover:text-[#EB5757]
                "
                onClick={deleteDocumentHandler}
              >
                Delete
              </Button>
            </div>
            <span className="text-sm text-white">{details.inTrash}</span>
          </article>
        )}
        <div
          className="flex 
        flex-col-reverse 
        sm:flex-row 
        sm:justify-between 
        justify-center 
        sm:items-center 
        sm:p-2 
        p-8"
        >
          <div>{breadCrumbs}</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center h-10">
              {collaborators?.map((collaborator) => (
                <TooltipProvider key={collaborator.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar
                        className="
                    -ml-3 
                    bg-background 
                    border-2 
                    flex 
                    items-center 
                    justify-center 
                    border-white 
                    h-8 
                    w-8 
                    rounded-full
                    "
                      >
                        <AvatarImage
                          src={
                            collaborator.avatarUrl ? collaborator.avatarUrl : ""
                          }
                          className="rounded-full"
                        />
                        <AvatarFallback>
                          {collaborator.email.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>{collaborator.email}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            {saving ? (
              <Badge
                variant="secondary"
                className="bg-orange-600 top-4
                text-white
                right-4
                z-50
                "
              >
                Saving...
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-emerald-600 
                top-4
              text-white
              right-4
              z-50
              "
              >
                Saved
              </Badge>
            )}
          </div>
        </div>
      </div>
      {details.bannerUrl && (
        <div className="relative w-full h-[200px]">
          <Image
            src={
              supabase.storage
                .from("document-banners")
                .getPublicUrl(details.bannerUrl).data.publicUrl
            }
            fill
            className="w-full md:h-48
            h-20
            object-cover"
            alt="Banner Image"
          />
        </div>
      )}
      <div
        className="flex 
        justify-center
        items-center
        flex-col
        mt-2
        relative
      "
      >
        <div
          className="w-full 
        self-center 
        max-w-[800px] 
        flex 
        flex-col
         px-7 
         lg:my-8"
        >
          <div className="text-[80px]">
            <EmojiPicker getValue={iconOnChange}>
              <div
                className="w-[100px]
                cursor-pointer
                transition-colors
                h-[100px]
                flex
                items-center
                justify-center
                hover:bg-muted
                rounded-xl"
              >
                {details.iconId}
              </div>
            </EmojiPicker>
          </div>
          <div className="flex ">
            <BannerUpload
              id={documentId}
              dirType={dirType}
              className="mt-2
              text-sm
              text-muted-foreground
              p-2
              hover:text-card-foreground
              transition-all
              rounded-md"
            >
              {details.bannerUrl ? "Update Banner" : "Add Banner"}
            </BannerUpload>
            {details.bannerUrl && (
              <Button
                disabled={deletingBanner}
                onClick={deleteBanner}
                variant="ghost"
                className="gap-2 hover:bg-background
                flex
                item-center
                justify-center
                mt-2
                text-sm
                text-muted-foreground
                w-36
                p-2
                rounded-md"
              >
                <XCircleIcon size={16} />
                <span className="whitespace-nowrap font-normal">
                  Remove Banner
                </span>
              </Button>
            )}
          </div>
          <span
            className="
            text-muted-foreground
            text-3xl
            font-bold
            h-9
          "
          >
            {details.title}
          </span>
          <span className="text-muted-foreground text-sm">
            {dirType.toUpperCase()}
          </span>
        </div>
        <div id="container" className="max-w-[800px]" ref={wrapperRef}></div>
      </div>
    </>
  );
};

export default QuillEditor;
