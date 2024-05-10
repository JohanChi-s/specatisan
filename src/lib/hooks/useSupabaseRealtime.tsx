import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect } from "react";
import { useAppState } from "../providers/state-provider";

import { Document } from "../supabase/supabase.types";
import { useRouter } from "next/navigation";

const useSupabaseRealtime = () => {
  const supabase = createClientComponentClient();
  const { dispatch, state, workspaceId: selectedWorskpace } = useAppState();
  const router = useRouter();
  useEffect(() => {
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents" },
        async (payload) => {
          if (payload.eventType === "UPDATE") {
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, state, selectedWorskpace, dispatch, router]);

  return null;
};

export default useSupabaseRealtime;
