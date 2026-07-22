import type { TipoMaterialeInfo } from "../types/domain";

export const TIPI_MATERIALE_INFO: TipoMaterialeInfo[] = [
  {
    slug: "contesti-di-senso",
    nome: "Contesti di senso",
    descrizione: "Situazioni di partenza che danno significato all’apprendimento.",
  },
  {
    slug: "pratiche-didattiche",
    nome: "Pratiche didattiche",
    descrizione: "Percorsi e metodologie sperimentate in classe.",
  },
  {
    slug: "problemi",
    nome: "Problemi",
    descrizione: "Situazioni-problema da proporre agli allievi.",
  },
  {
    slug: "giochi",
    nome: "Giochi",
    descrizione: "Attività ludiche con obiettivi di apprendimento.",
  },
  {
    slug: "supporti",
    nome: "Supporti",
    descrizione: "Materiali di supporto alla lezione (immagini, schemi, presentazioni).",
  },
  {
    slug: "schede-allievo",
    nome: "Schede per l’allievo",
    descrizione: "Schede stampabili da consegnare direttamente agli allievi.",
  },
];

export function trovaTipoMateriale(slug: string): TipoMaterialeInfo | undefined {
  return TIPI_MATERIALE_INFO.find((t) => t.slug === slug);
}
