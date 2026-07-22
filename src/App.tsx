import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { SubjectPage } from "./pages/SubjectPage";
import { YearPage } from "./pages/YearPage";
import { TypePage } from "./pages/TypePage";
import { MaterialDetailPage } from "./pages/MaterialDetailPage";
import { ProposeMaterialPage } from "./pages/ProposeMaterialPage";
import { ModerationPage } from "./pages/ModerationPage";
import { NotFoundPage } from "./pages/NotFoundPage";

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
          <Route path="/materia/:materiaSlug/anno/:anno" element={<YearPage />} />
          <Route path="/materia/:materiaSlug/anno/:anno/tipo/:tipo" element={<TypePage />} />
          <Route path="/materiale/:id" element={<MaterialDetailPage />} />
          <Route path="/proponi" element={<ProposeMaterialPage />} />
          <Route path="/moderazione" element={<ModerationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
