import { createAction } from "@/actions";
import { UserSection } from "@/actions/sections";
import CopyToClipboard from "@/components/CopyToClipboard";
import useActionContext from "@/hooks/useActionContext";
import useBoolean from "@/hooks/useBoolean";
import useCurrentTeam from "@/hooks/useCurrentTeam";
import useKeyDown from "@/hooks/useKeyDown";
import useMobile from "@/hooks/useMobile";
import usePolicy from "@/hooks/usePolicy";
import useStores from "@/hooks/useStores";
import Document from "@/models/Document";
import Share from "@/models/Share";
import { documentPath, urlify } from "@/utils/routeHelpers";
import { ChevronLeft, LinkIcon } from "lucide-react";
import { observer } from "mobx-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ActionButton from "../ActionButton";
import Input from "../Input";
import { Separator } from "../ui/separator";
import { Tooltip } from "../ui/tooltip";
import DocumentMembersList from "./DocumentMemberList";
import { OtherAccess } from "./OtherAccess";
import PublicAccess from "./PublicAccess";
import { UserSuggestions } from "./UserSuggestions";

type Props = {
  /** The document to share. */
  document: Document;
  /** The existing share model, if any. */
  share: Share | null | undefined;
  /** The existing share parent model, if any. */
  sharedParent: Share | null | undefined;
  /** Callback fired when the popover requests to be closed. */
  onRequestClose: () => void;
  /** Whether the popover is visible. */
  visible: boolean;
};

const presence = {
  initial: {
    opacity: 0,
    width: 0,
    marginRight: 0,
  },
  animate: {
    opacity: 1,
    width: "auto",
    marginRight: 8,
    transition: {
      type: "spring",
      duration: 0.2,
      bounce: 0,
    },
  },
  exit: {
    opacity: 0,
    width: 0,
    marginRight: 0,
  },
};

function SharePopover({
  document,
  share,
  sharedParent,
  onRequestClose,
  visible,
}: Props) {
  const team = useCurrentTeam();
  const { t } = useTranslation();
  const can = usePolicy(document);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { users, userMemberships } = useStores();
  const isMobile = useMobile();
  const [query, setQuery] = React.useState("");
  const [picker, showPicker, hidePicker] = useBoolean();
  const timeout = React.useRef<ReturnType<typeof setTimeout>>();
  const linkButtonRef = React.useRef<HTMLButtonElement>(null);
  const [invitedInSession, setInvitedInSession] = React.useState<string[]>([]);
  const [pendingIds, setPendingIds] = React.useState<string[]>([]);
  const collectionSharingDisabled = document.collection?.sharing === false;

  useKeyDown(
    "Escape",
    (ev) => {
      ev.preventDefault();
      ev.stopImmediatePropagation();

      if (picker) {
        hidePicker();
      } else {
        onRequestClose();
      }
    },
    {
      allowInInput: true,
    }
  );

  React.useEffect(() => {
    if (visible) {
      void document.share();
    }
  }, [document, hidePicker, visible]);

  React.useEffect(() => {
    if (visible) {
      setPendingIds([]);
      hidePicker();
    }
  }, [hidePicker, visible]);

  React.useEffect(() => {
    if (!picker) {
      setQuery("");
    }
  }, [picker]);

  const handleCopied = React.useCallback(() => {
    onRequestClose();

    timeout.current = setTimeout(() => {
      toast.message(t("Link copied to clipboard"));
    }, 100);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [onRequestClose, t]);

  const context = useActionContext();

  const inviteAction = React.useMemo(
    () =>
      createAction({
        name: t("Invite"),
        section: UserSection,
        perform: async () => {
          await Promise.all(
            pendingIds.map((userId) =>
              userMemberships.create({
                documentId: document.id,
                userId,
              })
            )
          );

          if (pendingIds.length === 1) {
            const user = users.get(pendingIds[0]);
            toast.message(
              t("{{ userName }} was invited to the document", {
                userName: user!.name,
              })
            );
          } else {
            toast.message(
              t("{{ count }} people invited to the document", {
                count: pendingIds.length,
              })
            );
          }

          setInvitedInSession((prev) => [...prev, ...pendingIds]);
          setPendingIds([]);
          hidePicker();
        },
      }),
    [document.id, hidePicker, pendingIds, t, users, userMemberships]
  );

  const handleQuery = React.useCallback(
    (event) => {
      showPicker();
      setQuery(event.target.value);
    },
    [showPicker, setQuery]
  );

  const focusInput = React.useCallback(() => {
    if (!picker) {
      inputRef.current?.focus();
      showPicker();
    }
  }, [picker, showPicker]);

  const handleAddPendingId = React.useCallback(
    (id: string) => {
      setPendingIds((prev) => [...prev, id]);
    },
    [setPendingIds]
  );

  const handleRemovePendingId = React.useCallback(
    (id: string) => {
      setPendingIds((prev) => prev.filter((i) => i !== id));
    },
    [setPendingIds]
  );

  const backButton = (
    <>
      {picker && (
        <button
          key="back"
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
          onClick={hidePicker}
        >
          <ChevronLeft />
        </button>
      )}
    </>
  );

  const rightButton = picker ? (
    pendingIds.length ? (
      <ActionButton action={inviteAction} context={context} key="invite">
        {t("Invite")}
      </ActionButton>
    ) : null
  ) : (
    <Tooltip key="copy-link">
      <CopyToClipboard
        text={urlify(documentPath(document))}
        onCopy={handleCopied}
      >
        <button
          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
          disabled={!share}
          ref={linkButtonRef}
        >
          <LinkIcon size={20} />
        </button>
      </CopyToClipboard>
    </Tooltip>
  );

  return (
    <div>
      {can.manageUsers &&
        (isMobile ? (
          <div className="flex items-center mb-3">
            {backButton}
            <Input
              key="input"
              placeholder={`${t("Invite by name")}…`}
              value={query}
              onChange={handleQuery}
              onClick={showPicker}
              autoFocus
              margin={0}
              flex
            >
              {rightButton}
            </Input>
          </div>
        ) : (
          <div className="sticky top-0 bg-white text-black border-b border-gray-300 p-3 -ml-3 -mr-3 -mb-2 cursor-text">
            <div className="flex items-center">
              {backButton}
              <input
                key="input"
                ref={inputRef}
                placeholder={`${t("Invite by name")}…`}
                value={query}
                onChange={handleQuery}
                onClick={showPicker}
                style={{ padding: "6px 0" }}
                className="flex-grow px-2"
              />
              {rightButton}
            </div>
          </div>
        ))}

      {picker && (
        <div>
          <UserSuggestions
            document={document}
            query={query}
            pendingIds={pendingIds}
            addPendingId={handleAddPendingId}
            removePendingId={handleRemovePendingId}
          />
        </div>
      )}

      <div style={{ display: picker ? "none" : "block" }}>
        <OtherAccess document={document}>
          <DocumentMembersList
            document={document}
            invitedInSession={invitedInSession}
          />
        </OtherAccess>

        {team.sharing && can.share && !collectionSharingDisabled && (
          <>
            {document.members.length ? <Separator /> : null}
            <PublicAccess
              document={document}
              share={share}
              sharedParent={sharedParent}
              onRequestClose={onRequestClose}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default observer(SharePopover);
