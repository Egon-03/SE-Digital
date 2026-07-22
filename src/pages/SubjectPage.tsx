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

      {materia.rimandaA && (
        <div className="banner" role="note">
          <div style={{ fontSize: "1.6rem" }} aria-hidden="true">
            ↗
          </div>
          <div>
            <p style={{ fontWeight: 700, marginBottom: "0.3rem" }}>
              Per questa materia rimandiamo a {materia.rimandaA.nome}
            </p>
            <p style={{ marginBottom: "0.6rem" }}>{materia.rimandaA.motivo}</p>
            <a
              href={materia.rimandaA.url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-piccolo"
            >
              Vai al portale ↗
            </a>
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
