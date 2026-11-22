// Vérifie les garde-fous de l'assistant simulé : `node scripts/check-assistant.ts`
import assert from 'node:assert';
import { repondre, REPONSE_DETRESSE, securiser, souvenirs, traduireEnJe } from '../src/assistant.ts';

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
const convs = [
  { id: 'a', date: 1, messages: [{ role: 'user' as const, content: 'Ma fille de 15 ans refuse de voir un médecin' }, { role: 'assistant' as const, content: 'réponse' }] },
  { id: 'b', date: 2, messages: [{ role: 'user' as const, content: 'Elle a commencé un suivi' }] },
  { id: 'c', date: 3, messages: [{ role: 'user' as const, content: 'question en cours' }] },
];
const m = souvenirs(convs, 'c');
assert.ok(m.indexOf('suivi') < m.indexOf('15 ans') && !m.includes('en cours') && !m.includes('réponse'));
assert.ok(souvenirs(convs, null, 60).length <= 60);
console.log('assistant OK');

// Rappels du calendrier
const { lireHeure, arrive, declencheur } = await import('../src/rappels.ts');
assert.equal(lireHeure('14h'), '14:00'); assert.equal(lireHeure('14h30'), '14:30'); assert.equal(lireHeure('9:05'), '09:05');
assert.equal(lireHeure('14'), '14:00'); assert.equal(lireHeure('25h'), null); assert.equal(lireHeure('midi'), null);
const ev = { jour: '2026-11-23', heure: '14:00', titre: 'Exposé' };
assert.ok(arrive({ ...ev, repetition: 'semaine' }, '2026-11-30') && !arrive({ ...ev, repetition: 'semaine' }, '2026-11-24'));
assert.ok(arrive({ ...ev, repetition: 'jour' }, '2026-11-24') && !arrive({ ...ev, repetition: 'jour' }, '2026-11-22'));
assert.ok(arrive({ ...ev, repetition: 'mois' }, '2026-12-23') && !arrive(ev, '2026-11-24'));
const avant = new Date('2026-11-22T10:00:00');
assert.deepEqual(declencheur({ ...ev, rappel: 15 }, avant), { type: 'date', date: new Date('2026-11-23T13:45:00') });
assert.deepEqual(declencheur({ ...ev, rappel: 1440, repetition: 'semaine' }, avant), { type: 'weekly', weekday: 1, hour: 14, minute: 0 });
assert.equal(declencheur({ ...ev, rappel: 0 }, new Date('2026-11-24T00:00:00')), null);
assert.equal(declencheur({ ...ev, rappel: null }, avant), null);
console.log('rappels OK');
