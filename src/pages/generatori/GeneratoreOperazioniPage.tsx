import { useState } from "react";
import { Breadcrumb } from "../../components/Breadcrumb";
import {
  generaEsercizi,
  NOMI_OPERAZIONE,
  type ConfigOperazioni,
  type EsercizioOperazione,
  type TipoOperazione,
} from "../../lib/generators/operazioni";

const OPZIONI_NUMERO_ESERCIZI = [5, 10, 15, 20, 30];

const CONFIG_INIZIALE: ConfigOperazioni = {
  tipo: "addizione",
  cifre: 2,
  consentiRiporto: true,
  consentiResto: false,
  numeroEsercizi: 10,
};

export function GeneratoreOperazioniPage() {
  const [config, setConfig] = useState<ConfigOperazioni>(CONFIG_INIZIALE);
  const [esercizi, setEsercizi] = useState<EsercizioOperazione[] | null>(null);
  const [risposte, setRisposte] = useState<string[][]>([]);
  const [esito, setEsito] = useState<{ corretti: number; totale: number } | null>(null);

  function genera() {
    const nuovi = generaEsercizi(config);
    setEsercizi(nuovi);
    setRisposte(nuovi.map((e) => e.risposte.map(() => "")));
    setEsito(null);
  }

  function aggiornaRisposta(indiceEsercizio: number, indiceRisposta: number, valore: string) {
    setRisposte((prev) => {
      const nuove = prev.map((r) => [...r]);
      nuove[indiceEsercizio][indiceRisposta] = valore;
      return nuove;
    });
  }

  function correggi() {
    if (!esercizi) return;
    let corretti = 0;
    esercizi.forEach((es, i) => {
      const tutteCorrette = es.risposte.every(
        (attesa, j) => Number(risposte[i][j]) === attesa,
      );
      if (tutteCorrette) corretti++;
    });
    setEsito({ corretti, totale: esercizi.length });
  }

  const mostraRiportoPrestito = config.tipo === "addizione" || config.tipo === "sottrazione";
  const mostraResto = config.tipo === "divisione";

  return (
    <div className="container">
      <Breadcrumb
        percorso={[
          { etichetta: "Matematica", href: "/materia/matematica" },
          { etichetta: "Generatori", href: "/materia/matematica/generatori" },
          { etichetta: "Operazioni aritmetiche" },
        ]}
      />

      <h1>Generatore di operazioni aritmetiche</h1>

      <div className="no-stampa">
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div className="campo" style={{ marginBottom: 0 }}>
            <label htmlFor="tipo-operazione">Tipo di operazione</label>
            <select
              id="tipo-operazione"
              value={config.tipo}
              onChange={(e) =>
                setConfig((c) => ({ ...c, tipo: e.target.value as TipoOperazione }))
              }
            >
              {Object.entries(NOMI_OPERAZIONE).map(([valore, nome]) => (
                <option key={valore} value={valore}>
                  {nome}
                </option>
              ))}
            </select>
          </div>

          <div className="campo" style={{ marginBottom: 0 }}>
            <label htmlFor="cifre">
              {config.tipo === "moltiplicazione" || config.tipo === "divisione"
                ? "Cifre del numero maggiore"
                : "Cifre degli operandi"}
            </label>
            <select
              id="cifre"
              value={config.cifre}
              onChange={(e) =>
                setConfig((c) => ({ ...c, cifre: Number(e.target.value) as 1 | 2 | 3 }))
              }
            >
              <option value={1}>1 cifra</option>
              <option value={2}>2 cifre</option>
              <option value={3}>3 cifre</option>
            </select>
          </div>

          {mostraRiportoPrestito && (
            <label className="checkbox-riga" style={{ paddingBottom: "0.6em" }}>
              <input
                type="checkbox"
                checked={config.consentiRiporto}
                onChange={(e) => setConfig((c) => ({ ...c, consentiRiporto: e.target.checked }))}
              />
              Consenti {config.tipo === "addizione" ? "riporto" : "prestito"}
            </label>
          )}

          {mostraResto && (
            <label className="checkbox-riga" style={{ paddingBottom: "0.6em" }}>
              <input
                type="checkbox"
                checked={config.consentiResto}
                onChange={(e) => setConfig((c) => ({ ...c, consentiResto: e.target.checked }))}
              />
              Consenti resto (divisione non esatta)
            </label>
          )}

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

        <div style={{ display: "flex", gap: "0.7rem", marginTop: "1.2rem", flexWrap: "wrap" }}>
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
          <h2>{NOMI_OPERAZIONE[config.tipo]}</h2>
          <ol className="lista-esercizi">
            {esercizi.map((es, i) => {
              const correttoEsercizio =
                esito && es.risposte.every((attesa, j) => Number(risposte[i][j]) === attesa);
              const erratoEsercizio =
                esito && !es.risposte.every((attesa, j) => Number(risposte[i][j]) === attesa);
              return (
                <li key={i} className="esercizio-riga">
                  <span className="esercizio-testo">{es.testo}</span>
                  {es.risposte.map((_, j) => (
                    <span key={j} className="esercizio-risposta">
                      <label className="sr-only" htmlFor={`es-${i}-${j}`}>
                        {es.etichetteRisposta[j]} esercizio {i + 1}
                      </label>
                      <input
                        id={`es-${i}-${j}`}
                        type="number"
                        inputMode="numeric"
                        value={risposte[i]?.[j] ?? ""}
                        onChange={(e) => aggiornaRisposta(i, j, e.target.value)}
                      />
                    </span>
                  ))}
                  {correttoEsercizio && (
                    <span className="no-stampa esito-riga esito-corretto"> corretto</span>
                  )}
                  {erratoEsercizio && (
                    <span className="no-stampa esito-riga esito-errato">
                      {" "}
                      atteso: {es.risposte.join(" resto ")}
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
