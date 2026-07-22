import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { SubjectPage } from "./pages/SubjectPage";
import { YearPage } from "./pages/YearPage";
import { TypePage } from "./pages/TypePage";
import { MaterialDetailPage } from "./pages/MaterialDetailPage";
import { InsertMaterialPage } from "./pages/InsertMaterialPage";
import { ModerationPage } from "./pages/ModerationPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { GeneratoriMatematicaPage } from "./pages/generatori/GeneratoriMatematicaPage";
import { GeneratoreOperazioniPage } from "./pages/generatori/GeneratoreOperazioniPage";
import { GeneratoreOrologioPage } from "./pages/generatori/GeneratoreOrologioPage";
import { GeneratoriItalianoPage } from "./pages/generatori/GeneratoriItalianoPage";
import { GeneratoreOrtografiaPage } from "./pages/generatori/GeneratoreOrtografiaPage";
import { GeneratoreDettatoPage } from "./pages/generatori/GeneratoreDettatoPage";
import { GeneratoreTestoBucatoPage } from "./pages/generatori/GeneratoreTestoBucatoPage";
import { GeneratoreAnalisiGrammaticalePage } from "./pages/generatori/GeneratoreAnalisiGrammaticalePage";

function App() {
  return (
    <>
      <a href="#contenuto" className="skip-link">
        Vai al contenuto
      </a>
      <Header />
      <main id="contenuto" tabIndex={-1} style={{ flex: 1, paddingBlock: "2rem" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/materia/:materiaSlug" element={<SubjectPage />} />
          <Route path="/materia/matematica/generatori" element={<GeneratoriMatematicaPage />} />
          <Route
            path="/materia/matematica/generatori/operazioni"
            element={<GeneratoreOperazioniPage />}
          />
          <Route
            path="/materia/matematica/generatori/orologio"
            element={<GeneratoreOrologioPage />}
          />
          <Route path="/materia/italiano/generatori" element={<GeneratoriItalianoPage />} />
          <Route
            path="/materia/italiano/generatori/ortografia"
            element={<GeneratoreOrtografiaPage />}
          />
          <Route
            path="/materia/italiano/generatori/dettato"
            element={<GeneratoreDettatoPage />}
          />
          <Route
            path="/materia/italiano/generatori/testo-bucato"
            element={<GeneratoreTestoBucatoPage />}
          />
          <Route
            path="/materia/italiano/generatori/analisi-grammaticale"
            element={<GeneratoreAnalisiGrammaticalePage />}
          />
          <Route path="/materia/:materiaSlug/anno/:anno" element={<YearPage />} />
          <Route path="/materia/:materiaSlug/anno/:anno/tipo/:tipo" element={<TypePage />} />
          <Route path="/materiale/:id" element={<MaterialDetailPage />} />
          <Route path="/inserisci" element={<InsertMaterialPage />} />
          <Route path="/moderazione" element={<ModerationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
