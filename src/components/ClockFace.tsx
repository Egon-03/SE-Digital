interface Props {
  ore: number;
  minuti: number;
  size?: number;
  /** Etichetta accessibile: se assente, l'ora resta nascosta agli screen reader (uso "indovina l'ora"). */
  ariaLabel?: string;
  /** false per un quadrante vuoto, da completare a mano con le lancette disegnate. */
  mostraLancette?: boolean;
}

export function ClockFace({ ore, minuti, size = 140, ariaLabel, mostraLancette = true }: Props) {
  const angoloMinuti = (minuti / 60) * 360;
  const angoloOre = ((ore % 12) / 12) * 360 + (minuti / 60) * (360 / 12);

  const tacche = Array.from({ length: 12 }, (_, i) => {
    const angolo = (i / 12) * 360;
    const spessa = i % 3 === 0;
    const r1 = spessa ? 74 : 78;
    const r2 = 84;
    return { angolo, r1, r2, spessa };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      role={ariaLabel ? "img" : "presentation"}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : "true"}
    >
      <circle cx="90" cy="90" r="86" fill="var(--bianco-carta)" stroke="var(--bordo)" strokeWidth="3" />
      {tacche.map(({ angolo, r1, r2, spessa }) => {
        const rad = (angolo * Math.PI) / 180;
        const x1 = 90 + r1 * Math.sin(rad);
        const y1 = 90 - r1 * Math.cos(rad);
        const x2 = 90 + r2 * Math.sin(rad);
        const y2 = 90 - r2 * Math.cos(rad);
        return (
          <line
            key={angolo}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--inchiostro)"
            strokeWidth={spessa ? 3 : 1.5}
            strokeLinecap="round"
          />
        );
      })}
      {mostraLancette && (
        <>
          <line
            x1="90"
            y1="90"
            x2={90 + 45 * Math.sin((angoloOre * Math.PI) / 180)}
            y2={90 - 45 * Math.cos((angoloOre * Math.PI) / 180)}
            stroke="var(--terracotta)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="90"
            y1="90"
            x2={90 + 64 * Math.sin((angoloMinuti * Math.PI) / 180)}
            y2={90 - 64 * Math.cos((angoloMinuti * Math.PI) / 180)}
            stroke="var(--verde)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </>
      )}
      <circle cx="90" cy="90" r="5" fill="var(--inchiostro)" />
    </svg>
  );
}
