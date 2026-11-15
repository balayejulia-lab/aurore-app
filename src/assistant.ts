// Assistant SIMULÉ pour la beta (aucune IA réelle, aucune donnée envoyée).
// Plus tard : IA Apple sur l'iPhone, sinon Cloudflare (gratuit), sinon ces réponses pré-écrites.

const DETRESSE = /suicid|mourir|en finir|me tuer|se tuer|plus envie de vivre|disparaître|danger/i;
const CHIFFRES_CORPS = /poids|kilo|\bkg\b|calorie|imc|maigr|grossi|mensuration|combien.*mang/i;

export const REPONSE_DETRESSE =
  "Ce que tu décris est important et tu n'as pas à le porter seul·e. Si toi ou ton proche êtes en danger, appelle tout de suite le 3114 (prévention du suicide, gratuit, 24h/24) ou le 15. Le bouton « Aide » en haut de l'écran te donne tous les numéros en un geste.";

const REPONSE_CORPS =
  "Je préfère ne pas parler de chiffres, de poids ou d'alimentation : c'est le rôle de l'équipe médicale qui accompagne ton proche. Je peux t'aider sur la manière d'être présent·e, de trouver les mots, ou de prendre soin de toi.";

const REPONSES: [RegExp, string][] = [
  [/parler|veut pas|refuse|silence|ferm/i, "C'est souvent un besoin de se protéger, pas un rejet. Tu peux lui dire simplement que tu es là, sans insister, et partager un moment qui vous fait du bien. La porte reste ouverte."],
  [/dire|mots|ce soir|phrase/i, "Quelques mots simples suffisent souvent : « Je suis là », « Je t'aime comme tu es », « On fait quelque chose ensemble ce week-end ? ». Parler d'un projet futur aide aussi à regarder vers l'avant."],
  [/moi|fatigu|épuis|épuis|craqu|seul/i, "Ce que tu ressens est normal : accompagner quelqu'un, c'est beaucoup. Prends du temps pour toi sans culpabiliser. Des associations accompagnent aussi les proches ; en parler peut vraiment alléger."],
  [/colère|énerv|dispute|conflit/i, "Les tensions arrivent, même dans les familles très aimantes. Tu peux revenir plus tard avec calme : « Je me suis mal exprimé·e tout à l'heure, je tiens à toi. » Ça répare beaucoup."],
  [/repas|table|manger|nourriture/i, "Les moments de repas peuvent être sensibles. Le mieux est de suivre les conseils de l'équipe soignante et de garder une ambiance douce, avec des sujets de conversation légers et agréables."],
];

export function repondre(question: string): string {
  if (DETRESSE.test(question)) return REPONSE_DETRESSE;
  if (CHIFFRES_CORPS.test(question)) return REPONSE_CORPS;
  return REPONSES.find(([re]) => re.test(question))?.[1]
    ?? "Merci de me poser la question. Ce qui aide souvent : être présent·e sans pression, valoriser chaque petit pas, et parler de ce qui fait envie pour la suite. Tu veux qu'on cherche ensemble des mots pour lui en parler ?";
}

// Outil « Traduire ce que je ressens » : propose une formulation douce, centrée sur le « je ».
export function adoucir(texte: string): string[] {
  const t = texte.trim().replace(/[.!?]+$/, '');
  if (!t) return [];
  if (DETRESSE.test(t)) return [REPONSE_DETRESSE];
  return [
    `J'ai envie de te dire quelque chose qui me tient à cœur : ${t.charAt(0).toLowerCase()}${t.slice(1)}. Je te le dis parce que je tiens à toi.`,
    `Je ne trouve pas toujours les bons mots, mais voilà ce que je ressens : ${t.charAt(0).toLowerCase()}${t.slice(1)}. Je suis là, quoi qu'il arrive.`,
  ];
}
