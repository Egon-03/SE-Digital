import type { ReactNode } from "react";
import type { MateriaSlug } from "../../types/domain";

interface Props {
  slug: MateriaSlug;
  size?: number;
  className?: string;
}

/**
 * Piccole marche illustrate per materia, disegnate a piatto (niente
 * gradienti, niente stile "icon font"): ogni disciplina ha una forma
 * riconoscibile e imperfetta, come un timbro o un ritaglio di carta.
 */
export function SubjectIcon({ slug, size = 40, className }: Props) {
  const paths = ICONE[slug] ?? ICONE.italiano;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths}
    </svg>
  );
}

const ICONE: Record<MateriaSlug, ReactNode> = {
  italiano: (
    <>
      <path d="M8 14c9-5 17-5 24 1v35c-7-6-15-6-24-1V14Z" fill="#c24a2c" />
      <path d="M56 14c-9-5-17-5-24 1v35c7-6 15-6 24-1V14Z" fill="#3e6b52" />
      <path d="M32 15v35" stroke="#faf3e6" strokeWidth="2" />
      <path d="M20 6c3 3 3 6 0 9-3-3-3-6 0-9Z" fill="#dca23a" />
    </>
  ),
  francese: (
    <>
      <path d="M8 14c9-5 17-5 24 1v35c-7-6-15-6-24-1V14Z" fill="#3d6e93" />
      <path d="M56 14c-9-5-17-5-24 1v35c7-6 15-6 24-1V14Z" fill="#c24a2c" />
      <path d="M32 15v35" stroke="#faf3e6" strokeWidth="2" />
      <path d="M45 6h9l-4.5 5L54 16h-9V6Z" fill="#dca23a" />
    </>
  ),
  matematica: (
    <>
      <circle cx="32" cy="32" r="22" fill="#dca23a" />
      <path d="M20 32h24M32 20v24" stroke="#faf3e6" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  "studio-ambiente": (
    <>
      <circle cx="24" cy="22" r="11" fill="#dca23a" />
      <path
        d="M4 46c8-12 20-18 30-12 8 5 12 4 20-2v14c-14 10-30 10-50 0Z"
        fill="#3e6b52"
      />
      <path d="M46 40c3 4 3 9 0 13-3-4-3-9 0-13Z" fill="#3d6e93" />
    </>
  ),
  "educazione-visiva": (
    <>
      <path
        d="M32 8c14 0 24 9 24 20 0 8-5 11-11 11-3 0-4-2-4-4s2-3 2-6c0-6-9-9-16-6-8 3-15-1-15-11C12 15 20 8 32 8Z"
        fill="#c24a2c"
      />
      <circle cx="24" cy="24" r="3.2" fill="#dca23a" />
      <circle cx="34" cy="18" r="3.2" fill="#3e6b52" />
      <circle cx="43" cy="26" r="3.2" fill="#3d6e93" />
    </>
  ),
  "arti-plastiche": (
    <>
      <path d="M22 24h20l-3 28a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4l-3-28Z" fill="#3e6b52" />
      <ellipse cx="32" cy="24" rx="11" ry="4" fill="#2e5140" />
      <path
        d="M24 14c3-4 6-6 8-4 2 2-1 4-3 6 4-1 8 0 8 3s-5 4-9 3c3 2 4 5 1 6-3 1-6-3-6-6-3 1-6-1-5-4 1-2 4-3 6-4Z"
        fill="#c24a2c"
      />
    </>
  ),
  "educazione-musicale": (
    <>
      <path d="M40 10v28a7 7 0 1 1-4-6.3V16l-10 3v22a7 7 0 1 1-4-6.3V13l18-6Z" fill="#c24a2c" />
      <path d="M46 18c4 3 4 9 0 13" stroke="#dca23a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M50 12c7 5 7 16 0 22" stroke="#dca23a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),
  "educazione-fisica": (
    <>
      <circle cx="36" cy="12" r="5" fill="#3d6e93" />
      <path
        d="M20 24l10-6 6 4 10-3M22 22l4 12-8 14m14-16 4 8 8 6M30 30l-2 8"
        stroke="#3d6e93"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M10 46c6-2 10-2 14 0" stroke="#dca23a" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),
  religione: (
    <>
      <path d="M27 26h10v28a5 5 0 0 1-10 0V26Z" fill="#3e6b52" />
      <ellipse cx="32" cy="26" rx="5" ry="2.4" fill="#2e5140" />
      <path
        d="M32 8c3 5 5 8 5 11 0 3-2 5-5 5s-5-2-5-5c0-3 2-6 5-11Z"
        fill="#dca23a"
      />
    </>
  ),
};
