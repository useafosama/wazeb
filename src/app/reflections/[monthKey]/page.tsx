import HistoricalMonthlyReflectionClient from './HistoricalMonthlyReflectionClient';

export function generateStaticParams() {
  const params: { monthKey: string }[] = [];
  const years = [2024, 2025, 2026, 2027];
  for (const year of years) {
    for (let m = 1; m <= 12; m++) {
      const monthStr = String(m).padStart(2, '0');
      params.push({ monthKey: `${year}-${monthStr}` });
    }
  }
  return params;
}

export default function HistoricalMonthlyReflectionPage() {
  return <HistoricalMonthlyReflectionClient />;
}
