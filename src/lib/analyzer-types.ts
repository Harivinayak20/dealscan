export type InputType = "url" | "text" | "screenshot" | "manual";

export type AnalysisMode = "groq" | "gemini" | "local";

export type ManualDetails = {
  year?: string;
  make?: string;
  model?: string;
  mileage?: string;
  price?: string;
  titleStatus?: string;
  sellerNotes?: string;
};

export type AnalyzeListingRequest = {
  inputType: InputType;
  listingText: string;
  sourceUrl?: string;
  manualDetails?: ManualDetails;
};

export type ScoreCategory = {
  label: string;
  score: number;
  note: string;
};

export type AnalyzeListingResult = {
  score: number;
  verdict: string;
  summary: string;
  estimatedFairValueRange: {
    low: number | null;
    high: number | null;
    note: string;
  };
  suggestedOfferRange: {
    low: number | null;
    high: number | null;
    note: string;
  };
  categories: ScoreCategory[];
  redFlags: string[];
  greenFlags: string[];
  missingInfo: string[];
  negotiationTip: string;
  sellerQuestions: string[];
  confidence: "Low" | "Medium" | "High";
};
