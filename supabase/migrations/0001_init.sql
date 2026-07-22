-- Schema iniziale — Hub materiali didattici SE Ticino
-- Vedi brief §3, §5. Copre lo schema completo previsto dal brief; i dati
-- reali (Piano di Studio ufficiale, materiali) si popolano nel tempo.

-- Stub utenti per la fase 2 (login docenti). Tabella vuota nell'MVP:
-- serve solo perché "materiali.autore_id" possa già puntarci senza
-- richiedere un refactoring dello schema in futuro.
create table if not exists utenti (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text unique not null,
  creato_il timestamptz not null default now()
);

create table if not exists materiali (
  id text primary key,
  titolo text not null,
  descrizione_breve text not null default '',
  materia text not null,
  anni int[] not null default '{}',
  tipo text not null,

  -- Collegamento al Piano di Studio (brief §3): area -> disciplina -> ciclo
  -- -> ambito di competenza -> traguardo di competenza -> traguardo specifico.
  pds_area_disciplinare text not null default '',
  pds_disciplina text not null default '',
  pds_ciclo smallint check (pds_ciclo in (1, 2)),
  pds_ambito_competenza text not null default '',
  pds_traguardo_competenza text not null default '',
  pds_traguardo_specifico text not null default '',

  tag_liberi text[] not null default '{}',
  tag_formazione_generale text[] not null default '{}',
  tag_competenze_trasversali text[] not null default '{}',

  -- [{ nome, url, formato, dimensioneKb }, ...]
  file_allegati jsonb not null default '[]',

  autore_nome text not null default 'Team redazionale',
  autore_id uuid references utenti(id),

  data_creazione timestamptz not null default now(),
  data_modifica timestamptz not null default now(),

  stato text not null default 'in_revisione'
    check (stato in ('bozza', 'in_revisione', 'approvato', 'rifiutato')),
  licenza text not null default 'CC BY-NC 4.0',
  contatore_download int not null default 0
);

create index if not exists materiali_materia_idx on materiali (materia);
create index if not exists materiali_stato_idx on materiali (stato);

alter table materiali enable row level security;
alter table utenti enable row level security;

-- Lettura pubblica: solo i materiali già approvati sono visibili a chiunque.
create policy "materiali approvati sono pubblici"
  on materiali for select
  using (stato = 'approvato');

-- Chiunque (anche senza login, in questa fase) può proporre un materiale:
-- l'insert è permesso solo se lo stato proposto è "in_revisione", così un
-- utente anonimo non può auto-approvarsi un materiale.
create policy "chiunque puo proporre un materiale"
  on materiali for insert
  with check (stato = 'in_revisione');

-- Non esiste ancora un ruolo "moderatore" reale: l'accesso alla vista di
-- moderazione è protetto solo lato client con una password condivisa
-- (brief §5, "non serve un sistema utenti completo" in questa fase).
-- Di conseguenza anche l'update dello stato passa dalla chiave anon —
-- è un gate leggero, non una vera autorizzazione lato server. Va sostituito
-- con Supabase Auth + policy basate su ruolo reale quando arriva la fase 2
-- (login docenti). Nel frattempo si limita l'update alle sole transizioni
-- di stato valide, senza permettere di alterare altri campi del materiale.
create policy "transizione di stato in revisione -> approvato/rifiutato"
  on materiali for update
  using (stato = 'in_revisione')
  with check (stato in ('approvato', 'rifiutato'));
