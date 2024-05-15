"use server";
import { and, eq, ilike, notExists } from "drizzle-orm";
import { validate } from "uuid";
import db from "./db";
import {
  collaborators,
  collections,
  documents,
  tags,
  tagsToDocuments,
  users,
  workspaces,
} from "./schema";
import {
  Collection,
  Document,
  DocumentWithTags,
  Subscription,
  Tag,
  User,
  Workspace,
} from "./supabase.types";
import { omit } from "lodash";

export const createWorkspace = async (workspace: Workspace) => {
  try {
    const response = await db.insert(workspaces).values(workspace);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error: "Failed to create workspace due to an internal error",
    };
  }
};

export const deleteWorkspace = async (workspaceId: string) => {
  if (!workspaceId) return;
  await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
};

export const getUserSubscriptionStatus = async (userId: string) => {
  try {
    const data = await db.query.subscriptions.findFirst({
      where: (s, { eq }) => eq(s.userId, userId),
    });
    if (data) return { data: data as Subscription, error: null };
    else return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error` };
  }
};

export const getCollections = async (workspaceId: string) => {
  const isValid = validate(workspaceId);
  if (!isValid)
    return {
      data: null,
      error: "Invalid workspace ID provided",
    };

  try {
    const results: Collection[] = await db
      .select()
      .from(collections)
      .orderBy(collections.createdAt)
      .where(eq(collections.workspaceId, workspaceId));
    return { data: results as Collection[], error: null };
  } catch (error) {
    console.log("err: ", error);

    return { data: null, error: "Error" };
  }
};

export const getWorkspaceDetails = async (workspaceId: string) => {
  const isValid = validate(workspaceId);
  if (!isValid)
    return {
      data: [],
      error: "Error",
    };

  try {
    const response = (await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1)) as Workspace[];
    return { data: response, error: null };
  } catch (error) {
    console.log(error);
    return { data: [], error: "Error" };
  }
};

export const getDocumentDetails = async (fileId: string) => {
  const isValid = validate(fileId);
  if (!isValid) {
    return { data: null, error: "Error" };
  }
  try {
    const response = await db.query.documents.findFirst({
      where: (d, { eq }) => eq(d.id, fileId),
    });
    return { data: response as Document, error: null };
  } catch (error) {
    console.log("🔴Error", error);
    return { data: null, error: "Error" };
  }
};

export const deleteDocument = async (fileId: string) => {
  const isValid = validate(fileId);
  if (!isValid) return { data: null, error: "INVALID_FILE_ID" };
  try {
    const response = await db.delete(documents).where(eq(documents.id, fileId));
    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};

// delete collection
export const deleteCollection = async (collectionId: string) => {
  const isValid = validate(collectionId);
  if (!isValid) return { data: null, error: "INVALID_COLLECTION_ID" };
  try {
    const response = await db
      .delete(collections)
      .where(eq(collections.id, collectionId));
    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};
export const getCollectionDetails = async (collectionId: string) => {
  const isValid = validate(collectionId);
  if (!isValid) {
    data: [];
    error: "Error";
  }

  try {
    const response = (await db
      .select()
      .from(collections)
      .where(eq(collections.id, collectionId))
      .limit(1)) as Collection[];

    return { data: response, error: null };
  } catch (error) {
    return { data: [], error: "Error" };
  }
};

export const getPrivateWorkspaces = async (userId: string) => {
  if (!userId) return [];
  const privateWorkspaces = (await db
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .where(
      and(
        notExists(
          db
            .select()
            .from(collaborators)
            .where(eq(collaborators.workspaceId, workspaces.id))
        ),
        eq(workspaces.workspaceOwner, userId)
      )
    )) as Workspace[];
  return privateWorkspaces;
};

export const getCollaboratingWorkspaces = async (userId: string) => {
  if (!userId) return [];
  const collaboratedWorkspaces = (await db
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(users)
    .innerJoin(collaborators, eq(users.id, collaborators.userId))
    .innerJoin(workspaces, eq(collaborators.workspaceId, workspaces.id))
    .where(eq(users.id, userId))) as Workspace[];
  return collaboratedWorkspaces;
};

export const getSharedWorkspaces = async (userId: string) => {
  if (!userId) return [];
  const sharedWorkspaces = (await db
    .selectDistinct({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .orderBy(workspaces.createdAt)
    .innerJoin(collaborators, eq(workspaces.id, collaborators.workspaceId))
    .where(eq(workspaces.workspaceOwner, userId))) as Workspace[];
  return sharedWorkspaces;
};

// get All workspaces
export const getAllWorkspaces = async (userId: string) => {
  if (!userId) return { data: null, error: "Bad Request" };
  try {
    const resp = (await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.workspaceOwner, userId))) as Workspace[];
    return { data: resp, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};

export const getDocuments = async (collectionId: string) => {
  const isValid = validate(collectionId);
  if (!isValid) return { data: null, error: "Error" };
  try {
    const results = (await db
      .select()
      .from(documents)
      .orderBy(documents.createdAt)
      .where(eq(documents.collectionId, collectionId))) as Document[] | [];
    return { data: results, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

// get Document by workspaceId
export const getDocumentByWorkspaceId = async (workspaceId: string) => {
  const isValid = validate(workspaceId);
  if (!isValid) return { data: [], error: "Error" };
  try {
    const results = await db.query.documents.findMany({
      where: (doc, { eq }) => eq(doc.workspaceId, workspaceId),
      with: {
        tagsToDocuments: {
          with: {
            tag: true,
          },
        },
      },
    });
    const documetnWithTags: DocumentWithTags[] = results.map((r) => {
      const tags: Tag[] = [];
      r.tagsToDocuments.map((t) => {
        tags.push(t.tag);
      });
      omit(r, "tagsToDocuments");
      return { ...r, tags };
    });
    return { data: documetnWithTags, error: null };
  } catch (error) {
    console.log(error);
    return { data: [], error: "Error" };
  }
};

// get Documents by collectionId
export const getDocumentsByCollectionId = async (collectionId: string) => {
  const isValid = validate(collectionId);
  if (!isValid) return { data: [], error: "Error" };
  try {
    const results = await db.query.documents.findMany({
      where: (doc, { eq }) => eq(doc.collectionId, collectionId),
      with: {
        tagsToDocuments: {
          with: {
            tag: true,
          },
        },
      },
    });
    console.log("🚀 ~ getDocumentsByCollectionId ~ results:", results);
    const documetnWithTags: DocumentWithTags[] = results.map((r) => {
      const tags: Tag[] = [];
      r.tagsToDocuments.map((t) => {
        tags.push(t.tag);
      });
      omit(r, "tagsToDocuments");
      return { ...r, tags };
    });
    return { data: documetnWithTags, error: null };
  } catch (error) {
    console.log(error);
    return { data: [], error: "Error" };
  }
};

export const addCollaborators = async (users: User[], workspaceId: string) => {
  const response = users.forEach(async (user: User) => {
    const userExists = await db.query.collaborators.findFirst({
      where: (u, { eq }) =>
        and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId)),
    });
    if (!userExists)
      await db.insert(collaborators).values({ workspaceId, userId: user.id });
  });
};

export const removeCollaborators = async (
  users: User[],
  workspaceId: string
) => {
  const response = users.forEach(async (user: User) => {
    const userExists = await db.query.collaborators.findFirst({
      where: (u, { eq }) =>
        and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId)),
    });
    if (userExists)
      await db
        .delete(collaborators)
        .where(
          and(
            eq(collaborators.workspaceId, workspaceId),
            eq(collaborators.userId, user.id)
          )
        );
  });
};

export const findUser = async (userId: string) => {
  const response = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });
  return response;
};

export const getActiveProductsWithPrice = async () => {
  try {
    const res = await db.query.products.findMany({
      where: (pro, { eq }) => eq(pro.active, true),

      with: {
        prices: {
          where: (pri, { eq }) => eq(pri.active, true),
        },
      },
    });
    if (res.length) return { data: res, error: null };
    return { data: [], error: null };
  } catch (error) {
    console.log(error);
    return { data: [], error };
  }
};

export const createCollection = async (collection: Collection) => {
  try {
    const results = await db.insert(collections).values(collection);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: error };
  }
};

export const createDocument = async (document: Document) => {
  try {
    await db.insert(documents).values(document);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const updateCollection = async (
  collection: Partial<Collection>,
  collectionId: string
) => {
  try {
    await db
      .update(collections)
      .set(collection)
      .where(eq(collections.id, collectionId));
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const updateDocument = async (
  document: Partial<Document>,
  fileId: string
) => {
  try {
    await db.update(documents).set(document).where(eq(documents.id, fileId));
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const updateWorkspace = async (
  workspace: Partial<Workspace>,
  workspaceId: string
) => {
  if (!workspaceId) return;
  try {
    await db
      .update(workspaces)
      .set(workspace)
      .where(eq(workspaces.id, workspaceId));
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const getCollaborators = async (workspaceId: string) => {
  const response = await db
    .select()
    .from(collaborators)
    .where(eq(collaborators.workspaceId, workspaceId));
  if (!response.length) return [];
  const userInformation: Promise<User | undefined>[] = response.map(
    async (user) => {
      const exists = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, user.userId),
      });
      return exists;
    }
  );
  const resolvedUsers = await Promise.all(userInformation);
  return resolvedUsers.filter(Boolean) as User[];
};

export const getUsersFromSearch = async (email: string) => {
  if (!email) return [];
  const accounts = db
    .select()
    .from(users)
    .where(ilike(users.email, `${email}%`));
  return accounts;
};

// Get all tags by workspaceId
export const getTags = async (workspaceId: string) => {
  const isValid = validate(workspaceId);
  if (!isValid) return { data: null, error: "Error" };
  try {
    const results = (await db
      .select()
      .from(tags)
      .orderBy(tags.createdAt)
      .where(eq(tags.workspaceId, workspaceId))) as Tag[] | [];
    return { data: results, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const createTag = async (tag: Tag) => {
  try {
    await db.insert(tags).values(tag);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

// update Tag
export const updateTag = async (tag: Partial<Tag>) => {
  if (!tag.id) return { data: null, error: "Error" };
  try {
    await db.update(tags).set(tag).where(eq(tags.id, tag.id));
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

// deleteTag
export const deleteTag = async (tagId: string) => {
  if (!tagId) return { data: null, error: "Error" };
  try {
    await db.delete(tags).where(eq(tags.id, tagId));
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const assignTagToDocument = async (
  tagId: string,
  documentId: string
) => {
  try {
    await db.insert(tagsToDocuments).values({ tagId, documentId });
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const removeTagFromDocument = async (
  tagId: string,
  documentId: string
) => {
  try {
    await db
      .delete(tagsToDocuments)
      .where(
        and(
          eq(tagsToDocuments.tagId, tagId),
          eq(tagsToDocuments.documentId, documentId)
        )
      );
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};
