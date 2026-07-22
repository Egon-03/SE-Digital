import { scegliN } from "./utils";

export type PartiDelDiscorso =
  | "articolo"
  | "nome"
  | "verbo"
  | "aggettivo"
  | "pronome"
  | "preposizione"
  | "congiunzione"
  | "avverbio"
  | "interiezione";

export const NOMI_PARTE: Record<PartiDelDiscorso, string> = {
  articolo: "Articolo",
  nome: "Nome",
  verbo: "Verbo",
  aggettivo: "Aggettivo",
  pronome: "Pronome",
  preposizione: "Preposizione",
  congiunzione: "Congiunzione",
  avverbio: "Avverbio",
  interiezione: "Interiezione",
};

/** Parti del discorso introdotte progressivamente, dalla 1ª alla 5ª elementare. */
const CATEGORIE_PER_ANNO: Record<number, PartiDelDiscorso[]> = {
  1: ["articolo", "nome"],
  2: ["articolo", "nome", "verbo"],
  3: ["articolo", "nome", "verbo", "aggettivo"],
  4: ["articolo", "nome", "verbo", "aggettivo", "pronome", "preposizione"],
  5: [
    "articolo",
    "nome",
    "verbo",
    "aggettivo",
    "pronome",
    "preposizione",
    "congiunzione",
    "avverbio",
    "interiezione",
  ],
};

export function categoriePerAnno(anno: number): PartiDelDiscorso[] {
  return CATEGORIE_PER_ANNO[anno] ?? CATEGORIE_PER_ANNO[1];
}

export interface ParolaAnalisi {
  frase: string;
  parola: string;
  categoria: PartiDelDiscorso;
}

const BANCA_PAROLE: ParolaAnalisi[] = [
  // Articolo
  { frase: "Il cane abbaia nel cortile.", parola: "Il", categoria: "articolo" },
  { frase: "La maestra scrive alla lavagna.", parola: "La", categoria: "articolo" },
  { frase: "I bambini giocano in giardino.", parola: "I", categoria: "articolo" },
  { frase: "Gli uccelli cantano sui rami.", parola: "Gli", categoria: "articolo" },
  { frase: "Ho comprato un gelato al limone.", parola: "un", categoria: "articolo" },
  { frase: "Una farfalla si è posata sul fiore.", parola: "Una", categoria: "articolo" },
  { frase: "Lo zaino è pieno di libri.", parola: "Lo", categoria: "articolo" },
  { frase: "Le nuvole coprono il sole.", parola: "Le", categoria: "articolo" },

  // Nome
  { frase: "Il cane abbaia nel cortile.", parola: "cane", categoria: "nome" },
  { frase: "La casa dei nonni è in montagna.", parola: "casa", categoria: "nome" },
  { frase: "L'albero ha perso tutte le foglie.", parola: "albero", categoria: "nome" },
  { frase: "Il bambino corre sul prato.", parola: "bambino", categoria: "nome" },
  { frase: "La scuola inizia alle otto.", parola: "scuola", categoria: "nome" },
  { frase: "Ho letto un libro interessante.", parola: "libro", categoria: "nome" },
  { frase: "Il sole scalda la spiaggia.", parola: "sole", categoria: "nome" },
  { frase: "Il mare oggi è molto calmo.", parola: "mare", categoria: "nome" },

  // Verbo
  { frase: "Il cane corre veloce nel parco.", parola: "corre", categoria: "verbo" },
  { frase: "Marco mangia la merenda.", parola: "mangia", categoria: "verbo" },
  { frase: "I bambini giocano a nascondino.", parola: "giocano", categoria: "verbo" },
  { frase: "Il gatto dorme sul divano.", parola: "dorme", categoria: "verbo" },
  { frase: "Laura scrive una lettera.", parola: "scrive", categoria: "verbo" },
  { frase: "Noi cantiamo una canzone allegra.", parola: "cantiamo", categoria: "verbo" },
  { frase: "Voi leggete un fumetto.", parola: "leggete", categoria: "verbo" },
  { frase: "Gli uccelli volano nel cielo azzurro.", parola: "volano", categoria: "verbo" },

  // Aggettivo
  { frase: "Ho visto un cane bellissimo.", parola: "bellissimo", categoria: "aggettivo" },
  { frase: "Il castello è molto grande.", parola: "grande", categoria: "aggettivo" },
  { frase: "Mi ha regalato una piccola pianta.", parola: "piccola", categoria: "aggettivo" },
  { frase: "Il ghepardo è un animale veloce.", parola: "veloce", categoria: "aggettivo" },
  { frase: "Indossava un cappello rosso.", parola: "rosso", categoria: "aggettivo" },
  { frase: "La torta della nonna è dolce.", parola: "dolce", categoria: "aggettivo" },
  { frase: "Abbiamo passato una giornata faticosa.", parola: "faticosa", categoria: "aggettivo" },
  { frase: "Il fiume è freddo in inverno.", parola: "freddo", categoria: "aggettivo" },

  // Pronome
  { frase: "Io vado a scuola a piedi.", parola: "Io", categoria: "pronome" },
  { frase: "Tu sei il mio migliore amico.", parola: "Tu", categoria: "pronome" },
  { frase: "Lui abita vicino al parco.", parola: "Lui", categoria: "pronome" },
  { frase: "Lei ha vinto la gara di corsa.", parola: "Lei", categoria: "pronome" },
  { frase: "Noi andiamo al mare ogni estate.", parola: "Noi", categoria: "pronome" },
  { frase: "Voi avete finito i compiti?", parola: "Voi", categoria: "pronome" },
  { frase: "Loro arrivano domani mattina.", parola: "Loro", categoria: "pronome" },
  { frase: "Qualcuno ha bussato alla porta.", parola: "Qualcuno", categoria: "pronome" },

  // Preposizione
  { frase: "Il libro è di Marco.", parola: "di", categoria: "preposizione" },
  { frase: "Andiamo a scuola insieme.", parola: "a", categoria: "preposizione" },
  { frase: "Il treno arriva da Milano.", parola: "da", categoria: "preposizione" },
  { frase: "I giocattoli sono in camera.", parola: "in", categoria: "preposizione" },
  { frase: "Gioco a calcio con i miei amici.", parola: "con", categoria: "preposizione" },
  { frase: "Il gatto è salito su un albero.", parola: "su", categoria: "preposizione" },
  { frase: "Questo regalo è per te.", parola: "per", categoria: "preposizione" },
  { frase: "C'è un ponte tra le due colline.", parola: "tra", categoria: "preposizione" },

  // Congiunzione
  { frase: "Ho preso la penna e il quaderno.", parola: "e", categoria: "congiunzione" },
  { frase: "Vorrei uscire ma piove forte.", parola: "ma", categoria: "congiunzione" },
  { frase: "Puoi scegliere il gelato o la torta.", parola: "o", categoria: "congiunzione" },
  { frase: "Sono felice perché è il mio compleanno.", parola: "perché", categoria: "congiunzione" },
  { frase: "Usciamo quando smette di piovere.", parola: "quando", categoria: "congiunzione" },
  { frase: "Ascolto la musica mentre disegno.", parola: "mentre", categoria: "congiunzione" },

  // Avverbio
  { frase: "Hai giocato molto bene oggi.", parola: "bene", categoria: "avverbio" },
  { frase: "Ha risposto male alla domanda.", parola: "male", categoria: "avverbio" },
  { frase: "Siamo arrivati presto alla stazione.", parola: "presto", categoria: "avverbio" },
  { frase: "Sei arrivato tardi alla lezione.", parola: "tardi", categoria: "avverbio" },
  { frase: "Vieni qui, ti mostro una cosa.", parola: "qui", categoria: "avverbio" },
  { frase: "Metti il libro là, sopra il tavolo.", parola: "là", categoria: "avverbio" },
  { frase: "Ricorderò sempre questa giornata.", parola: "sempre", categoria: "avverbio" },
  { frase: "Non ho mai visto un tramonto così.", parola: "mai", categoria: "avverbio" },

  // Interiezione
  { frase: "Oh, che bella sorpresa!", parola: "Oh", categoria: "interiezione" },
  { frase: "Ahi, mi sono fatto male al dito!", parola: "Ahi", categoria: "interiezione" },
  { frase: "Wow, che disegno fantastico!", parola: "Wow", categoria: "interiezione" },
  { frase: "Ehi, aspettami!", parola: "Ehi", categoria: "interiezione" },
  { frase: "Beh, forse hai ragione tu.", parola: "Beh", categoria: "interiezione" },
  { frase: "Evviva, abbiamo vinto la partita!", parola: "Evviva", categoria: "interiezione" },
];

export interface ConfigAnalisiGrammaticale {
  anno: number;
  numeroEsercizi: number;
}

export interface EsercizioAnalisiGrammaticale {
  frase: string;
  parola: string;
  categoria: PartiDelDiscorso;
  opzioni: PartiDelDiscorso[];
}

export function generaEsercizi(
  config: ConfigAnalisiGrammaticale,
): EsercizioAnalisiGrammaticale[] {
  const categorieAmmesse = categoriePerAnno(config.anno);
  const pool = BANCA_PAROLE.filter((p) => categorieAmmesse.includes(p.categoria));
  const scelte = scegliN(pool, config.numeroEsercizi);
  return scelte.map((p) => ({
    frase: p.frase,
    parola: p.parola,
    categoria: p.categoria,
    opzioni: categorieAmmesse,
  }));
}
