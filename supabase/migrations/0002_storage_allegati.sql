-- Bucket di storage per i PDF caricati con "Inserisci materiale" (vedi
-- src/lib/repository.ts, inserireMateriale). Analogo, come apertura, alla
-- policy "chiunque puo proporre un materiale" di 0001_init.sql: nell'MVP
-- non esiste un sistema di ruoli reale, quindi anche il caricamento diretto
-- di file è aperto a chiunque, mentre la visibilità pubblica della *scheda*
-- resta comunque filtrata da stato = 'approvato' (0001_init.sql). Il bucket
-- pubblico rende però il singolo file scaricabile da chi conosce l'URL
-- anche prima dell'approvazione: da rivedere con Supabase Auth + ruoli
-- reali in fase 2.
insert into storage.buckets (id, name, public)
values ('materiali-allegati', 'materiali-allegati', true)
on conflict (id) do nothing;

create policy "chiunque puo caricare allegati pdf"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'materiali-allegati');

create policy "allegati sono leggibili pubblicamente"
  on storage.objects for select
  to public
  using (bucket_id = 'materiali-allegati');
