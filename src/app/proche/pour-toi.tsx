import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { adoucir } from '@/assistant';
import { HUMEURS_PROCHE, SOIN_DE_SOI } from '@/data';
import { useApp } from '@/store';
import { Bouton, Carte, Champ, CoeurFavori, Ecran, Puce, Section, T } from '@/ui';

export default function PourToi() {
  const app = useApp();
  const { c } = app;
  const [humeur, setHumeur] = useState('');
  const [texte, setTexte] = useState('');
  const [propositions, setPropositions] = useState<string[]>([]);

  return (
    <Ecran titre="Comment tu te sens ?" sousTitre="Un espace rien que pour toi">
      <Section titre="Aujourd'hui, je me sens…">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {HUMEURS_PROCHE.map((h) => <Puce key={h} titre={h} actif={humeur === h} onPress={() => setHumeur(humeur === h ? '' : h)} />)}
        </View>
        {!!humeur && (
          <Animated.View entering={FadeInDown}>
            <Carte couleur={c.soft}>
              <T>Merci de l'avoir dit. Ce que tu ressens est légitime. {humeur.startsWith('Épuis') || humeur.startsWith('Seul') ? "Pense à te reposer, et à en parler à quelqu'un de confiance." : 'Prends un moment pour toi aujourd’hui.'}</T>
            </Carte>
          </Animated.View>
        )}
      </Section>

      <Section titre="Traduire ce que je ressens">
        <Carte>
          <T color={c.muted}>Écris ce que tu souhaiterais lui dire, on t'aide avec d'autres mots.</T>
          <Champ label="Ce que j'aimerais lui dire" value={texte} onChangeText={setTexte} multiline placeholder="Ex. : j'ai peur quand tu ne me parles pas" maxLength={300} />
          <Bouton icone="sparkle" titre="M'aider à le dire" disabled={!texte.trim()} onPress={() => setPropositions(adoucir(texte))} />
        </Carte>
        {propositions.map((p, i) => (
          <Animated.View key={p} entering={FadeInDown.delay(i * 120)}>
            <Carte couleur={c.peach}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <T size={13} weight="bold" color={c.link} style={{ flex: 1 }}>PROPOSITION {i + 1}</T>
                <CoeurFavori favori={{ id: `trad-${p}`, type: 'Mes mots', texte: p }} />
              </View>
              <T size={16.5}>{p}</T>
            </Carte>
          </Animated.View>
        ))}
        {propositions.length > 0 && <T size={12.5} color={c.muted} center>Ces mots restent privés : rien n'est envoyé automatiquement.</T>}
      </Section>

      <Section titre="Prendre soin de toi">
        {SOIN_DE_SOI.map((s) => (
          <Carte key={s.titre}>
            <T weight="semibold">{s.titre}</T>
            <T color={c.muted}>{s.texte}</T>
          </Carte>
        ))}
      </Section>
    </Ecran>
  );
}
