import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMaterialeById } from "../lib/repository";
import { trovaMateria } from "../data/materie";
import { trovaTipoMateriale } from "../data/tipiMateriale";
import { Breadcrumb } from "../components/Breadcrumb";
import { PdsChain } from "../components/PdsChain";
import { cicloDaAnno, type MaterialeDidattico } from "../types/domain";
import { NotFoundPage } from "./NotFoundPage";

export function MaterialDetailPage() {
  const { id = "" } = useParams();
  const [stato, setStato] = useState<"caricamento" | "trovato" | "assente">("caricamento");
  const [materiale, setMateriale] = useState<MaterialeDidattico | null>(null);

  useEffect(() => {
    let attivo = true;
    setStato("caricamento");
    getMaterialeById(id).then((m) => {
      if (!attivo) return;
      if (m) {
        setMateriale(m);
        setStato("trovato");
      } else {
        setStato("assente");
      }
    });
    return () => {
      attivo = false;
    };
  }, [id]);

  if (stato === "caricamento") {
    return (
      <div className="container">
        <p>Caricamento materiale…</p>
      </div>
    );
  }

  if (stato === "assente" || !materiale) return <NotFoundPage />;

  const materia = trovaMateria(materiale.materia);
  const tipoInfo = trovaTipoMateriale(materiale.tipo);
  const cicli = Array.from(new Set(materiale.anni.map(cicloDaAnno))).sort();
  const tuttiTag = [
    ...materiale.tagFormazioneGenerale.map((t) => ({ t, gruppo: "Formazione generale" })),
    ...materiale.tagCompetenzeTrasversali.map((t) => ({ t, gruppo: "Competenze trasversali" })),
  ];

  return (
    <div className="container">
      <Breadcrumb
        percorso={[
          ...(materia ? [{ etichetta: materia.nome, href: `/materia/${materia.slug}` }] : []),
          { etichetta: materiale.titolo },
        ]}
      />

      {materiale.stato !== "approvato" && (
        <div className="banner" role="note" style={{ borderColor: "var(--terracotta)" }}>
          <p style={{ margin: 0 }}>
            Questo materiale è <strong>{formattaStato(materiale.stato)}</strong> e non è ancora
            visibile pubblicamente sul sito: questa pagina serve solo a mostrare com’è fatta una
            scheda in coda di moderazione.
          </p>
        </div>
      )}

      <h1>{materiale.titolo}</h1>
      <p style={{ fontSize: "1.1rem", color: "var(--inchiostro-tenue)" }}>
        {materiale.descrizioneBreve}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
        {cicli.map((c) => (
          <span key={c} className={`badge badge-ciclo-${c}`}>
            Ciclo {c}
          </span>
        ))}
        <span className="tag">{tipoInfo?.nome}</span>
        <span className="tag">Anni: {materiale.anni.join(", ")}</span>
        <span className={`badge badge-stato-${materiale.stato}`}>{formattaStato(materiale.stato)}</span>
      </div>

      <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "minmax(0, 1fr)" }}>
        <section>
          <h2>Collegamento al Piano di Studio</h2>
          <div className="card">
            <PdsChain pds={materiale.pds} />
          </div>
        </section>

        <section>
          <h2>File allegati</h2>
          {materiale.fileAllegati.length === 0 ? (
            <p style={{ color: "var(--inchiostro-tenue)" }}>Nessun file allegato.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.6rem" }}>
              {materiale.fileAllegati.map((file) => (
                <li key={file.url}>
                  <a href={file.url} className="btn" download>
                    ⬇ {file.nome}
                    <span className="tag" style={{ marginLeft: "0.5rem" }}>
                      {file.formato.toUpperCase()} · {file.dimensioneKb}&nbsp;KB
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {tuttiTag.length > 0 && (
          <section>
            <h2>Dimensioni trasversali</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {tuttiTag.map(({ t, gruppo }) => (
                <span key={`${gruppo}-${t}`} className="tag" title={gruppo}>
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {materiale.tagLiberi.length > 0 && (
          <section>
            <h2>Tag</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {materiale.tagLiberi.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2>Informazioni</h2>
          <dl className="scheda-info">
            <div>
              <dt>Autore</dt>
              <dd>{materiale.autoreNome}</dd>
            </div>
            <div>
              <dt>Pubblicato il</dt>
              <dd>{formattaData(materiale.dataCreazione)}</dd>
            </div>
            <div>
              <dt>Ultima modifica</dt>
              <dd>{formattaData(materiale.dataModifica)}</dd>
            </div>
            <div>
              <dt>Licenza</dt>
              <dd>{materiale.licenza}</dd>
            </div>
            {typeof materiale.contatoreDownload === "number" && (
              <div>
                <dt>Download</dt>
                <dd>{materiale.contatoreDownload}</dd>
              </div>
            )}
          </dl>
        </section>
      </div>
    </div>
  );
}

function formattaStato(stato: MaterialeDidattico["stato"]) {
  const nomi: Record<MaterialeDidattico["stato"], string> = {
    bozza: "in bozza",
    in_revisione: "in revisione",
    approvato: "approvato",
    rifiutato: "rifiutato",
  };
  return nomi[stato];
}

function formattaData(iso: string) {
  return new Date(iso).toLocaleDateString("it-CH", { year: "numeric", month: "long", day: "numeric" });
}
