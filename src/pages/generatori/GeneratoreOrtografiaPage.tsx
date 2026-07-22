import { useState } from "react";
import { Breadcrumb } from "../../components/Breadcrumb";
import {
  generaEsercizi,
  NOMI_REGOLA,
  regolePerAnno,
  type ConfigOrtografia,
  type EsercizioOrtografia,
} from "../../lib/generators/ortografia";

const ANNI = [1, 2, 3, 4, 5];
const OPZIONI_NUMERO_ESERCIZI = [5, 10, 15, 20];

const CONFIG_INIZIALE: ConfigOrtografia = { anno: 3, numeroEsercizi: 10 };

export function GeneratoreOrtografiaPage() {
  const [config, setConfig] = useState<ConfigOrtografia>(CONFIG_INIZIALE);
  const [esercizi, setEsercizi] = useState<EsercizioOrtografia[] | null>(null);
  const [risposte, setRisposte] = useState<string[]>([]);
  const [esito, setEsito] = useState<{ corretti: number; totale: number } | null>(null);

  function genera() {
    const nuovi = generaEsercizi(config);
    setEsercizi(nuovi);
    setRisposte(nuovi.map(() => ""));
    setEsito(null);
  }

  function scegli(indice: number, valore: string) {
    setRisposte((prev) => {
      const nuove = [...prev];
      nuove[indice] = valore;
      return nuove;
    });
  }

  function correggi() {
    if (!esercizi) return;
    let corretti = 0;
    esercizi.forEach((es, i) => {
      if (risposte[i] === es.corretta) corretti++;
    });
    setEsito({ corretti, totale: esercizi.length });
  }

  return (
    <div className="container">
      <Breadcrumb
        percorso={[
          { etichetta: "Italiano", href: "/materia/italiano" },
          { etichetta: "Generatori", href: "/materia/italiano/generatori" },
          { etichetta: "Ortografia" },
        ]}
      />

      <h1>Generatore di esercizi di ortografia</h1>

      <div className="no-stampa">
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div className="campo" style={{ marginBottom: 0 }}>
            <label htmlFor="anno">Classe</label>
            <select
              id="anno"
              value={config.anno}
              onChange={(e) => setConfig((c) => ({ ...c, anno: Number(e.target.value) }))}
            >
              {ANNI.map((anno) => (
                <option key={anno} value={anno}>
                  {anno}ª elementare
                </option>
              ))}
            </select>
          </div>

          <div className="campo" style={{ marginBottom: 0 }}>
            <label htmlFor="numero-esercizi">Numero di esercizi</label>
            <select
              id="numero-esercizi"
              value={config.numeroEsercizi}
              onChange={(e) =>
                setConfig((c) => ({ ...c, numeroEsercizi: Number(e.target.value) }))
              }
            >
              {OPZIONI_NUMERO_ESERCIZI.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="aiuto" style={{ color: "var(--inchiostro-tenue)", fontSize: "0.85rem" }}>
          Regole allenate per questa classe:{" "}
          {regolePerAnno(config.anno)
            .map((r) => NOMI_REGOLA[r])
            .join(", ")}
          .
        </p>

        <div style={{ display: "flex", gap: "0.7rem", marginTop: "1rem", flexWrap: "wrap" }}>
          <button type="button" className="btn btn-primario" onClick={genera}>
            Genera scheda
          </button>
          {esercizi && (
            <>
              <button type="button" className="btn" onClick={correggi}>
                Correggi
              </button>
              <button type="button" className="btn" onClick={() => window.print()}>
                Stampa scheda
              </button>
            </>
          )}
        </div>
      </div>

      <div aria-live="polite">
        {esito && (
          <p style={{ fontWeight: 700, marginTop: "1rem" }}>
            Hai risposto correttamente a {esito.corretti} esercizi su {esito.totale}.
          </p>
        )}
      </div>

      {esercizi && (
        <section className="scheda-stampa" style={{ marginTop: "1.5rem" }}>
          <p className="riga-intestazione-stampa">
            Nome: <span className="riga-da-compilare" /> Data: <span className="riga-da-compilare" />
          </p>
          <h2>Quale parola è scritta correttamente?</h2>
          <ol className="lista-esercizi lista-esercizi-verticale">
            {esercizi.map((es, i) => {
              const corretto = esito && risposte[i] === es.corretta;
              const errato = esito && risposte[i] !== es.corretta;
              return (
                <li key={i} className="esercizio-riga">
                  <fieldset className="esercizio-opzioni">
                    <legend className="sr-only">Esercizio {i + 1}</legend>
                    {es.opzioni.map((opzione) => (
                      <label key={opzione} className="checkbox-riga">
                        <input
                          type="radio"
                          name={`es-${i}`}
                          value={opzione}
                          checked={risposte[i] === opzione}
                          onChange={() => scegli(i, opzione)}
                        />
                        {opzione}
                      </label>
                    ))}
                  </fieldset>
                  {corretto && (
                    <span className="no-stampa esito-riga esito-corretto"> corretto</span>
                  )}
                  {errato && (
                    <span className="no-stampa esito-riga esito-errato">
                      {" "}
                      atteso: {es.corretta}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </div>
  );
}
