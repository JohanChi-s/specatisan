"use client";

import { getDocumentByCollectionId } from "@/server/api/document";
import { usePathname } from "next/navigation";
import React, {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { Collection, Document, Workspace } from "../../shared/supabase.types";

export type appCollectionsType = Collection & { documents: Document[] | [] };
export type appWorkspacesType = Workspace & {
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
      type: "SET_COLLECTIONS";
      payload: { workspaceId: string; collections: [] | appCollectionsType[] };
    }
  | {
      type: "ADD_COLLECTION";
      payload: { workspaceId: string; collection: appCollectionsType };
    }
  | {
      type: "ADD_DOCUMENT";
      payload: {
        workspaceId: string;
        document: Document;
        collectionId: string;
      };
    }
  | {
      type: "DELETE_DOCUMENT";
      payload: {
        workspaceId: string;
        collectionId: string;
        documentId: string;
      };
    }
  | {
      type: "DELETE_COLLECTION";
      payload: { workspaceId: string; collectionId: string };
    }
  | {
      type: "SET_DOCUMENTS";
      payload: {
        workspaceId: string;
        documents: Document[];
        collectionId: string;
      };
    }
  | {
      type: "UPDATE_COLLECTION";
      payload: {
        collection: Partial<appCollectionsType>;
        workspaceId: string;
        collectionId: string;
      };
    }
  | {
      type: "UPDATE_DOCUMENT";
      payload: {
        document: Partial<Document>;
        collectionId: string;
        workspaceId: string;
        documentId: string;
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
    case "SET_COLLECTIONS":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              collections: action.payload.collections.sort(
                (a, b) =>
                  new Date(a.createAt).getTime() -
                  new Date(b.createAt).getTime()
              ),
            };
          }
          return workspace;
        }),
      };
    case "ADD_COLLECTION":
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
                new Date(a.createAt).getTime() - new Date(b.createAt).getTime()
            ),
          };
        }),
      };
    case "UPDATE_COLLECTION":
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
    case "DELETE_COLLECTION":
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
    case "SET_DOCUMENTS":
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
    case "ADD_DOCUMENT":
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
    case "DELETE_DOCUMENT":
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
                      (document) => document.id !== action.payload.documentId
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
    case "UPDATE_DOCUMENT":
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
                      if (document.id === action.payload.documentId) {
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
      documentId: string | undefined;
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

  const documentId = useMemo(() => {
    const urlSegments = pathname?.split("/").filter(Boolean);
    if (urlSegments)
      if (urlSegments?.length > 3) {
        return urlSegments[3];
      }
  }, [pathname]);

  useEffect(() => {
    if (!collectionId || !workspaceId) return;
    const fetchDocuments = async () => {
      const { error: documentsError, data } = await getDocumentByCollectionId(
        collectionId
      );
      if (documentsError) {
        console.log(documentsError);
      }
      if (!data) return;
      dispatch({
        type: "SET_DOCUMENTS",
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
      value={{ state, dispatch, workspaceId, collectionId, documentId }}
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
