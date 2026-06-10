export const fmtVotos = (n: number): string =>
  n.toLocaleString('es-PE');

export const fmtPct = (n: number, decimals = 3): string =>
  `${n.toFixed(decimals)} %`;

export const fmtDiff = (
  diff: number,
  namePos: string,
  nameNeg: string,
): { label: string; isPos: boolean } => {
  const abs = Math.abs(diff);
  if (diff >= 0) return { label: `${namePos} +${fmtVotos(abs)} votos`, isPos: true };
  return { label: `${nameNeg} +${fmtVotos(abs)} votos`, isPos: false };
};
