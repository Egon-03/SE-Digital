import { type FormEvent, useEffect, useState } from "react";
import { trovaMateria } from "../data/materie";
import { trovaTipoMateriale } from "../data/tipiMateriale";
import {
  esciDaModerazione,
  isModerazioneAutenticata,
  provaAccessoModerazione,
} from "../lib/moderationAuth";
import { approvaMateriale, getMaterialiInRevisione, rifiutaMateriale } from "../lib/repository";
import type { MaterialeDidattico } from "../types/domain";
import { EmptyState } from "../components/EmptyState";

export function ModerationPage() {
  const [autenticato, setAutenticato] = useState(false);
  const [password, setPassword] = useState("");
  const [erroreAccesso, setErroreAccesso] = useState<string | null>(null);
  const [inRevisione, setInRevisione] = useState<MaterialeDidattico[] | null>(null);

  useEffect(() => {
    setAutenticato(isModerazioneAutenticata());
  }, []);

  useEffect(() => {
    if (autenticato) ricarica();
  }, [autenticato]);

  function ricarica() {
    getMaterialiInRevisione().then(setInRevisione);
  }

  function handleAccesso(e: FormEvent) {
    e.preventDefault();
    if (provaAccessoModerazione(password)) {
      setAutenticato(true);
      setErroreAccesso(null);
    } else {
      setErroreAccesso("Password non corretta.");
    }
  }

  async function handleDecisione(id: string, titolo: string, decisione: "approvato" | "rifiutato") {
    if (decisione === "rifiutato" && !window.confirm(`Rifiutare “${titolo}”? Non sarà pubblicato.`)) {
      return;
    }
    if (decisione === "approvato") await approvaMateriale(id);
    else await rifiutaMateriale(id);
    ricarica();
  }

  if (!autenticato) {
    return (
      <div className="container" style={{ maxWidth: "26rem" }}>
        <h1>Area di moderazione</h1>
        <p style={{ color: "var(--inchiostro-tenue)" }}>
          Accesso riservato ai moderatori. In questa fase è protetto da una password condivisa,
          non da un account personale.
        </p>
        <form onSubmit={handleAccesso}>
          <div className="campo">
            <label htmlFor="password-moderazione">Password</label>
            <input
              id="password-moderazione"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {erroreAccesso && (
            <div className="messaggio-errore" role="alert" style={{ marginBottom: "1rem" }}>
              {erroreAccesso}
            </div>
          )}
          <button type="submit" className="btn btn-primario">
            Entra
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h1 style={{ marginBottom: 0 }}>Materiali in revisione</h1>
        <button
          type="button"
          className="btn btn-piccolo"
          onClick={() => {
            esciDaModerazione();
            setAutenticato(false);
          }}
        >
          Esci
        </button>
      </div>

      <div aria-live="polite">
        {inRevisione === null && <p>Caricamento…</p>}

        {inRevisione !== null && inRevisione.length === 0 && (
          <EmptyState messaggio="Nessun materiale in attesa di revisione." />
        )}

        {inRevisione && inRevisione.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "1rem" }}>
            {inRevisione.map((m) => {
              const materia = trovaMateria(m.materia);
              const tipoInfo = trovaTipoMateriale(m.tipo);
              return (
                <li key={m.id} className="card">
                  <h2 style={{ marginBottom: "0.3rem", fontSize: "1.2rem" }}>{m.titolo}</h2>
                  <p className="clamp-3" style={{ color: "var(--inchiostro-tenue)", marginBottom: "0.5rem" }}>
                    {m.descrizioneBreve}
                  </p>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
                    <span className="tag">{materia?.nome}</span>
                    <span className="tag">{tipoInfo?.nome}</span>
                    <span className="tag">Anni: {m.anni.join(", ")}</span>
                    <span className="tag">Proposto da: {m.autoreNome}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    <button
                      type="button"
                      className="btn btn-piccolo btn-primario"
                      onClick={() => handleDecisione(m.id, m.titolo, "approvato")}
                    >
                      Approva
                    </button>
                    <button
                      type="button"
                      className="btn btn-piccolo"
                      onClick={() => handleDecisione(m.id, m.titolo, "rifiutato")}
                    >
                      Rifiuta
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
