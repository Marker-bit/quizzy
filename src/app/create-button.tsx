"use client";

import { Button } from "@/components/ui/button";
import { createQuiz } from "@/server/quizzes/actions";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function CreateButton() {
  const [loading, setLoading] = useState(false);

  const create = async () => {
    setLoading(true);
    await createQuiz();
    setLoading(false);
  };

  return (
    <Button onClick={create}>
      {loading && <Loader2 className="size-4 animate-spin mr-2" />}
      Создать квиз
    </Button>
  );
}
