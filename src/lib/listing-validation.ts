export const LISTING_TEXT_MIN_LENGTH = 20;
export const LISTING_TEXT_MAX_LENGTH = 7000;

export function getListingTextError(text: string) {
  const length = text.trim().length;

  if (length === 0) {
    return "Add listing text, screenshot text, or vehicle details before analyzing.";
  }

  if (length < LISTING_TEXT_MIN_LENGTH) {
    return `Add at least ${LISTING_TEXT_MIN_LENGTH} characters so the analyzer has enough detail.`;
  }

  if (length > LISTING_TEXT_MAX_LENGTH) {
    return `Keep the listing under ${LISTING_TEXT_MAX_LENGTH.toLocaleString()} characters.`;
  }

  return "";
}
