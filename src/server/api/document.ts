"use server";

import { eq } from "drizzle-orm";
import { validate } from "uuid";
import { documents } from "@/lib/supabase/schema";
import type { Document } from "@/shared/supabase.types";
import db from "@/lib/supabase/db";

export async function getDocumentByWorkspaceId(workspaceId: string) {
  if (!validate(workspaceId)) {
    return {
      data: null,
      error: "Invalid workspace ID",
    };
  }
  try {
    const results = await db
      .select()
      .from(documents)
      .where(eq(documents.workspaceId, workspaceId))
      .orderBy(documents.createdAt);
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: `Error fetching documents by workspace ID: ${error}` };
  }
}

// documnents by collection ID
export async function getDocumentByCollectionId(collectionId: string) {
  if (!validate(collectionId)) {
    return {
      data: null,
      error: "Invalid collection ID",
    };
  }
  try {
    const results = await db
      .select()
      .from(documents)
      .where(eq(documents.collectionId, collectionId))
      .orderBy(documents.createdAt);
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: `Error fetching documents by collection ID: ${error}` };
  }
}

export async function getDocumentDetails(documentId: string) {
  if (!validate(documentId)) {
    return {
      data: null,
      error: "Invalid document ID",
    };
  }
  try {
    const results = await db.select().from(documents).where(eq(documents.id, documentId));
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: `Error fetching document details: ${error}` };
  }
}

export async function createDocument(document: Document) {
  try {
    const results = await db.insert(documents).values(document);
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: `Error creating document: ${error}` };
  }
}

export async function updateDocument(documentId: string, document: Document) {
  try {
    const results = await db.update(documents).set(document).where(eq(documents.id, documentId));
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: `Error updating document: ${error}` };
  }
}

export async function deleteDocument(documentId: string) {
  if (!validate(documentId)) {
    return {
      data: null,
      error: "Invalid document ID",
    };
  }
  try {
    const results = await db.delete(documents).where(eq(documents.id, documentId));
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: `Error deleting document: ${error}` };
  }
}
