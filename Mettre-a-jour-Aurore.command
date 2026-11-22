#!/bin/bash
# Double-clique sur ce fichier dans le Finder : il met Aurore à jour et l'installe sur l'iPhone branché.
cd "$(dirname "$0")" || exit 1
echo "1/3 · Récupération des nouveautés…"
git fetch origin && git reset --hard origin/claude/beta || { echo "Échec de la mise à jour (internet ?)"; read -r; exit 1; }
echo "2/3 · Installation des modules…"
npm install || { echo "Échec de npm install"; read -r; exit 1; }
echo "3/3 · Construction et installation sur l'iPhone (branché et déverrouillé)…"
npx expo run:ios --device --configuration Release
echo ""
echo "Terminé. Tu peux fermer cette fenêtre."
read -r
