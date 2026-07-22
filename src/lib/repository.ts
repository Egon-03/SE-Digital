import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { MATERIALI } from "../data/materiali";
import type {
  MaterialeDidattico,
  MateriaSlug,
  TipoMateriale,
  NuovaPropostaMateriale,
} from "../types/domain";

export interface FiltriMateriali {
  materia?: MateriaSlug;
  anno?: number;
  tipo?: TipoMateriale;
  testo?: string;
}

const STORAGE_KEY = "se-digital-materiali-v1";

/**
 * Repository con doppio backend: usa Supabase quando le credenziali sono
 * configurate (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY), altrimenti
 * ripiega su un "database" locale in localStorage seminato con i dati di
 * esempio — così proporre un materiale e approvarlo funziona anche nella
 * demo statica su GitHub Pages, senza alcun backend reale.
 */

function loadLocal(): MaterialeDidattico[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MaterialeDidattico[];
  } catch {
    // localStorage non disponibile o dati corrotti: si riparte dai dati seed.
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MATERIALI));
  return MATERIALI;
}

function saveLocal(materiali: MaterialeDidattico[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(materiali));
}

function corrisponde(m: MaterialeDidattico, f: FiltriMateriali): boolean {
  if (f.materia && m.materia !== f.materia) return false;
  if (f.anno && !m.anni.includes(f.anno)) return false;
  if (f.tipo && m.tipo !== f.tipo) return false;
  if (f.testo) {
    const q = f.testo.toLowerCase();
    const haystack = `${m.titolo} ${m.descrizioneBreve} ${m.tagLiberi.join(" ")}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

export async function getMaterialiApprovati(
  filtri: FiltriMateriali = {},
): Promise<MaterialeDidattico[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from("materiali").select("*").eq("stato", "approvato");
    if (filtri.materia) query = query.eq("materia", filtri.materia);
    if (filtri.tipo) query = query.eq("tipo", filtri.tipo);
    const { data, error } = await query;
    if (error) throw error;
    let risultati = (data ?? []) as MaterialeDidattico[];
    if (filtri.anno) risultati = risultati.filter((m) => m.anni.includes(filtri.anno!));
    if (filtri.testo) risultati = risultati.filter((m) => corrisponde(m, filtri));
    return risultati;
  }

  return loadLocal()
    .filter((m) => m.stato === "approvato")
    .filter((m) => corrisponde(m, filtri));
}

export async function getMaterialeById(id: string): Promise<MaterialeDidattico | undefined> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("materiali").select("*").eq("id", id).single();
    if (error) return undefined;
    return data as MaterialeDidattico;
  }
  return loadLocal().find((m) => m.id === id);
}

export async function proporreMateriale(
  proposta: NuovaPropostaMateriale,
): Promise<MaterialeDidattico> {
  const nuovo: MaterialeDidattico = {
    id: `proposta-${Date.now()}`,
    titolo: proposta.titolo,
    descrizioneBreve: proposta.descrizioneBreve,
    materia: proposta.materia,
    anni: proposta.anni,
    tipo: proposta.tipo,
    pds: {
      areaDisciplinare: "",
      disciplina: "",
      ciclo: proposta.anni[0] <= 2 ? 1 : 2,
      ambitoCompetenza: "",
      traguardoCompetenza: "",
      traguardoSpecifico: "",
    },
    tagLiberi: [],
    tagFormazioneGenerale: [],
    tagCompetenzeTrasversali: [],
    fileAllegati: [],
    autoreNome: proposta.autoreNome,
    autoreId: null,
    dataCreazione: new Date().toISOString().slice(0, 10),
    dataModifica: new Date().toISOString().slice(0, 10),
    stato: "in_revisione",
    licenza: "CC BY-NC 4.0",
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("materiali").insert(nuovo).select().single();
    if (error) throw error;
    return data as MaterialeDidattico;
  }

  const attuali = loadLocal();
  const aggiornati = [...attuali, nuovo];
  saveLocal(aggiornati);
  return nuovo;
}

export async function getMaterialiInRevisione(): Promise<MaterialeDidattico[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("materiali")
      .select("*")
      .eq("stato", "in_revisione");
    if (error) throw error;
    return (data ?? []) as MaterialeDidattico[];
  }
  return loadLocal().filter((m) => m.stato === "in_revisione");
}

async function cambiaStato(id: string, stato: "approvato" | "rifiutato"): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("materiali").update({ stato }).eq("id", id);
    if (error) throw error;
    return;
  }
  const attuali = loadLocal();
  const aggiornati = attuali.map((m) =>
    m.id === id ? { ...m, stato, dataModifica: new Date().toISOString().slice(0, 10) } : m,
  );
  saveLocal(aggiornati);
}

export const approvaMateriale = (id: string) => cambiaStato(id, "approvato");
export const rifiutaMateriale = (id: string) => cambiaStato(id, "rifiutato");
