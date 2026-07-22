import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  etichetta: string;
  href?: string;
}

export function Breadcrumb({ percorso }: { percorso: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Percorso di navigazione">
      <ol className="breadcrumb">
        <li>
          <Link to="/">Home</Link>
        </li>
        {percorso.map((item, i) => (
          <li key={i}>
            {item.href ? (
              <Link to={item.href}>{item.etichetta}</Link>
            ) : (
              <span className="attuale" aria-current="page">
                {item.etichetta}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
