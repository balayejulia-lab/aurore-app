export const ENERGY_LEVELS = [
  { id: "high", emoji: "🟢", label: "J'ai de l'énergie", accent: "text-emerald-700 bg-emerald-50 hover:bg-emerald-100" },
  { id: "mid", emoji: "🟡", label: "J'ai un peu d'énergie", accent: "text-amber-700 bg-amber-50 hover:bg-amber-100" },
  { id: "low", emoji: "🔴", label: "Je suis épuisé·e", accent: "text-rose-700 bg-rose-50 hover:bg-rose-100" },
];

export const IDEAS_BY_ENERGY = {
  high: [
    "Organiser une petite sortie improvisée, sans pression de durée.",
    "Préparer un repas ou un goûter ensemble.",
    "Recréer une petite tradition à vous deux.",
    "Refaire une activité que vous aimiez avant, juste pour le plaisir.",
    "Préparer une petite surprise toute simple pour ce soir.",
  ],
  mid: [
    "Préparer son thé ou son café préféré, sans rien dire de plus.",
    "Envoyer une photo qui vous fait sourire tous les deux.",
    "Préparer une courte playlist pour cette personne.",
    "Proposer une petite promenade, sans obligation d'aller loin.",
    "Regarder ensemble une photo d'un souvenir qui vous fait sourire.",
  ],
  low: [
    "Laisser un petit mot, juste pour dire que tu penses à cette personne.",
    "Envoyer un message sans poser de question : « Je pense à toi ❤️ Pas besoin de répondre. »",
    "Offrir une petite fleur, sans grande mise en scène.",
    "Être simplement disponible, sans chercher une solution.",
    "Prendre soin de toi d'abord — ça compte aussi.",
  ],
};
