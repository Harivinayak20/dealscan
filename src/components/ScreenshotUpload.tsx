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
      <label className="grid min-h-36 cursor-pointer place-items-center rounded-lg border-2 border-dashed border-slate-300 bg-white p-4 text-center hover:border-emerald-600">
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
          aria-label="Upload listing screenshot"
        />
        <span className="grid justify-items-center gap-2">
          <UploadCloud className="h-8 w-8 text-emerald-700" aria-hidden="true" />
          <span className="text-lg font-extrabold text-slate-900">Choose a screenshot</span>
          <span className="text-base text-slate-600">Preview only for MVP. Paste the visible text below.</span>
        </span>
      </label>

      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Uploaded listing screenshot preview"
          className="max-h-80 w-full rounded-lg border border-slate-200 object-contain"
        />
      ) : null}

      {/* TODO: Add OCR here later so screenshot text can be extracted before analysis. */}
      <ListingTextArea value={listingText} onChange={onListingTextChange} />
    </div>
  );
}
