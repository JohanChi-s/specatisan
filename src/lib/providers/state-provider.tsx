"use client";

import React, {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { Document, Collection, workspace } from "../supabase/supabase.types";
import { usePathname } from "next/navigation";
import { getDocuments } from "@/lib/supabase/queries";

export type appCollectionsType = Collection & { documents: Document[] | [] };
export type appWorkspacesType = workspace & {
  collections: appCollectionsType[] | [];
};

interface AppState {
  workspaces: appWorkspacesType[] | [];
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
      payload: { workspaces: appWorkspacesType[] | [] };
    }
  | {
      type: "SET_FOLDERS";
      payload: { workspaceId: string; collections: [] | appCollectionsType[] };
    }
  | {
      type: "ADD_FOLDER";
      payload: { workspaceId: string; collection: appCollectionsType };
    }
  | {
      type: "ADD_FILE";
      payload: {
        workspaceId: string;
        document: Document;
        collectionId: string;
      };
    }
  | {
      type: "DELETE_FILE";
      payload: { workspaceId: string; collectionId: string; fileId: string };
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
        collectionId: string;
      };
    }
  | {
      type: "UPDATE_FOLDER";
      payload: {
        collection: Partial<appCollectionsType>;
        workspaceId: string;
        collectionId: string;
      };
    }
  | {
      type: "UPDATE_FILE";
      payload: {
        document: Partial<Document>;
        collectionId: string;
        workspaceId: string;
        fileId: string;
      };
    };

const initialState: AppState = { workspaces: [] };

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
    case "SET_FOLDERS":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              collections: action.payload.collections.sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              ),
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
              collections: workspace.collections.map((collection) => {
                if (collection.id === action.payload.collectionId) {
                  return {
                    ...collection,
                    documents: action.payload.documents,
                  };
                }
                return collection;
              }),
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
                if (collection.id === action.payload.collectionId) {
                  return {
                    ...collection,
                    documents: [
                      ...collection.documents,
                      action.payload.document,
                    ].sort(
                      (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    ),
                  };
                }
                return collection;
              }),
            };
          }
          return workspace;
        }),
      };
    case "DELETE_FILE":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              collection: workspace.collections.map((collection) => {
                if (collection.id === action.payload.collectionId) {
                  return {
                    ...collection,
                    documents: collection.documents.filter(
                      (document) => document.id !== action.payload.fileId
                    ),
                  };
                }
                return collection;
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
              collections: workspace.collections.map((collection) => {
                if (collection.id === action.payload.collectionId) {
                  return {
                    ...collection,
                    documents: collection.documents.map((document) => {
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
                return collection;
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
    if (!collectionId || !workspaceId) return;
    const fetchDocuments = async () => {
      const { error: filesError, data } = await getDocuments(collectionId);
      if (filesError) {
        console.log(filesError);
      }
      if (!data) return;
      dispatch({
        type: "SET_FILES",
        payload: { workspaceId, documents: data, collectionId },
      });
    };
    fetchDocuments();
  }, [collectionId, workspaceId]);

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
