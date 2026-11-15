// Contenus de démonstration de la beta. Les témoignages sont des EXEMPLES FICTIFS :
// les vrais seront rassemblés puis validés par l'équipe avant la sortie.

export const PHRASES_DU_JOUR = [
  "La vie revient par petites touches. Aujourd'hui en est une.",
  "Tu n'as rien à prouver aujourd'hui. Juste à être là.",
  'Chaque petit pas compte, même ceux que personne ne voit.',
  "Ce que tu aimes t'attend encore.",
  "Tu as le droit d'aller à ton rythme.",
];
export const phraseDuJour = () => PHRASES_DU_JOUR[new Date().getDate() % PHRASES_DU_JOUR.length];

export const PHRASES_PROCHE = [
  { key: 'proche-soutien-1', cat: 'Soutien', texte: "Je pense à toi aujourd'hui. Tu n'es pas seul·e." },
  { key: 'proche-soutien-2', cat: 'Soutien', texte: 'Je suis fier·ère de chaque pas que tu fais, même les petits.' },
  { key: 'proche-soutien-3', cat: 'Soutien', texte: 'Prends ton temps. Je suis là, à ton rythme.' },
  { key: 'proche-soutien-5', cat: 'Soutien', texte: "Je crois en toi, même les jours où c'est difficile d'y croire toi-même." },
  { key: 'proche-remerciement-1', cat: 'Merci', texte: "Merci d'exister. Merci d'être toi." },
  { key: 'proche-remerciement-3', cat: 'Merci', texte: "Merci de me laisser être présent·e à tes côtés." },
  { key: 'proche-difficile-2', cat: 'Difficile à dire', texte: "Je ne sais pas toujours quoi dire ni quoi faire, mais je ne pars pas." },
  { key: 'proche-difficile-1', cat: 'Difficile à dire', texte: "J'ai peur pour toi parfois, parce que je tiens à toi." },
];

export const PHRASES_PATIENT = [
  { key: 'patient-soutien-1', cat: 'Soutien', texte: "Ta présence m'aide plus que tu ne le penses." },
  { key: 'patient-soutien-3', cat: 'Soutien', texte: "Même quand je n'arrive pas à le montrer, ça compte énormément que tu sois là." },
  { key: 'patient-remerciement-1', cat: 'Merci', texte: "Merci d'être là." },
  { key: 'patient-remerciement-2', cat: 'Merci', texte: "Merci de ne jamais avoir baissé les bras avec moi." },
  { key: 'patient-difficile-3', cat: 'Difficile à dire', texte: "Parfois je m'éloigne, mais ça ne veut pas dire que je ne tiens pas à toi." },
  { key: 'patient-difficile-4', cat: 'Difficile à dire', texte: "Je ne sais pas toujours comment te rassurer, mais j'aimerais y arriver." },
];

export type Temoignage = { id: string; prenom: string; theme: string; titre: string; texte: string };
export const TEMOIGNAGES_PATIENT: Temoignage[] = [
  { id: 't1', prenom: 'Camille', theme: 'Reprendre goût', titre: 'Le jour où j’ai rechanté', texte: "Un matin, je me suis surprise à chanter sous la douche. Ça faisait des années. Ce n’était rien et c’était tout : la preuve que quelque chose revenait." },
  { id: 't2', prenom: 'Inès', theme: 'Liens', titre: 'Mes amies ne sont pas parties', texte: "J’avais peur qu’elles se lassent. Elles ont juste attendu, en m’envoyant des photos de nos endroits. Aujourd’hui on y retourne, ensemble." },
  { id: 't3', prenom: 'Lucas', theme: 'Rêves', titre: 'Le carnet de voyage', texte: "J’ai commencé par noter les villes qui me faisaient rêver. Puis j’ai préparé un week-end. Puis je suis parti. Un pas, puis un autre." },
  { id: 't4', prenom: 'Sarah', theme: 'Reprendre goût', titre: 'La musique d’abord', texte: "La guitare était restée dans un coin. Dix minutes par jour, sans objectif. C’est devenu mon moment à moi." },
];
export const TEMOIGNAGES_PROCHE: Temoignage[] = [
  { id: 'p1', prenom: 'Nathalie, maman', theme: 'Tenir', titre: 'J’ai appris à ne pas tout réparer', texte: "Je voulais trouver la solution. J’ai compris qu’être là, simplement, était déjà énorme. Ma fille me l’a dit plus tard." },
  { id: 'p2', prenom: 'Karim, frère', theme: 'Trouver les mots', titre: 'Parler d’autre chose', texte: "On a recommencé à regarder des séries ensemble. On ne parlait pas de la maladie, on riait. Ça nous a rapprochés." },
  { id: 'p3', prenom: 'Julie, amie', theme: 'Prendre soin de soi', titre: 'Moi aussi j’avais le droit d’aller mal', texte: "Parler à quelqu’un pour moi m’a permis de rester solide pour elle, sans m’épuiser." },
];

export const INSPIRATIONS = [
  { id: 'i1', type: 'Citation', texte: '« Il y a toujours un rayon de soleil quelque part. »', auteur: 'Proverbe' },
  { id: 'i2', type: 'Idée', texte: 'Écouter un album en entier, les yeux fermés, comme au cinéma.' },
  { id: 'i3', type: 'Idée', texte: 'Écrire une carte postale à quelqu’un que tu aimes, même sans l’envoyer.' },
  { id: 'i4', type: 'Citation', texte: '« Ce n’est pas la destination qui compte, c’est le chemin. »', auteur: 'Proverbe' },
  { id: 'i5', type: 'Idée', texte: 'Planter une graine sur le rebord de ta fenêtre et la regarder pousser.' },
  { id: 'i6', type: 'Idée', texte: 'Faire une liste des endroits où tu aimerais aller un jour.' },
  { id: 'i7', type: 'Citation', texte: '« Lentement mais sûrement. »', auteur: 'La Fontaine' },
  { id: 'i8', type: 'Idée', texte: 'Apprendre trois mots dans une langue qui te fait rêver.' },
];

export const PETITS_PAS_DU_JOUR = [
  'Ouvrir la fenêtre et respirer l’air du matin',
  'Envoyer un message à quelqu’un qui compte',
  'Écouter une chanson que tu aimais avant',
  'Sortir marcher cinq minutes au soleil',
  'Feuilleter un livre qui te faisait rêver',
];
export const petitPasDuJour = () => PETITS_PAS_DU_JOUR[new Date().getDate() % PETITS_PAS_DU_JOUR.length];

export const HUMEURS = ['Apaisé·e', 'Fatigué·e', 'Fier·ère', 'Inquiet·ète', 'Plein·e d’envies', 'Un peu perdu·e', 'Reconnaissant·e'];
export const HUMEURS_PROCHE = ['Épuisé·e', 'Inquiet·ète', 'Plein·e d’espoir', 'Impuissant·e', 'Soulagé·e', 'Seul·e', 'Fier·ère'];

export const ATTENTIONS = [
  { id: 'a1', cat: 'Être là', texte: 'Proposer une balade sans but précis, juste pour être ensemble.' },
  { id: 'a2', cat: 'Être là', texte: 'Regarder un film ou une série qu’elle ou il aime, sans parler de la maladie.' },
  { id: 'a3', cat: 'Petits mots', texte: 'Glisser un post-it gentil là où elle ou il le trouvera.' },
  { id: 'a4', cat: 'Petits mots', texte: 'Envoyer une photo d’un souvenir heureux partagé.' },
  { id: 'a5', cat: 'Projets', texte: 'Parler d’un projet futur : un voyage, un concert, une sortie.' },
  { id: 'a6', cat: 'Projets', texte: 'Lui demander ce qui lui ferait plaisir de faire ce mois-ci.' },
  { id: 'a7', cat: 'Prendre soin de toi', texte: 'Prendre une heure rien que pour toi cette semaine.' },
];

export const SOIN_DE_SOI = [
  { titre: 'Tu as le droit d’être fatigué·e', texte: 'Accompagner quelqu’un demande beaucoup. Te reposer n’est pas l’abandonner.' },
  { titre: 'Parler à quelqu’un pour toi', texte: 'Des associations accompagnent aussi les familles et les proches. Tu n’as pas à porter ça seul·e.' },
  { titre: 'Garder tes petites joies', texte: 'Continuer ce que tu aimes t’aide à rester solide, et c’est un bel exemple pour elle ou lui.' },
];

export const DEFIS_DOUX = [
  'Prendre une photo de quelque chose de beau aujourd’hui',
  'Noter une chose qui t’a fait sourire',
  'Ranger un petit coin qui te fera plaisir',
  'Appeler quelqu’un juste pour dire bonjour',
];
