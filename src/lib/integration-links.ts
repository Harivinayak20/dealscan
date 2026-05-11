const historyReportUrl = process.env.NEXT_PUBLIC_HISTORY_REPORT_URL || "https://www.carfax.com/vehicle-history-reports/";
const inspectionUrl =
  process.env.NEXT_PUBLIC_INSPECTION_URL || "https://www.yourmechanic.com/services/pre-purchase-car-inspection";
const insuranceUrl = process.env.NEXT_PUBLIC_INSURANCE_URL || "https://www.thezebra.com/auto-insurance/";
const loanUrl = process.env.NEXT_PUBLIC_LOAN_URL || "https://www.bankrate.com/loans/auto-loans/auto-loan-calculator/";
const partsUrl = process.env.NEXT_PUBLIC_PARTS_URL || "https://www.amazon.com/s?k=used+car+maintenance+parts";
const obdScannerUrl = process.env.NEXT_PUBLIC_OBD_SCANNER_URL || "https://www.amazon.com/s?k=obd2+scanner";
const detailingKitUrl = process.env.NEXT_PUBLIC_DETAILING_KIT_URL || "https://www.amazon.com/s?k=car+detailing+kit";

export const partnerLinks = {
  historyReport: historyReportUrl,
  carfax: historyReportUrl,
  inspection: inspectionUrl,
  insurance: insuranceUrl,
  loan: loanUrl,
  payments: loanUrl,
  parts: partsUrl,
  obdScanner: obdScannerUrl,
  obd: obdScannerUrl,
  detailingKit: detailingKitUrl,
};
