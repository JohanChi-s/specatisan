import { and, eq, ilike, notExists } from "drizzle-orm";
import { validate } from "uuid";
import { collaborators, collections, documents, users, workspaces } from "@/lib/supabase/schema";
import type { Collaborator, Collection, Price, Subscription, User, Workspace } from "@/shared/supabase.types";
import db from "@/lib/supabase/db";

export const getCollaborators = async (workspaceId: string) => {
  const response = await db
    .select()
    .from(collaborators)
    .where(eq(collaborators.workspaceId, workspaceId));
  if (!response.length) return [];
  const userInformation: Promise<User | undefined>[] = response.map(async (user) => {
    const exists = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, user.userId),
    });
    return exists;
  });
  const resolvedUsers = await Promise.all(userInformation);
  return resolvedUsers.filter(Boolean) as User[];
};

export const addCollaborators = async (users: User[], workspaceId: string) => {
  // biome-ignore lint/complexity/noForEach: <explanation>
  const response = users.forEach(async (user: User) => {
    const userExists = await db.query.collaborators.findFirst({
      where: (u, { eq }) => and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId)),
    });
    if (!userExists) await db.insert(collaborators).values({ workspaceId, userId: user.id });
  });
};

export const removeCollaborators = async (users: User[], workspaceId: string) => {
  // biome-ignore lint/complexity/noForEach: <explanation>
  const response = users.forEach(async (user: User) => {
    const userExists = await db.query.collaborators.findFirst({
      where: (u, { eq }) => and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId)),
    });
    if (userExists)
      await db
        .delete(collaborators)
        .where(and(eq(collaborators.workspaceId, workspaceId), eq(collaborators.userId, user.id)));
  });
};

// collections


export const createCollection = async (collection: Collection) => {
  try {
    const result = await db.insert(collections).values(collection);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: 'Error' };
  }
};

// get collection by workspace id
export const getCollectionByWorkspaceId = async (workspaceId: string) => {
  try {
    const results = await db.select().from(collections).where(eq(collections.workspaceId, workspaceId)).orderBy(collections.createAt);
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: 'Error fetching collections by workspace ID: ' + error };
  }
}

// get collection details populating documents
export const getCollectionDetails = async (collectionId: string) => {
  try {
    const results = await db.select().from(collections).where(eq(collections.id, collectionId));
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: 'Error fetching collection details: ' + error };
  }
}

// update collection
export const updateCollection = async (collectionId: string,  collection: Collection) => {
  try {
    const results = await db.update(collections).set(collection).where(eq(collections.id, collectionId));
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: 'Error updating collection: ' + error };
  }
}

// delete collection
export const deleteCollection = async (collectionId: string) => {
  try {
    const results = await db.delete(collections).where(eq(collections.id, collectionId));
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: 'Error deleting collection: ' + error };
  }
}



export const getDocumentByWorkspaceId = async (workspaceId: string) => {
  if (!validate(workspaceId)) {
    return {
      data: null,
      error: 'Invalid workspace ID',
    };
  }
  try {
    const results = await db.select().from(documents).where(eq(documents.workspaceId, workspaceId)).orderBy(documents.createdAt);
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: 'Error fetching documents by workspace ID: ' + error };
  }    
}

// documnents by collection ID
export const getDocumentByCollectionId = async (collectionId: string) => {
  if (!validate(collectionId)) {
    return {
      data: null,
      error: 'Invalid collection ID',
    };
  }
  try {
    const results = await db.query.documents.findMany({
      where: (d, { eq }) => eq(d.collectionId, collectionId),
    })
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: 'Error fetching documents by collection ID: ' + error };
  }    
}

export const getDocumentDetails = async (documentId: string) => {
  if (!validate(documentId)) {
    return {
      data: null,
      error: 'Invalid document ID',
    };
  }
  try {
    const results = await db.select().from(documents).where(eq(documents.id, documentId));
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: 'Error fetching document details: ' + error };
  }    
}

export const createDocument = async (document: Document) => {
  try {
    const results = await db.insert(documents).values(document);
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: 'Error creating document: ' + error };
  }    
}

export const updateDocument = async (documentId: string, document: Document) => {
  try {
    const results = await db.update(documents).set(document).where(eq(documents.id, documentId));
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: 'Error updating document: ' + error };
  }    
}

export const deleteDocument = async (documentId: string) => {
  if (!validate(documentId)) {
    return {
      data: null,
      error: 'Invalid document ID',
    };
  }
  try {
    const results = await db.delete(documents).where(eq(documents.id, documentId));
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: 'Error deleting document: ' + error };
  }    
}


// users



export const getUsersFromSearch = async (email: string) => {
  if (!email) return [];
  try {
    
    const accounts = await db
    .select()
    .from(users)
    .where(ilike(users.email, `${email}%`));

    return accounts;
  } catch (error) {
    return {
      data: null,
      error: 'Error fetching users: ' + error,
    };
  }
}

// find user by id
export const findUser = async (userId: string) => {
  const response = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });
  return response;
};



export const getUserSubscriptionStatus = async (userId: string) => {
  try {
    const data = await db.query.subscriptions.findFirst({
      where: (s, { eq }) => eq(s.userId, userId),
    });
    if (data) return { data: data as Subscription, error: null };
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: 'Error' };
  }
};


export const getActiveProductsWithPrice = async () => {
  try {
    const res = await db.query.products.findMany({
      where: (pro, { eq }) => eq(pro.active, true),

      with: {
        prices: {
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          where: (pri: Price, { eq }: any) => eq(pri.active, true),
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




export const createWorkspace = async (workspace: Workspace) => {
  try {
    const response = await db.insert(workspaces).values(workspace);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: 'Error' };
  }
};


export const deleteWorkspace = async (workspaceId: string) => {
  if (!workspaceId) return;
  await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
};


export const getWorkspaceDetails = async (workspaceId: string) => {
  const isValid = validate(workspaceId);
  if (!isValid)
    return {
      data: [],
      error: 'Error',
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
    return { data: [], error: 'Error' };
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
    return { data: null, error: 'Error' };
  }
};



