"use client";

import { numberToLetter } from "@/lib/utils";
import { deleteQuestion, updateQuestion } from "@/server/questions/actions";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Delete, Plus, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Question({
  question,
}: {
  question: {
    id: number;
    text: string;
    imageUrl: string | null;
    quizId: number;
    answers: {
      id: number;
      text: string;
      imageUrl: string | null;
      isCorrect: boolean;
    }[];
  };
}) {
  const [text, setText] = useState(question.text);
  const [answers, setAnswers] = useState(question.answers);
  const router = useRouter();

  const isChanged =
    text !== question.text ||
    answers.length !== question.answers.length ||
    answers.find(
      (answer) =>
        answer.text !==
        question.answers.find((qAnswer) => qAnswer.id === answer.id)?.text,
    );

  let nextAnswerId = answers.length
    ? Math.max(...answers.map((answer) => answer.id)) + 1
    : 0;

  const saveChanges = async () => {
    await updateQuestion(question.id, text, answers);
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
              <Save className="size-4" />
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
        <button className="ml-2 rounded-xl bg-black/5 p-2" onClick={deleteQ}>
          <Delete className="size-4" />
        </button>
      </div>
    </div>
  );
}
