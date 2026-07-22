import { Link } from "react-router-dom";
import type { MaterialeDidattico } from "../types/domain";
import { cicloDaAnno } from "../types/domain";
import { trovaTipoMateriale } from "../data/tipiMateriale";

export function MaterialCard({ materiale }: { materiale: MaterialeDidattico }) {
  const tipo = trovaTipoMateriale(materiale.tipo);
  const cicli = Array.from(new Set(materiale.anni.map(cicloDaAnno))).sort();

  return (
    <Link to={`/materiale/${materiale.id}`} className="card-link">
      <article className="card card-nastro">
        <h2 style={{ marginBottom: "0.4rem", fontSize: "1.2rem" }}>{materiale.titolo}</h2>
        <p
          className="clamp-3"
          style={{ color: "var(--inchiostro-tenue)", marginBottom: "0.8rem" }}
        >
          {materiale.descrizioneBreve}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center" }}>
          {cicli.map((c) => (
            <span key={c} className={`badge badge-ciclo-${c}`}>
              Ciclo {c}
            </span>
          ))}
          <span className="tag">{tipo?.nome}</span>
          <span className="tag">Anni: {materiale.anni.join(", ")}</span>
        </div>
      </article>
    </Link>
  );
}
