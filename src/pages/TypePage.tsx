import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { trovaMateria } from "../data/materie";
import { trovaTipoMateriale } from "../data/tipiMateriale";
import { Breadcrumb } from "../components/Breadcrumb";
import { EmptyState } from "../components/EmptyState";
import { MaterialCard } from "../components/MaterialCard";
import { getMaterialiApprovati } from "../lib/repository";
import { cicloDaAnno, type MaterialeDidattico } from "../types/domain";

export function TypePage() {
  const { materiaSlug = "", anno = "", tipo = "" } = useParams();
  const materia = trovaMateria(materiaSlug);
  const tipoInfo = trovaTipoMateriale(tipo);
  const annoNum = Number(anno);

  const [materiali, setMateriali] = useState<MaterialeDidattico[] | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const tuttoIlCiclo = searchParams.get("ciclo") === "tutto";
  const testo = searchParams.get("q") ?? "";

  function setTuttoIlCiclo(valore: boolean) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (valore) next.set("ciclo", "tutto");
        else next.delete("ciclo");
        return next;
      },
      { replace: true },
    );
  }

  function setTesto(valore: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (valore) next.set("q", valore);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
  }

  useEffect(() => {
    if (!materia || !tipoInfo) return;
    let attivo = true;
    getMaterialiApprovati({ materia: materia.slug, tipo: tipoInfo.slug }).then((risultati) => {
      if (attivo) setMateriali(risultati);
    });
    return () => {
      attivo = false;
    };
  }, [materia, tipoInfo]);

  const filtrati = useMemo(() => {
    if (!materiali) return [];
    const ciclo = cicloDaAnno(annoNum);
    return materiali
      .filter((m) => (tuttoIlCiclo ? m.anni.some((a) => cicloDaAnno(a) === ciclo) : m.anni.includes(annoNum)))
      .filter((m) =>
        testo
          ? `${m.titolo} ${m.descrizioneBreve} ${m.tagLiberi.join(" ")}`
              .toLowerCase()
              .includes(testo.toLowerCase())
          : true,
      );
  }, [materiali, annoNum, tuttoIlCiclo, testo]);

  if (!materia || !materia.anni.includes(annoNum) || !tipoInfo) return <Navigate to="/" replace />;

  return (
    <div className="container">
      <Breadcrumb
        percorso={[
          { etichetta: materia.nome, href: `/materia/${materia.slug}` },
          { etichetta: `${annoNum}ª elementare`, href: `/materia/${materia.slug}/anno/${annoNum}` },
          { etichetta: tipoInfo.nome },
        ]}
      />

      <h1>
        {tipoInfo.nome} — {materia.nome}, {annoNum}ª elementare
      </h1>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "flex-end",
          marginBottom: "1.5rem",
        }}
      >
        <div className="campo" style={{ marginBottom: 0, flex: "1 1 240px" }}>
          <label htmlFor="ricerca-testo">Cerca per parola chiave</label>
          <input
            id="ricerca-testo"
            name="ricerca"
            type="search"
            autoComplete="off"
            value={testo}
            onChange={(e) => setTesto(e.target.value)}
            placeholder="es. rime, orto, ritmo…"
          />
        </div>
        <label className="checkbox-riga" htmlFor="tutto-ciclo" style={{ paddingBottom: "0.6em" }}>
          <input
            id="tutto-ciclo"
            type="checkbox"
            checked={tuttoIlCiclo}
            onChange={(e) => setTuttoIlCiclo(e.target.checked)}
          />
          Includi tutti gli anni del {cicloDaAnno(annoNum)}° ciclo
        </label>
      </div>

      <div aria-live="polite">
        {materiali === null && <p>Caricamento materiali…</p>}

        {materiali !== null && filtrati.length === 0 && (
          <EmptyState
            messaggio="Nessun materiale disponibile in questa categoria."
            dettaglio="Conosci un materiale adatto? Puoi proporlo tu con il modulo “Proponi materiale”."
          />
        )}

        {filtrati.length > 0 && (
          <>
            <p className="sr-only" role="status">
              {filtrati.length} materiali trovati
            </p>
            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "1rem" }}>
              {filtrati.map((m) => (
                <li key={m.id}>
                  <MaterialCard materiale={m} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
