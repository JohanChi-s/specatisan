"use client";

import { usePathname } from "next/navigation";
import React, {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { Collection, Document, Workspace } from "../supabase/supabase.types";
import { getAllWorkspaces, getSharedWorkspaces } from "../supabase/queries";
import { useSupabaseUser } from "./supabase-user-provider";

export type appWorkspacesType = Workspace & {
  collections: Collection[] | [];
  documents: Document[] | [];
};

interface AppState {
  workspaces: appWorkspacesType[] | [];
  currentWorkspace: appWorkspacesType | null;
}

type Action =
  | { type: "ADD_WORKSPACE"; payload: appWorkspacesType }
  | { type: "DELETE_WORKSPACE"; payload: string }
  | {
      type: "UPDATE_WORKSPACE";
      payload: { workspace: Partial<appWorkspacesType>; workspaceId: string };
    }
  | {
      type: "SET_WORKSPACES";
      payload: { workspaces: appWorkspacesType[] };
    }
  | {
      type: "SET_CURRENT_WORKSPACES";
      payload: { workspace: appWorkspacesType };
    }
  | {
      type: "SET_FOLDERS";
      payload: { workspaceId: string; collections: Collection[] | [] };
    }
  | {
      type: "ADD_FOLDER";
      payload: { workspaceId: string; collection: Collection };
    }
  | {
      type: "ADD_FILE";
      payload: {
        workspaceId: string;
        document: Document;
      };
    }
  | {
      type: "DELETE_FOLDER";
      payload: { workspaceId: string; collectionId: string };
    }
  | {
      type: "SET_FILES";
      payload: {
        workspaceId: string;
        documents: Document[];
      };
    }
  | {
      type: "UPDATE_FOLDER";
      payload: {
        collection: Partial<Collection>;
        workspaceId: string;
        collectionId: string;
      };
    }
  | {
      type: "UPDATE_FILE";
      payload: {
        document: Partial<Document>;
        workspaceId: string;
        fileId: string;
      };
    };

const initialState: AppState = { workspaces: [], currentWorkspace: null };

const appReducer = (
  state: AppState = initialState,
  action: Action
): AppState => {
  switch (action.type) {
    case "ADD_WORKSPACE":
      return {
        ...state,
        workspaces: [...state.workspaces, action.payload],
      };
    case "DELETE_WORKSPACE":
      return {
        ...state,
        workspaces: state.workspaces.filter(
          (workspace) => workspace.id !== action.payload
        ),
      };
    case "UPDATE_WORKSPACE":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              ...action.payload.workspace,
            };
          }
          return workspace;
        }),
      };
    case "SET_WORKSPACES":
      return {
        ...state,
        workspaces: action.payload.workspaces,
      };
    case "SET_CURRENT_WORKSPACES":
      return {
        ...state,
        currentWorkspace: action.payload.workspace,
      };
    case "SET_FOLDERS":
      console.log("workspace ===", state.workspaces.length);
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            console.log("workspace111", workspace, action.payload.collections);
            return {
              ...workspace,
              collections: action.payload.collections,
            };
          }
          return workspace;
        }),
      };
    case "ADD_FOLDER":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          return {
            ...workspace,
            collections: [
              ...workspace.collections,
              action.payload.collection,
            ].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            ),
          };
        }),
      };
    case "UPDATE_FOLDER":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              collections: workspace.collections.map((collection) => {
                if (collection.id === action.payload.collectionId) {
                  return { ...collection, ...action.payload.collection };
                }
                return collection;
              }),
            };
          }
          return workspace;
        }),
      };
    case "DELETE_FOLDER":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              collections: workspace.collections.filter(
                (collection) => collection.id !== action.payload.collectionId
              ),
            };
          }
          return workspace;
        }),
      };
    case "SET_FILES":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              ...workspace.collections,
              documents: action.payload.documents.sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              ),
            };
          }
          return workspace;
        }),
      };
    case "ADD_FILE":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              collections: workspace.collections.map((collection) => {
                return {
                  ...collection,
                };
              }),
            };
          }
          return workspace;
        }),
      };
    case "UPDATE_FILE":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              ...workspace.collections,
              documents: workspace.documents.map((document) => {
                if (document.id === action.payload.fileId) {
                  return {
                    ...document,
                    ...action.payload.document,
                  };
                }
                return document;
              }),
            };
          }
          return workspace;
        }),
      };
    default:
      return initialState;
  }
};

const AppStateContext = createContext<
  | {
      state: AppState;
      dispatch: Dispatch<Action>;
      workspaceId: string | undefined;
      collectionId: string | undefined;
      fileId: string | undefined;
    }
  | undefined
>(undefined);

interface AppStateProviderProps {
  children: React.ReactNode;
}

const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const pathname = usePathname();
  const { user } = useSupabaseUser();

  const workspaceId = useMemo(() => {
    const urlSegments = pathname?.split("/").filter(Boolean);
    if (urlSegments)
      if (urlSegments.length > 1) {
        return urlSegments[1];
      }
  }, [pathname]);

  const collectionId = useMemo(() => {
    const urlSegments = pathname?.split("/").filter(Boolean);
    if (urlSegments)
      if (urlSegments?.length > 2) {
        return urlSegments[2];
      }
  }, [pathname]);

  const fileId = useMemo(() => {
    const urlSegments = pathname?.split("/").filter(Boolean);
    if (urlSegments)
      if (urlSegments?.length > 3) {
        return urlSegments[3];
      }
  }, [pathname]);

  useEffect(() => {
    if (!workspaceId || !user?.id) return;
    const fetchWorkspaces = async () => {
      const { data, error } = await getAllWorkspaces(user.id);
      if (error || !data) {
        return;
      } else {
        const transformedData = data.map((workspace) => ({
          ...workspace,
          collections: [],
          documents: [],
        }));
        const currentWorkspace = transformedData.find(
          (w) => w.id === workspaceId
        );
        if (currentWorkspace) {
          dispatch({
            type: "SET_CURRENT_WORKSPACES",
            payload: { workspace: currentWorkspace },
          });
        }
        dispatch({
          type: "SET_WORKSPACES",
          payload: { workspaces: transformedData },
        });
      }
    };
    fetchWorkspaces();
  }, [user?.id, workspaceId]);

  useEffect(() => {
    console.log("App State Changed", state);
  }, [state]);

  return (
    <AppStateContext.Provider
      value={{ state, dispatch, workspaceId, collectionId, fileId }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
