// Vérifie les garde-fous de l'assistant simulé : `node scripts/check-assistant.ts`
import assert from 'node:assert';
import { repondre, REPONSE_DETRESSE, securiser, traduireEnJe } from '../src/assistant.ts';

assert.equal(repondre("Elle m'a dit qu'elle voulait en finir"), REPONSE_DETRESSE);
assert.match(repondre('Combien de kilos elle devrait prendre ?'), /équipe médicale/);
assert.match(repondre('Elle ne veut pas en parler'), /porte reste ouverte/);
assert.ok(repondre('bonjour').length > 20);
assert.equal(traduireEnJe('', []), '');
assert.match(traduireEnJe('Tu ne me dis jamais rien.', ['inquietude', 'tristesse']), /^Je ressens de l'inquiétude et de la tristesse quand je pense à ça : « tu ne me dis jamais rien »/);
assert.equal(traduireEnJe('je veux mourir', []), REPONSE_DETRESSE);
const r1 = repondre('Elle ne veut pas en parler');
assert.notEqual(repondre('Elle ne veut pas en parler', [r1]), r1);
const r2 = repondre('bonjour');
assert.notEqual(repondre('bonjour', [r2]), r2);
assert.match(securiser('Que faire ce soir ?', 'Vise 2000 kcal par jour.'), /équipe médicale/);
assert.match(securiser('Il parle de se tuer', 'Reste près de lui.'), /3114/);
assert.equal(securiser('Que dire ?', 'Dis-lui que tu es là.'), 'Dis-lui que tu es là.');
console.log('assistant OK');
