export type TCOSegment = {
  label: string;
  monthly: number;
  yearly: number;
  color: string;
  detail: string;
};

export type TCOResult = {
  segments: TCOSegment[];
  totalMonthly: number;
  totalYearly: number;
  total5Year: number;
};

const INSURANCE_BY_MAKE: Record<string, number> = {
  Toyota: 110, Honda: 105, Mazda: 108, Subaru: 112,
  BMW: 185, Mercedes: 195, Audi: 175, Lexus: 155,
  Ford: 125, Chevrolet: 128, Dodge: 140, Jeep: 135,
  Nissan: 118, Hyundai: 112, Kia: 115, Volkswagen: 120,
  Tesla: 200, Porsche: 220,
};

const MAINTENANCE_BY_AGE: Record<string, number> = {
  older: 180, mid: 120, newer: 65,
};

export function calculateTCO(
  make: string | null,
  year: number | null,
  price: number,
  mileage: number | null,
  score: number,
  monthlyPayment: number,
): TCOResult {
  const currentYear = new Date().getFullYear();
  const age = year ? currentYear - year : 5;
  const annualMiles = mileage ? Math.max(5000, Math.min(25000, mileage / Math.max(1, age))) : 12000;

  const baseInsurance = 95;
  const makeInsurance = make ? INSURANCE_BY_MAKE[make] ?? 115 : 115;
  const ageInsuranceFactor = Math.min(1.6, 1 + age * 0.02);
  const insuranceMonthly = Math.round(baseInsurance + (makeInsurance - baseInsurance) * ageInsuranceFactor);

  const fuelMonthly = Math.round(annualMiles / 12 / 25 * 3.50);

  const ageCat = age > 10 ? "older" : age > 5 ? "mid" : "newer";
  const maintenanceMonthly = Math.round(
    MAINTENANCE_BY_AGE[ageCat] * (score < 50 ? 1.4 : score < 70 ? 1.15 : 0.9),
  );

  const annualDepreciationRate = age < 3 ? 0.12 : age < 7 ? 0.10 : 0.08;
  const currentValue = price * Math.max(0.15, Math.pow(1 - annualDepreciationRate, 1));
  const depreciationMonthly = Math.round(currentValue * annualDepreciationRate / 12);

  const segments: TCOSegment[] = [
    { label: "Loan Payment", monthly: monthlyPayment, yearly: monthlyPayment * 12, color: "#c9a86a", detail: `${monthlyPayment}/mo × 12 months` },
    { label: "Insurance", monthly: insuranceMonthly, yearly: insuranceMonthly * 12, color: "#7ca982", detail: `Based on ${make || "standard"} rates, ${age}-year-old vehicle` },
    { label: "Fuel", monthly: fuelMonthly, yearly: fuelMonthly * 12, color: "#123d33", detail: `${annualMiles.toLocaleString()} mi/yr, 25 mpg avg, $3.50/gal` },
    { label: "Maintenance", monthly: maintenanceMonthly, yearly: maintenanceMonthly * 12, color: "#d6a84f", detail: `Age-adjusted: ${ageCat} vehicle${score < 70 ? " + risk premium" : ""}` },
    { label: "Depreciation", monthly: depreciationMonthly, yearly: depreciationMonthly * 12, color: "#c45a4a", detail: `~${(annualDepreciationRate * 100).toFixed(0)}% annual loss` },
  ];

  const totalMonthly = segments.reduce((s, seg) => s + seg.monthly, 0);
  return {
    segments,
    totalMonthly,
    totalYearly: totalMonthly * 12,
    total5Year: totalMonthly * 60,
  };
}
