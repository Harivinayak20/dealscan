export type ScanStatus = "good_deal" | "fair_deal" | "risky_deal" | "needs_review";

export type StoredScan = {
  id: string;
  createdAt: string;
  vehicleTitle: string;
  score: number;
  verdict: string;
  status: ScanStatus;
  confidence: "Low" | "Medium" | "High";
  sourceUrl?: string;
  listingTextSnippet: string;
  internalNotes?: string;
};

export type AuditEntry = {
  id: string;
  timestamp: string;
  action: string;
  adminEmail: string;
  details: string;
};

export type AdminSettings = {
  scoringThresholds: {
    greatDealMin: number;
    decentDealMin: number;
    cautionMin: number;
    redFlagsMin: number;
  };
  affiliateLinks: {
    carfax: string;
    inspection: string;
    insurance: string;
    payments: string;
    obd: string;
    detailing: string;
  };
  featureFlags: {
    groqEnabled: boolean;
    urlExtractionEnabled: boolean;
    screenshotOcrEnabled: boolean;
  };
};

export const DEFAULT_SETTINGS: AdminSettings = {
  scoringThresholds: {
    greatDealMin: 85,
    decentDealMin: 70,
    cautionMin: 55,
    redFlagsMin: 40,
  },
  affiliateLinks: {
    carfax: "https://www.carfax.com/vehicle-history-reports/",
    inspection: "https://www.yourmechanic.com/services/pre-purchase-car-inspection",
    insurance: "https://www.thezebra.com/auto-insurance/",
    payments: "https://www.bankrate.com/loans/auto-loans/auto-loan-calculator/",
    obd: "https://www.amazon.com/s?k=obd2+scanner",
    detailing: "https://www.amazon.com/s?k=car+detailing+kit",
  },
  featureFlags: {
    groqEnabled: true,
    urlExtractionEnabled: true,
    screenshotOcrEnabled: true,
  },
};

export function verdictToStatus(verdict: string): ScanStatus {
  switch (verdict) {
    case "Great Deal":
      return "good_deal";
    case "Decent Deal":
      return "fair_deal";
    case "Proceed with Caution":
    case "Red Flags Present":
      return "risky_deal";
    default:
      return "needs_review";
  }
}

export function statusLabel(status: ScanStatus): string {
  switch (status) {
    case "good_deal":
      return "Good Deal";
    case "fair_deal":
      return "Fair Deal";
    case "risky_deal":
      return "Risky Deal";
    case "needs_review":
      return "Needs Review";
  }
}
