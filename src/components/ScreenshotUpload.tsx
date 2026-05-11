import { UploadCloud } from "lucide-react";
import type { ChangeEvent } from "react";
import { ListingTextArea } from "@/components/ListingTextArea";

type ScreenshotUploadProps = {
  listingText: string;
  onListingTextChange: (value: string) => void;
  previewUrl: string | null;
  onPreviewChange: (url: string | null) => void;
};

export function ScreenshotUpload({
  listingText,
  onListingTextChange,
  previewUrl,
  onPreviewChange,
}: ScreenshotUploadProps) {
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      onPreviewChange(null);
      return;
    }

    onPreviewChange(URL.createObjectURL(file));
  }

  return (
    <div className="grid gap-4">
      <label className="grid min-h-36 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-[rgba(11,13,16,0.14)] bg-white/90 p-4 text-center transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-[0_18px_46px_-36px_rgba(11,13,16,0.60)] focus-within:ring-2 focus-within:ring-[var(--champagne)]">
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
          aria-label="Upload listing screenshot"
        />
        <span className="grid justify-items-center gap-2">
          <UploadCloud className="h-8 w-8 text-[var(--racing-green)]" aria-hidden="true" />
          <span className="text-lg font-extrabold text-[var(--graphite)]">Choose a screenshot</span>
          <span className="text-base text-neutral-600">Preview only for MVP. Paste the visible text below.</span>
        </span>
      </label>

      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Uploaded listing screenshot preview"
          className="max-h-80 w-full rounded-2xl border border-[rgba(11,13,16,0.10)] object-contain"
        />
      ) : null}

      {/* TODO: Add OCR here later so screenshot text can be extracted before analysis. */}
      <ListingTextArea value={listingText} onChange={onListingTextChange} />
    </div>
  );
}
