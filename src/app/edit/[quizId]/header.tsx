"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { updateQuiz } from "@/server/quizzes/actions";
import { useRouter } from "next/navigation";

export default function QuizHeader({
  quiz,
}: {
  quiz: { name: string | null; description: string | null; id: number };
}) {
  const [name, setName] = useState(quiz.name ?? "");
  const [description, setDescription] = useState(quiz.description ?? "");
  const router = useRouter();

  const isChanged = name !== quiz.name || description !== quiz.description;

  const saveChanges = async () => {
    await updateQuiz(quiz.id, name, description);
    await router.refresh();
  };

  return (
    <>
      <div className="sticky left-0 top-5 mx-auto flex rounded-full bg-black/10 p-1 shadow-md backdrop-blur-xl">
        <AnimatePresence>
          {isChanged && (
            <motion.div
              initial={{ opacity: 0, width: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, width: "auto", filter: "blur(0px)" }}
              exit={{ opacity: 0, width: 0, filter: "blur(10px)" }}
              className="mr-1"
            >
              <button
                className="mr-1 rounded-full px-4 py-1 hover:bg-black/10"
                onClick={saveChanges}
              >
                Сохранить
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <button className="mr-1 rounded-full px-4 py-1 hover:bg-black/10">
          Удалить
        </button>
        <button className="rounded-full px-4 py-1 hover:bg-black/10">
          Добавить вопрос
        </button>
      </div>
      <div className="flex flex-col justify-center text-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-transparent text-center text-6xl font-bold outline-none placeholder:text-black/30"
          placeholder="Название квиза"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-transparent text-center text-xl italic outline-none placeholder:text-black/30"
          placeholder="Описание квиза"
        />
      </div>
    </>
  );
}
