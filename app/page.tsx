import { AnswerInput } from "@/components/AnswerInput";

export default function Home() {
  return (
    <main className="flex h-screen flex-col justify-center">
      <div className="flex w-full flex-col items-center justify-start gap-4">
        <div className="container">
          <AnswerInput />
        </div>
      </div>
    </main>
  );
}
