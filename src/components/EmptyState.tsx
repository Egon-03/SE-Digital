export function EmptyState({ messaggio, dettaglio }: { messaggio: string; dettaglio?: string }) {
  return (
    <div className="stato-vuoto" role="status">
      <svg
        width="56"
        height="56"
        viewBox="0 0 64 64"
        aria-hidden="true"
        style={{ marginBottom: "0.75rem" }}
      >
        <path
          d="M10 24h44l-4 28a4 4 0 0 1-4 3.6H18A4 4 0 0 1 14 52L10 24Z"
          fill="none"
          stroke="var(--inchiostro-tenue)"
          strokeWidth="2"
        />
        <path d="M10 24l4-10h36l4 10" fill="none" stroke="var(--inchiostro-tenue)" strokeWidth="2" />
        <path d="M26 36h12" stroke="var(--senape-scuro)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <p style={{ fontWeight: 700, marginBottom: dettaglio ? "0.3rem" : 0 }}>{messaggio}</p>
      {dettaglio && <p style={{ margin: 0 }}>{dettaglio}</p>}
    </div>
  );
}
