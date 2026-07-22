export function casuale(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Restituisce una copia mescolata dell'array (Fisher-Yates). */
export function mescola<T>(elementi: T[]): T[] {
  const copia = [...elementi];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = casuale(0, i);
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Sceglie `n` elementi distinti a caso dall'array (senza ripetizioni, se possibile). */
export function scegliN<T>(elementi: T[], n: number): T[] {
  if (n >= elementi.length) return mescola(elementi);
  return mescola(elementi).slice(0, n);
}
