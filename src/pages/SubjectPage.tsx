import { Link, Navigate, useParams } from "react-router-dom";
import { trovaMateria } from "../data/materie";
import { Breadcrumb } from "../components/Breadcrumb";
import { SubjectIcon } from "../components/icons/SubjectIcon";

const ANNI = [1, 2, 3, 4, 5];

export function SubjectPage() {
  const { materiaSlug = "" } = useParams();
  const materia = trovaMateria(materiaSlug);

  if (!materia) return <Navigate to="/" replace />;

  return (
    <div className="container">
      <Breadcrumb percorso={[{ etichetta: materia.nome }]} />

      <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginBottom: "1rem" }}>
        <SubjectIcon slug={materia.slug} size={48} />
        <h1 style={{ margin: 0 }}>{materia.nome}</h1>
      </div>

      {materia.slug === "matematica" && (
        <div className="banner" role="note">
          <svg width="32" height="32" viewBox="0 0 40 40" aria-hidden="true" style={{ flexShrink: 0 }}>
            <rect x="1" y="1" width="38" height="38" rx="8" fill="var(--senape)" />
            <path
              d="M13 20h14M20 13v14"
              stroke="var(--bianco-carta)"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
          </svg>
          <div>
            <p style={{ fontWeight: 700, marginBottom: "0.3rem" }}>
              Generatori di esercizi
            </p>
            <p style={{ marginBottom: "0.6rem" }}>
              Crea al volo schede di operazioni o di lettura dell'orologio, da svolgere a
              schermo o da stampare.
            </p>
            <Link to="/materia/matematica/generatori" className="btn btn-piccolo">
              Vai ai generatori
            </Link>
          </div>
        </div>
      )}

      {materia.slug === "italiano" && (
        <div className="banner" role="note">
          <svg width="32" height="32" viewBox="0 0 40 40" aria-hidden="true" style={{ flexShrink: 0 }}>
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
          <div>
            <p style={{ fontWeight: 700, marginBottom: "0.3rem" }}>
              Generatori di esercizi
            </p>
            <p style={{ marginBottom: "0.6rem" }}>
              Crea al volo schede di ortografia, dettati, testi bucati o analisi grammaticale,
              in base alla classe, da svolgere a schermo o da stampare.
            </p>
            <Link to="/materia/italiano/generatori" className="btn btn-piccolo">
              Vai ai generatori
            </Link>
          </div>
        </div>
      )}

      <h2>Scegli l’anno</h2>
      <ul className="griglia-scelte">
        {ANNI.map((anno) => {
          const pertinente = materia.anni.includes(anno);
          return (
            <li key={anno}>
              {pertinente ? (
                <Link to={`/materia/${materia.slug}/anno/${anno}`} className="scelta">
                  <span
                    className="scelta-titolo"
                    style={{ fontSize: "1.4rem" }}
                    aria-hidden="true"
                  >
                    {anno}ª
                  </span>
                  <span className="scelta-nota">elementare</span>
                </Link>
              ) : (
                <span
                  className="scelta"
                  aria-disabled="true"
                  title={`${materia.nome} non è insegnata al ${anno}° anno`}
                >
                  <span className="scelta-titolo" style={{ fontSize: "1.4rem" }}>
                    {anno}ª
                  </span>
                  <span className="scelta-nota">non pertinente</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
