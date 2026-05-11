import { Camera, ChevronRight, ClipboardList, PencilLine } from "lucide-react";
import type { ComponentType } from "react";
import type { InputType } from "@/lib/analyzer-types";

type InputTabsProps = {
  value: InputType;
  onChange: (value: InputType) => void;
};

const tabs = [
  {
    value: "text",
    label: "Copy Paste Text",
    description: "Paste listing details from any website.",
    icon: ClipboardList,
    swatch: "bg-[rgba(201,168,106,0.16)] text-[var(--graphite)]",
  },
  {
    value: "screenshot",
    label: "Upload Screenshot",
    description: "Add a deal screenshot from your phone.",
    icon: Camera,
    swatch: "bg-[rgba(124,169,130,0.16)] text-[var(--racing-green)]",
  },
  {
    value: "manual",
    label: "Enter Manually",
    description: "Fill in the car info step by step.",
    icon: PencilLine,
    swatch: "bg-[rgba(214,168,79,0.16)] text-[#5d4212]",
  },
] satisfies Array<{
  value: InputType;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  swatch: string;
}>;

export function InputTabs({ value, onChange }: InputTabsProps) {
  return (
    <div className="grid gap-3" role="tablist" aria-label="Choose input method">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const selected = value === tab.value;

        return (
          <a
            key={tab.value}
            href={`#${tab.value}`}
            role="tab"
            aria-selected={selected}
            aria-label={`Use ${tab.label}`}
            onClick={(event) => {
              event.preventDefault();
              onChange(tab.value);
            }}
            className={`group flex min-h-24 items-center justify-between rounded-2xl border px-4 py-3 text-left transition duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--champagne)] ${
              selected
                ? "border-[rgba(201,168,106,0.34)] bg-[var(--graphite)] text-[var(--ivory)] shadow-lg shadow-black/20"
                : "border-[rgba(11,13,16,0.10)] bg-white text-[var(--graphite)] hover:border-[rgba(201,168,106,0.55)]"
            }`}
          >
            <span className="flex items-center gap-4">
              <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-xl ${selected ? "bg-white/10 text-[var(--champagne)]" : tab.swatch}`}>
                <Icon className="h-8 w-8" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-2xl font-black tracking-normal">{tab.label}</span>
                <span className={`mt-1 block text-base font-medium ${selected ? "text-[var(--silver)]" : "text-neutral-600"}`}>
                  {tab.description}
                </span>
              </span>
            </span>
            <ChevronRight className={`h-7 w-7 transition group-hover:translate-x-1 ${selected ? "text-[var(--champagne)]" : "text-neutral-700"}`} aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
