import { mescola, scegliN } from "./utils";

export type RegolaOrtografica =
  | "digrammi"
  | "suoni-duri-dolci"
  | "doppie"
  | "accento"
  | "apostrofo"
  | "h-verbo-avere"
  | "qu-cu-cq";

export const NOMI_REGOLA: Record<RegolaOrtografica, string> = {
  digrammi: "Digrammi GN, GL, SC",
  "suoni-duri-dolci": "Suoni duri e dolci di C e G (CHI/CHE, GHI/GHE, CI/CE, GI/GE)",
  doppie: "Consonanti doppie",
  accento: "Accento",
  apostrofo: "Apostrofo",
  "h-verbo-avere": "H del verbo avere",
  "qu-cu-cq": "QU, CU, CQ",
};

/** Regole introdotte progressivamente, dalla 1ª alla 5ª elementare. */
const REGOLE_PER_ANNO: Record<number, RegolaOrtografica[]> = {
  1: ["digrammi"],
  2: ["digrammi", "suoni-duri-dolci", "doppie"],
  3: ["suoni-duri-dolci", "doppie", "qu-cu-cq", "h-verbo-avere"],
  4: ["doppie", "qu-cu-cq", "h-verbo-avere", "accento", "apostrofo"],
  5: ["doppie", "accento", "apostrofo", "h-verbo-avere"],
};

export interface CoppiaOrtografica {
  corretta: string;
  errata: string;
  regola: RegolaOrtografica;
}

const BANCA_PAROLE: CoppiaOrtografica[] = [
  // Digrammi GN, GL, SC
  { corretta: "gnomo", errata: "gniomo", regola: "digrammi" },
  { corretta: "montagna", errata: "montagnia", regola: "digrammi" },
  { corretta: "sogno", errata: "sognio", regola: "digrammi" },
  { corretta: "bagno", errata: "bagnio", regola: "digrammi" },
  { corretta: "famiglia", errata: "familia", regola: "digrammi" },
  { corretta: "figlio", errata: "filio", regola: "digrammi" },
  { corretta: "maglione", errata: "malione", regola: "digrammi" },
  { corretta: "pesce", errata: "pescie", regola: "digrammi" },
  { corretta: "nascere", errata: "nasciere", regola: "digrammi" },
  { corretta: "scendere", errata: "sciendere", regola: "digrammi" },

  // Suoni duri e dolci (CHI/CHE, GHI/GHE, CI/CE, GI/GE)
  { corretta: "chiesa", errata: "ciesa", regola: "suoni-duri-dolci" },
  { corretta: "chilo", errata: "cilo", regola: "suoni-duri-dolci" },
  { corretta: "ghiaccio", errata: "giaccio", regola: "suoni-duri-dolci" },
  { corretta: "gheppio", errata: "geppio", regola: "suoni-duri-dolci" },
  { corretta: "barche", errata: "barce", regola: "suoni-duri-dolci" },
  { corretta: "fichi", errata: "fici", regola: "suoni-duri-dolci" },
  { corretta: "laghi", errata: "lagi", regola: "suoni-duri-dolci" },
  { corretta: "amiche", errata: "amice", regola: "suoni-duri-dolci" },
  { corretta: "righe", errata: "rige", regola: "suoni-duri-dolci" },

  // Consonanti doppie
  { corretta: "gatto", errata: "gato", regola: "doppie" },
  { corretta: "sasso", errata: "saso", regola: "doppie" },
  { corretta: "leggero", errata: "legero", regola: "doppie" },
  { corretta: "gallina", errata: "galina", regola: "doppie" },
  { corretta: "cappotto", errata: "capoto", regola: "doppie" },
  { corretta: "settimana", errata: "setimana", regola: "doppie" },
  { corretta: "ombrello", errata: "ombrelo", regola: "doppie" },
  { corretta: "spaghetti", errata: "spageti", regola: "doppie" },
  { corretta: "freccia", errata: "frecia", regola: "doppie" },
  { corretta: "coniglio", errata: "conilio", regola: "doppie" },

  // Accento
  { corretta: "città", errata: "citta", regola: "accento" },
  { corretta: "perché", errata: "perche", regola: "accento" },
  { corretta: "però", errata: "pero", regola: "accento" },
  { corretta: "così", errata: "cosi", regola: "accento" },
  { corretta: "già", errata: "gia", regola: "accento" },
  { corretta: "più", errata: "piu", regola: "accento" },
  { corretta: "caffè", errata: "caffe", regola: "accento" },
  { corretta: "lunedì", errata: "lunedi", regola: "accento" },
  { corretta: "università", errata: "universita", regola: "accento" },

  // Apostrofo
  { corretta: "l'amico", errata: "lamico", regola: "apostrofo" },
  { corretta: "un'amica", errata: "un amica", regola: "apostrofo" },
  { corretta: "dell'acqua", errata: "del acqua", regola: "apostrofo" },
  { corretta: "un'ora", errata: "un ora", regola: "apostrofo" },
  { corretta: "l'albero", errata: "lalbero", regola: "apostrofo" },
  { corretta: "quest'anno", errata: "quest anno", regola: "apostrofo" },
  { corretta: "l'isola", errata: "lisola", regola: "apostrofo" },

  // H del verbo avere
  { corretta: "ho fame", errata: "o fame", regola: "h-verbo-avere" },
  { corretta: "hai ragione", errata: "ai ragione", regola: "h-verbo-avere" },
  { corretta: "ha detto", errata: "a detto", regola: "h-verbo-avere" },
  { corretta: "hanno vinto", errata: "anno vinto", regola: "h-verbo-avere" },
  { corretta: "ho scritto", errata: "o scritto", regola: "h-verbo-avere" },
  { corretta: "hai capito", errata: "ai capito", regola: "h-verbo-avere" },

  // QU, CU, CQ
  { corretta: "acqua", errata: "aqua", regola: "qu-cu-cq" },
  { corretta: "acquario", errata: "aquario", regola: "qu-cu-cq" },
  { corretta: "scuola", errata: "squola", regola: "qu-cu-cq" },
  { corretta: "quaderno", errata: "cuaderno", regola: "qu-cu-cq" },
  { corretta: "cuoco", errata: "quoco", regola: "qu-cu-cq" },
  { corretta: "quadro", errata: "cuadro", regola: "qu-cu-cq" },
  { corretta: "cuore", errata: "quore", regola: "qu-cu-cq" },
];

export interface ConfigOrtografia {
  anno: number;
  numeroEsercizi: number;
}

export interface EsercizioOrtografia {
  opzioni: string[];
  corretta: string;
  regola: RegolaOrtografica;
}

export function regolePerAnno(anno: number): RegolaOrtografica[] {
  return REGOLE_PER_ANNO[anno] ?? REGOLE_PER_ANNO[1];
}

export function generaEsercizi(config: ConfigOrtografia): EsercizioOrtografia[] {
  const regoleAmmesse = regolePerAnno(config.anno);
  const pool = BANCA_PAROLE.filter((c) => regoleAmmesse.includes(c.regola));
  const scelte = scegliN(pool, config.numeroEsercizi);
  return scelte.map((c) => ({
    opzioni: mescola([c.corretta, c.errata]),
    corretta: c.corretta,
    regola: c.regola,
  }));
}
