// Vérifie les garde-fous de l'assistant simulé : `node scripts/check-assistant.ts`
import assert from 'node:assert';
import { adoucir, repondre, REPONSE_DETRESSE } from '../src/assistant.ts';

assert.equal(repondre("Elle m'a dit qu'elle voulait en finir"), REPONSE_DETRESSE);
assert.match(repondre('Combien de kilos elle devrait prendre ?'), /équipe médicale/);
assert.match(repondre('Elle ne veut pas en parler'), /porte reste ouverte/);
assert.ok(repondre('bonjour').length > 20);
assert.equal(adoucir('').length, 0);
assert.match(adoucir("J'ai peur pour toi.")[0], /j'ai peur pour toi\. Je te le dis/);
assert.equal(adoucir('je veux mourir')[0], REPONSE_DETRESSE);
console.log('assistant OK');
