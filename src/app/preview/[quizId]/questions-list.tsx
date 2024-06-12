"use client";

import { cn, numberToLetter } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";

export default function QuestionsList({
  questions,
}: {
  questions: {
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
  }[];
}) {
  const [answers, setAnswers] = useState<number[][]>([]);
  const goodAnswers = questions.map((q, i) =>
    q.answers
      .map((a, i) => {
        return {
          correct: a.isCorrect,
          index: i,
        };
      })
      .filter((a) => a.correct)
      .map((a) => a.index),
  );
  const [checking, setChecking] = useState(false);

  const answerClick = (questionIndex: number, answerIndex: number) => {
    if (checking) return;
    setAnswers((prev) => {
      const lastAnswers = prev[questionIndex] || [];
      const newAnswers = [...prev];
      if (lastAnswers.includes(answerIndex)) {
        newAnswers[questionIndex] = lastAnswers.filter(
          (index) => index !== answerIndex,
        );
        if (
          newAnswers[questionIndex]!.length === 0 &&
          questionIndex === answers.length - 1
        ) {
          newAnswers.splice(questionIndex, 1);
        }
      } else {
        const correctCount = questions[questionIndex]!.answers.filter(
          (a) => a.isCorrect,
        ).length;
        // if (lastAnswers.length >= correctCount) {
        //   return newAnswers;
        // }
        if (correctCount === 1) {
          newAnswers[questionIndex] = [answerIndex];
        } else {
          newAnswers[questionIndex] = [...lastAnswers, answerIndex];
        }
      }
      return newAnswers;
    });
  };

  return (
    <div className="mt-2 flex flex-col gap-2 sm:items-center">
      {questions.map((question, questionIndex) => (
        <AnimatePresence key={question.id}>
          {answers.length >= questionIndex && (
            <motion.div
              key={question.id}
              className="flex flex-col rounded-xl bg-black/5 p-2 sm:w-[30vw]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p className="text-xl font-bold">
                {questionIndex + 1}. {question.text}
              </p>
              {checking ? (
                <p className="italic">
                  {answers[questionIndex]!.filter(
                    (a) => !goodAnswers[questionIndex]!.includes(a),
                  ).length === 0
                    ? "Ответ верный"
                    : "Ответ неверный"}
                </p>
              ) : (
                <p className="italic">
                  {question.answers.filter((a) => a.isCorrect).length}{" "}
                  ответ(а/ов) верны(й/е)
                </p>
              )}

              {question.imageUrl && (
                <Image
                  alt="Question image"
                  className="rounded-md"
                  src={question.imageUrl}
                  width={300}
                  height={300}
                />
              )}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {question.answers.map((answer, answerIndex) => (
                  <button
                    key={answer.id}
                    className={cn(
                      "flex items-center gap-2",
                      // answers[questionIndex]?.includes(answer.id) &&
                      //   "bg-black/5",
                    )}
                    onClick={() => answerClick(questionIndex, answerIndex)}
                  >
                    <div
                      className={cn(
                        "flex size-8 max-h-8 min-h-8 min-w-8 max-w-8 items-center justify-center rounded-full bg-amber-100",
                        answers[questionIndex]?.includes(answerIndex) &&
                          "border-2 border-black/50",
                        checking &&
                          (answer.isCorrect
                            ? "border-green-400 bg-green-100 text-green-500"
                            : "border-red-400 bg-red-100 text-red-500"),
                      )}
                    >
                      {!checking ? (
                        numberToLetter(answer.id)
                      ) : answer.isCorrect ? (
                        <Check className="size-4" />
                      ) : (
                        <X className="size-4" />
                      )}
                    </div>
                    <div>{answer.text}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
      <AnimatePresence mode="wait">
        {questions.length === answers.length && !checking && (
          <motion.button
            className="rounded-xl bg-black/5 p-2 hover:bg-black/10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={() => {
              setChecking(true);
            }}
            key="check"
          >
            Проверить
          </motion.button>
        )}
        {checking && (
          <motion.button
            className="rounded-xl bg-black/5 p-2 hover:bg-black/10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={() => {
              setChecking(false);
              setAnswers([]);
            }}
            key="reset"
          >
            Сбросить
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
