import { type FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MATERIE } from "../data/materie";
import { TIPI_MATERIALE_INFO } from "../data/tipiMateriale";
import { proporreMateriale } from "../lib/repository";
import type { MateriaSlug, MaterialeDidattico, TipoMateriale } from "../types/domain";

export function ProposeMaterialPage() {
  const [materia, setMateria] = useState<MateriaSlug>(MATERIE[0].slug);
  const [anniSelezionati, setAnniSelezionati] = useState<number[]>([]);
  const [tipo, setTipo] = useState<TipoMateriale>(TIPI_MATERIALE_INFO[0].slug);
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [autoreNome, setAutoreNome] = useState("");
  const [inviando, setInviando] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [creato, setCreato] = useState<MaterialeDidattico | null>(null);
  const erroreRef = useRef<HTMLDivElement>(null);

  const materiaSelezionata = MATERIE.find((m) => m.slug === materia) ?? MATERIE[0];
  const formSporco = Boolean(titolo || descrizione || autoreNome || anniSelezionati.length > 0);

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrore(null);

    if (!titolo.trim() || !descrizione.trim() || !autoreNome.trim() || anniSelezionati.length === 0) {
      setErrore("Compila titolo, descrizione, autore e seleziona almeno un anno.");
      return;
    }

    setInviando(true);
    try {
      const nuovo = await proporreMateriale({
        titolo: titolo.trim(),
        descrizioneBreve: descrizione.trim(),
        materia,
        anni: anniSelezionati,
        tipo,
        autoreNome: autoreNome.trim(),
      });
      setCreato(nuovo);
    } catch {
      setErrore("Non è stato possibile inviare la proposta. Riprova più tardi.");
    } finally {
      setInviando(false);
    }
  }

  if (creato) {
    return (
      <div className="container" style={{ maxWidth: "40rem" }}>
        <h1>Proposta inviata</h1>
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
      <h1>Proponi un materiale</h1>
      <p style={{ color: "var(--inchiostro-tenue)" }}>
        Chiunque può proporre un materiale, anche senza account. La proposta entra in coda di
        revisione e diventa visibile pubblicamente solo dopo l’approvazione di un moderatore.
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
          {inviando ? "Invio in corso…" : "Invia proposta"}
        </button>
      </form>
    </div>
  );
}
