// Logique pure des rappels du calendrier (testée par scripts/check-assistant.ts).
export type Repetition = 'non' | 'jour' | 'semaine' | 'mois';
export const RAPPELS: [number | null, string][] = [[null, 'Aucun'], [0, "À l'heure"], [5, '5 min avant'], [15, '15 min avant'], [30, '30 min avant'], [60, '1 h avant'], [1440, 'La veille']];
export const REPETITIONS: [Repetition, string][] = [['non', 'Une fois'], ['jour', 'Chaque jour'], ['semaine', 'Chaque semaine'], ['mois', 'Chaque mois']];

// Accepte « 14 », « 14h », « 14h30 », « 14:30 », « 9.05 » → « 14:30 ».
export function lireHeure(s: string): string | null {
  const m = s.trim().toLowerCase().match(/^(\d{1,2})\s*(?:[h:.]\s*(\d{1,2})?)?$/);
  if (!m) return null;
  const h = Number(m[1]), min = Number(m[2] ?? 0);
  return h < 24 && min < 60 ? `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}` : null;
}

export type Ev = { jour: string; heure: string; titre: string; rappel?: number | null; repetition?: Repetition };

// Un événement répété apparaît aussi les jours suivants qui correspondent.
export function arrive(e: Ev, cle: string): boolean {
  if (e.jour === cle) return true;
  const r = e.repetition ?? 'non';
  if (r === 'non' || cle < e.jour) return false;
  const a = new Date(`${e.jour}T00:00:00`), b = new Date(`${cle}T00:00:00`);
  return r === 'jour' || (r === 'semaine' && a.getDay() === b.getDay()) || (r === 'mois' && a.getDate() === b.getDate());
}

// Moment de la notification (heure de l'événement moins le rappel), traduit en déclencheur.
export type Declencheur = { type: 'date'; date: Date } | { type: 'daily'; hour: number; minute: number } | { type: 'weekly'; weekday: number; hour: number; minute: number } | { type: 'monthly'; day: number; hour: number; minute: number };
export function declencheur(e: Ev, maintenant = new Date()): Declencheur | null {
  if (e.rappel == null) return null;
  const t = new Date(new Date(`${e.jour}T${e.heure}:00`).getTime() - e.rappel * 60000);
  const h = t.getHours(), minute = t.getMinutes();
  switch (e.repetition ?? 'non') {
    case 'jour': return { type: 'daily', hour: h, minute };
    case 'semaine': return { type: 'weekly', weekday: t.getDay() + 1, hour: h, minute };
    // shortcut: un rappel mensuel calé sur le 29-31 saute les mois plus courts (comportement iOS).
    case 'mois': return { type: 'monthly', day: t.getDate(), hour: h, minute };
    default: return t > maintenant ? { type: 'date', date: t } : null;
  }
}

