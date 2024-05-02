import { observer } from "mobx-react";
import { PlusIcon } from "lucide-react";
import * as React from "react";
import { Trans, useTranslation } from "react-i18next";
import { DocumentPermission } from "@/shared/types";
import User from "@/models/User";
import UserMembership from "@/models/UserMembership";
import InputMemberPermissionSelect from "@/components/InputMemberPermissionSelect";
import ListItem from "@/components/List/Item";
import { EmptySelectValue, Permission } from "@/app/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  user: User;
  membership?: UserMembership | undefined;
  onAdd?: () => void;
  onRemove?: () => void;
  onLeave?: () => void;
  onUpdate?: (permission: DocumentPermission) => void;
};

const MemberListItem = ({
  user,
  membership,
  onRemove,
  onLeave,
  onUpdate,
}: Props) => {
  const { t } = useTranslation();

  const handleChange = React.useCallback(
    (permission: DocumentPermission | typeof EmptySelectValue) => {
      if (permission === EmptySelectValue) {
        onRemove?.();
      } else {
        onUpdate?.(permission);
      }
    },
    [onRemove, onUpdate]
  );

  const permissions: Permission[] = [
    {
      label: t("View only"),
      value: DocumentPermission.Read,
    },
    {
      label: t("Can edit"),
      value: DocumentPermission.ReadWrite,
    },
    {
      label: t("No access"),
      value: EmptySelectValue,
    },
  ];

  const currentPermission = permissions.find(
    (p) => p.value === membership?.permission
  );
  if (!currentPermission) {
    return null;
  }
  const disabled = !onUpdate && !onLeave;
  const MaybeLink = membership?.source ? "a" : React.Fragment;

  return (
    <ListItem
      title={user.name}
      image={
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      }
      subtitle={
        membership?.sourceId ? (
          <Trans>
            Has access through{" "}
            <MaybeLink href={membership.source?.document?.path ?? ""}>
              parent
            </MaybeLink>
          </Trans>
        ) : user.isSuspended ? (
          t("Suspended")
        ) : user.email ? (
          user.email
        ) : user.isInvited ? (
          t("Invited")
        ) : user.isViewer ? (
          t("Viewer")
        ) : (
          t("Editor")
        )
      }
      actions={
        disabled ? null : (
          <div className="mr-[-8px]">
            <InputMemberPermissionSelect
              permissions={
                onLeave
                  ? [
                      currentPermission,
                      {
                        label: `${t("Leave")}…`,
                        value: EmptySelectValue,
                      },
                    ]
                  : permissions
              }
              value={membership?.permission}
              onChange={handleChange}
            />
          </div>
        )
      }
      className="m-0 -mx-16 p-6 px-16 rounded-8"
    />
  );
};

export const InviteIcon = PlusIcon;

export default observer(MemberListItem);
