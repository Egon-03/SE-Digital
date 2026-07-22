export type LivelloOrologio =
  | "ore-intere"
  | "mezze-ore"
  | "quarti-ora"
  | "cinque-minuti"
  | "minuto-esatto";

export interface ConfigOrologio {
  livello: LivelloOrologio;
  numeroEsercizi: number;
}

export interface EsercizioOrologio {
  ore: number; // 1-12
  minuti: number; // 0-59
}

const MINUTI_PER_LIVELLO: Record<LivelloOrologio, number[]> = {
  "ore-intere": [0],
  "mezze-ore": [0, 30],
  "quarti-ora": [0, 15, 30, 45],
  "cinque-minuti": Array.from({ length: 12 }, (_, i) => i * 5),
  "minuto-esatto": Array.from({ length: 60 }, (_, i) => i),
};

export const NOMI_LIVELLO_OROLOGIO: Record<LivelloOrologio, string> = {
  "ore-intere": "Solo ore intere (es. 3:00)",
  "mezze-ore": "Ore e mezze ore (es. 3:30)",
  "quarti-ora": "Quarti d'ora (es. 3:15, 3:45)",
  "cinque-minuti": "Multipli di 5 minuti",
  "minuto-esatto": "Al minuto esatto",
};

function casuale(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generaOrario(livello: LivelloOrologio): EsercizioOrologio {
  const opzioniMinuti = MINUTI_PER_LIVELLO[livello];
  const minuti = opzioniMinuti[casuale(0, opzioniMinuti.length - 1)];
  const ore = casuale(1, 12);
  return { ore, minuti };
}

export function generaOrari(config: ConfigOrologio): EsercizioOrologio[] {
  return Array.from({ length: config.numeroEsercizi }, () => generaOrario(config.livello));
}

export function formattaOrario(e: EsercizioOrologio): string {
  return `${e.ore}:${String(e.minuti).padStart(2, "0")}`;
}
