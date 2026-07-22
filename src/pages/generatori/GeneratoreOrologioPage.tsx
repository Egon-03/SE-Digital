import { useState } from "react";
import { Breadcrumb } from "../../components/Breadcrumb";
import { ClockFace } from "../../components/ClockFace";
import {
  generaOrari,
  formattaOrario,
  NOMI_LIVELLO_OROLOGIO,
  type ConfigOrologio,
  type EsercizioOrologio,
  type LivelloOrologio,
} from "../../lib/generators/orologio";

const OPZIONI_NUMERO_ESERCIZI = [4, 6, 9, 12];

type Direzione = "leggi" | "disegna";

export function GeneratoreOrologioPage() {
  const [livello, setLivello] = useState<LivelloOrologio>("quarti-ora");
  const [numeroEsercizi, setNumeroEsercizi] = useState(6);
  const [direzione, setDirezione] = useState<Direzione>("leggi");
  const [esercizi, setEsercizi] = useState<EsercizioOrologio[] | null>(null);
  const [risposte, setRisposte] = useState<{ ore: string; minuti: string }[]>([]);
  const [esito, setEsito] = useState<{ corretti: number; totale: number } | null>(null);

  function genera() {
    const config: ConfigOrologio = { livello, numeroEsercizi };
    const nuovi = generaOrari(config);
    setEsercizi(nuovi);
    setRisposte(nuovi.map(() => ({ ore: "", minuti: "" })));
    setEsito(null);
  }

  function aggiornaRisposta(indice: number, campo: "ore" | "minuti", valore: string) {
    setRisposte((prev) => {
      const nuove = [...prev];
      nuove[indice] = { ...nuove[indice], [campo]: valore };
      return nuove;
    });
  }

  function correggi() {
    if (!esercizi) return;
    let corretti = 0;
    esercizi.forEach((es, i) => {
      const oreCorretta = Number(risposte[i].ore) === es.ore;
      const minutiCorretti = Number(risposte[i].minuti) === es.minuti;
      if (oreCorretta && minutiCorretti) corretti++;
    });
    setEsito({ corretti, totale: esercizi.length });
  }

  return (
    <div className="container">
      <Breadcrumb
        percorso={[
          { etichetta: "Matematica", href: "/materia/matematica" },
          { etichetta: "Generatori", href: "/materia/matematica/generatori" },
          { etichetta: "Lettura dell'orologio" },
        ]}
      />

      <h1>Generatore — lettura dell'orologio</h1>

      <div className="no-stampa">
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div className="campo" style={{ marginBottom: 0 }}>
            <label htmlFor="direzione">Consegna</label>
            <select
              id="direzione"
              value={direzione}
              onChange={(e) => setDirezione(e.target.value as Direzione)}
            >
              <option value="leggi">Leggi l'ora dal quadrante</option>
              <option value="disegna">Disegna le lancette (scheda stampabile)</option>
            </select>
          </div>

          <div className="campo" style={{ marginBottom: 0 }}>
            <label htmlFor="livello">Precisione</label>
            <select
              id="livello"
              value={livello}
              onChange={(e) => setLivello(e.target.value as LivelloOrologio)}
            >
              {Object.entries(NOMI_LIVELLO_OROLOGIO).map(([valore, nome]) => (
                <option key={valore} value={valore}>
                  {nome}
                </option>
              ))}
            </select>
          </div>

          <div className="campo" style={{ marginBottom: 0 }}>
            <label htmlFor="numero-orologi">Numero di orologi</label>
            <select
              id="numero-orologi"
              value={numeroEsercizi}
              onChange={(e) => setNumeroEsercizi(Number(e.target.value))}
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
          {esercizi && direzione === "leggi" && (
            <button type="button" className="btn" onClick={correggi}>
              Correggi
            </button>
          )}
          {esercizi && (
            <button type="button" className="btn" onClick={() => window.print()}>
              Stampa scheda
            </button>
          )}
        </div>
      </div>

      <div aria-live="polite">
        {esito && (
          <p style={{ fontWeight: 700, marginTop: "1rem" }}>
            Hai letto correttamente {esito.corretti} orologi su {esito.totale}.
          </p>
        )}
      </div>

      {esercizi && (
        <section className="scheda-stampa" style={{ marginTop: "1.5rem" }}>
          <p className="riga-intestazione-stampa">
            Nome: <span className="riga-da-compilare" /> Data: <span className="riga-da-compilare" />
          </p>
          <h2>{direzione === "leggi" ? "Leggi l'ora" : "Disegna le lancette"}</h2>
          <ul className="griglia-orologi">
            {esercizi.map((es, i) => {
              const correttoEsercizio =
                esito &&
                Number(risposte[i].ore) === es.ore &&
                Number(risposte[i].minuti) === es.minuti;
              const erratoEsercizio = esito && !correttoEsercizio;
              return (
                <li key={i} className="orologio-riga">
                  {direzione === "leggi" ? (
                    <>
                      <ClockFace
                        ore={es.ore}
                        minuti={es.minuti}
                        ariaLabel="Quadrante di un orologio analogico: leggi l'ora e scrivila qui sotto."
                      />
                      <div className="orologio-risposta">
                        <label className="sr-only" htmlFor={`ore-${i}`}>
                          Ore orologio {i + 1}
                        </label>
                        <input
                          id={`ore-${i}`}
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={12}
                          value={risposte[i]?.ore ?? ""}
                          onChange={(e) => aggiornaRisposta(i, "ore", e.target.value)}
                        />
                        <span aria-hidden="true">:</span>
                        <label className="sr-only" htmlFor={`minuti-${i}`}>
                          Minuti orologio {i + 1}
                        </label>
                        <input
                          id={`minuti-${i}`}
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={59}
                          value={risposte[i]?.minuti ?? ""}
                          onChange={(e) => aggiornaRisposta(i, "minuti", e.target.value)}
                        />
                      </div>
                      {correttoEsercizio && (
                        <span className="no-stampa esito-riga esito-corretto">corretto</span>
                      )}
                      {erratoEsercizio && (
                        <span className="no-stampa esito-riga esito-errato">
                          atteso: {formattaOrario(es)}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <ClockFace ore={es.ore} minuti={es.minuti} mostraLancette={false} />
                      <p style={{ fontWeight: 700 }}>{formattaOrario(es)}</p>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
