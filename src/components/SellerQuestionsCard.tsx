import { MessageCircleQuestion } from "lucide-react";

type SellerQuestionsCardProps = {
  questions: string[];
};

export function SellerQuestionsCard({ questions }: SellerQuestionsCardProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-black text-slate-950">
        <MessageCircleQuestion className="h-5 w-5 text-emerald-700" aria-hidden="true" />
        Questions to ask seller
      </h2>
      <ol className="mt-3 grid gap-3">
        {questions.map((question, index) => (
          <li key={question} className="flex gap-3 text-base leading-7 text-slate-800">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-black text-slate-700">
              {index + 1}
            </span>
            <span>{question}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
