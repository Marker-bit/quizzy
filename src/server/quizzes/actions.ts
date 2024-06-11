"use server";

import { db } from "@/server/db";
import { quizzes as quizTable } from "@/server/db/schema";
import { redirect } from "next/navigation";
import { validateRequest } from "../auth/validate-request";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function createQuiz() {
  const { user } = await validateRequest();
  if (!user) {
    return new NextResponse(null, { status: 400 });
  }

  const quiz = await db
    .insert(quizTable)
    .values({ createdById: user.id })
    .returning()
    .get();
  return redirect(`/edit/${quiz.id}`);
}

export async function updateQuiz(
  quizId: number,
  name: string,
  description: string,
) {
  const { user } = await validateRequest();
  if (!user) {
    return new NextResponse(null, { status: 400 });
  }
  await db
    .update(quizTable)
    .set({ name, description })
    .where(and(eq(quizTable.id, quizId), eq(quizTable.createdById, user.id)));
}
