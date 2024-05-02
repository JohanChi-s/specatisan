import { observer } from "mobx-react";
import { CheckCheck, X } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { s } from "@/shared/styles";
import Document from "@/models/Document";
import User from "@/models/User";
import useCurrentUser from "@/hooks/useCurrentUser";
import useStores from "@/hooks/useStores";
import useThrottledCallback from "@/hooks/useThrottledCallback";
import Empty from "../Empty";
import { InviteIcon, StyledListItem } from "./MemberListItem";

type Props = {
  /** The document being shared. */
  document: Document;
  /** The search query to filter users by. */
  query: string;
  /** A list of pending user ids that have not yet been invited. */
  pendingIds: string[];
  /** Callback to add a user to the pending list. */
  addPendingId: (id: string) => void;
  /** Callback to remove a user from the pending list. */
  removePendingId: (id: string) => void;
};

export const UserSuggestions = observer(
  ({ document, query, pendingIds, addPendingId, removePendingId }: Props) => {
    const { users } = useStores();
    const { t } = useTranslation();
    const user = useCurrentUser();

    const fetchUsersByQuery = useThrottledCallback(
      (query) => users.fetchPage({ query }),
      250
    );

    const suggestions = React.useMemo(
      () =>
        users
          .notInDocument(document.id, query)
          .filter((u) => u.id !== user.id && !u.isSuspended),
      [users, users.orderedData, document.id, document.members, user.id, query]
    );

    const pending = React.useMemo(
      () => pendingIds.map((id) => users.get(id)).filter(Boolean) as User[],
      [users, pendingIds]
    );

    React.useEffect(() => {
      if (query) {
        void fetchUsersByQuery(query);
      }
    }, [query, fetchUsersByQuery]);

    function getListItemProps(suggestion: User) {
      return {
        title: suggestion.name,
        subtitle: suggestion.email
          ? suggestion.email
          : suggestion.isViewer
          ? t("Viewer")
          : t("Editor"),
        image: (
          <Avatar
            model={suggestion}
            size={AvatarSize.Medium}
            showBorder={false}
          />
        ),
      };
    }

    const isEmpty = suggestions.length === 0;
    const suggestionsWithPending = suggestions.filter(
      (u) => !pendingIds.includes(u.id)
    );

    return (
      <>
        {pending.map((suggestion) => (
          <div className="flex items-center space-x-2" key={suggestion.id}>
            <div className="flex-shrink-0">
              <CheckCheck className={`text-${s("accent")}`} />
            </div>
            <div>{getListItemProps(suggestion)}</div>
            <div>
              <X className="hidden" />
            </div>
          </div>
        ))}
        {pending.length > 0 &&
          (suggestionsWithPending.length > 0 || isEmpty) && (
            <div className="border-t border-dashed border-gray-300 my-3" />
          )}
        {suggestionsWithPending.map((suggestion) => (
          <StyledListItem
            {...getListItemProps(suggestion)}
            key={suggestion.id}
            onClick={() => addPendingId(suggestion.id)}
            actions={<InviteIcon />}
          />
        ))}
        {isEmpty && <Empty style={{ marginTop: 22 }}>{t("No matches")}</Empty>}
      </>
    );
  }
);
