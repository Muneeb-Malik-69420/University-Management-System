// Shared by API validation and browser reports so both apply the same rules.
export function isValidAssessment({ marks, total }) {
  return Number.isFinite(marks) && Number.isFinite(total)
    && total > 0 && total <= 10000 && marks >= 0 && marks <= total;
}

export function grade(percentage) {
  if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
    throw new RangeError('Percentage must be between 0 and 100');
  }
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

export function isValidFeeAmount(amount) {
  if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) return false;
  // Allow normal floating-point representation error, but reject fractional paisa.
  return Math.abs(amount * 100 - Math.round(amount * 100)) < 0.000001;
}

export function feeTotals(fees) {
  let total = 0, collected = 0;
  for (const fee of fees) {
    if (!isValidFeeAmount(fee.amount)) throw new RangeError('Invalid fee amount');
    if (!['Paid', 'Unpaid'].includes(fee.status)) throw new RangeError('Invalid fee status');
    const paisa = Math.round(fee.amount * 100);
    total += paisa;
    if (!Number.isSafeInteger(total)) throw new RangeError('Fee total exceeds safe range');
    if (fee.status === 'Paid') collected += paisa;
  }
  return { total: total / 100, collected: collected / 100, outstanding: (total - collected) / 100 };
}
