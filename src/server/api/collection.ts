"use server";

import db from "@/lib/supabase/db";
import { eq } from "drizzle-orm";
import { collections, documents } from "@/lib/supabase/schema";
import type { Collection } from "@/shared/supabase.types";

//create collection

export async function createCollection(collection: Collection) {
  try {
    const result = await db.insert(collections).values(collection);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
}

// get collection by workspace id
export async function getCollectionByWorkspaceId(workspaceId: string) {
  try {
    const results = await db
      .select()
      .from(collections)
      .where(eq(collections.workspaceId, workspaceId))
      .orderBy(collections.createAt);
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: `Error fetching collections by workspace ID: ${error}` };
  }
}

// get collection details populating documents
export async function getCollectionDetails(collectionId: string) {
  try {
    const results = await db.select().from(collections).where(eq(collections.id, collectionId));
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: `Error fetching collection details: ${error}` };
  }
}

// update collection
export async function updateCollection(collectionId: string, collection: Collection) {
  try {
    const results = await db
      .update(collections)
      .set(collection)
      .where(eq(collections.id, collectionId));
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: `Error updating collection: ${error}` };
  }
}

// delete collection
export async function deleteCollection(collectionId: string) {
  try {
    const results = await db.delete(collections).where(eq(collections.id, collectionId));
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: `Error deleting collection: ${error}` };
  }
}
