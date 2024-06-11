"use client";

import { Button } from "@/components/ui/button";
import { createQuiz } from "@/server/quizzes/actions";

export default function CreateButton() {
  return <Button onClick={async () => await createQuiz()}>Создать квиз</Button>;
}
