import { Link } from "react-router-dom";
import { Breadcrumb } from "../../components/Breadcrumb";

export function GeneratoriItalianoPage() {
  return (
    <div className="container">
      <Breadcrumb
        percorso={[
          { etichetta: "Italiano", href: "/materia/italiano" },
          { etichetta: "Generatori" },
        ]}
      />

      <h1>Generatori di esercizi — Italiano</h1>
      <p style={{ color: "var(--inchiostro-tenue)", maxWidth: "40rem" }}>
        Crea al volo schede di esercizi personalizzate in base alla classe: falle svolgere
        direttamente a schermo oppure stampale per il lavoro su carta.
      </p>

      <ul className="griglia-scelte" style={{ marginTop: "1.5rem" }}>
        <li>
          <Link to="/materia/italiano/generatori/ortografia" className="scelta">
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
              <rect x="1" y="1" width="38" height="38" rx="8" fill="var(--terracotta)" />
              <path
                d="M11 21l6 6 12-14"
                stroke="var(--bianco-carta)"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span>
              <span className="scelta-titolo">Ortografia</span>
              <span className="scelta-nota">
                Digrammi, doppie, accenti, apostrofi e altre regole, in base alla classe
              </span>
            </span>
          </Link>
        </li>
        <li>
          <Link to="/materia/italiano/generatori/dettato" className="scelta">
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
              <rect x="1" y="1" width="38" height="38" rx="8" fill="var(--blu)" />
              <rect x="16" y="9" width="8" height="14" rx="4" fill="var(--bianco-carta)" />
              <path
                d="M12 20a8 8 0 0 0 16 0"
                stroke="var(--bianco-carta)"
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M20 28v4" stroke="var(--bianco-carta)" strokeWidth="2.6" strokeLinecap="round" />
              <path d="M15 32h10" stroke="var(--bianco-carta)" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
            <span>
              <span className="scelta-titolo">Dettato</span>
              <span className="scelta-nota">
                Con lettura automatica del browser oppure con testo per chi detta ad alta voce
              </span>
            </span>
          </Link>
        </li>
        <li>
          <Link to="/materia/italiano/generatori/testo-bucato" className="scelta">
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
              <rect x="1" y="1" width="38" height="38" rx="8" fill="var(--senape)" />
              <path
                d="M10 14h20M10 20h8"
                stroke="var(--bianco-carta)"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <rect
                x="21"
                y="17.5"
                width="9"
                height="5"
                rx="1.5"
                fill="none"
                stroke="var(--bianco-carta)"
                strokeWidth="2.2"
              />
              <path d="M10 26h20" stroke="var(--bianco-carta)" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
            <span>
              <span className="scelta-titolo">Testi bucati</span>
              <span className="scelta-nota">
                Brani da completare con le parole mancanti, con banca parole opzionale
              </span>
            </span>
          </Link>
        </li>
        <li>
          <Link to="/materia/italiano/generatori/analisi-grammaticale" className="scelta">
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
              <rect x="1" y="1" width="38" height="38" rx="8" fill="var(--verde)" />
              <circle cx="17" cy="17" r="7" fill="none" stroke="var(--bianco-carta)" strokeWidth="2.6" />
              <path d="M22 22l7 7" stroke="var(--bianco-carta)" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
            <span>
              <span className="scelta-titolo">Analisi grammaticale</span>
              <span className="scelta-nota">
                Riconosci le parti del discorso, dalle più semplici alle nove complete
              </span>
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
