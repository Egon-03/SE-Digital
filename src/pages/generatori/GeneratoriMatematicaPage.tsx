import { Link } from "react-router-dom";
import { Breadcrumb } from "../../components/Breadcrumb";
import { ClockFace } from "../../components/ClockFace";

export function GeneratoriMatematicaPage() {
  return (
    <div className="container">
      <Breadcrumb
        percorso={[
          { etichetta: "Matematica", href: "/materia/matematica" },
          { etichetta: "Generatori" },
        ]}
      />

      <h1>Generatori di esercizi — Matematica</h1>
      <p style={{ color: "var(--inchiostro-tenue)", maxWidth: "40rem" }}>
        Crea al volo schede di esercizi personalizzate: falle svolgere direttamente a schermo
        oppure stampale per il lavoro su carta.
      </p>

      <ul className="griglia-scelte" style={{ marginTop: "1.5rem" }}>
        <li>
          <Link to="/materia/matematica/generatori/operazioni" className="scelta">
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
              <rect x="1" y="1" width="38" height="38" rx="8" fill="var(--senape)" />
              <path
                d="M13 20h14M20 13v14"
                stroke="var(--bianco-carta)"
                strokeWidth="3.4"
                strokeLinecap="round"
              />
            </svg>
            <span>
              <span className="scelta-titolo">Operazioni aritmetiche</span>
              <span className="scelta-nota">
                Addizione, sottrazione, moltiplicazione, divisione — con riporto/prestito e resto
                configurabili
              </span>
            </span>
          </Link>
        </li>
        <li>
          <Link to="/materia/matematica/generatori/orologio" className="scelta">
            <ClockFace ore={10} minuti={10} size={40} />
            <span>
              <span className="scelta-titolo">Lettura dell'orologio</span>
              <span className="scelta-nota">
                Dalle ore intere al minuto esatto, per leggere l'ora o disegnare le lancette
              </span>
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
