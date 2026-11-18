// Vérifie les garde-fous de l'assistant simulé : `node scripts/check-assistant.ts`
import assert from 'node:assert';
import { repondre, REPONSE_DETRESSE, traduireEnJe } from '../src/assistant.ts';

assert.equal(repondre("Elle m'a dit qu'elle voulait en finir"), REPONSE_DETRESSE);
assert.match(repondre('Combien de kilos elle devrait prendre ?'), /équipe médicale/);
assert.match(repondre('Elle ne veut pas en parler'), /porte reste ouverte/);
assert.ok(repondre('bonjour').length > 20);
assert.equal(traduireEnJe('', []), '');
assert.match(traduireEnJe('Tu ne me dis jamais rien.', ['inquietude', 'tristesse']), /^Je ressens de l'inquiétude et de la tristesse quand je pense à ça : « tu ne me dis jamais rien »/);
assert.equal(traduireEnJe('je veux mourir', []), REPONSE_DETRESSE);
console.log('assistant OK');
