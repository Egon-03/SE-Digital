const SESSION_KEY = "se-digital-moderazione-autenticata";

/**
 * Protezione minimale della vista di moderazione (brief §5): una password
 * condivisa, non un sistema utenti. In fase 2, quando arriverà il login
 * docenti, questo modulo va sostituito da un controllo lato server reale.
 */
export function isModerazioneAutenticata(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

export function provaAccessoModerazione(password: string): boolean {
  const attesa = import.meta.env.VITE_MODERATION_PASSWORD as string | undefined;
  if (!attesa) {
    console.warn(
      "VITE_MODERATION_PASSWORD non configurata: accesso moderazione disabilitato.",
    );
    return false;
  }
  const ok = password === attesa;
  if (ok) sessionStorage.setItem(SESSION_KEY, "true");
  return ok;
}

export function esciDaModerazione(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
