"use server";

import db from "@/lib/supabase/db";
import { collaborators, users, workspaces } from "@/lib/supabase/schema";
import type { Workspace } from "@/shared/supabase.types";
import { eq, and, notExists } from "drizzle-orm";
import { validate } from "uuid";

export async function createWorkspace(workspace: Workspace) {
  try {
    const response = await db.insert(workspaces).values(workspace);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
}

export async function deleteWorkspace(workspaceId: string) {
  if (!workspaceId) return;
  await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
}

export async function getWorkspaceDetails(workspaceId: string) {
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
}

export async function getPrivateWorkspaces(userId: string) {
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
          db.select().from(collaborators).where(eq(collaborators.workspaceId, workspaces.id)),
        ),
        eq(workspaces.workspaceOwner, userId),
      ),
    )) as Workspace[];
  return privateWorkspaces;
}

export async function getCollaboratingWorkspaces(userId: string) {
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
}

export async function getSharedWorkspaces(userId: string) {
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
}

export async function updateWorkspace(workspace: Partial<Workspace>, workspaceId: string) {
  if (!workspaceId) return;
  try {
    await db.update(workspaces).set(workspace).where(eq(workspaces.id, workspaceId));
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
}
