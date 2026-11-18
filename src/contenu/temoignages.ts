// shortcut: exemples fictifs pour la beta. Sur le site, les témoignages venaient d'une recherche en ligne ;
// la vraie liste sera rassemblée puis validée avant la sortie.
export type Temoignage = { id: string; name?: string; age?: string; type: 'texte' | 'podcast' | 'video'; title: string; text: string; context?: string; link?: string };

export const TEMOIGNAGES_PATIENT: Temoignage[] = [
  { id: 'p1', name: 'Camille', age: '24 ans', type: 'texte', title: 'Le jour où j’ai rechanté', text: "Un matin, je me suis surprise à chanter sous la douche. Ça faisait des années. Ce n’était rien et c’était tout : la preuve que quelque chose revenait.\n\nAujourd’hui je chante dans une chorale le jeudi soir. Je n’aurais jamais cru ça possible.", context: 'Exemple pour la beta' },
  { id: 'p2', name: 'Inès', age: '19 ans', type: 'texte', title: 'Mes amies ne sont pas parties', text: "J’avais peur qu’elles se lassent. Elles ont juste attendu, en m’envoyant des photos de nos endroits. Aujourd’hui on y retourne, ensemble.", context: 'Exemple pour la beta' },
  { id: 'p3', name: 'Lucas', age: '27 ans', type: 'texte', title: 'Le carnet de voyage', text: "J’ai commencé par noter les villes qui me faisaient rêver. Puis j’ai préparé un week-end. Puis je suis parti. Un pas, puis un autre.", context: 'Exemple pour la beta' },
  { id: 'p4', name: 'Sarah', age: '31 ans', type: 'texte', title: 'La musique d’abord', text: "La guitare était restée dans un coin. Dix minutes par jour, sans objectif. C’est devenu mon moment à moi.", context: 'Exemple pour la beta' },
];

export const TEMOIGNAGES_PROCHE: Temoignage[] = [
  { id: 'r1', type: 'texte', title: 'J’ai appris à ne pas tout réparer', text: "Je voulais trouver la solution. J’ai compris qu’être là, simplement, était déjà énorme. Ma fille me l’a dit plus tard.", context: 'Exemple pour la beta' },
  { id: 'r2', type: 'texte', title: 'Parler d’autre chose', text: "On a recommencé à regarder des séries ensemble. On ne parlait pas de la maladie, on riait. Ça nous a rapprochés.", context: 'Exemple pour la beta' },
  { id: 'r3', type: 'texte', title: 'Moi aussi j’avais le droit d’aller mal', text: "Parler à quelqu’un pour moi m’a permis de rester solide pour elle, sans m’épuiser.", context: 'Exemple pour la beta' },
];
