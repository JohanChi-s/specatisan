"use client";
import { MAX_COLLECTIONS_FREE_PLAN } from "@/lib/constants";
import { useAppState } from "@/lib/providers/state-provider";
import { Subscription } from "@/shared/supabase.types";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { DiamondIcon } from "lucide-react";

interface PlanUsageProps {
  collectionsLength: number;
  subscription: Subscription | null;
}

const PlanUsage: React.FC<PlanUsageProps> = ({
  collectionsLength,
  subscription,
}) => {
  const { workspaceId, state } = useAppState();
  const [usagePercentage, setUsagePercentage] = useState(
    (collectionsLength / MAX_COLLECTIONS_FREE_PLAN) * 100
  );

  useEffect(() => {
    const stateCollectionsLength = state.workspaces.find(
      (workspace) => workspace.id === workspaceId
    )?.collections.length;
    if (stateCollectionsLength === undefined) return;
    setUsagePercentage(
      (stateCollectionsLength / MAX_COLLECTIONS_FREE_PLAN) * 100
    );
  }, [state, workspaceId]);

  return (
    <article className="mb-4">
      {subscription?.status !== "active" && (
        <div
          className="flex 
          gap-2
          text-muted-foreground
          mb-2
          items-center
        "
        >
          <div className="h-4 w-4">
            <DiamondIcon />
          </div>
          <div
            className="flex 
        justify-between 
        w-full 
        items-center
        "
          >
            <div>Free Plan</div>
            <small>{usagePercentage.toFixed(0)}% / 100%</small>
          </div>
        </div>
      )}
      {subscription?.status !== "active" && (
        <Progress value={usagePercentage} className="h-1" />
      )}
    </article>
  );
};

export default PlanUsage;
