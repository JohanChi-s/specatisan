import { eq } from "drizzle-orm";
import { validate } from "uuid";
import { documents } from "@/lib/supabase/schema";
import { Collection, Document } from '@/shared/supabase.types'
import db from "@/lib/supabase/db";

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
    const results = await db.select().from(documents).where(eq(documents.collectionId, collectionId)).orderBy(documents.createdAt);
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
