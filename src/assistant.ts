// Assistant des proches : vraie IA via notre serveur (worker/), sinon réponses pré-écrites hors ligne.

const DETRESSE = /suicid|mourir|en finir|me tuer|se tuer|plus envie de vivre|disparaître|danger/i;
const CHIFFRES_CORPS = /poids|kilo|\bkg\b|calorie|imc|maigr|grossi|mensuration|combien.*mang/i;

export const REPONSE_DETRESSE =
  "Ce que tu décris est important et tu n'as pas à le porter seul·e. Si toi ou ton proche êtes en danger, appelle tout de suite le 3114 (prévention du suicide, gratuit, 24h/24) ou le 15. Le bouton « Aide » en haut de l'écran te donne tous les numéros en un geste.";

const REPONSE_CORPS =
  "Je préfère ne pas parler de chiffres, de poids ou d'alimentation : c'est le rôle de l'équipe médicale qui accompagne ton proche. Je peux t'aider sur la manière d'être présent·e, de trouver les mots, ou de prendre soin de toi.";

const REPONSES: [RegExp, string][] = [
  [/ne pas dire|dire, et/i, "**Ce qui aide :** dire simplement que tu es là, parler de ce que vous aimez faire ensemble, valoriser la personne pour qui elle est.\n\n**À éviter :** les remarques sur l'apparence, l'assiette ou le corps (même pour complimenter), et les « il suffit de… ». Si tu hésites, une phrase comme « Je suis là si tu as besoin » ne fait jamais de mal."],
  [/mentalement|moral/i, "Même quand le moral remonte, les pensées liées au trouble peuvent rester présentes en arrière-plan. Ça ne veut pas dire que rien n'avance : c'est souvent une période fragile, où la personne a besoin de sentir qu'on ne la juge pas sur les apparences. Lui demander « Comment tu te sens, vraiment ? » sans attendre de réponse précise peut beaucoup aider."],
  [/expliquer|entourage/i, "Tu peux rester simple : « C'est une maladie, pas un choix ni un caprice. Elle se soigne, avec du temps et une équipe. Ce qui aide, c'est d'être présent sans commenter l'assiette ni l'apparence. » Tu n'as pas à tout raconter : tu choisis ce que tu partages, avec l'accord de la personne si possible."],
  [/brusquer|quotidien/i, "Garder des moments « normaux » ensemble, proposer sans insister, accepter un non, et laisser la personne décider du rythme. Les petites attentions comptent souvent plus que les grandes discussions."],
  [/prendre soin de moi/i, "Tu as le droit de souffler. Garde des moments pour toi, parle à quelqu'un de confiance, et n'hésite pas à te faire accompagner : des groupes et associations existent aussi pour les familles et les proches. Prendre soin de toi, c'est aussi tenir sur la durée."],
  [/aide professionnelle|professionnel|où trouver/i, "Le médecin traitant est souvent la première porte d'entrée : il peut orienter vers une équipe spécialisée en troubles des conduites alimentaires. Pour une écoute, la ligne Anorexie Boulimie Info Écoute (09 69 325 900) accompagne aussi les proches. En cas d'urgence, le 15 ou le 3114."],
  [/parler|veut pas|refuse|silence|ferm/i, "C'est souvent un besoin de se protéger, pas un rejet. Tu peux lui dire simplement que tu es là, sans insister, et partager un moment qui vous fait du bien. La porte reste ouverte."],
  [/dire|mots|ce soir|phrase/i, "Quelques mots simples suffisent souvent : « Je suis là », « Je t'aime comme tu es », « On fait quelque chose ensemble ce week-end ? ». Parler d'un projet futur aide aussi à regarder vers l'avant."],
  [/moi|fatigu|épuis|épuis|craqu|seul/i, "Ce que tu ressens est normal : accompagner quelqu'un, c'est beaucoup. Prends du temps pour toi sans culpabiliser. Des associations accompagnent aussi les proches ; en parler peut vraiment alléger."],
  [/colère|énerv|dispute|conflit/i, "Les tensions arrivent, même dans les familles très aimantes. Tu peux revenir plus tard avec calme : « Je me suis mal exprimé·e tout à l'heure, je tiens à toi. » Ça répare beaucoup."],
  [/repas|table|manger|nourriture/i, "Les moments de repas peuvent être sensibles. Le mieux est de suivre les conseils de l'équipe soignante et de garder une ambiance douce, avec des sujets de conversation légers et agréables."],
];

const PRECISER = "Pour t'aider au plus juste, dis-m'en un peu plus : qui accompagnes-tu, et où en êtes-vous en ce moment (pas encore de suivi, soins en cours, période plus difficile) ?";

// Hors ligne : réponses pré-écrites, sans jamais redonner une réponse déjà donnée.
export function repondre(question: string, dejaDit: string[] = []): string {
  if (DETRESSE.test(question)) return REPONSE_DETRESSE;
  if (CHIFFRES_CORPS.test(question)) return REPONSE_CORPS;
  const neuves = REPONSES.filter(([re, r]) => re.test(question) && !dejaDit.includes(r));
  return neuves[0]?.[1] ?? (dejaDit.includes(PRECISER) ? "Je t'entends. Ce que tu vis compte, et tu n'as pas à trouver toutes les réponses seul·e : la ligne Anorexie Boulimie Info Écoute (09 69 325 900) écoute aussi les proches, et le médecin traitant peut vous orienter." : PRECISER);
}

// Filet de sécurité sur la réponse de l'IA : jamais de chiffres sur le corps ou l'alimentation,
// et les numéros d'urgence toujours présents si la question parle de danger.
const CHIFFRE_CORPS_REPONSE = /\d+([.,]\d+)?\s*(kg|kilos?|calories?|kcal|grammes?|g\b)|imc\s*(de|à|:)?\s*\d/i;
export function securiser(question: string, reponse: string): string {
  if (CHIFFRE_CORPS_REPONSE.test(reponse)) return REPONSE_CORPS;
  if (DETRESSE.test(question) && !reponse.includes('3114')) return `${REPONSE_DETRESSE}\n\n${reponse}`;
  return reponse;
}

type Message = { role: 'user' | 'assistant'; content: string };
// shortcut: jeton partagé visible dans l'app ; remplacer par l'auth des comptes (Supabase) au lancement.
const URL_IA = process.env.EXPO_PUBLIC_ASSISTANT_URL;
const JETON = process.env.EXPO_PUBLIC_ASSISTANT_TOKEN ?? '';

export async function demander(historique: Message[]): Promise<string> {
  const question = historique[historique.length - 1].content;
  const dejaDit = historique.filter((m) => m.role === 'assistant').map((m) => m.content);
  if (URL_IA) {
    try {
      const r = await fetch(URL_IA, { method: 'POST', headers: { 'content-type': 'application/json', 'x-aurore-token': JETON }, body: JSON.stringify({ messages: historique }) });
      const { texte } = (await r.json()) as { texte?: string };
      if (r.ok && texte) return securiser(question, texte);
    } catch {}
  }
  return repondre(question, dejaDit);
}

// Outil « Traduire ce que je ressens » (simulé) : reformule en « je », sans accuser.
const NOMS: Record<string, string> = { inquietude: "de l'inquiétude", frustration: 'de la frustration', tristesse: 'de la tristesse', incomprehension: "de l'incompréhension" };
export function traduireEnJe(pensee: string, ressentis: string[]): string {
  const t = pensee.trim().replace(/[.!?]+$/, '');
  if (!t) return '';
  if (DETRESSE.test(t)) return REPONSE_DETRESSE;
  const liste = ressentis.map((r) => NOMS[r]).filter(Boolean);
  const ressens = liste.length ? `Je ressens ${liste.length > 1 ? `${liste.slice(0, -1).join(', ')} et ${liste[liste.length - 1]}` : liste[0]}` : "J'ai besoin de te dire quelque chose";
  return `${ressens} quand je pense à ça : « ${t.charAt(0).toLowerCase()}${t.slice(1)} ». Je te le dis parce que je tiens à toi, et j'aimerais qu'on puisse en parler, à ton rythme.`;
}
