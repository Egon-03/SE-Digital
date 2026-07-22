/**
 * Modello dati del progetto — vedi brief §2-5.
 * Lo schema copre la struttura completa fin dall'inizio anche se i dati
 * reali (Piano di Studio ufficiale, materiali) vengono popolati nel tempo.
 */

export type MateriaSlug =
  | "italiano"
  | "francese"
  | "matematica"
  | "studio-ambiente"
  | "educazione-visiva"
  | "arti-plastiche"
  | "educazione-musicale"
  | "educazione-fisica"
  | "religione";

export interface Materia {
  slug: MateriaSlug;
  nome: string;
  /** Anni scolastici (1-5) in cui la materia è insegnata. */
  anni: number[];
  /** true se la materia ha uno statuto particolare (facoltativa, ecc.) */
  facoltativa?: boolean;
}

export type Ciclo = 1 | 2;

export function cicloDaAnno(anno: number): Ciclo {
  return anno <= 2 ? 1 : 2;
}

export const TIPI_MATERIALE = [
  "contesti-di-senso",
  "pratiche-didattiche",
  "problemi",
  "giochi",
  "supporti",
  "schede-allievo",
] as const;

export type TipoMateriale = (typeof TIPI_MATERIALE)[number];

export interface TipoMaterialeInfo {
  slug: TipoMateriale;
  nome: string;
  descrizione: string;
}

/** Catena gerarchica di collegamento al Piano di Studio (brief §3). */
export interface CollegamentoPds {
  areaDisciplinare: string;
  disciplina: string;
  ciclo: Ciclo;
  ambitoCompetenza: string;
  traguardoCompetenza: string;
  traguardoSpecifico: string;
}

export type StatoMateriale = "bozza" | "in_revisione" | "approvato" | "rifiutato";

export interface FileAllegato {
  nome: string;
  url: string;
  formato: "pdf" | "docx" | "jpg" | "png";
  dimensioneKb: number;
}

export interface MaterialeDidattico {
  id: string;
  titolo: string;
  descrizioneBreve: string;
  materia: MateriaSlug;
  anni: number[];
  tipo: TipoMateriale;
  pds: CollegamentoPds;
  tagLiberi: string[];
  tagFormazioneGenerale: string[];
  tagCompetenzeTrasversali: string[];
  fileAllegati: FileAllegato[];
  autoreNome: string;
  /** Nullable: predisposto per un futuro sistema account (fase 2). */
  autoreId: string | null;
  dataCreazione: string;
  dataModifica: string;
  stato: StatoMateriale;
  licenza: string;
  contatoreDownload?: number;
}

/** Stub per fase 2 — non usato per l'autenticazione nell'MVP. */
export interface Utente {
  id: string;
  nome: string;
  email: string;
}

export interface NuovaPropostaMateriale {
  titolo: string;
  descrizioneBreve: string;
  materia: MateriaSlug;
  anni: number[];
  tipo: TipoMateriale;
  autoreNome: string;
  noteProponente?: string;
}
