import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { HUMEURS } from '@/data';
import { useApp } from '@/store';
import { Bouton, Carte, Champ, Ecran, Puce, Section, T } from '@/ui';

// Carnet : des mots, jamais de chiffres ni de notes.
export default function Carnet() {
  const app = useApp();
  const { c } = app;
  const [humeur, setHumeur] = useState('');
  const [douceurs, setDouceurs] = useState(['', '', '']);
  const [note, setNote] = useState('');
  const [ecrit, setEcrit] = useState(false);
  const enregistrer = () => {
    app.ecrirePage({ humeur, douceurs: douceurs.map((d) => d.trim()).filter(Boolean), note: note.trim() });
    setEcrit(true);
  };

  return (
    <Ecran titre="Mon carnet" sousTitre="Un espace rien qu'à toi">
      {ecrit ? (
        <Animated.View entering={FadeIn}>
          <Carte couleur={c.soft}>
            <T size={19} weight="title">Merci d'avoir pris ce moment pour toi.</T>
            <T color={c.muted}>Ta page est gardée précieusement. Tu pourras la relire quand tu veux.</T>
            <Bouton variante="contour" titre="Écrire une autre page" onPress={() => { setEcrit(false); setHumeur(''); setDouceurs(['', '', '']); setNote(''); }} />
          </Carte>
        </Animated.View>
      ) : (
        <>
          <Section titre="Comment je me sens">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {HUMEURS.map((h) => <Puce key={h} titre={h} actif={humeur === h} onPress={() => setHumeur(humeur === h ? '' : h)} />)}
            </View>
          </Section>
          <Section titre="Trois choses douces aujourd'hui">
            {douceurs.map((d, i) => (
              <Champ key={i} label={`Chose douce ${i + 1}`} value={d} onChangeText={(t) => setDouceurs((l) => l.map((x, j) => (j === i ? t : x)))} placeholder={['Un rayon de soleil', 'Un message reçu', 'Une chanson'][i]} maxLength={80} />
            ))}
          </Section>
          <Champ label="Ce que j'ai envie d'écrire (facultatif)" value={note} onChangeText={setNote} multiline placeholder="Une pensée, un rêve, une lettre à moi plus tard…" />
          <Bouton titre="Garder cette page" onPress={enregistrer} disabled={!humeur && !douceurs.some((d) => d.trim()) && !note.trim()} />
        </>
      )}

      <Section titre="Mes pages">
        {app.carnet.map((p) => (
          <Carte key={p.id}>
            <T size={13} weight="bold" color={c.link}>{p.date.toUpperCase()}{p.humeur ? ` · ${p.humeur}` : ''}</T>
            {p.douceurs.map((d) => <T key={d}>✿ {d}</T>)}
            {!!p.note && <T color={c.muted}>{p.note}</T>}
          </Carte>
        ))}
      </Section>
    </Ecran>
  );
}
