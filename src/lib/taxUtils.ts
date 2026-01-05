export type TaxBracket = {
  upperLimit: number | null; // null means no upper limit
  rate: number; // expressed as decimal, e.g. 0.30 for 30%
};

/**
 * Approximate Kenyan PAYE brackets for 2026 (for illustration).
 * Amounts are monthly in KES.
 */
export const PAYE_BRACKETS_2026: TaxBracket[] = [
  { upperLimit: 24000, rate: 0.10 },
  { upperLimit: 40667, rate: 0.25 },
  { upperLimit: 57334, rate: 0.30 },
  { upperLimit: 76999, rate: 0.325 },
  { upperLimit: null, rate: 0.35 },
];

export const KENYA_CORPORATE_TAX_RATE_2026 = 0.30; // 30%
export const KENYA_VAT_RATE_2026 = 0.16; // 16%
export const KENYA_DIGITAL_SERVICE_TAX_RATE_2026 = 0.015; // 1.5%

export const formatKES = (amount: number): string => {
  const rounded = Math.round(amount);
  return `KES ${rounded.toLocaleString("en-KE")}`;
};

export const calculateProgressiveTax = (
  income: number,
  brackets: TaxBracket[]
): number => {
  if (income <= 0) return 0;

  let remaining = income;
  let tax = 0;
  let lowerLimit = 0;

  for (const bracket of brackets) {
    if (bracket.upperLimit == null) {
      tax += remaining * bracket.rate;
      break;
    }

    const bandSize = bracket.upperLimit - lowerLimit;
    const taxableInBand = Math.min(remaining, bandSize);

    if (taxableInBand <= 0) break;

    tax += taxableInBand * bracket.rate;
    remaining -= taxableInBand;
    lowerLimit = bracket.upperLimit;
  }

  return tax;
};

export const calculatePayeMonthly = (grossSalary: number): number => {
  return calculateProgressiveTax(grossSalary, PAYE_BRACKETS_2026);
};

export interface MarginInputs {
  grossSales: number;
  inputCosts: number;
  nonCompliantExpenseTotal: number;
}

export interface MarginBreakdown extends MarginInputs {
  vat: number;
  digitalServiceTax: number;
  taxPenalty: number;
  netProfit: number;
}

/**
 * Extra corporate tax payable because a given expense is 100% non‑deductible
 * due to lack of eTIMS compliance.
 */
export const calculateNonCompliantExpensePenalty = (
  expenseAmount: number,
  corporateRate: number = KENYA_CORPORATE_TAX_RATE_2026
): number => {
  if (expenseAmount <= 0) return 0;
  return expenseAmount * corporateRate;
};

export const calculateMargin = ({
  grossSales,
  inputCosts,
  nonCompliantExpenseTotal,
}: MarginInputs): MarginBreakdown => {
  const vat = grossSales * KENYA_VAT_RATE_2026;
  const digitalServiceTax = grossSales * KENYA_DIGITAL_SERVICE_TAX_RATE_2026;
  const taxPenalty = calculateNonCompliantExpensePenalty(
    nonCompliantExpenseTotal
  );

  const netProfit =
    grossSales - (vat + digitalServiceTax + inputCosts + taxPenalty);

  return {
    grossSales,
    inputCosts,
    nonCompliantExpenseTotal,
    vat,
    digitalServiceTax,
    taxPenalty,
    netProfit,
  };
};


