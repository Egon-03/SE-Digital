import type { Materia } from "../types/domain";

const ANNI_COMPLETI = [1, 2, 3, 4, 5];

export const MATERIE: Materia[] = [
  { slug: "italiano", nome: "Italiano", anni: ANNI_COMPLETI },
  { slug: "francese", nome: "Francese", anni: [3, 4, 5] },
  { slug: "matematica", nome: "Matematica", anni: ANNI_COMPLETI },
  { slug: "studio-ambiente", nome: "Studio d’ambiente", anni: ANNI_COMPLETI },
  { slug: "educazione-visiva", nome: "Educazione visiva", anni: ANNI_COMPLETI },
  { slug: "arti-plastiche", nome: "Educazione alle arti plastiche", anni: ANNI_COMPLETI },
  { slug: "educazione-musicale", nome: "Educazione musicale", anni: ANNI_COMPLETI },
  { slug: "educazione-fisica", nome: "Educazione fisica", anni: ANNI_COMPLETI },
  {
    slug: "religione",
    nome: "Insegnamento religioso",
    anni: ANNI_COMPLETI,
    facoltativa: true,
  },
];

export function trovaMateria(slug: string): Materia | undefined {
  return MATERIE.find((m) => m.slug === slug);
}
