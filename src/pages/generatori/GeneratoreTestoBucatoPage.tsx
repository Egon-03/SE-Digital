import { useState } from "react";
import { Breadcrumb } from "../../components/Breadcrumb";
import {
  generaTestoBucato,
  lacuneConsigliate,
  type ConfigTestoBucato,
  type EsercizioTestoBucato,
} from "../../lib/generators/testoBucato";

const ANNI = [1, 2, 3, 4, 5];
const OPZIONI_LACUNE = [2, 3, 4, 5, 6, 8, 10];

export function GeneratoreTestoBucatoPage() {
  const [config, setConfig] = useState<ConfigTestoBucato>({
    anno: 3,
    numeroLacune: lacuneConsigliate(3),
  });
  const [mostraBanca, setMostraBanca] = useState(true);
  const [esercizio, setEsercizio] = useState<EsercizioTestoBucato | null>(null);
  const [risposte, setRisposte] = useState<string[]>([]);
  const [esito, setEsito] = useState<{ corretti: number; totale: number } | null>(null);

  function cambiaAnno(anno: number) {
    setConfig({ anno, numeroLacune: lacuneConsigliate(anno) });
  }

  function genera() {
    const nuovo = generaTestoBucato(config);
    setEsercizio(nuovo);
    setRisposte(nuovo.paroleMancanti.map(() => ""));
    setEsito(null);
  }

  function aggiornaRisposta(indice: number, valore: string) {
    setRisposte((prev) => {
      const nuove = [...prev];
      nuove[indice] = valore;
      return nuove;
    });
  }

  function correggi() {
    if (!esercizio) return;
    let corretti = 0;
    esercizio.paroleMancanti.forEach((attesa, i) => {
      if (risposte[i]?.trim().toLowerCase() === attesa.toLowerCase()) corretti++;
    });
    setEsito({ corretti, totale: esercizio.paroleMancanti.length });
  }

  return (
    <div className="container">
      <Breadcrumb
        percorso={[
          { etichetta: "Italiano", href: "/materia/italiano" },
          { etichetta: "Generatori", href: "/materia/italiano/generatori" },
          { etichetta: "Testi bucati" },
        ]}
      />

      <h1>Generatore di testi bucati</h1>

      <div className="no-stampa">
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div className="campo" style={{ marginBottom: 0 }}>
            <label htmlFor="anno">Classe</label>
            <select id="anno" value={config.anno} onChange={(e) => cambiaAnno(Number(e.target.value))}>
              {ANNI.map((anno) => (
                <option key={anno} value={anno}>
                  {anno}ª elementare
                </option>
              ))}
            </select>
          </div>

          <div className="campo" style={{ marginBottom: 0 }}>
            <label htmlFor="numero-lacune">Numero di lacune</label>
            <select
              id="numero-lacune"
              value={config.numeroLacune}
              onChange={(e) =>
                setConfig((c) => ({ ...c, numeroLacune: Number(e.target.value) }))
              }
            >
              {OPZIONI_LACUNE.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <label className="checkbox-riga" style={{ paddingBottom: "0.6em" }}>
            <input
              type="checkbox"
              checked={mostraBanca}
              onChange={(e) => setMostraBanca(e.target.checked)}
            />
            Mostra banca delle parole
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.7rem", marginTop: "1rem", flexWrap: "wrap" }}>
          <button type="button" className="btn btn-primario" onClick={genera}>
            Genera scheda
          </button>
          {esercizio && (
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
            Hai completato correttamente {esito.corretti} lacune su {esito.totale}.
          </p>
        )}
      </div>

      {esercizio && (
        <section className="scheda-stampa" style={{ marginTop: "1.5rem" }}>
          <p className="riga-intestazione-stampa">
            Nome: <span className="riga-da-compilare" /> Data: <span className="riga-da-compilare" />
          </p>
          <h2>{esercizio.titolo}</h2>

          {mostraBanca && (
            <p className="banca-parole">
              <strong>Banca delle parole:</strong> {esercizio.bancaParole.join(" · ")}
            </p>
          )}

          <p className="testo-bucato">
            {esercizio.parti.map((parte, i) => (
              <span key={i}>
                {parte}
                {i < esercizio.paroleMancanti.length && (
                  <>
                    <label className="sr-only" htmlFor={`lacuna-${i}`}>
                      Parola mancante {i + 1}
                    </label>
                    <input
                      id={`lacuna-${i}`}
                      type="text"
                      className="lacuna-input"
                      value={risposte[i] ?? ""}
                      onChange={(e) => aggiornaRisposta(i, e.target.value)}
                    />
                    {esito &&
                      (risposte[i]?.trim().toLowerCase() ===
                      esercizio.paroleMancanti[i].toLowerCase() ? (
                        <span className="no-stampa esito-riga esito-corretto"> ✓</span>
                      ) : (
                        <span className="no-stampa esito-riga esito-errato">
                          {" "}
                          ({esercizio.paroleMancanti[i]})
                        </span>
                      ))}
                  </>
                )}
              </span>
            ))}
          </p>
        </section>
      )}
    </div>
  );
}
