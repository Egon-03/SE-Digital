import type { CSSProperties, ReactNode } from "react";
import type { TipoMateriale } from "../../types/domain";

interface Props {
  slug: TipoMateriale;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export function TipoIcon({ slug, size = 28, className, style }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {GLIFI[slug]}
    </svg>
  );
}

const GLIFI: Record<TipoMateriale, ReactNode> = {
  "contesti-di-senso": (
    <>
      <path d="M6 24c4-10 8-14 10-14s6 4 10 14" />
      <circle cx="16" cy="8" r="3" />
    </>
  ),
  "pratiche-didattiche": (
    <>
      <path d="M8 6h13l3 3v17H8z" />
      <path d="M12 13h9M12 17h9M12 21h6" />
    </>
  ),
  problemi: (
    <>
      <path d="M16 6a7 7 0 0 0-4 12c1 1 1 2 1 3h6c0-1 0-2 1-3a7 7 0 0 0-4-12Z" />
      <path d="M13 25h6" />
    </>
  ),
  giochi: (
    <>
      <rect x="6" y="10" width="20" height="14" rx="3" />
      <circle cx="12" cy="17" r="1.4" fill="currentColor" />
      <circle cx="20" cy="17" r="1.4" fill="currentColor" />
    </>
  ),
  supporti: (
    <>
      <rect x="5" y="7" width="22" height="15" rx="1.5" />
      <path d="M5 19l6-5 5 4 5-6 6 7" />
    </>
  ),
  "schede-allievo": (
    <>
      <path d="M9 5h11l5 5v17H9z" />
      <path d="M20 5v5h5" />
      <path d="M12 17h8M12 21h8" />
    </>
  ),
};
