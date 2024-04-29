import { PlusIcon } from "lucide-react";
import * as React from "react";
import styled from "styled-components";
import { stringToColor } from "@/shared/utils/color";
import RootStore from "@/stores/RootStore";
import TeamNew from "@/scenes/TeamNew";
import TeamLogo from "@/components/TeamLogo";
import { createAction } from "@/actions";
import { ActionContext } from "@/app/types";
import { TeamSection } from "../sections";

export const createTeamsList = ({ stores }: { stores: RootStore }) =>
  stores.auth.availableTeams?.map((session) => ({
    id: `switch-${session.id}`,
    name: session.name,
    analyticsName: "Switch workspace",
    section: TeamSection,
    keywords: "change switch workspace organization team",
    icon: function _Icon() {
      return (
        <StyledTeamLogo
          alt={session.name}
          model={{
            initial: session.name[0],
            avatarUrl: session.avatarUrl,
            id: session.id,
            color: stringToColor(session.id),
          }}
          size={24}
        />
      );
    },
    visible: ({ currentTeamId }: ActionContext) => currentTeamId !== session.id,
    perform: () => (window.location.href = session.url),
  })) ?? [];

export const switchTeam = createAction({
  name: ({ t }) => t("Switch workspace"),
  placeholder: ({ t }) => t("Select a workspace"),
  analyticsName: "Switch workspace",
  keywords: "change switch workspace organization team",
  section: TeamSection,
  visible: ({ stores }) =>
    !!stores.auth.availableTeams && stores.auth.availableTeams?.length > 1,
  children: createTeamsList,
});

export const createTeam = createAction({
  name: ({ t }) => `${t("New workspace")}…`,
  analyticsName: "New workspace",
  keywords: "create change switch workspace organization team",
  section: TeamSection,
  icon: <PlusIcon />,
  visible: ({ stores, currentTeamId }) =>
    stores.policies.abilities(currentTeamId ?? "").createTeam,
  perform: ({ t, event, stores }) => {
    event?.preventDefault();
    event?.stopPropagation();
    const { user } = stores.auth;
    user &&
      stores.dialogs.openModal({
        title: t("Create a workspace"),
        fullscreen: true,
        content: <TeamNew user={user} />,
      });
  },
});

const StyledTeamLogo = styled(TeamLogo)`
  border-radius: 2px;
  border: 0;
`;

export const rootTeamActions = [switchTeam, createTeam];
