import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="container">
      <h1>Pagina non trovata</h1>
      <p>Il contenuto cercato non esiste o non è (ancora) pubblico.</p>
      <Link to="/" className="btn btn-primario">
        Torna alla home
      </Link>
    </div>
  );
}
