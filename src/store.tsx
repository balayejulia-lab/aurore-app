import { createContext, useContext, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { clair, sombre } from './theme';

// shortcut: tout vit en mémoire (beta sans serveur) ; Supabase remplacera ce store après validation.
export type Profil = 'patient' | 'proche';
export type Ambiance = 'system' | 'light' | 'dark';
export type Favori = { id: string; type: string; texte: string; auteur?: string; resume?: string; lien?: string };
export type Page = { id: string; content: string; date: number };
export type Raison = { id: string; text: string };
export type Victoire = { id: string; title: string; shared: string[] };
export type Evenement = { id: string; jour: string; titre: string; heure: string; lieu: string; note: string };
export type Contact = { id: string; nom: string; tel: string };
export type Etape = { text: string; done: boolean };
export type Objectif = { id: string; title: string; completed: boolean; steps: Etape[] };
export type Envie = { id: string; question: string; answer: string; category: string; transformed: boolean };

export const nid = () => Math.random().toString(36).slice(2, 9);

// Tout ce qui appartient à UN compte. Le profil est choisi une seule fois et ne change jamais :
// un compte est soit patient, soit proche, jamais les deux.
type Donnees = {
  profil: Profil | null; surnom: string; partenaire: string | null; photos: string[]; fondHero: string;
  pages: Page[]; pin: string | null; verrouille: boolean; raisons: Raison[]; victoires: Victoire[];
  favoris: Favori[]; evenements: Evenement[]; contacts: Contact[]; motDoux: string; rappels: boolean;
  objectifs: Objectif[]; envies: Envie[]; scene: string | null;
};
const VIDE: Donnees = {
  profil: null, surnom: '', partenaire: null, photos: [], fondHero: '#eef4f0', pages: [], pin: null, verrouille: false,
  raisons: [], victoires: [], favoris: [], evenements: [], contacts: [], motDoux: '', rappels: true, objectifs: [], envies: [], scene: null,
};
type Maj<T> = T | ((v: T) => T);

function useAppState() {
  const systeme = useColorScheme();
  const [ambiance, setAmbiance] = useState<Ambiance>('system');
  const [compte, setCompte] = useState<string | null>(null);
  const [comptes, setComptes] = useState<Record<string, Donnees>>({});
  const d = (compte && comptes[compte]) || VIDE;

  const maj = (f: (x: Donnees) => Donnees) => { if (compte) setComptes((m) => ({ ...m, [compte]: f(m[compte] ?? VIDE) })); };
  const champ = <K extends keyof Donnees>(k: K) => (v: Maj<Donnees[K]>) =>
    maj((x) => ({ ...x, [k]: typeof v === 'function' ? (v as (a: Donnees[K]) => Donnees[K])(x[k]) : v }));
  const liste = <K extends keyof Donnees>(k: K, f: (l: Donnees[K]) => Donnees[K]) => maj((x) => ({ ...x, [k]: f(x[k]) }));
  const majObjectif = (id: string, f: (o: Objectif) => Objectif) => liste('objectifs', (l) => l.map((o) => (o.id === id ? f(o) : o)));

  const nuit = ambiance === 'dark' || (ambiance === 'system' && systeme === 'dark');
  const c = nuit ? sombre : clair;

  return {
    c, nuit, ambiance, setAmbiance,
    connecte: !!compte,
    existe: (id: string) => !!comptes[id],
    /** Ouvre (ou crée) le compte et renvoie son profil, s'il en a déjà un. */
    ouvrirCompte: (id: string): Profil | null => { setComptes((m) => (m[id] ? m : { ...m, [id]: VIDE })); setCompte(id); return comptes[id]?.profil ?? null; },
    deconnecter: () => setCompte(null),
    profil: d.profil,
    /** Fixe le profil à la fin de l'inscription ; ne remplace jamais un profil déjà choisi. */
    choisirProfil: (p: Profil) => maj((x) => (x.profil ? x : { ...x, profil: p })),
    surnom: d.surnom, setSurnom: champ('surnom'),
    partenaire: d.partenaire, setPartenaire: champ('partenaire'),
    visites: 6,
    photos: d.photos, fondHero: d.fondHero, setFondHero: champ('fondHero'), rappels: d.rappels, setRappels: champ('rappels'),
    ajouterPhoto: (uri: string) => liste('photos', (l) => [uri, ...l]),
    retirerPhoto: (uri: string) => liste('photos', (l) => l.filter((x) => x !== uri)),
    pages: d.pages,
    ecrirePage: (content: string) => liste('pages', (l) => [...l, { id: nid(), content, date: Date.now() }]),
    modifierPage: (id: string, content: string) => liste('pages', (l) => l.map((x) => (x.id === id ? { ...x, content } : x))),
    supprimerPage: (id: string) => liste('pages', (l) => l.filter((x) => x.id !== id)),
    pin: d.pin, verrouille: d.verrouille,
    creerPin: (code: string) => maj((x) => ({ ...x, pin: code, verrouille: true })),
    deverrouiller: (code: string) => { if (code === d.pin) { maj((x) => ({ ...x, verrouille: false })); return true; } return false; },
    verrouiller: () => maj((x) => ({ ...x, verrouille: true })),
    raisons: d.raisons,
    ajouterRaison: (text: string) => liste('raisons', (l) => [{ id: nid(), text }, ...l]),
    supprimerRaison: (id: string) => liste('raisons', (l) => l.filter((x) => x.id !== id)),
    victoires: d.victoires,
    ajouterVictoire: (title: string) => liste('victoires', (l) => [{ id: nid(), title, shared: [] }, ...l]),
    supprimerVictoire: (id: string) => liste('victoires', (l) => l.filter((x) => x.id !== id)),
    partagerVictoire: (id: string) => liste('victoires', (l) => l.map((x) => (x.id === id ? { ...x, shared: ['lien'] } : x))),
    favoris: d.favoris,
    estFavori: (id: string) => d.favoris.some((f) => f.id === id),
    basculerFavori: (f: Favori) => liste('favoris', (l) => (l.some((x) => x.id === f.id) ? l.filter((x) => x.id !== f.id) : [f, ...l])),
    evenements: d.evenements,
    ajouterEvenement: (e: Omit<Evenement, 'id'>) => liste('evenements', (l) => [...l, { ...e, id: nid() }]),
    supprimerEvenement: (id: string) => liste('evenements', (l) => l.filter((x) => x.id !== id)),
    contacts: d.contacts,
    ajouterContact: (nom: string, tel: string) => liste('contacts', (l) => [...l, { id: nid(), nom, tel }]),
    supprimerContact: (id: string) => liste('contacts', (l) => l.filter((x) => x.id !== id)),
    motDoux: d.motDoux, setMotDoux: champ('motDoux'),
    objectifs: d.objectifs, scene: d.scene, setScene: champ('scene'),
    ajouterObjectif: (title: string) => liste('objectifs', (l) => [{ id: nid(), title, completed: false, steps: [] }, ...l]),
    basculerObjectif: (id: string) => majObjectif(id, (o) => ({ ...o, completed: !o.completed })),
    renommerObjectif: (id: string, title: string) => majObjectif(id, (o) => ({ ...o, title })),
    supprimerObjectif: (id: string) => liste('objectifs', (l) => l.filter((o) => o.id !== id)),
    ajouterEtape: (id: string, text: string) => majObjectif(id, (o) => ({ ...o, steps: [...o.steps, { text, done: false }] })),
    basculerEtape: (id: string, i: number) => majObjectif(id, (o) => ({ ...o, steps: o.steps.map((s, j) => (j === i ? { ...s, done: !s.done } : s)) })),
    modifierEtape: (id: string, i: number, text: string) => majObjectif(id, (o) => ({ ...o, steps: o.steps.map((s, j) => (j === i ? { ...s, text } : s)) })),
    supprimerEtape: (id: string, i: number) => majObjectif(id, (o) => ({ ...o, steps: o.steps.filter((_, j) => j !== i) })),
    envies: d.envies,
    garderEnvie: (question: string, answer: string, category: string) => liste('envies', (l) => [{ id: nid(), question, answer, category, transformed: false }, ...l]),
    modifierEnvie: (id: string, answer: string) => liste('envies', (l) => l.map((e) => (e.id === id ? { ...e, answer } : e))),
    supprimerEnvie: (id: string) => liste('envies', (l) => l.filter((e) => e.id !== id)),
    transformerEnvie: (e: Envie) => maj((x) => ({ ...x, objectifs: [{ id: nid(), title: e.answer, completed: false, steps: [] }, ...x.objectifs], envies: x.envies.map((y) => (y.id === e.id ? { ...y, transformed: true } : y)) })),
  };
}

type App = ReturnType<typeof useAppState>;
const Ctx = createContext<App | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const state = useAppState();
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp hors AppProvider');
  return v;
}

export const useC = () => useApp().c;
