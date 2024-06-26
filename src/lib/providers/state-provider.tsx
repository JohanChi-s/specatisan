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
import {
  getCollections,
  getDocumentByWorkspaceId,
  getStars,
  getTags,
  getUserPermission,
  getUserWorkspaces,
} from "../supabase/queries";
import {
  Collection,
  Document,
  DocumentWithTags,
  StarWithDocument,
  Tag,
  Workspace,
} from "../supabase/supabase.types";
import { useSupabaseUser } from "./supabase-user-provider";

interface AppState {
  workspaces: Workspace[] | [];
  currentWorkspace: Workspace | null;
  collections: Collection[] | [];
  tags: Tag[] | [];
  favorites: StarWithDocument[] | [];
  documents: DocumentWithTags[] | [];
  userPermisison: string | undefined;
}

type Action =
  | { type: "ADD_WORKSPACE"; payload: Workspace }
  | { type: "DELETE_WORKSPACE"; payload: string }
  | {
      type: "UPDATE_WORKSPACE";
      payload: { workspace: Partial<Workspace>; workspaceId: string };
    }
  | {
      type: "SET_WORKSPACES";
      payload: { workspaces: Workspace[] };
    }
  | {
      type: "SET_CURRENT_WORKSPACES";
      payload: { workspace: Workspace };
    }
  | {
      type: "SET_COLLECTIONS";
      payload: { workspaceId: string; collections: Collection[] | [] };
    }
  | {
      type: "ADD_COLLECTION";
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
      type: "DELETE_COLLECTION";
      payload: { workspaceId: string; collectionId: string };
    }
  | {
      type: "SET_FILES";
      payload: {
        workspaceId: string;
        documents: DocumentWithTags[];
      };
    }
  | {
      type: "UPDATE_COLLECTION";
      payload: {
        collection: Partial<Collection>;
        workspaceId: string;
        collectionId: string;
      };
    }
  | {
      type: "UPDATE_FILE";
      payload: {
        document: Partial<DocumentWithTags>;
        workspaceId: string;
        fileId: string;
      };
    }
  | {
      type: "CREATE_TAG";
      payload: {
        tag: Tag;
        workspaceId: string;
      };
    }
  | {
      type: "SET_TAGS";
      payload: {
        tags: Tag[];
        workspaceId: string;
      };
    }
  | {
      type: "UPDATE_TAG";
      payload: {
        tag: Partial<Tag>;
        tagId: string;
        workspaceId: string;
      };
    }
  | {
      type: "DELETE_TAG";
      payload: {
        tagId: string;
        workspaceId: string;
      };
    }
  | {
      type: "SET_FAVORITES";
      payload: {
        favorites: StarWithDocument[];
        workspaceId: string;
      };
    }
  | {
      type: "ADD_FAVORITE";
      payload: {
        favorite: StarWithDocument;
        workspaceId: string;
      };
    }
  | {
      type: "DELETE_FAVORITE";
      payload: {
        favoriteId: string;
        workspaceId: string;
      };
    }
  | {
      type: "SET_USER_PERMISSION";
      payload: {
        permission: string;
        workspaceId: string;
      };
    }
  | {
      type: "UPDATE_USER_PERMISSION";
      payload: {
        permission: string;
        workspaceId: string;
      };
    };

const initialState: AppState = {
  workspaces: [],
  currentWorkspace: null,
  tags: [],
  collections: [],
  favorites: [],
  documents: [],
  userPermisison: undefined,
};

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
    case "SET_COLLECTIONS":
      return {
        ...state,
        collections: action.payload.collections,
      };
    case "ADD_COLLECTION":
      return {
        ...state,
        collections: [...state.collections, action.payload.collection],
      };
    case "UPDATE_COLLECTION":
      return {
        ...state,
        collections: state.collections.map((collection) => {
          if (collection.id === action.payload.collectionId) {
            return {
              ...collection,
              ...action.payload.collection,
            };
          }
          return collection;
        }),
      };
    case "DELETE_COLLECTION":
      return {
        ...state,
        collections: state.collections.filter(
          (collection) => collection.id !== action.payload.collectionId
        ),
      };
    case "SET_FILES":
      return {
        ...state,
        documents: action.payload.documents,
      };
    case "ADD_FILE":
      return {
        ...state,
        documents: [
          ...state.documents,
          action.payload.document as DocumentWithTags,
        ],
      };
    case "UPDATE_FILE":
      return {
        ...state,
        documents: state.documents.map((document) => {
          if (document.id === action.payload.fileId) {
            return {
              ...document,
              ...action.payload.document,
            };
          }
          return document;
        }),
      };
    case "SET_TAGS":
      return {
        ...state,
        tags: action.payload.tags,
      };
    case "CREATE_TAG":
      return {
        ...state,
        tags: [...state.tags, action.payload.tag],
      };
    case "UPDATE_TAG":
      return {
        ...state,
        tags: state.tags.map((tag) => {
          if (tag.id === action.payload.tagId) {
            return {
              ...tag,
              ...action.payload.tag,
            };
          }
          return tag;
        }),
      };
    case "DELETE_TAG":
      return {
        ...state,
        tags: state.tags.filter((tag) => tag.id !== action.payload.tagId),
      };
    case "SET_FAVORITES":
      return {
        ...state,
        favorites: action.payload.favorites,
      };
    case "ADD_FAVORITE":
      return {
        ...state,
        favorites: [...state.favorites, action.payload.favorite],
      };
    case "DELETE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter(
          (favorite) => favorite.id !== action.payload.favoriteId
        ),
      };
    case "SET_USER_PERMISSION":
      return {
        ...state,
        userPermisison: action.payload.permission,
      };
    case "UPDATE_USER_PERMISSION":
      return {
        ...state,
        userPermisison: action.payload.permission,
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

  useEffect(() => {
    if (!user?.id || !workspaceId) return;
    const fetchData = async (userId: string, workspaceId: string) => {
      try {
        const { data: workspaces, error: workspacesError } =
          await getUserWorkspaces(userId);
        if (workspacesError || !workspaces) return;

        const currentWorkspace = workspaces.find((w) => w.id === workspaceId);

        if (currentWorkspace) {
          dispatch({
            type: "SET_CURRENT_WORKSPACES",
            payload: { workspace: currentWorkspace },
          });
        }
        dispatch({
          type: "SET_WORKSPACES",
          payload: { workspaces: workspaces },
        });

        const { data: tags, error: tagsError } = await getTags(workspaceId);
        if (!tagsError && tags) {
          dispatch({ type: "SET_TAGS", payload: { tags, workspaceId } });
        }

        const { data: documents, error: docError } =
          await getDocumentByWorkspaceId(workspaceId);
        if (!docError && documents) {
          dispatch({
            type: "SET_FILES",
            payload: { documents, workspaceId },
          });
        }

        // set collections
        const { data: collections, error: collectionsError } =
          await getCollections(workspaceId);
        if (!collectionsError && collections) {
          dispatch({
            type: "SET_COLLECTIONS",
            payload: { workspaceId, collections },
          });
        }

        const { data: favorites, error: favoriteError } = await getStars(
          userId,
          workspaceId
        );
        if (!favoriteError && favorites) {
          dispatch({
            type: "SET_FAVORITES",
            payload: { favorites, workspaceId },
          });
        }

        const { data: currentUserPermission, error: permissionError } =
          await getUserPermission(workspaceId, userId);
        if (!permissionError && currentUserPermission) {
          dispatch({
            type: "SET_USER_PERMISSION",
            payload: {
              permission: currentUserPermission.permission,
              workspaceId,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData(user?.id, workspaceId);
  }, [user?.id, workspaceId]);
  return (
    <AppStateContext.Provider value={{ state, dispatch, workspaceId }}>
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
