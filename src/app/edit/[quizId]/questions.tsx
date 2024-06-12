"use client";

import { AnimatePresence, motion } from "framer-motion";
import Question from "./question";

export default function Questions({
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
  return (
    <div className="flex flex-col justify-center gap-2 text-center">
      <AnimatePresence>
        {questions.map((question) => (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            key={question.id}
          >
            <Question question={question} />
          </motion.div>
        ))}
      </AnimatePresence>
      {questions.length === 0 && <p className="italic">Нет вопросов</p>}
    </div>
  );
}
