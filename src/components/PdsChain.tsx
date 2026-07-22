import type { CollegamentoPds } from "../types/domain";

/** Mostra l'intera catena di collegamento al Piano di Studio (brief §3). */
export function PdsChain({ pds }: { pds: CollegamentoPds }) {
  const anelli = [
    { etichetta: "Area disciplinare", valore: pds.areaDisciplinare },
    { etichetta: "Disciplina", valore: pds.disciplina },
    { etichetta: "Ciclo", valore: `${pds.ciclo}° ciclo` },
    { etichetta: "Ambito di competenza", valore: pds.ambitoCompetenza },
    { etichetta: "Traguardo di competenza", valore: pds.traguardoCompetenza },
    { etichetta: "Traguardo specifico di apprendimento", valore: pds.traguardoSpecifico },
  ].filter((a) => a.valore);

  if (anelli.length === 0) {
    return (
      <p style={{ color: "var(--inchiostro-tenue)" }}>
        Collegamento al Piano di Studio non ancora indicato per questo materiale.
      </p>
    );
  }

  return (
    <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {anelli.map((anello, i) => (
        <li
          key={anello.etichetta}
          style={{
            paddingLeft: `${i * 1.1}rem`,
            paddingBottom: "0.6rem",
            borderLeft: i > 0 ? "2px dashed var(--inchiostro-tenue)" : undefined,
            marginLeft: i > 0 ? "0.35rem" : 0,
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "0.78rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "var(--inchiostro-tenue)",
              fontWeight: 700,
            }}
          >
            {anello.etichetta}
          </span>
          <span style={{ fontFamily: "var(--serif)", fontSize: "1.05rem" }}>{anello.valore}</span>
        </li>
      ))}
    </ol>
  );
}
