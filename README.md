# Materiali SE — Hub didattico per la scuola elementare ticinese

Hub web che raccoglie materiali didattici per tutte le materie e i 5 anni
della scuola elementare ticinese, collegati al Piano di Studio cantonale.
Vedi il brief di progetto per il contesto completo (obiettivi, tassonomia,
modello dati).

Sito statico (Vite + React + TypeScript) pubblicato su GitHub Pages, con
backend opzionale su Supabase.

## Avvio in locale

```bash
npm install
npm run dev
```

Il sito è consultabile su `http://localhost:5173/SE-Digital/`.

Senza alcuna configurazione aggiuntiva il sito funziona già, usando un
"database" mock in `localStorage` (seminato con i dati d'esempio in
`src/data/materiali.ts`): puoi proporre un materiale dal form pubblico e
vederlo comparire nella coda di moderazione. "Inserisci materiale" (`/inserisci`)
funziona allo stesso modo ma richiede anche un file PDF allegato; senza
Supabase configurato il PDF viene salvato come data-URL in `localStorage`
(limite ~4MB), con Supabase viene caricato sul bucket `materiali-allegati`
(limite 20MB).

## Collegare Supabase (opzionale)

1. Crea un progetto su [supabase.com](https://supabase.com).
2. Esegui le migration in `supabase/migrations/` in ordine (0001, poi 0002 —
   SQL Editor del progetto, oppure `supabase db push` con la CLI ufficiale).
   La 0002 crea il bucket di storage `materiali-allegati` usato da
   "Inserisci materiale" per i PDF caricati.
3. Copia `.env.example` in `.env.local` e compila:
   - `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (Impostazioni progetto → API)
   - `VITE_MODERATION_PASSWORD`, la password condivisa per `/moderazione`
4. Riavvia `npm run dev`.

Finché queste variabili non sono impostate, il repository (`src/lib/repository.ts`)
usa automaticamente il backend mock — nessuna riga di codice da cambiare.

**Nota sulla sicurezza della moderazione**: nell'MVP l'accesso a
`/moderazione` è protetto solo da una password condivisa controllata lato
client, non da un vero sistema di ruoli (vedi brief §5, §9). La policy SQL
corrispondente limita comunque, lato database, gli update alla sola
transizione `in_revisione → approvato/rifiutato`. Un sistema di
autenticazione reale (Supabase Auth + ruoli) è previsto in fase 2.

## Pubblicazione su GitHub Pages

Il workflow `.github/workflows/deploy.yml` builda e pubblica il sito a ogni
push su `main`, su `https://<utente>.github.io/SE-Digital/`.

Per attivarlo:

1. Impostazioni repository → Pages → Source: **GitHub Actions**.
2. Se vuoi collegare Supabase anche in produzione, aggiungi gli stessi tre
   valori di `.env.example` come *Repository secrets* (Impostazioni →
   Secrets and variables → Actions): `VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`, `VITE_MODERATION_PASSWORD`.

`vite.config.ts` ha già `base: '/SE-Digital/'` impostato per servire
correttamente asset e router sotto quel percorso.

## Struttura del progetto

```
src/
  types/domain.ts        modello dati (brief §2-5)
  data/                  materie, tipi di materiale, materiali d'esempio
  lib/
    supabaseClient.ts     client Supabase (null se non configurato)
    repository.ts         accesso ai dati: Supabase o mock localStorage
    moderationAuth.ts      gate password per /moderazione
  components/            UI riutilizzabile (card, breadcrumb, icone materie)
  pages/                 una pagina per step di navigazione
supabase/migrations/      schema SQL per Supabase
```

Navigazione: Home → Materia → Anno → Tipo di materiale → Elenco filtrabile
→ Dettaglio, con "Proponi materiale" raggiungibile da ovunque (brief §6).

## Cosa manca (fase 2, non bloccante)

- Login docenti reale, collezioni personali (brief §7). L'upload diretto dei
  PDF ("Inserisci materiale") è già disponibile, ma resta aperto a chiunque
  come "Proponi materiale" — vedi nota di sicurezza in
  `supabase/migrations/0002_storage_allegati.sql`.
- Popolamento del Piano di Studio ufficiale oltre i dati d'esempio (brief §9).
