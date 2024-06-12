"use client";

import { cn, numberToLetter } from "@/lib/utils";
import { deleteQuestion, updateQuestion } from "@/server/questions/actions";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Delete,
  Dices,
  Loader2,
  Plus,
  Save,
  Shuffle,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Question({
  question,
}: {
  question: {
    id: string;
    text: string;
    imageUrl: string | null;
    quizId: string;
    answers: {
      id: number;
      text: string;
      imageUrl: string | null;
      isCorrect: boolean;
    }[];
    shuffleAnswers: boolean;
  };
}) {
  const [text, setText] = useState(question.text);
  const [answers, setAnswers] = useState(question.answers);
  const [shuffleAnswers, setShuffleAnswers] = useState(question.shuffleAnswers);
  const [updateLoading, setUpdateLoading] = useState(false);
  const router = useRouter();

  const isChanged =
    text !== question.text ||
    shuffleAnswers !== question.shuffleAnswers ||
    answers.length !== question.answers.length ||
    answers.find(
      (answer) =>
        answer.text !==
          question.answers.find((qAnswer) => qAnswer.id === answer.id)?.text ||
        answer.isCorrect !==
          question.answers.find((qAnswer) => qAnswer.id === answer.id)
            ?.isCorrect,
    );

  let nextAnswerId = answers.length
    ? Math.max(...answers.map((answer) => answer.id)) + 1
    : 0;

  const saveChanges = async () => {
    if (answers.length < 2) {
      toast.error("Добавьте хотя бы два варианта ответа", {
        description: "Вопрос должен иметь хотя бы два варианта ответа",
      });
      return;
    }
    if (!answers.find((a) => a.isCorrect)) {
      toast.error("Выберите правильный вариант ответа", {
        description: "Вы должны выбрать хотя бы один правильный вариант ответа",
      });
      return;
    }
    if (text.trim() === "") {
      toast.error("Заполните текст вопроса", {
        description: "Текст вопроса не может быть пустым",
      });
      return;
    }
    if (answers.find((a) => a.text.trim() === "")) {
      toast.error("Заполните текст ответа", {
        description: "Текст ответа не может быть пустым",
      });
      return;
    }

    setUpdateLoading(true);
    await updateQuestion(question.id, text, answers, shuffleAnswers);
    setUpdateLoading(false);
    toast.success("Вопрос успешно обновлен");
    router.refresh();
  };

  const deleteQ = async () => {
    await deleteQuestion(question.id);
    router.refresh();
  };

  return (
    <div className="rounded-xl bg-black/5 p-2 text-start sm:mx-auto sm:w-[30vw]">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="bg-transparent text-xl font-bold outline-none placeholder:text-black/30"
        placeholder="Текст вопроса"
      />
      <div className="flex flex-col">
        <AnimatePresence initial={false}>
          {answers.map((answer, i) => (
            <motion.div
              className="flex items-center overflow-hidden rounded-md border border-black/20 bg-transparent"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              key={answer.id}
            >
              <button
                className="flex items-center gap-1 border-r border-black/20 bg-amber-100 p-1 text-black/60"
                onClick={() =>
                  setAnswers((answers) =>
                    answers.map((a) =>
                      a.id === answer.id
                        ? { ...answer, isCorrect: !answer.isCorrect }
                        : a,
                    ),
                  )
                }
              >
                {numberToLetter(i)}
                {answer.isCorrect && <Check className="size-4" />}
              </button>
              <input
                value={answer.text}
                onChange={(e) =>
                  setAnswers((answers) =>
                    answers.map((a) =>
                      a.id === answer.id ? { ...a, text: e.target.value } : a,
                    ),
                  )
                }
                className="h-full w-full bg-transparent pl-2 text-xl outline-none"
              />
              <button
                className="h-full border-l border-black/20 bg-amber-100 p-1 text-black/60"
                onClick={() =>
                  setAnswers((answers) =>
                    answers.filter((a) => a.id !== answer.id),
                  )
                }
              >
                <Delete className="size-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="ml-auto mt-2 flex w-fit">
        <AnimatePresence initial={false}>
          {isChanged && (
            <motion.button
              className="rounded-xl bg-black/5 p-2"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              onClick={saveChanges}
            >
              <AnimatePresence initial={false} mode="wait">
                {updateLoading ? (
                  <motion.div
                    key="loading-save"
                    initial={{
                      scale: 0,
                    }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Loader2 className="size-4 animate-spin" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="save"
                    initial={{
                      scale: 0,
                    }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Save className="size-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>
        <button
          className="ml-2 rounded-xl bg-black/5 p-2"
          onClick={() =>
            setAnswers((answers) => [
              ...answers,
              { id: nextAnswerId, text: "", isCorrect: false, imageUrl: null },
            ])
          }
        >
          <Plus className="size-4" />
        </button>
        <button
          className={cn(
            "ml-2 rounded-xl p-2",
            shuffleAnswers ? "bg-black/10" : "bg-black/5",
          )}
          onClick={() => setShuffleAnswers((a) => !a)}
        >
          <Dices className="size-4" />
        </button>
        <button className="ml-2 rounded-xl bg-black/5 p-2" onClick={deleteQ}>
          <Delete className="size-4" />
        </button>
      </div>
    </div>
  );
}
