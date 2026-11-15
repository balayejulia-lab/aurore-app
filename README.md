# Aurore — l'app iPhone (beta)

La vie qui revient, à ton rythme. Cette version est une **beta de démonstration** : toutes les données sont fictives, rien n'est envoyé sur Internet, l'assistant répond avec des réponses pré-écrites.

## Lancer la beta sur un Mac

À faire une seule fois :
1. Installer **Xcode** depuis l'App Store, l'ouvrir une fois et accepter les composants proposés.
2. Installer **Node.js** (version LTS) depuis nodejs.org.

Puis, dans le Terminal, depuis ce dossier :

```bash
npm install
npx expo run:ios
```

Un iPhone virtuel s'ouvre avec Aurore. Pour l'installer sur un vrai iPhone branché en câble : `npx expo run:ios --device`.

Après une mise à jour du code (« Pull » dans GitHub Desktop) : relancer `npx expo run:ios`.

## Organisation du code
- `src/app/` : les écrans (un fichier = un écran). `patient/` et `proche/` = les onglets de chaque profil.
- `src/ui.tsx` : boutons, cartes, logo, en-tête avec le bouton « Aide ».
- `src/theme.ts` : couleurs jour / nuit et polices.
- `src/store.tsx` : les données de la beta (en mémoire, remplacées plus tard par Supabase).
- `src/data.ts` : textes de démonstration (les témoignages sont des exemples fictifs).
- `src/assistant.ts` : assistant simulé + garde-fous (vérifiés par `npm run check`).

## Règles du projet
Voir `docs/PASSATION-APP.md` dans le dépôt `aurore` (sécurité, logo, design).
