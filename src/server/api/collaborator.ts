"use server";
import { and, eq } from "drizzle-orm";
import { validate } from "uuid";
import { collaborators } from "@/lib/supabase/schema";
import type { User } from "@/shared/supabase.types";
import db from "@/lib/supabase/db";

export async function getCollaborators(workspaceId: string) {
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
}

export async function addCollaborators(users: User[], workspaceId: string) {
  // biome-ignore lint/complexity/noForEach: <explanation>
  const response = users.forEach(async (user: User) => {
    const userExists = await db.query.collaborators.findFirst({
      where: (u, { eq }) => and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId)),
    });
    if (!userExists) await db.insert(collaborators).values({ workspaceId, userId: user.id });
  });
}

export async function removeCollaborators(users: User[], workspaceId: string) {
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
}
