"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  updateQuiz,
  deleteQuiz as deleteAction,
  addQuestion as addQuestionAction,
} from "@/server/quizzes/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function QuizHeader({
  quiz,
}: {
  quiz: { name: string | null; description: string | null; id: string };
}) {
  const [name, setName] = useState(quiz.name ?? "");
  const [description, setDescription] = useState(quiz.description ?? "");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addQuestionLoading, setAddQuestionLoading] = useState(false);
  const router = useRouter();

  const isChanged = name !== quiz.name || description !== quiz.description;

  const saveChanges = async () => {
    await updateQuiz(quiz.id, name, description);
    router.refresh();
  };

  const deleteQuiz = async () => {
    setDeleteLoading(true);
    await deleteAction(quiz.id);
    setDeleteLoading(false);
    router.push("/");
  };

  const addQuestion = async () => {
    setAddQuestionLoading(true);
    await addQuestionAction(quiz.id);
    setAddQuestionLoading(false);
    router.refresh();
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
                className="rounded-full px-4 py-1 hover:bg-black/10"
                onClick={saveChanges}
              >
                Сохранить
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence initial={false} mode="wait">
          {deleteConfirm ? (
            <motion.div
              initial={{ opacity: 0, width: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, width: "auto", filter: "blur(0px)" }}
              exit={{ opacity: 0, width: 0, filter: "blur(10px)" }}
              className="mr-1 flex whitespace-nowrap"
              key="confirmDelete"
            >
              <motion.button
                className="mr-1 flex items-center overflow-hidden whitespace-nowrap rounded-full px-4 py-1 hover:bg-black/10"
                onClick={deleteQuiz}
              >
                <AnimatePresence>
                  {deleteLoading && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                    >
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    </motion.div>
                  )}
                </AnimatePresence>
                Вы уверены?
              </motion.button>
              <motion.button
                className="overflow-hidden whitespace-nowrap rounded-full px-4 py-1 hover:bg-black/10"
                onClick={() => setDeleteConfirm(!deleteConfirm)}
              >
                Отмена
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, width: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, width: "auto", filter: "blur(0px)" }}
              exit={{ opacity: 0, width: 0, filter: "blur(10px)" }}
              className="mr-1"
              key="delete"
            >
              <motion.button
                className="overflow-hidden rounded-full px-4 py-1 hover:bg-black/10"
                onClick={() => setDeleteConfirm(!deleteConfirm)}
              >
                Удалить
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          className="flex items-center rounded-full px-4 py-1 hover:bg-black/10"
          onClick={addQuestion}
        >
          <AnimatePresence>
            {addQuestionLoading && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
              >
                <Loader2 className="mr-2 size-4 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
          Добавить вопрос
        </button>
        <Link href={`/preview/${quiz.id}`}>
          <button className="rounded-full px-4 py-1 hover:bg-black/10">
            Посмотреть
          </button>
        </Link>
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
