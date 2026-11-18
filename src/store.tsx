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

function useAppState() {
  const systeme = useColorScheme();
  const [connecte, setConnecte] = useState(false);
  const [profil, setProfil] = useState<Profil | null>(null);
  const [surnom, setSurnom] = useState('');
  const [ambiance, setAmbiance] = useState<Ambiance>('system');
  // Beta : un compte déjà lié pour voir les petits mots.
  const [partenaire, setPartenaire] = useState<string | null>(null);
  const [visites] = useState(6);
  const [photos, setPhotos] = useState<string[]>([]);
  const [fondHero, setFondHero] = useState('#eef4f0');
  const [journal, setJournal] = useState<Record<Profil, Page[]>>({ patient: [], proche: [] });
  const [pin, setPin] = useState<string | null>(null);
  const [verrouille, setVerrouille] = useState(false);
  const [raisons, setRaisons] = useState<Raison[]>([]);
  const [victoires, setVictoires] = useState<Victoire[]>([]);
  const [favoris, setFavoris] = useState<Favori[]>([]);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [motDoux, setMotDoux] = useState('');
  const [rappels, setRappels] = useState(true);
  const [objectifs, setObjectifs] = useState<Objectif[]>([]);
  const [envies, setEnvies] = useState<Envie[]>([]);
  const [scene, setScene] = useState<string | null>(null);
  const majObjectif = (id: string, f: (o: Objectif) => Objectif) => setObjectifs((l) => l.map((o) => (o.id === id ? f(o) : o)));

  const nuit = ambiance === 'dark' || (ambiance === 'system' && systeme === 'dark');
  const c = nuit ? sombre : clair;
  const p: Profil = profil ?? 'patient';

  return {
    c, nuit, connecte, setConnecte, profil, setProfil, surnom, setSurnom, ambiance, setAmbiance,
    partenaire, setPartenaire, visites, photos, fondHero, setFondHero, rappels, setRappels,
    ajouterPhoto: (uri: string) => setPhotos((l) => [uri, ...l]),
    retirerPhoto: (uri: string) => setPhotos((l) => l.filter((x) => x !== uri)),
    pages: journal[p],
    ecrirePage: (content: string) => setJournal((j) => ({ ...j, [p]: [...j[p], { id: nid(), content, date: Date.now() }] })),
    modifierPage: (id: string, content: string) => setJournal((j) => ({ ...j, [p]: j[p].map((x) => (x.id === id ? { ...x, content } : x)) })),
    supprimerPage: (id: string) => setJournal((j) => ({ ...j, [p]: j[p].filter((x) => x.id !== id) })),
    pin, verrouille,
    creerPin: (code: string) => { setPin(code); setVerrouille(true); },
    deverrouiller: (code: string) => { if (code === pin) { setVerrouille(false); return true; } return false; },
    verrouiller: () => setVerrouille(true),
    raisons,
    ajouterRaison: (text: string) => setRaisons((l) => [{ id: nid(), text }, ...l]),
    supprimerRaison: (id: string) => setRaisons((l) => l.filter((x) => x.id !== id)),
    victoires,
    ajouterVictoire: (title: string) => setVictoires((l) => [{ id: nid(), title, shared: [] }, ...l]),
    supprimerVictoire: (id: string) => setVictoires((l) => l.filter((x) => x.id !== id)),
    partagerVictoire: (id: string) => setVictoires((l) => l.map((x) => (x.id === id ? { ...x, shared: ['lien'] } : x))),
    favoris,
    estFavori: (id: string) => favoris.some((f) => f.id === id),
    basculerFavori: (f: Favori) => setFavoris((l) => (l.some((x) => x.id === f.id) ? l.filter((x) => x.id !== f.id) : [f, ...l])),
    evenements,
    ajouterEvenement: (e: Omit<Evenement, 'id'>) => setEvenements((l) => [...l, { ...e, id: nid() }]),
    supprimerEvenement: (id: string) => setEvenements((l) => l.filter((x) => x.id !== id)),
    contacts,
    ajouterContact: (nom: string, tel: string) => setContacts((l) => [...l, { id: nid(), nom, tel }]),
    supprimerContact: (id: string) => setContacts((l) => l.filter((x) => x.id !== id)),
    motDoux, setMotDoux,
    objectifs, scene, setScene,
    ajouterObjectif: (title: string) => setObjectifs((l) => [{ id: nid(), title, completed: false, steps: [] }, ...l]),
    basculerObjectif: (id: string) => majObjectif(id, (o) => ({ ...o, completed: !o.completed })),
    renommerObjectif: (id: string, title: string) => majObjectif(id, (o) => ({ ...o, title })),
    supprimerObjectif: (id: string) => setObjectifs((l) => l.filter((o) => o.id !== id)),
    ajouterEtape: (id: string, text: string) => majObjectif(id, (o) => ({ ...o, steps: [...o.steps, { text, done: false }] })),
    basculerEtape: (id: string, i: number) => majObjectif(id, (o) => ({ ...o, steps: o.steps.map((s, j) => (j === i ? { ...s, done: !s.done } : s)) })),
    modifierEtape: (id: string, i: number, text: string) => majObjectif(id, (o) => ({ ...o, steps: o.steps.map((s, j) => (j === i ? { ...s, text } : s)) })),
    supprimerEtape: (id: string, i: number) => majObjectif(id, (o) => ({ ...o, steps: o.steps.filter((_, j) => j !== i) })),
    envies,
    garderEnvie: (question: string, answer: string, category: string) => setEnvies((l) => [{ id: nid(), question, answer, category, transformed: false }, ...l]),
    modifierEnvie: (id: string, answer: string) => setEnvies((l) => l.map((e) => (e.id === id ? { ...e, answer } : e))),
    supprimerEnvie: (id: string) => setEnvies((l) => l.filter((e) => e.id !== id)),
    transformerEnvie: (e: Envie) => { setObjectifs((l) => [{ id: nid(), title: e.answer, completed: false, steps: [] }, ...l]); setEnvies((l) => l.map((x) => (x.id === e.id ? { ...x, transformed: true } : x))); },
    deconnecter: () => { setConnecte(false); setProfil(null); },
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
