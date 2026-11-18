export const PHRASE_CATEGORIES = [
  { key: "soutien", label: "Soutien", color: "bg-teal-50 text-teal-700" },
  { key: "remerciement", label: "Remerciement", color: "bg-amber-50 text-amber-700" },
  { key: "difficile", label: "Difficile à dire en face", color: "bg-rose-50 text-rose-700" },
];

// Du proche vers la personne accompagnée. Les clés sont préfixées pour ne
// jamais entrer en collision avec PHRASES_PATIENT côté serveur (voir
// base44/shared/encouragementPhrases.ts, qui résout le texte à partir de la
// clé envoyée par le client).
export const PHRASES_PROCHE = [
  { key: "proche-soutien-1", category: "soutien", text: "Je pense à toi aujourd'hui. Tu n'es pas seul·e." },
  { key: "proche-soutien-2", category: "soutien", text: "Je suis fier·ère de chaque pas que tu fais, même les petits." },
  { key: "proche-soutien-3", category: "soutien", text: "Prends ton temps. Je suis là, à ton rythme." },
  { key: "proche-soutien-4", category: "soutien", text: "Tu comptes énormément pour moi, aujourd'hui comme les autres jours." },
  { key: "proche-soutien-5", category: "soutien", text: "Je crois en toi, même les jours où c'est difficile d'y croire toi-même." },
  { key: "proche-remerciement-1", category: "remerciement", text: "Merci d'exister. Merci d'être toi." },
  { key: "proche-remerciement-2", category: "remerciement", text: "Merci pour ta confiance. Je mesure ce que ça représente." },
  { key: "proche-remerciement-3", category: "remerciement", text: "Merci de me laisser être présent·e à tes côtés." },
  { key: "proche-difficile-1", category: "difficile", text: "J'ai peur pour toi parfois, parce que je tiens à toi." },
  { key: "proche-difficile-2", category: "difficile", text: "Je ne sais pas toujours quoi dire ni quoi faire, mais je ne pars pas." },
  { key: "proche-difficile-3", category: "difficile", text: "Je m'en veux parfois de ne pas trouver les bons mots. Sache que j'essaie." },
  { key: "proche-difficile-4", category: "difficile", text: "Ce que tu traverses est difficile aussi pour moi à regarder, et je reste quand même." },
];

// De la personne accompagnée vers son proche.
export const PHRASES_PATIENT = [
  { key: "patient-soutien-1", category: "soutien", text: "Ta présence m'aide plus que tu ne le penses." },
  { key: "patient-soutien-2", category: "soutien", text: "Je vois tous les efforts que tu fais pour moi." },
  { key: "patient-soutien-3", category: "soutien", text: "Même quand je n'arrive pas à le montrer, ça compte énormément que tu sois là." },
  { key: "patient-remerciement-1", category: "remerciement", text: "Merci d'être là." },
  { key: "patient-remerciement-2", category: "remerciement", text: "Merci de ne jamais avoir baissé les bras avec moi." },
  { key: "patient-remerciement-3", category: "remerciement", text: "Merci de rester, même quand c'est dur pour toi aussi." },
  { key: "patient-difficile-1", category: "difficile", text: "Je sais que je te fais parfois peur, et j'en suis désolé·e." },
  { key: "patient-difficile-2", category: "difficile", text: "Je culpabilise de te faire porter ce poids avec moi." },
  { key: "patient-difficile-3", category: "difficile", text: "Parfois je m'éloigne, mais ça ne veut pas dire que je ne tiens pas à toi." },
  { key: "patient-difficile-4", category: "difficile", text: "Je ne sais pas toujours comment te rassurer, mais j'aimerais y arriver." },
];
