import { Link, Navigate, useParams } from "react-router-dom";
import { trovaMateria } from "../data/materie";
import { TIPI_MATERIALE_INFO } from "../data/tipiMateriale";
import { Breadcrumb } from "../components/Breadcrumb";
import { TipoIcon } from "../components/icons/TipoIcon";

export function YearPage() {
  const { materiaSlug = "", anno = "" } = useParams();
  const materia = trovaMateria(materiaSlug);
  const annoNum = Number(anno);

  if (!materia || !materia.anni.includes(annoNum)) return <Navigate to="/" replace />;

  return (
    <div className="container">
      <Breadcrumb
        percorso={[
          { etichetta: materia.nome, href: `/materia/${materia.slug}` },
          { etichetta: `${annoNum}ª elementare` },
        ]}
      />

      <h1>
        {materia.nome} — {annoNum}ª elementare
      </h1>

      <h2>Scegli il tipo di materiale</h2>
      <ul className="griglia-scelte">
        {TIPI_MATERIALE_INFO.map((tipo) => (
          <li key={tipo.slug}>
            <Link
              to={`/materia/${materia.slug}/anno/${annoNum}/tipo/${tipo.slug}`}
              className="scelta"
            >
              <TipoIcon slug={tipo.slug} size={30} style={{ color: "var(--terracotta)" }} />
              <span>
                <span className="scelta-titolo">{tipo.nome}</span>
                <span className="scelta-nota">{tipo.descrizione}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
