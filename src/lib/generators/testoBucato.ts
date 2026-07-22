import { mescola, scegliN } from "./utils";

export interface TestoBase {
  titolo: string;
  testo: string;
  anno: number;
}

const BANCA_TESTI: TestoBase[] = [
  {
    titolo: "In cortile",
    testo: "Marco gioca con la palla. Il cane corre veloce. La mamma guarda dalla finestra.",
    anno: 1,
  },
  {
    titolo: "A tavola",
    testo: "Oggi mangiamo la pizza. Il papà taglia il pane. Tutti sono contenti.",
    anno: 1,
  },
  {
    titolo: "Il temporale",
    testo:
      "Il cielo diventa scuro e il vento comincia a soffiare forte. I bambini corrono a casa prima che inizi a piovere.",
    anno: 2,
  },
  {
    titolo: "La merenda",
    testo:
      "Ogni pomeriggio la nonna prepara una merenda golosa: pane, burro e marmellata di fragole per tutti i nipoti.",
    anno: 2,
  },
  {
    titolo: "Al mercato",
    testo:
      "Il sabato mattina andiamo al mercato con la mamma. Compriamo frutta fresca, verdura di stagione e un mazzo di fiori profumati per la tavola.",
    anno: 3,
  },
  {
    titolo: "Il primo giorno di scuola",
    testo:
      "Il primo giorno di scuola Giulia era molto emozionata. Ha indossato il grembiule nuovo, ha preparato lo zaino e ha salutato i genitori con un grande sorriso.",
    anno: 3,
  },
  {
    titolo: "Il rifugio degli animali",
    testo:
      "Nel bosco vicino al paese vive una famiglia di ricci. Durante l'autunno raccolgono foglie secche per costruire un rifugio caldo, dove trascorreranno l'inverno al riparo dal freddo.",
    anno: 4,
  },
  {
    titolo: "La biblioteca",
    testo:
      "Ogni giovedì pomeriggio la biblioteca del quartiere organizza un incontro di lettura per bambini. I volontari leggono storie ad alta voce e poi propongono piccoli giochi legati ai racconti ascoltati.",
    anno: 4,
  },
  {
    titolo: "Il viaggio in treno",
    testo:
      "Durante il viaggio in treno verso la montagna, osservavamo il paesaggio che cambiava rapidamente: prima le colline coperte di vigneti, poi le foreste sempre più fitte, infine le cime innevate.",
    anno: 5,
  },
  {
    titolo: "L'invenzione della carta",
    testo:
      "Molti secoli fa, in Cina, fu inventata la carta: un materiale leggero e poco costoso che sostituì gradualmente la pergamena, permettendo così una diffusione molto più ampia della scrittura.",
    anno: 5,
  },
];

const LACUNE_PER_ANNO: Record<number, number> = { 1: 3, 2: 4, 3: 5, 4: 6, 5: 8 };

export function lacuneConsigliate(anno: number): number {
  return LACUNE_PER_ANNO[anno] ?? 4;
}

export interface ConfigTestoBucato {
  anno: number;
  numeroLacune: number;
}

export interface EsercizioTestoBucato {
  titolo: string;
  /** Segmenti di testo: tra `parti[i]` e `parti[i+1]` va inserita `paroleMancanti[i]`. */
  parti: string[];
  paroleMancanti: string[];
  bancaParole: string[];
}

const REGEX_LETTERA = /[A-Za-zàèéìòùÀÈÉÌÒÙ']+/;
const REGEX_TOKEN = /[A-Za-zàèéìòùÀÈÉÌÒÙ']+|[^A-Za-zàèéìòùÀÈÉÌÒÙ']+/g;

function tokenizza(testo: string): string[] {
  return testo.match(REGEX_TOKEN) ?? [testo];
}

export function generaTestoBucato(config: ConfigTestoBucato): EsercizioTestoBucato {
  const pool = BANCA_TESTI.filter((t) => t.anno === config.anno);
  const [base] = scegliN(pool.length > 0 ? pool : BANCA_TESTI, 1);

  const token = tokenizza(base.testo);
  const indiciEleggibili = token
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => t.length >= 3 && REGEX_LETTERA.test(t))
    .map(({ i }) => i);

  const numeroLacune = Math.min(config.numeroLacune, indiciEleggibili.length);
  const indiciLacuna = new Set(
    scegliN(indiciEleggibili, numeroLacune).sort((a, b) => a - b),
  );

  const parti: string[] = [];
  const paroleMancanti: string[] = [];
  let accumulo = "";
  token.forEach((t, i) => {
    if (indiciLacuna.has(i)) {
      parti.push(accumulo);
      accumulo = "";
      paroleMancanti.push(t);
    } else {
      accumulo += t;
    }
  });
  parti.push(accumulo);

  return {
    titolo: base.titolo,
    parti,
    paroleMancanti,
    bancaParole: mescola(paroleMancanti),
  };
}
