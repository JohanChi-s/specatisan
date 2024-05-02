import copy from "copy-to-clipboard";
import {
  DownloadIcon,
  Star,
  StarOff,
  FileText,
  FilePlus2,
  SearchIcon,
  BellMinus,
  Bell,
  TrashIcon,
  CrossIcon,
  ArchiveIcon,
  HistoryIcon,
  Waypoints,
  ScreenShareOff,
  ScreenShare,
  MessageCircle,
  GlobeIcon,
  CopyIcon,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { ExportContentType, TeamPreference } from "@/shared/types";
import DocumentDelete from "@/scenes/DocumentDelete";
import DocumentPermanentDelete from "@/scenes/DocumentPermanentDelete";
import DocumentPublish from "@/scenes/DocumentPublish";
import SharePopover from "@/components/Sharing";
import { createAction } from "@/actions";
import { DocumentSection } from "@/actions/sections";
import { env } from "@/app/env";
import history from "@/utils/history";
import {
  documentInsightsPath,
  documentHistoryPath,
  homePath,
  newDocumentPath,
  searchPath,
  documentPath,
  urlify,
} from "@/utils/routeHelpers";

export const openDocument = createAction({
  name: ({ t }) => t("Open document"),
  analyticsName: "Open document",
  section: DocumentSection,
  shortcut: ["o", "d"],
  keywords: "go to",
  icon: <FileText />,
  children: ({ stores }) => {
    const paths = stores.collections.pathsToDocuments;

    return paths
      .filter((path) => path.type === "document")
      .map((path) => ({
        // Note: using url which includes the slug rather than id here to bust
        // cache if the document is renamed
        id: path.url,
        name: path.title,
        icon: function _Icon() {
          return stores.documents.get(path.id)?.isStarred ? <Star /> : null;
        },
        section: DocumentSection,
        perform: () => history.push(path.url),
      }));
  },
});

export const createDocument = createAction({
  name: ({ t }) => t("New document"),
  analyticsName: "New document",
  section: DocumentSection,
  icon: <FilePlus2 />,
  keywords: "create",
  visible: ({ currentTeamId, stores }) =>
    !!currentTeamId && stores.policies.abilities(currentTeamId).createDocument,
  perform: ({ activeCollectionId, inStarredSection }) =>
    history.push(newDocumentPath(activeCollectionId), {
      starred: inStarredSection,
    }),
});

export const createNestedDocument = createAction({
  name: ({ t }) => t("New nested document"),
  analyticsName: "New document",
  section: DocumentSection,
  icon: <FilePlus2 />,
  keywords: "create",
  visible: ({ currentTeamId, activeDocumentId, stores }) =>
    !!currentTeamId &&
    !!activeDocumentId &&
    stores.policies.abilities(currentTeamId).createDocument &&
    stores.policies.abilities(activeDocumentId).createChildDocument,
  perform: ({ activeCollectionId, activeDocumentId, inStarredSection }) =>
    history.push(
      newDocumentPath(activeCollectionId, {
        parentDocumentId: activeDocumentId,
      }),
      {
        starred: inStarredSection,
      }
    ),
});

export const starDocument = createAction({
  name: ({ t }) => t("Star"),
  analyticsName: "Star document",
  section: DocumentSection,
  icon: <Star />,
  keywords: "favorite bookmark",
  visible: ({ activeDocumentId, stores }) => {
    if (!activeDocumentId) {
      return false;
    }
    const document = stores.documents.get(activeDocumentId);
    return (
      !document?.isStarred && stores.policies.abilities(activeDocumentId).star
    );
  },
  perform: async ({ activeDocumentId, stores }) => {
    if (!activeDocumentId) {
      return;
    }

    const document = stores.documents.get(activeDocumentId);
    await document?.star();
  },
});

export const unstarDocument = createAction({
  name: ({ t }) => t("Unstar"),
  analyticsName: "Unstar document",
  section: DocumentSection,
  icon: <StarOff />,
  keywords: "unfavorite unbookmark",
  visible: ({ activeDocumentId, stores }) => {
    if (!activeDocumentId) {
      return false;
    }
    const document = stores.documents.get(activeDocumentId);
    return (
      !!document?.isStarred &&
      stores.policies.abilities(activeDocumentId).unstar
    );
  },
  perform: async ({ activeDocumentId, stores }) => {
    if (!activeDocumentId) {
      return;
    }

    const document = stores.documents.get(activeDocumentId);
    await document?.unstar();
  },
});

export const publishDocument = createAction({
  name: ({ t }) => t("Publish"),
  analyticsName: "Publish document",
  section: DocumentSection,
  icon: <ScreenShare />,
  visible: ({ activeDocumentId, stores }) => {
    if (!activeDocumentId) {
      return false;
    }
    const document = stores.documents.get(activeDocumentId);
    return (
      !!document?.isDraft && stores.policies.abilities(activeDocumentId).publish
    );
  },
  perform: async ({ activeDocumentId, stores, t }) => {
    if (!activeDocumentId) {
      return;
    }

    const document = stores.documents.get(activeDocumentId);
    if (document?.publishedAt) {
      return;
    }

    if (document?.collectionId) {
      await document.save(undefined, {
        publish: true,
      });
      toast.success(
        t("Published {{ documentName }}", {
          documentName: document.noun,
        })
      );
    } else if (document) {
      stores.dialogs.openModal({
        title: t("Publish document"),
        content: <DocumentPublish document={document} />,
      });
    }
  },
});

export const unpublishDocument = createAction({
  name: ({ t }) => t("Unpublish"),
  analyticsName: "Unpublish document",
  section: DocumentSection,
  icon: <ScreenShareOff />,
  visible: ({ activeDocumentId, stores }) => {
    if (!activeDocumentId) {
      return false;
    }
    return stores.policies.abilities(activeDocumentId).unpublish;
  },
  perform: async ({ activeDocumentId, stores, t }) => {
    if (!activeDocumentId) {
      return;
    }

    const document = stores.documents.get(activeDocumentId);
    if (!document) {
      return;
    }

    await document.unpublish();

    toast.success(
      t("Unpublished {{ documentName }}", {
        documentName: document.noun,
      })
    );
  },
});

export const subscribeDocument = createAction({
  name: ({ t }) => t("Subscribe"),
  analyticsName: "Subscribe to document",
  section: DocumentSection,
  icon: <Bell />,
  visible: ({ activeDocumentId, stores }) => {
    if (!activeDocumentId) {
      return false;
    }

    const document = stores.documents.get(activeDocumentId);

    return (
      !document?.isSubscribed &&
      stores.policies.abilities(activeDocumentId).subscribe
    );
  },
  perform: async ({ activeDocumentId, stores, t }) => {
    if (!activeDocumentId) {
      return;
    }

    const document = stores.documents.get(activeDocumentId);
    await document?.subscribe();
    toast.success(t("Subscribed to document notifications"));
  },
});

export const unsubscribeDocument = createAction({
  name: ({ t }) => t("Unsubscribe"),
  analyticsName: "Unsubscribe from document",
  section: DocumentSection,
  icon: <BellMinus />,
  visible: ({ activeDocumentId, stores }) => {
    if (!activeDocumentId) {
      return false;
    }

    const document = stores.documents.get(activeDocumentId);

    return (
      !!document?.isSubscribed &&
      stores.policies.abilities(activeDocumentId).unsubscribe
    );
  },
  perform: async ({ activeDocumentId, stores, currentUserId, t }) => {
    if (!activeDocumentId || !currentUserId) {
      return;
    }

    const document = stores.documents.get(activeDocumentId);

    await document?.unsubscribe(currentUserId);

    toast.success(t("Unsubscribed from document notifications"));
  },
});

export const shareDocument = createAction({
  name: ({ t }) => t("Share"),
  analyticsName: "Share document",
  section: DocumentSection,
  icon: <GlobeIcon />,
  perform: async ({ activeDocumentId, stores, currentUserId, t }) => {
    if (!activeDocumentId || !currentUserId) {
      return;
    }

    const document = stores.documents.get(activeDocumentId);
    const share = stores.shares.getByDocumentId(activeDocumentId);
    const sharedParent = stores.shares.getByDocumentParents(activeDocumentId);
    if (!document) {
      return;
    }

    stores.dialogs.openModal({
      title: t("Share this document"),
      content: (
        <SharePopover
          document={document}
          share={share}
          sharedParent={sharedParent}
          onRequestClose={stores.dialogs.closeAllModals}
          visible
        />
      ),
    });
  },
});

export const downloadDocumentAsPDF = createAction({
  name: ({ t }) => t("PDF"),
  analyticsName: "Download document as PDF",
  section: DocumentSection,
  keywords: "export",
  icon: <DownloadIcon />,
  iconInContextMenu: false,
  visible: ({ activeDocumentId, stores }) =>
    !!activeDocumentId &&
    stores.policies.abilities(activeDocumentId).download &&
    env.PDF_EXPORT_ENABLED,
  perform: ({ activeDocumentId, t, stores }) => {
    if (!activeDocumentId) {
      return;
    }

    const id = toast.loading(`${t("Exporting")}…`);
    const document = stores.documents.get(activeDocumentId);
    return document
      ?.download(ExportContentType.Pdf)
      .finally(() => id && toast.dismiss(id));
  },
});

export const downloadDocumentAsMarkdown = createAction({
  name: ({ t }) => t("Markdown"),
  analyticsName: "Download document as Markdown",
  section: DocumentSection,
  keywords: "md markdown export",
  icon: <DownloadIcon />,
  iconInContextMenu: false,
  visible: ({ activeDocumentId, stores }) =>
    !!activeDocumentId && stores.policies.abilities(activeDocumentId).download,
  perform: async ({ activeDocumentId, stores }) => {
    if (!activeDocumentId) {
      return;
    }

    const document = stores.documents.get(activeDocumentId);
    await document?.download(ExportContentType.Markdown);
  },
});

export const downloadDocument = createAction({
  name: ({ t, isContextMenu }) =>
    isContextMenu ? t("Download") : t("Download document"),
  analyticsName: "Download document",
  section: DocumentSection,
  icon: <DownloadIcon />,
  keywords: "export",
  children: [downloadDocumentAsPDF, downloadDocumentAsMarkdown],
});

export const copyDocumentLink = createAction({
  name: ({ t }) => t("Copy link"),
  section: DocumentSection,
  keywords: "clipboard",
  visible: ({ activeDocumentId }) => !!activeDocumentId,
  perform: ({ stores, activeDocumentId, t }) => {
    const document = activeDocumentId
      ? stores.documents.get(activeDocumentId)
      : undefined;
    if (document) {
      copy(urlify(documentPath(document)));
      toast.success(t("Link copied to clipboard"));
    }
  },
});

export const copyDocument = createAction({
  name: ({ t }) => t("Copy"),
  analyticsName: "Copy document",
  section: DocumentSection,
  icon: <CopyIcon />,
  keywords: "clipboard",
  children: [copyDocumentLink],
});

export const searchDocumentsForQuery = (searchQuery: string) =>
  createAction({
    id: "search",
    name: ({ t }) =>
      t(`Search documents for "{{searchQuery}}"`, { searchQuery }),
    analyticsName: "Search documents",
    section: DocumentSection,
    icon: <SearchIcon />,
    perform: () => history.push(searchPath(searchQuery)),
    visible: ({ location }) => location.pathname !== searchPath(),
  });

export const archiveDocument = createAction({
  name: ({ t }) => t("Archive"),
  analyticsName: "Archive document",
  section: DocumentSection,
  icon: <ArchiveIcon />,
  visible: ({ activeDocumentId, stores }) => {
    if (!activeDocumentId) {
      return false;
    }
    return !!stores.policies.abilities(activeDocumentId).archive;
  },
  perform: async ({ activeDocumentId, stores, t }) => {
    if (activeDocumentId) {
      const document = stores.documents.get(activeDocumentId);
      if (!document) {
        return;
      }

      await document.archive();
      toast.success(t("Document archived"));
    }
  },
});

export const deleteDocument = createAction({
  name: ({ t }) => `${t("Delete")}…`,
  analyticsName: "Delete document",
  section: DocumentSection,
  icon: <TrashIcon />,
  dangerous: true,
  visible: ({ activeDocumentId, stores }) => {
    if (!activeDocumentId) {
      return false;
    }
    return !!stores.policies.abilities(activeDocumentId).delete;
  },
  perform: ({ activeDocumentId, stores, t }) => {
    if (activeDocumentId) {
      const document = stores.documents.get(activeDocumentId);
      if (!document) {
        return;
      }

      stores.dialogs.openModal({
        title: t("Delete {{ documentName }}", {
          documentName: document.noun,
        }),
        content: (
          <DocumentDelete
            document={document}
            onSubmit={stores.dialogs.closeAllModals}
          />
        ),
      });
    }
  },
});

export const permanentlyDeleteDocument = createAction({
  name: ({ t }) => t("Permanently delete"),
  analyticsName: "Permanently delete document",
  section: DocumentSection,
  icon: <CrossIcon />,
  dangerous: true,
  visible: ({ activeDocumentId, stores }) => {
    if (!activeDocumentId) {
      return false;
    }
    return !!stores.policies.abilities(activeDocumentId).permanentDelete;
  },
  perform: ({ activeDocumentId, stores, t }) => {
    if (activeDocumentId) {
      const document = stores.documents.get(activeDocumentId);
      if (!document) {
        return;
      }

      stores.dialogs.openModal({
        title: t("Permanently delete {{ documentName }}", {
          documentName: document.noun,
        }),
        content: (
          <DocumentPermanentDelete
            document={document}
            onSubmit={stores.dialogs.closeAllModals}
          />
        ),
      });
    }
  },
});

export const openDocumentComments = createAction({
  name: ({ t }) => t("Comments"),
  analyticsName: "Open comments",
  section: DocumentSection,
  icon: <MessageCircle />,
  visible: ({ activeDocumentId, stores }) => {
    const can = stores.policies.abilities(activeDocumentId ?? "");
    return (
      !!activeDocumentId &&
      can.comment &&
      !!stores.auth.team?.getPreference(TeamPreference.Commenting)
    );
  },
  perform: ({ activeDocumentId, stores }) => {
    if (!activeDocumentId) {
      return;
    }

    stores.ui.toggleComments(activeDocumentId);
  },
});

export const openDocumentHistory = createAction({
  name: ({ t }) => t("History"),
  analyticsName: "Open document history",
  section: DocumentSection,
  icon: <HistoryIcon />,
  visible: ({ activeDocumentId, stores }) => {
    const can = stores.policies.abilities(activeDocumentId ?? "");
    return !!activeDocumentId && can.read && !can.restore;
  },
  perform: ({ activeDocumentId, stores }) => {
    if (!activeDocumentId) {
      return;
    }
    const document = stores.documents.get(activeDocumentId);
    if (!document) {
      return;
    }
    history.push(documentHistoryPath(document));
  },
});

export const openDocumentInsights = createAction({
  name: ({ t }) => t("Insights"),
  analyticsName: "Open document insights",
  section: DocumentSection,
  icon: <Waypoints />,
  visible: ({ activeDocumentId, stores }) => {
    const can = stores.policies.abilities(activeDocumentId ?? "");
    const document = activeDocumentId
      ? stores.documents.get(activeDocumentId)
      : undefined;

    return (
      !!activeDocumentId &&
      can.read &&
      !document?.isTemplate &&
      !document?.isDeleted
    );
  },
  perform: ({ activeDocumentId, stores }) => {
    if (!activeDocumentId) {
      return;
    }
    const document = stores.documents.get(activeDocumentId);
    if (!document) {
      return;
    }
    history.push(documentInsightsPath(document));
  },
});

export const rootDocumentActions = [
  openDocument,
  archiveDocument,
  createDocument,
  deleteDocument,
  downloadDocument,
  copyDocumentLink,
  starDocument,
  unstarDocument,
  publishDocument,
  unpublishDocument,
  subscribeDocument,
  unsubscribeDocument,
  permanentlyDeleteDocument,
  openDocumentComments,
  openDocumentHistory,
  openDocumentInsights,
  shareDocument,
];
