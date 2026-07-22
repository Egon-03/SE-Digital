import { Link } from "react-router-dom";
import { MATERIE } from "../data/materie";
import { SubjectIcon } from "../components/icons/SubjectIcon";

export function HomePage() {
  return (
    <div className="container">
      <section style={{ padding: "2.5rem 0 2rem", maxWidth: "46rem" }}>
        <h1>Materiali didattici per la scuola elementare ticinese</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--inchiostro-tenue)" }}>
          Un unico hub per trovare, condividere e collegare al Piano di Studio i materiali di
          tutte le materie e di tutti e cinque gli anni, dalla 1ª alla 5ª elementare.
        </p>
        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1.2rem" }}>
          <a href="#materie" className="btn btn-primario">
            Esplora le materie
          </a>
          <Link to="/inserisci" className="btn">
            Proponi un materiale
          </Link>
        </div>
      </section>

      <section id="materie" style={{ paddingBottom: "3rem" }}>
        <h2>Scegli una materia</h2>
        <ul className="griglia-scelte">
          {MATERIE.map((materia) => (
            <li key={materia.slug}>
              <Link to={`/materia/${materia.slug}`} className="scelta">
                <SubjectIcon slug={materia.slug} />
                <span>
                  <span className="scelta-titolo">{materia.nome}</span>
                  <span className="scelta-nota">
                    {materia.facoltativa ? "Facoltativa · " : ""}
                    {materia.anni.length === 5
                      ? "1ª – 5ª"
                      : `${materia.anni[0]}ª – ${materia.anni[materia.anni.length - 1]}ª`}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
