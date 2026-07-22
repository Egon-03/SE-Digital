import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="header">
      <div className="container header-riga">
        <Link to="/" className="logo">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} width={40} height={40} alt="" />
          <span className="logo-testo">
            Materiali SE
            <small>Hub didattico — scuola elementare, Ticino</small>
          </span>
        </Link>
        <Link to="/proponi" className="btn btn-primario btn-piccolo">
          Proponi materiale
        </Link>
      </div>
    </header>
  );
}
