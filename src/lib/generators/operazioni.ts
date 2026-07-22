export type TipoOperazione = "addizione" | "sottrazione" | "moltiplicazione" | "divisione";

export interface ConfigOperazioni {
  tipo: TipoOperazione;
  /** Numero di cifre del primo operando (o di entrambi, per addizione/sottrazione). */
  cifre: 1 | 2 | 3;
  /** Per addizione: vieta il riporto. Per sottrazione: vieta il prestito. Ignorato altrove. */
  consentiRiporto: boolean;
  /** Solo per divisione: se falso, genera solo divisioni esatte (resto 0). */
  consentiResto: boolean;
  numeroEsercizi: number;
}

export interface EsercizioOperazione {
  testo: string;
  /** Risposta/e corrette. Divisione con resto ne ha due (quoziente, resto). */
  risposte: number[];
  /** Etichette dei campi di risposta, nello stesso ordine di `risposte`. */
  etichetteRisposta: string[];
}

function casuale(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cifreDigit(n: number): number[] {
  return String(n)
    .split("")
    .map(Number);
}

/** Genera un numero con esattamente `cifre` cifre (niente zeri iniziali). */
function numeroConCifre(cifre: number): number {
  const min = cifre === 1 ? 0 : 10 ** (cifre - 1);
  const max = 10 ** cifre - 1;
  return casuale(min, max);
}

function sommaSenzaRiporto(a: number, b: number): boolean {
  const da = cifreDigit(a);
  const db = cifreDigit(b);
  const lunghezza = Math.max(da.length, db.length);
  for (let i = 0; i < lunghezza; i++) {
    const ca = da[da.length - 1 - i] ?? 0;
    const cb = db[db.length - 1 - i] ?? 0;
    if (ca + cb > 9) return false;
  }
  return true;
}

function differenzaSenzaPrestito(a: number, b: number): boolean {
  const da = cifreDigit(a);
  const db = cifreDigit(b);
  for (let i = 0; i < db.length; i++) {
    const ca = da[da.length - 1 - i] ?? 0;
    const cb = db[db.length - 1 - i] ?? 0;
    if (ca < cb) return false;
  }
  return true;
}

/** Genera due addendi con `cifre` cifre, ritentando se serve evitare il riporto. */
function generaAddizione(cifre: number, consentiRiporto: boolean): [number, number] {
  for (let tentativo = 0; tentativo < 300; tentativo++) {
    const a = numeroConCifre(cifre);
    const b = numeroConCifre(cifre);
    if (consentiRiporto || sommaSenzaRiporto(a, b)) return [a, b];
  }
  return [numeroConCifre(cifre), numeroConCifre(cifre)];
}

function generaSottrazione(cifre: number, consentiRiporto: boolean): [number, number] {
  for (let tentativo = 0; tentativo < 300; tentativo++) {
    let a = numeroConCifre(cifre);
    let b = numeroConCifre(cifre);
    if (a < b) [a, b] = [b, a];
    if (consentiRiporto || differenzaSenzaPrestito(a, b)) return [a, b];
  }
  const a = numeroConCifre(cifre);
  const b = casuale(0, a);
  return [a, b];
}

function generaEsercizio(config: ConfigOperazioni): EsercizioOperazione {
  switch (config.tipo) {
    case "addizione": {
      const [a, b] = generaAddizione(config.cifre, config.consentiRiporto);
      return { testo: `${a} + ${b} =`, risposte: [a + b], etichetteRisposta: ["Risultato"] };
    }
    case "sottrazione": {
      const [a, b] = generaSottrazione(config.cifre, config.consentiRiporto);
      return { testo: `${a} − ${b} =`, risposte: [a - b], etichetteRisposta: ["Risultato"] };
    }
    case "moltiplicazione": {
      const a = numeroConCifre(config.cifre);
      const b = casuale(2, 9);
      return { testo: `${a} × ${b} =`, risposte: [a * b], etichetteRisposta: ["Risultato"] };
    }
    case "divisione": {
      const divisore = casuale(2, 9);
      const quoziente = numeroConCifre(config.cifre);
      const resto = config.consentiResto ? casuale(0, divisore - 1) : 0;
      const dividendo = quoziente * divisore + resto;
      return config.consentiResto
        ? {
            testo: `${dividendo} ÷ ${divisore} =`,
            risposte: [quoziente, resto],
            etichetteRisposta: ["Quoziente", "Resto"],
          }
        : {
            testo: `${dividendo} ÷ ${divisore} =`,
            risposte: [quoziente],
            etichetteRisposta: ["Risultato"],
          };
    }
  }
}

export function generaEsercizi(config: ConfigOperazioni): EsercizioOperazione[] {
  return Array.from({ length: config.numeroEsercizi }, () => generaEsercizio(config));
}

export const NOMI_OPERAZIONE: Record<TipoOperazione, string> = {
  addizione: "Addizione",
  sottrazione: "Sottrazione",
  moltiplicazione: "Moltiplicazione",
  divisione: "Divisione",
};
