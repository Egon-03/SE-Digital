import { useRef, useState } from "react";
import { Breadcrumb } from "../../components/Breadcrumb";
import {
  correggiDettato,
  generaDettato,
  type ParolaCorretta,
  type TestoDettato,
} from "../../lib/generators/dettato";

const ANNI = [1, 2, 3, 4, 5];
type Modalita = "audio" | "voce-adulto";

const supportoVoce = typeof window !== "undefined" && "speechSynthesis" in window;

export function GeneratoreDettatoPage() {
  const [anno, setAnno] = useState(3);
  const [modalita, setModalita] = useState<Modalita>(supportoVoce ? "audio" : "voce-adulto");
  const [velocita, setVelocita] = useState(0.9);
  const [dettato, setDettato] = useState<TestoDettato | null>(null);
  const [risposta, setRisposta] = useState("");
  const [mostraTesto, setMostraTesto] = useState(false);
  const [risultato, setRisultato] = useState<ParolaCorretta[] | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  function genera() {
    const nuovo = generaDettato(anno);
    setDettato(nuovo);
    setRisposta("");
    setMostraTesto(false);
    setRisultato(null);
  }

  function ascolta() {
    if (!dettato || !supportoVoce) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(dettato.testo);
    utterance.lang = "it-IT";
    utterance.rate = velocita;
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function correggi() {
    if (!dettato) return;
    setRisultato(correggiDettato(dettato.testo, risposta));
  }

  const corrette = risultato?.filter((p) => p.corretta).length ?? 0;

  return (
    <div className="container">
      <Breadcrumb
        percorso={[
          { etichetta: "Italiano", href: "/materia/italiano" },
          { etichetta: "Generatori", href: "/materia/italiano/generatori" },
          { etichetta: "Dettato" },
        ]}
      />

      <h1>Generatore di dettati</h1>

      <div className="no-stampa">
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div className="campo" style={{ marginBottom: 0 }}>
            <label htmlFor="anno">Classe</label>
            <select id="anno" value={anno} onChange={(e) => setAnno(Number(e.target.value))}>
              {ANNI.map((a) => (
                <option key={a} value={a}>
                  {a}ª elementare
                </option>
              ))}
            </select>
          </div>

          <div className="campo" style={{ marginBottom: 0 }}>
            <label htmlFor="modalita">Modalità</label>
            <select
              id="modalita"
              value={modalita}
              onChange={(e) => setModalita(e.target.value as Modalita)}
            >
              <option value="audio">Lettura automatica (voce del browser)</option>
              <option value="voce-adulto">Testo per chi detta ad alta voce</option>
            </select>
          </div>

          {modalita === "audio" && (
            <div className="campo" style={{ marginBottom: 0 }}>
              <label htmlFor="velocita">Velocità di lettura</label>
              <select
                id="velocita"
                value={velocita}
                onChange={(e) => setVelocita(Number(e.target.value))}
              >
                <option value={0.6}>Lenta</option>
                <option value={0.9}>Normale</option>
                <option value={1.2}>Veloce</option>
              </select>
            </div>
          )}
        </div>

        {modalita === "audio" && !supportoVoce && (
          <p className="aiuto" style={{ color: "var(--terracotta-scuro)" }}>
            Il browser non supporta la lettura vocale: usa la modalità "Testo per chi detta ad
            alta voce".
          </p>
        )}

        <div style={{ display: "flex", gap: "0.7rem", marginTop: "1rem", flexWrap: "wrap" }}>
          <button type="button" className="btn btn-primario" onClick={genera}>
            Genera dettato
          </button>
          {dettato && modalita === "audio" && supportoVoce && (
            <button type="button" className="btn" onClick={ascolta}>
              Ascolta / Riascolta
            </button>
          )}
          {dettato && (
            <button type="button" className="btn" onClick={correggi}>
              Correggi
            </button>
          )}
          {dettato && (
            <button type="button" className="btn" onClick={() => window.print()}>
              Stampa scheda
            </button>
          )}
        </div>
      </div>

      <div aria-live="polite">
        {risultato && (
          <p style={{ fontWeight: 700, marginTop: "1rem" }}>
            Hai scritto correttamente {corrette} parole su {risultato.length}.
          </p>
        )}
      </div>

      {dettato && (
        <section className="scheda-stampa" style={{ marginTop: "1.5rem" }}>
          <p className="riga-intestazione-stampa">
            Nome: <span className="riga-da-compilare" /> Data: <span className="riga-da-compilare" />
          </p>
          <h2>{dettato.titolo}</h2>

          {modalita === "voce-adulto" && (
            <div className="testo-dettato-box">
              <p className="aiuto">Testo da leggere ad alta voce a chi scrive:</p>
              <p style={{ fontFamily: "var(--serif)", fontSize: "1.1rem" }}>{dettato.testo}</p>
            </div>
          )}

          {modalita === "audio" && (
            <div className="no-stampa">
              <button
                type="button"
                className="btn btn-piccolo"
                onClick={() => setMostraTesto((v) => !v)}
              >
                {mostraTesto ? "Nascondi il testo" : "Mostra il testo (per l'insegnante)"}
              </button>
              {mostraTesto && (
                <p style={{ fontFamily: "var(--serif)", marginTop: "0.6rem" }}>{dettato.testo}</p>
              )}
            </div>
          )}

          <div className="campo" style={{ marginTop: "1rem" }}>
            <label htmlFor="risposta-dettato">Scrivi qui il dettato</label>
            <textarea
              id="risposta-dettato"
              rows={6}
              value={risposta}
              onChange={(e) => setRisposta(e.target.value)}
            />
          </div>

          {risultato && (
            <p className="no-stampa" style={{ lineHeight: 2 }}>
              {risultato.map((p, i) => (
                <span
                  key={i}
                  className={p.corretta ? "esito-corretto" : "esito-errato"}
                  style={{ marginRight: "0.4rem" }}
                >
                  {p.parola}
                </span>
              ))}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
