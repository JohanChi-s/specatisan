"use server";

import db from "@/lib/supabase/db";
import { users } from "@/lib/supabase/schema";
import type { Price, Subscription } from "@/shared/supabase.types";
import { ilike } from "drizzle-orm";

export async function getUsersFromSearch(email: string) {
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
      error: `Error fetching users: ${error}`,
    };
  }
}

// find user by id
export async function findUser(userId: string) {
  const response = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });
  return response;
}

export async function getUserSubscriptionStatus(userId: string) {
  try {
    const data = await db.query.subscriptions.findFirst({
      where: (s, { eq }) => eq(s.userId, userId),
    });
    if (data) return { data: data as Subscription, error: null };
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
}

export async function getActiveProductsWithPrice() {
  try {
    const res = await db.query.products.findMany({
      where: (pro, { eq }) => eq(pro.active, true),

      with: {
        prices: {
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
}
