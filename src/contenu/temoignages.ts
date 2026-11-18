// Témoignages réels publiés (patients guéris / proches), résumés sans aucun chiffre ni contenu sur le corps ou l'alimentation.
// shortcut: résumés rédigés à partir de recherches (les pages n'ont pas pu être ouvertes depuis l'outil) — à relire sur la source avant la sortie.
export type Temoignage = { id: string; name?: string; type: 'texte' | 'podcast' | 'video'; title: string; text: string; source: string; link: string };

export const TEMOIGNAGES_PATIENT: Temoignage[] = [
  { id: 'p-barbara', name: 'Barbara', type: 'texte', title: '« J’ai été anorexique et je m’en suis sortie »', source: 'Harmonie Santé', link: 'https://www.harmonie-sante.fr/sante-soins/maladies-traitements/jai-ete-anorexique-je-men-suis-sortie',
    text: "Barbara a raconté son parcours dans un livre. Sa guérison s’est faite lentement : elle explique qu’il a fallu accepter que cela prenne du temps.\n\nAujourd’hui sortie de la maladie, elle encourage les personnes touchées et leurs proches à se tourner vers des professionnels spécialisés." },
  { id: 'p-emma', name: 'Emma', type: 'texte', title: 'Une guérison pas à pas', source: 'Association Boulimie Anorexie (Suisse)', link: 'https://boulimie-anorexie.ch/temoignages/',
    text: "Emma raconte une guérison qui s’est construite étape par étape, sur plusieurs années, avec une thérapie qu’elle a choisi de poursuivre.\n\nElle se dit aujourd’hui totalement guérie, et témoigne pour montrer que c’est possible." },
  { id: 'p-premier-pas', type: 'texte', title: 'Le premier pas : demander de l’aide', source: 'Association Boulimie Anorexie (Suisse)', link: 'https://boulimie-anorexie.ch/approfondir/temoignages/',
    text: "Elle raconte que c’est au moment le plus difficile qu’elle a fait son premier pas vers la guérison : reconnaître qu’elle avait besoin d’aide.\n\nÀ partir de là, le chemin s’est construit, petit à petit, avec des personnes pour l’accompagner." },
  { id: 'p-fin', type: 'texte', title: '« Les troubles du comportement alimentaire peuvent avoir une fin »', source: 'Centre ressource de réhabilitation psychosociale', link: 'https://centre-ressource-rehabilitation.org/temoignage-je-souhaite-vous-prouver-de-par-mon-experience-que-les-troubles-du',
    text: "Après un accompagnement, elle a accepté de lâcher prise et de se faire confiance.\n\nElle explique que la souffrance ne la submerge plus, même si tout n’est pas parfait : la vie a repris sa place, et elle témoigne pour prouver qu’il y a une fin." },
  { id: 'p-nora', name: 'Nora', type: 'texte', title: 'La vie après l’anorexie', source: 'Blog de Nora Inn', link: 'https://norainnoflower.com/vie-apres-anorexie/',
    text: "Nora raconte son chemin jusqu’à la guérison dans un livre et sur son blog.\n\nPour elle, guérir ne s’est pas joué seulement dans le corps : elle a aussi travaillé sur ses relations, notamment avec sa mère. Elle partage aujourd’hui à quoi ressemble la vie d’après." },
  { id: 'p-letemps', type: 'texte', title: '« Oui, on peut guérir de cette maladie totalement ! »', source: 'Le Temps', link: 'https://www.letemps.ch/societe/sciences-humaines/non-lanorexie-na-toujours-voir-mere-pere-lattachement-oui-on-guerir-cette',
    text: "Une ancienne patiente, aujourd’hui guérie, raconte son parcours.\n\nElle insiste : les parents ne sont pas des ennemis, et elle a choisi de les associer à sa prise en charge. Son message est clair : on peut guérir totalement." },
  { id: 'p-anne', name: 'Anne', type: 'texte', title: '« Je touche la guérison de près et j’en suis fière »', source: 'StopTCA', link: 'https://stoptca.fr/temoignage-tca/je-touche-la-guerison-de-pres-et-jen-suis-fiere',
    text: "Anne raconte la fierté d’avoir avancé, pas après pas, vers une vie où la maladie prend de moins en moins de place.\n\nElle se dit aujourd’hui presque guérie, et partage son histoire pour donner de l’espoir." },
];

export const TEMOIGNAGES_PROCHE: Temoignage[] = [
  { id: 'r-karine', name: 'Karine, maman', type: 'podcast', title: 'Accompagner son enfant', source: 'Désanorexie (podcast)', link: 'https://desanorexie.com/podcast-accompagner-son-enfant-souffrant-danorexie/',
    text: "Karine raconte qu’avec son conjoint, ils ne s’en sont pas rendu compte tout de suite. Voir une psychologue l’a aidée à se déculpabiliser.\n\nAujourd’hui, sa fille va mieux, même si les progrès restent à protéger. Son conseil : ne pas rester seul·e." },
  { id: 'r-marie', name: 'Marie, maman', type: 'texte', title: '« Je me suis retrouvée seule face à cette maladie »', source: 'France 3 Nouvelle-Aquitaine', link: 'https://france3-regions.franceinfo.fr/nouvelle-aquitaine/charente-maritime/la-rochelle/temoignage-je-me-suis-retrouvee-seule-face-a-cette-maladie-marie-ancienne-anorexique-et-mere-d-une-fille-atteinte-d-anorexie-3230489.html',
    text: "Marie a elle-même traversé l’anorexie et en est guérie. Quand sa fille a été touchée à son tour, elle s’est d’abord sentie seule.\n\nElle s’est tournée vers une association de soutien aux familles, dont les conseils l’aident à accompagner sa fille au quotidien." },
  { id: 'r-mere-travail', name: 'Une maman', type: 'texte', title: 'Avancer ensemble', source: 'Psychologue.net', link: 'https://www.psychologue.net/articles/anorexie-mentale-une-epreuve-pour-les-parents',
    text: "Une mère raconte avoir entrepris un travail sur elle-même et sur sa relation avec sa fille.\n\nElle a vu sa fille avancer vers la guérison à mesure qu’elle-même comprenait mieux ce qui se jouait entre elles." },
  { id: 'r-fils', name: 'Des parents', type: 'texte', title: 'Ce que nous avons fait pour aider notre fils', source: 'Désanorexie', link: 'https://desanorexie.com/wp-content/uploads/2018/09/les-10-actions-entreprises-pour-aider-mon-fils-%C3%A0-vaincre-lanorexie-mentaleversion-finale.pdf',
    text: "Des parents partagent ce qu’ils ont mis en place pour aider leur fils à vaincre la maladie.\n\nIls racontent aussi la culpabilité qu’ils ont dû dépasser, et ce qui les a aidés à rester soudés." },
  { id: 'r-famille', name: 'Une maman et un pédiatre', type: 'texte', title: 'La famille, une force pour aller mieux', source: 'UNAFAM La Réunion', link: 'https://www.unafam.org/la-reunion/ressources/sortir-de-lanorexie-ou-de-la-boulimie-grace-aux-familles',
    text: "Une maman explique que les parents culpabilisent souvent, alors qu’ils ne le devraient pas.\n\nLe pédiatre interrogé le rappelle : aujourd’hui, on considère que la famille est ce qui aide l’adolescent à aller mieux." },
  { id: 'r-pere', name: 'Un papa et sa conjointe', type: 'texte', title: 'Prendre soin de soi pour tenir', source: 'Semaine de sensibilisation aux troubles alimentaires (Québec)', link: 'https://live.semainetroublesalimentaires.com/activites-benefiques/',
    text: "Un père et sa conjointe racontent la fatigue des longues discussions avec leur fille.\n\nIls expliquent pourquoi ils ont appris à se ménager : pour pouvoir continuer à la soutenir, sans s’épuiser." },
  { id: 'r-fratrie', name: 'Des frères et sœurs', type: 'podcast', title: 'La fratrie', source: 'ANEB Québec (podcast)', link: 'https://anebquebec.com/episode-8-temoignage-la-fratrie',
    text: "De jeunes adultes racontent ce qu’ils ont vécu en tant que frère ou sœur d’une personne touchée par un trouble alimentaire.\n\nIls parlent de la place qu’ils ont trouvée, et de ce qui les a aidés à rester présents." },
];
