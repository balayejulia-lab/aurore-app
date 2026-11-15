import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { INSPIRATIONS } from '@/data';
import { useC } from '@/store';
import { Carte, CoeurFavori, Ecran, Puce, T } from '@/ui';

export default function Inspiration() {
  const c = useC();
  const [type, setType] = useState('Tout');
  const fonds = [c.soft, c.peach, c.card];
  return (
    <Ecran titre="Inspiration" sousTitre="Des idées pour rallumer l'envie">
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {['Tout', 'Idée', 'Citation'].map((t) => <Puce key={t} titre={t === 'Tout' ? 'Tout' : `${t}s`} actif={type === t} onPress={() => setType(t)} />)}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {INSPIRATIONS.filter((i) => type === 'Tout' || i.type === type).map((i, n) => (
          <Animated.View key={i.id} entering={FadeInDown.delay(n * 50)} style={{ width: '47.5%' }}>
            <Carte couleur={fonds[n % 3]} style={{ minHeight: n % 3 === 0 ? 190 : 150 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <T size={12} weight="bold" color={c.link} style={{ flex: 1 }}>{i.type.toUpperCase()}</T>
                <CoeurFavori favori={{ id: i.id, type: i.type, texte: i.texte, auteur: i.auteur }} />
              </View>
              <T size={i.type === 'Citation' ? 17 : 15.5} weight={i.type === 'Citation' ? 'title' : 'medium'}>{i.texte}</T>
              {i.auteur && <T size={13} color={c.muted}>{i.auteur}</T>}
            </Carte>
          </Animated.View>
        ))}
      </View>
    </Ecran>
  );
}
