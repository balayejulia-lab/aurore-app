// Contenu de la notification du matin (une par jour, au choix de l'heure). Logique pure, testée par scripts/check-assistant.ts.
// Règles : discrète sur l'écran verrouillé (jamais « TCA », « maladie »…), rien sur la nourriture ni le corps, jamais culpabilisante.
import { CITATIONS } from './contenu/citations.ts';
import { DEFIS_CHALLENGES } from './contenu/defisChallenges.ts';
import { IDEAS_BY_ENERGY } from './contenu/procheAttentionIdeas.ts';

export type Matin = { titre: string; corps: string; url: string };
type Perso = { raisons: { text: string }[]; motDoux: string; victoires: { title: string }[] };

// Filtre de sécurité : écarte tout texte qui parle de nourriture, de corps ou nomme la maladie.
const SENSIBLE = /cuisin|mang|repas|go[uû]ter|recette|g[aâ]teau|aliment|nourri|poids|corps|calori|r[ée]gime|maladi|anorex|boulim|tca\b|hospital/i;
const sur = (l: string[]) => l.filter((x) => !SENSIBLE.test(x));

const CITATIONS_COURTES = sur(CITATIONS.map((c) => c.text)).filter((t) => t.length <= 140);
const DEFIS = sur(DEFIS_CHALLENGES);
const ATTENTIONS = sur([...IDEAS_BY_ENERGY.low, ...IDEAS_BY_ENERGY.mid]);
const PHRASES = [
  '« Je suis là, même si tu n\'as pas envie de parler. »',
  '« Je t\'aime comme tu es, et ça ne change pas. »',
  '« Tu n\'as rien à me prouver. »',
  '« On n\'est pas obligés d\'en parler, on peut juste passer un moment ensemble. »',
  '« Si tu as besoin de moi, je suis là, à n\'importe quelle heure. »',
  '« Je suis fier·e de toi, même pour les petites choses. »',
  '« Tu as le droit d\'avoir une mauvaise journée. »',
];
const ET_TOI = [
  'Prends deux minutes pour toi ce matin. Comment tu te sens, vraiment ?',
  'Accompagner quelqu\'un, ça use aussi. Qu\'est-ce qui te ferait du bien aujourd\'hui ?',
  'Tu comptes aussi. Pense à faire une petite chose rien que pour toi.',
];

const pioche = <T,>(l: T[], n: number) => l[((n % l.length) + l.length) % l.length];

/** n = numéro du jour (jours depuis 1970) : chaque jour a son message, et la semaine a son rythme. */
export function contenuMatin(profil: 'patient' | 'proche', n: number, perso: Perso): Matin {
  const jour = n % 7;
  if (profil === 'proche') {
    if (jour === 0) return { titre: '🌿 Et toi, comment tu vas ?', corps: pioche(ET_TOI, Math.floor(n / 7)), url: '/proche' };
    if (jour % 2 === 1) return { titre: "💛 L'attention du jour", corps: pioche(ATTENTIONS, n), url: '/proche/attentions' };
    return { titre: '💬 Une phrase pour aujourd\'hui', corps: pioche(PHRASES, n), url: '/proche' };
  }
  const siens = sur([...perso.raisons.map((r) => r.text), perso.motDoux].filter(Boolean));
  if (jour === 3 && siens.length) return { titre: '💛 Tes mots à toi', corps: pioche(siens, Math.floor(n / 7)), url: '/patient' };
  const victoires = sur(perso.victoires.map((v) => v.title));
  if (jour === 6 && victoires.length) return { titre: '🏆 Souviens-toi', corps: `Tu as noté : « ${pioche(victoires, Math.floor(n / 7))} »`, url: '/patient' };
  if (jour === 1 || jour === 4) return { titre: '🌱 Petit défi du jour', corps: pioche(DEFIS, n), url: '/patient/inspiration' };
  return { titre: '☀️ Ton mot du matin', corps: pioche(CITATIONS_COURTES, n), url: '/patient/inspiration' };
}

export const HEURES_MATIN = ['06:30', '07:00', '08:00', '09:00', '10:00', '16:00', '21:30'];
export const numeroJour = (d: Date) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
