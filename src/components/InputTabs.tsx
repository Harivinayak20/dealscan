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
    swatch: "bg-blue-50 text-blue-900",
  },
  {
    value: "screenshot",
    label: "Upload Screenshot",
    description: "Add a deal screenshot from your phone.",
    icon: Camera,
    swatch: "bg-green-50 text-green-900",
  },
  {
    value: "manual",
    label: "Enter Manually",
    description: "Fill in the car info step by step.",
    icon: PencilLine,
    swatch: "bg-amber-50 text-amber-900",
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
            className={`group flex min-h-24 items-center justify-between rounded-lg border px-4 py-3 text-left transition duration-200 hover:-translate-y-1 hover:shadow-xl ${
              selected
                ? "border-blue-950 bg-blue-950 text-white shadow-lg shadow-blue-950/20"
                : "border-slate-200 bg-white text-slate-900 hover:border-blue-300"
            }`}
          >
            <span className="flex items-center gap-4">
              <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-lg ${selected ? "bg-white/10 text-white" : tab.swatch}`}>
                <Icon className="h-8 w-8" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-2xl font-black tracking-normal">{tab.label}</span>
                <span className={`mt-1 block text-base font-medium ${selected ? "text-blue-100" : "text-slate-600"}`}>
                  {tab.description}
                </span>
              </span>
            </span>
            <ChevronRight className={`h-7 w-7 transition group-hover:translate-x-1 ${selected ? "text-white" : "text-slate-700"}`} aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
