// Filtre de contenu sensible : masque les mots liés au poids, à l'alimentation
// et au trouble, partout sauf dans l'espace privé (lettres à soi-même).
const TRIGGER_WORDS = [
  "calories", "calorie", "kcal", "poids", "weight", "kilo", "kilos", "kilogramme", "kilogrammes",
  "kg", "régime", "regime", "diet", "diète", "maigrir", "maigreur", "grossir", "balance",
  "jeûne", "jeuner", "jeûner", "vomir", "vomi", "vomissement", "vomissements", "purge",
  "anorexie", "boulimie", "binge", "peser", "pesée", "pesées", "compter", "compte", "morphologie"
];

const LETTER = "[^a-zà-ÿ]";
const escape = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = (w: string) => new RegExp(`(^|${LETTER})(${escape(w)})(${LETTER}|$)`, "gi");
const mask = (w: string) => "•".repeat(Math.min(w.length, 8));

export function cleanText(text = "") {
  if (!text) return text;
  let clean = text;
  for (const w of TRIGGER_WORDS) {
    clean = clean.replace(pattern(w), (_m: string, p1: string, w2: string, p3: string) => `${p1}${mask(w2)}${p3}`);
  }
  return clean;
}

export function containsTrigger(text = "") {
  if (!text) return false;
  return TRIGGER_WORDS.some((w) => pattern(w).test(text));
}

// Recherches à bloquer côté patient (Pinterest/YouTube) : en plus du
// vocabulaire général du trouble, les termes utilisés pour chercher
// activement du contenu pro-TCA ("thinspiration", "pro ana"…), qui
// n'apparaissent normalement pas dans un témoignage et n'ont donc pas
// leur place dans TRIGGER_WORDS.
const SEARCH_RISK_WORDS = [
  ...TRIGGER_WORDS,
  "thinspo", "thinspiration", "bonespo", "proana", "pro ana", "pro-ana",
  "promia", "pro mia", "pro-mia", "ana tips", "mia tips", "ed tips",
  "meanspo", "skinny tips", "how to lose weight fast", "perdre du poids vite",
];
const searchPattern = (w: string) => new RegExp(`(^|${LETTER})(${escape(w).replace(/ /g, "\\s+")})(${LETTER}|$)`, "gi");

export function containsSearchRisk(text = "") {
  if (!text) return false;
  return SEARCH_RISK_WORDS.some((w) => searchPattern(w).test(text));
}