import { createTag, getTags } from "@/lib/supabase/queries";
import { Tag } from "@/lib/supabase/supabase.types";
import { createStore } from "zustand/vanilla";

export type TagState = {
  tags: Tag[];
};

export type TagActions = {
  fetchTags: (workspaceId: string) => Promise<void>;
};

export type TagStore = TagState & TagActions;

export const defaultInitialState: TagState = {
  tags: [],
};

export const createCounterStore = (
  initState: TagState = defaultInitialState
) => {
  return createStore<TagStore>()((set) => ({
    ...initState,
    fetchTags: async (workspaceId: string) => {
      const { data, error } = await getTags(workspaceId);
      if (data) {
        set({ tags: data });
      }
      if (error) {
        console.error("Error fetching tags:", error);
      }
    },
  }));
};
