import { createContext, useContext, useState, type ReactNode } from 'react';
import { jour, nuit } from './theme';

// shortcut: tout vit en mémoire (beta sans serveur) ; Supabase remplacera ce store après validation.
export type Profil = 'patient' | 'proche';
export type Favori = { id: string; type: string; texte: string; auteur?: string };
export type Envie = { id: string; categorie: 'Passion' | 'Rêve' | 'Projet'; titre: string; pas: { id: string; texte: string; fait: boolean }[] };
export type Page = { id: string; date: string; humeur: string; douceurs: string[]; note: string };
export type Mot = { id: string; texte: string; de: string; quand: string };

const id = () => Math.random().toString(36).slice(2, 9);

function useAppState() {
  const [profil, setProfil] = useState<Profil>('patient');
  const [prenom, setPrenom] = useState('Juju');
  const [lien, setLien] = useState<string | null>('Maman');
  const [modeNuit, setModeNuit] = useState(false);
  const [taille, setTaille] = useState(1);
  const [photos, setPhotos] = useState<string[]>([]);
  const [favoris, setFavoris] = useState<Favori[]>([]);
  // Les petits pas ne font que s'additionner : rien ne se perd, jamais.
  const [petitsPas, setPetitsPas] = useState(12);
  const [envies, setEnvies] = useState<Envie[]>([
    { id: id(), categorie: 'Passion', titre: 'Reprendre le dessin', pas: [
      { id: id(), texte: 'Racheter un carnet de croquis', fait: true },
      { id: id(), texte: 'Dessiner 10 minutes au parc', fait: false },
    ] },
    { id: id(), categorie: 'Rêve', titre: 'Voir la mer au Portugal', pas: [
      { id: id(), texte: 'Regarder des photos de Porto', fait: false },
    ] },
    { id: id(), categorie: 'Projet', titre: 'Apprendre la guitare', pas: [] },
  ]);
  const [carnet, setCarnet] = useState<Page[]>([
    { id: id(), date: 'Hier', humeur: 'Apaisée', douceurs: ['Un appel avec Léa', 'Le soleil sur le balcon'], note: '' },
  ]);
  const [motsRecus, setMotsRecus] = useState<Mot[]>([
    { id: id(), texte: 'Je suis fier·ère de chaque pas que tu fais, même les petits.', de: 'Maman', quand: 'ce matin' },
  ]);
  const [motsEnvoyes, setMotsEnvoyes] = useState<Mot[]>([]);

  const c = modeNuit ? nuit : jour;

  return {
    c, profil, setProfil, prenom, setPrenom, lien, setLien, modeNuit, setModeNuit, taille, setTaille,
    photos, ajouterPhoto: (uri: string) => setPhotos((p) => [...p, uri]),
    retirerPhoto: (uri: string) => setPhotos((p) => p.filter((x) => x !== uri)),
    favoris,
    estFavori: (fid: string) => favoris.some((f) => f.id === fid),
    basculerFavori: (f: Favori) =>
      setFavoris((l) => (l.some((x) => x.id === f.id) ? l.filter((x) => x.id !== f.id) : [f, ...l])),
    petitsPas, unPasDePlus: () => setPetitsPas((n) => n + 1),
    envies,
    ajouterEnvie: (categorie: Envie['categorie'], titre: string) =>
      setEnvies((l) => [...l, { id: id(), categorie, titre, pas: [] }]),
    ajouterPas: (eid: string, texte: string) =>
      setEnvies((l) => l.map((e) => (e.id === eid ? { ...e, pas: [...e.pas, { id: id(), texte, fait: false }] } : e))),
    // Un pas fait le reste : on ne peut pas « défaire » une victoire.
    faireLePas: (eid: string, pid: string) => {
      setEnvies((l) => l.map((e) => (e.id === eid ? { ...e, pas: e.pas.map((p) => (p.id === pid ? { ...p, fait: true } : p)) } : e)));
      setPetitsPas((n) => n + 1);
    },
    carnet,
    ecrirePage: (p: Omit<Page, 'id' | 'date'>) => setCarnet((l) => [{ ...p, id: id(), date: "Aujourd'hui" }, ...l]),
    motsRecus, motsEnvoyes,
    envoyerMot: (texte: string) => setMotsEnvoyes((l) => [{ id: id(), texte, de: prenom, quand: "à l'instant" }, ...l]),
    recevoirMot: (m: Mot) => setMotsRecus((l) => [m, ...l]),
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

export function useC() {
  return useApp().c;
}

