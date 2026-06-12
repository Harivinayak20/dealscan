export type PaymentPlan = {
  termMonths: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
};

export type FinancingDetails = {
  price: number;
  downPayment: number;
  tradeIn: number;
  apr: number;
  plans: PaymentPlan[];
  suggestedPlan: number;
};

export function calculateFinancing(
  price: number,
  downPayment = 0,
  tradeIn = 0,
  apr = 6.5,
): FinancingDetails {
  const loanAmount = Math.max(0, price - downPayment - tradeIn);
  const terms = [48, 60, 72];
  const monthlyRate = apr / 100 / 12;

  const plans: PaymentPlan[] = terms.map((termMonths) => {
    if (monthlyRate === 0) {
      const monthly = loanAmount / termMonths;
      return { termMonths, monthlyPayment: Math.round(monthly), totalInterest: 0, totalCost: loanAmount };
    }
    const factor = (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
    const monthlyPayment = loanAmount * factor;
    const totalCost = monthlyPayment * termMonths;
    const totalInterest = totalCost - loanAmount;
    return {
      termMonths,
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalCost: Math.round(totalCost),
    };
  });

  const suggestedPlan = 1;

  return { price, downPayment, tradeIn, apr, plans, suggestedPlan };
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
