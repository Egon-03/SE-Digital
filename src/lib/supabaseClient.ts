import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Nullo finché il progetto Supabase non è collegato (vedi README per la
 * procedura). In assenza di credenziali il sito resta pienamente navigabile
 * usando il repository mock (src/lib/repository.ts), così da poter essere
 * pubblicato su GitHub Pages fin da subito.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;
