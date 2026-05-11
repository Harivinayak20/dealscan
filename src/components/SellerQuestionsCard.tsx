import { MessageCircleQuestion } from "lucide-react";

type SellerQuestionsCardProps = {
  questions: string[];
};

export function SellerQuestionsCard({ questions }: SellerQuestionsCardProps) {
  return (
    <section className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 p-4 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.50)]">
      <h2 className="flex items-center gap-2 text-lg font-black text-[var(--graphite)]">
        <MessageCircleQuestion className="h-5 w-5 text-[var(--racing-green)]" aria-hidden="true" />
        Questions to ask seller
      </h2>
      <ol className="mt-3 grid gap-3">
        {questions.map((question, index) => (
          <li key={question} className="flex gap-3 text-base leading-7 text-[var(--graphite)]">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[rgba(201,168,106,0.18)] text-sm font-black text-[var(--graphite)]">
              {index + 1}
            </span>
            <span>{question}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
