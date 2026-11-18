# Serveur de l'assistant des proches

Petit serveur Cloudflare qui envoie les questions des proches à Claude. La clé Anthropic reste ici, jamais dans l'app.

1. `cd worker && npm install`
2. `npx wrangler login` (compte Cloudflare gratuit)
3. `npx wrangler secret put ANTHROPIC_API_KEY` (clé depuis platform.claude.com)
4. `npx wrangler secret put APP_TOKEN` (un mot de passe long, inventé)
5. `npx wrangler deploy` : note l'adresse affichée (https://aurore-assistant.xxx.workers.dev)
6. À la racine de l'app, crée `.env` :
   ```
   EXPO_PUBLIC_ASSISTANT_URL=https://aurore-assistant.xxx.workers.dev
   EXPO_PUBLIC_ASSISTANT_TOKEN=le même mot de passe qu'à l'étape 4
   ```
7. Rebuild l'app. Sans `.env`, l'assistant reste en réponses pré-écrites.
