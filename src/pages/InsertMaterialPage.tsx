import { type FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MATERIE } from "../data/materie";
import { TIPI_MATERIALE_INFO } from "../data/tipiMateriale";
import { inserireMateriale, LIMITE_DIMENSIONE_FILE_MB } from "../lib/repository";
import type { MateriaSlug, MaterialeDidattico, TipoMateriale } from "../types/domain";

/** Gli errori di Supabase (Postgrest, Storage) sono oggetti semplici con
 * `.message`, non istanze di Error: va gestito anche quel caso. */
function messaggioErrore(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "message" in err) return String((err as { message: unknown }).message);
  return String(err);
}

export function InsertMaterialPage() {
  const [materia, setMateria] = useState<MateriaSlug>(MATERIE[0].slug);
  const [anniSelezionati, setAnniSelezionati] = useState<number[]>([]);
  const [tipo, setTipo] = useState<TipoMateriale>(TIPI_MATERIALE_INFO[0].slug);
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [autoreNome, setAutoreNome] = useState("");
  const [file, setFile] = useState<File[]>([]);
  const [inviando, setInviando] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [creato, setCreato] = useState<MaterialeDidattico | null>(null);
  const erroreRef = useRef<HTMLDivElement>(null);

  const materiaSelezionata = MATERIE.find((m) => m.slug === materia) ?? MATERIE[0];
  const formSporco = Boolean(
    titolo || descrizione || autoreNome || anniSelezionati.length > 0 || file.length > 0,
  );

  useEffect(() => {
    if (errore && erroreRef.current) erroreRef.current.focus();
  }, [errore]);

  useEffect(() => {
    if (!formSporco || creato) return;
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formSporco, creato]);

  function toggleAnno(anno: number) {
    setAnniSelezionati((prev) =>
      prev.includes(anno) ? prev.filter((a) => a !== anno) : [...prev, anno].sort(),
    );
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selezionati = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (selezionati.length === 0) return;

    const nonPdf = selezionati.filter((f) => f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf"));
    if (nonPdf.length > 0) {
      setErrore(`Puoi caricare solo file PDF (non valido: ${nonPdf.map((f) => f.name).join(", ")}).`);
      return;
    }
    const troppoGrandi = selezionati.filter((f) => f.size > LIMITE_DIMENSIONE_FILE_MB * 1024 * 1024);
    if (troppoGrandi.length > 0) {
      setErrore(
        `Ogni file deve essere al massimo ${LIMITE_DIMENSIONE_FILE_MB}MB (troppo grande: ${troppoGrandi
          .map((f) => f.name)
          .join(", ")}).`,
      );
      return;
    }

    setErrore(null);
    setFile((prev) => [...prev, ...selezionati]);
  }

  function rimuoviFile(nome: string) {
    setFile((prev) => prev.filter((f) => f.name !== nome));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrore(null);

    if (!titolo.trim() || !descrizione.trim() || !autoreNome.trim() || anniSelezionati.length === 0) {
      setErrore("Compila titolo, descrizione, autore e seleziona almeno un anno.");
      return;
    }
    if (file.length === 0) {
      setErrore("Allega almeno un file PDF.");
      return;
    }

    setInviando(true);
    try {
      const nuovo = await inserireMateriale(
        {
          titolo: titolo.trim(),
          descrizioneBreve: descrizione.trim(),
          materia,
          anni: anniSelezionati,
          tipo,
          autoreNome: autoreNome.trim(),
        },
        file,
      );
      setCreato(nuovo);
    } catch (err) {
      setErrore(`Non è stato possibile caricare il materiale: ${messaggioErrore(err)}`);
    } finally {
      setInviando(false);
    }
  }

  if (creato) {
    return (
      <div className="container" style={{ maxWidth: "40rem" }}>
        <h1>Materiale caricato</h1>
        <div className="messaggio-esito">
          Grazie! “{creato.titolo}” è stato messo in coda di revisione e non è ancora visibile
          pubblicamente. Un moderatore lo esaminerà a breve.
        </div>
        <p style={{ marginTop: "1.5rem" }}>
          <Link to="/" className="btn btn-primario">
            Torna alla home
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: "40rem" }}>
      <h1>Inserisci materiale</h1>
      <p style={{ color: "var(--inchiostro-tenue)" }}>
        Chiunque può caricare un materiale, anche senza account. Come per una proposta, entra in
        coda di revisione e diventa visibile pubblicamente solo dopo l’approvazione di un
        moderatore — con la differenza che qui alleghi direttamente il file PDF.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="campo">
          <label htmlFor="titolo">Titolo del materiale</label>
          <input
            id="titolo"
            name="titolo"
            type="text"
            autoComplete="off"
            value={titolo}
            onChange={(e) => setTitolo(e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="descrizione">Descrizione breve</label>
          <textarea
            id="descrizione"
            name="descrizione"
            autoComplete="off"
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="materia">Materia</label>
          <select
            id="materia"
            name="materia"
            value={materia}
            onChange={(e) => {
              setMateria(e.target.value as MateriaSlug);
              setAnniSelezionati([]);
            }}
          >
            {MATERIE.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="campo" style={{ border: "none", padding: 0 }}>
          <legend style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: "0.35rem" }}>
            Anno/i di riferimento
          </legend>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {[1, 2, 3, 4, 5].map((anno) => {
              const pertinente = materiaSelezionata.anni.includes(anno);
              return (
                <label
                  key={anno}
                  className="checkbox-riga"
                  style={{ opacity: pertinente ? 1 : 0.4 }}
                >
                  <input
                    type="checkbox"
                    name="anni"
                    disabled={!pertinente}
                    checked={anniSelezionati.includes(anno)}
                    onChange={() => toggleAnno(anno)}
                  />
                  {anno}ª
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="campo">
          <label htmlFor="tipo">Tipo di materiale</label>
          <select id="tipo" name="tipo" value={tipo} onChange={(e) => setTipo(e.target.value as TipoMateriale)}>
            {TIPI_MATERIALE_INFO.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="autore">Il tuo nome</label>
          <span className="aiuto" id="autore-aiuto">
            Verrà mostrato pubblicamente come autore del materiale.
          </span>
          <input
            id="autore"
            name="nome"
            type="text"
            autoComplete="name"
            aria-describedby="autore-aiuto"
            value={autoreNome}
            onChange={(e) => setAutoreNome(e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="file">File PDF</label>
          <span className="aiuto" id="file-aiuto">
            Solo file .pdf, massimo {LIMITE_DIMENSIONE_FILE_MB}MB ciascuno. Puoi selezionarne più
            di uno.
          </span>
          <input
            id="file"
            name="file"
            type="file"
            accept=".pdf,application/pdf"
            multiple
            aria-describedby="file-aiuto"
            onChange={handleFile}
          />
          {file.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 0", display: "grid", gap: "0.4rem" }}>
              {file.map((f) => (
                <li
                  key={f.name}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}
                >
                  <span className="tag">
                    {f.name} · {Math.round(f.size / 1024)}&nbsp;KB
                  </span>
                  <button type="button" className="btn btn-piccolo" onClick={() => rimuoviFile(f.name)}>
                    Rimuovi
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {errore && (
          <div
            className="messaggio-errore"
            role="alert"
            tabIndex={-1}
            ref={erroreRef}
            style={{ marginBottom: "1rem" }}
          >
            {errore}
          </div>
        )}

        <button type="submit" className="btn btn-primario" disabled={inviando}>
          {inviando ? "Caricamento in corso…" : "Carica materiale"}
        </button>
      </form>
    </div>
  );
}
