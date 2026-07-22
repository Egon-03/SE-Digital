import { useState } from "react";
import { Breadcrumb } from "../../components/Breadcrumb";
import {
  categoriePerAnno,
  generaEsercizi,
  NOMI_PARTE,
  type ConfigAnalisiGrammaticale,
  type EsercizioAnalisiGrammaticale,
  type PartiDelDiscorso,
} from "../../lib/generators/analisiGrammaticale";

const ANNI = [1, 2, 3, 4, 5];
const OPZIONI_NUMERO_ESERCIZI = [5, 8, 10, 15];

const CONFIG_INIZIALE: ConfigAnalisiGrammaticale = { anno: 3, numeroEsercizi: 8 };

function evidenzia(frase: string, parola: string) {
  const indice = frase.indexOf(parola);
  if (indice === -1) return <>{frase}</>;
  return (
    <>
      {frase.slice(0, indice)}
      <strong className="parola-evidenziata">{parola}</strong>
      {frase.slice(indice + parola.length)}
    </>
  );
}

export function GeneratoreAnalisiGrammaticalePage() {
  const [config, setConfig] = useState<ConfigAnalisiGrammaticale>(CONFIG_INIZIALE);
  const [esercizi, setEsercizi] = useState<EsercizioAnalisiGrammaticale[] | null>(null);
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
      if (risposte[i] === es.categoria) corretti++;
    });
    setEsito({ corretti, totale: esercizi.length });
  }

  return (
    <div className="container">
      <Breadcrumb
        percorso={[
          { etichetta: "Italiano", href: "/materia/italiano" },
          { etichetta: "Generatori", href: "/materia/italiano/generatori" },
          { etichetta: "Analisi grammaticale" },
        ]}
      />

      <h1>Generatore di analisi grammaticale</h1>

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
            <label htmlFor="numero-esercizi">Numero di parole</label>
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
          Parti del discorso allenate per questa classe:{" "}
          {categoriePerAnno(config.anno)
            .map((c) => NOMI_PARTE[c])
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
            Hai analizzato correttamente {esito.corretti} parole su {esito.totale}.
          </p>
        )}
      </div>

      {esercizi && (
        <section className="scheda-stampa" style={{ marginTop: "1.5rem" }}>
          <p className="riga-intestazione-stampa">
            Nome: <span className="riga-da-compilare" /> Data: <span className="riga-da-compilare" />
          </p>
          <h2>Che parte del discorso è la parola in grassetto?</h2>
          <ol className="lista-esercizi lista-esercizi-verticale">
            {esercizi.map((es, i) => {
              const corretto = esito && risposte[i] === es.categoria;
              const errato = esito && risposte[i] !== es.categoria;
              return (
                <li key={i} className="esercizio-riga">
                  <span className="esercizio-testo">{evidenzia(es.frase, es.parola)}</span>
                  <label className="sr-only" htmlFor={`categoria-${i}`}>
                    Parte del discorso, esercizio {i + 1}
                  </label>
                  <select
                    id={`categoria-${i}`}
                    className="select-analisi"
                    value={risposte[i]}
                    onChange={(e) => scegli(i, e.target.value)}
                  >
                    <option value="" disabled>
                      Scegli…
                    </option>
                    {es.opzioni.map((opzione: PartiDelDiscorso) => (
                      <option key={opzione} value={opzione}>
                        {NOMI_PARTE[opzione]}
                      </option>
                    ))}
                  </select>
                  {corretto && (
                    <span className="no-stampa esito-riga esito-corretto"> corretto</span>
                  )}
                  {errato && (
                    <span className="no-stampa esito-riga esito-errato">
                      {" "}
                      atteso: {NOMI_PARTE[es.categoria]}
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
