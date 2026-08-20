import { z } from "zod";
import { LISTING_TEXT_MAX_LENGTH, LISTING_TEXT_MIN_LENGTH } from "@/lib/listing-validation";

export const manualDetailsSchema = z
  .object({
    year: z.string().trim().optional(),
    make: z.string().trim().optional(),
    model: z.string().trim().optional(),
    mileage: z.string().trim().optional(),
    price: z.string().trim().optional(),
    titleStatus: z.string().trim().optional(),
    sellerNotes: z.string().trim().optional(),
  })
  .optional();

export const analyzeListingRequestSchema = z.object({
  inputType: z.enum(["url", "text", "screenshot", "manual"], {
    error: "Choose URL, paste text, screenshot, or manual entry before analyzing.",
  }),
  listingText: z
    .string({ error: "Add a listing URL, listing text, screenshot, or vehicle details before analyzing." })
    .trim()
    .min(LISTING_TEXT_MIN_LENGTH, `Add at least ${LISTING_TEXT_MIN_LENGTH} characters so the analyzer has enough detail.`)
    .max(LISTING_TEXT_MAX_LENGTH, `Keep the listing under ${LISTING_TEXT_MAX_LENGTH.toLocaleString()} characters.`),
  sourceUrl: z.string().url().optional(),
  manualDetails: manualDetailsSchema,
});
