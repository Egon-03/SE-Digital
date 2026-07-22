import { scegliN } from "./utils";

export interface TestoDettato {
  titolo: string;
  testo: string;
  anno: number;
}

const BANCA_DETTATI: TestoDettato[] = [
  {
    titolo: "Il gatto e la mamma",
    testo: "Il gatto dorme sul letto. La mamma prepara la pasta.",
    anno: 1,
  },
  {
    titolo: "Il sole",
    testo: "Il sole è caldo. I bambini giocano nel parco.",
    anno: 1,
  },
  {
    titolo: "La nonna e il cane",
    testo:
      "La nonna cucina la torta di mele. Il cane scodinzola vicino alla cuccia. Fuori piove e il cielo è grigio.",
    anno: 2,
  },
  {
    titolo: "Un pomeriggio in giardino",
    testo:
      "Oggi il sole splende e le rondini volano alte nel cielo. Luca e Anna giocano a palla nel giardino della nonna.",
    anno: 2,
  },
  {
    titolo: "L'ombrello dimenticato",
    testo:
      "Ieri è piovuto tutta la notte e stamattina c'è ancora un po' di vento. Marco ha portato l'ombrello a scuola, ma Sara non ce l'ha e si è bagnata.",
    anno: 3,
  },
  {
    titolo: "La gita al lago",
    testo:
      "Sabato la classe ha fatto una gita al lago. Abbiamo camminato lungo la riva, abbiamo osservato le anatre e abbiamo mangiato la merenda all'ombra di un grande albero.",
    anno: 3,
  },
  {
    titolo: "L'autunno nel bosco",
    testo:
      "Quando arriva l'autunno, le foglie degli alberi cambiano colore e cadono lentamente sui prati. Gli animali del bosco si preparano per l'inverno: lo scoiattolo raccoglie le nocciole, mentre il riccio cerca un rifugio sotto le foglie secche.",
    anno: 4,
  },
  {
    titolo: "Il mercato del sabato",
    testo:
      "Ogni sabato mattina, in piazza, si tiene il mercato del paese. I contadini portano frutta e verdura fresca, i fioristi espongono mazzi colorati e, tra le bancarelle, si sente il profumo del pane appena sfornato.",
    anno: 4,
  },
  {
    titolo: "La festa della lettura",
    testo:
      "La biblioteca del paese organizza ogni anno una festa dedicata alla lettura: bambini e ragazzi si ritrovano nella piazza principale per scambiarsi i libri preferiti, ascoltare storie e partecipare a piccoli laboratori di scrittura creativa.",
    anno: 5,
  },
  {
    titolo: "Un'invenzione straordinaria",
    testo:
      "Molti secoli fa, l'invenzione della stampa cambiò per sempre il modo di comunicare: prima di allora, infatti, i libri venivano copiati a mano, uno per uno, e per questo motivo erano rari e costosissimi.",
    anno: 5,
  },
];

export function testiPerAnno(anno: number): TestoDettato[] {
  return BANCA_DETTATI.filter((t) => t.anno === anno);
}

export function generaDettato(anno: number): TestoDettato {
  const pool = testiPerAnno(anno);
  const [scelto] = scegliN(pool.length > 0 ? pool : BANCA_DETTATI, 1);
  return scelto;
}

export interface ParolaCorretta {
  parola: string;
  corretta: boolean;
}

/** Confronta parola per parola il testo scritto con il testo originale del dettato. */
export function correggiDettato(testoOriginale: string, testoScritto: string): ParolaCorretta[] {
  const paroleOriginali = testoOriginale.trim().split(/\s+/).filter(Boolean);
  const paroleScritte = testoScritto.trim().split(/\s+/).filter(Boolean);
  const lunghezza = Math.max(paroleOriginali.length, paroleScritte.length);
  const risultato: ParolaCorretta[] = [];
  for (let i = 0; i < lunghezza; i++) {
    const attesa = paroleOriginali[i];
    const scritta = paroleScritte[i];
    risultato.push({
      parola: scritta ?? "(mancante)",
      corretta: scritta !== undefined && scritta === attesa,
    });
  }
  return risultato;
}
