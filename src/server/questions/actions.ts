"use server";

import { NextResponse } from "next/server";
import { validateRequest } from "../auth/validate-request";
import { db } from "../db";
import { questions, quizzes } from "../db/schema";
import { and, eq } from "drizzle-orm";

export async function updateQuestion(
  questionId: string,
  text: string,
  answers: {
    id: number;
    text: string;
    imageUrl: string | null;
    isCorrect: boolean;
  }[],
) {
  const { user } = await validateRequest();
  if (!user) {
    return new NextResponse(null, { status: 400 });
  }
  const question = (
    await db
      .select()
      .from(questions)
      .where(eq(questions.id, questionId))
      .limit(1)
  )[0];
  if (!question) {
    return new NextResponse(null, { status: 404 });
  }
  const quiz = (
    await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, question.quizId))
      .limit(1)
  )[0];
  if (!quiz) {
    return new NextResponse(null, { status: 404 });
  }
  if (quiz.createdById !== user.id) {
    return new NextResponse(null, { status: 403 });
  }
  await db
    .update(questions)
    .set({ text, answers })
    .where(and(eq(questions.id, questionId)));
}

export async function deleteQuestion(questionId: string) {
  const { user } = await validateRequest();
  if (!user) {
    return new NextResponse(null, { status: 400 });
  }
  const question = (
    await db
      .select()
      .from(questions)
      .where(eq(questions.id, questionId))
      .limit(1)
  )[0];
  if (!question) {
    return new NextResponse(null, { status: 404 });
  }
  const quiz = (
    await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, question.quizId))
      .limit(1)
  )[0];
  if (!quiz) {
    return new NextResponse(null, { status: 404 });
  }
  if (quiz.createdById !== user.id) {
    return new NextResponse(null, { status: 403 });
  }
  await db.delete(questions).where(eq(questions.id, questionId));
}
