"use client";

import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AnswerSchema = z.object({
  reason: z.string(),
  winner: z.string(),
  loser: z.string(),
  emoji_winner: z.string(),
  emoji_loser: z.string(),
});

type Answer = z.infer<typeof AnswerSchema>;

const initialAnswer: Answer = {
  reason: "",
  winner: "pedra",
  loser: "",
  emoji_winner: "🪨",
  emoji_loser: "",
};

const AnswerInput = () => {
  const [value, setValue] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [previousAnswer, setPreviousAnswer] = useState<Answer>(initialAnswer);
  const [showResult, setShowResult] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setValue("");
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "Você é uma API JSON, que ira responder quem ganharia na porrada dada duas opcoes." +
                "Você deve responder com um JSON com a resposta. Sempre inclua os seguintes campos: reason, winner, emoji_winner, loser, e emoji_loser." +
                "Retorne apenas o JSON. Não use comentários, ou Markdown. Sempre retorne como um objeto JSON." +
                "Sempre seja engracado e sarcastico quando for preencher o campo reason. Sempre retorne apenas dois emoji que descrevam os sujeitos que o usuario mandar." +
                "Nenhuma porrada ira acabar em empate. Sempre retorne um ganhador" +
                "Seja curto e sucinto quando criar a razao.",
            },
            {
              role: "user",
              content: `${previousAnswer.winner} vs ${value}`,
            },
          ],
        }),
      });

      const data = await response.json();
      const answer = JSON.parse(data.choices[0].message.content);
      const validated = AnswerSchema.safeParse(answer);

      if (validated.success) {
        setAnswer(validated.data);
        setPreviousAnswer(validated.data);
        setShowResult(true);
      }
    } catch (error) { }
  };

  const handleNext = () => {
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div>
        {answer && (
          <div className="flex w-full flex-col items-center justify-start">
            <p className="pb-2 text-center text-2xl sm:text-4xl">
              {answer?.winner}
            </p>
            <p className="pb-2 text-center text-2xl text-green-400 sm:text-4xl">
              da porrada em
            </p>
            <p className="pb-2 text-center text-2xl sm:text-4xl">
              {previousAnswer.loser}
            </p>
            <p className="text-pretty pb-4 text-center text-lg">
              {answer.reason}
            </p>
            <div className="flex flex-row items-center justify-center">
              <p className="text-[140px]">{answer.emoji_winner}</p>
              <p className="px-6 text-4xl">🤜</p>
              <p className="text-[140px]">{answer.emoji_loser}</p>
            </div>
            <Button className="border px-8 py-4 text-lg" onClick={handleNext}>
              proximo
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-start">
      <p className="text-3xl">Quem ganha na porrada</p>
      <p className="text-[8rem]">{previousAnswer.emoji_winner}</p>
      <p className="text-3xl">contra {previousAnswer.winner}?</p>
      <form
        onSubmit={handleSubmit}
        className="my-4 flex w-1/4 items-center justify-start gap-4"
      >
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          className="w-full rounded-md border-2 border-gray-300 p-2 text-lg"
          placeholder="Escreva sua resposta aqui"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export { AnswerInput };
