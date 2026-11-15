import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Temoignage } from './data';
import { useC } from './store';
import { Carte, CoeurFavori, Ecran, Puce, T } from './ui';

// Écran partagé patient / proche. Les textes sont des exemples fictifs en attendant la liste validée.
export function Temoignages({ liste, sousTitre }: { liste: Temoignage[]; sousTitre: string }) {
  const c = useC();
  const themes = ['Tous', ...new Set(liste.map((t) => t.theme))];
  const [theme, setTheme] = useState('Tous');
  const [ouvert, setOuvert] = useState<string | null>(null);
  return (
    <Ecran titre="Témoignages" sousTitre={sousTitre}>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {themes.map((t) => <Puce key={t} titre={t} actif={theme === t} onPress={() => setTheme(t)} />)}
      </View>
      {liste.filter((t) => theme === 'Tous' || t.theme === theme).map((t, i) => (
        <Animated.View key={t.id} entering={FadeInDown.delay(i * 60)}>
          <Carte onPress={() => setOuvert(ouvert === t.id ? null : t.id)} label={t.titre} couleur={i % 2 ? c.card : c.soft}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <T size={12.5} weight="bold" color={c.link}>{t.theme.toUpperCase()} · {t.prenom}</T>
              </View>
              <CoeurFavori favori={{ id: t.id, type: 'Témoignage', texte: t.titre, auteur: t.prenom }} />
            </View>
            <T size={19} weight="title">{t.titre}</T>
            <T color={c.muted} lines={ouvert === t.id ? undefined : 2}>{t.texte}</T>
            <T size={14} weight="semibold" color={c.link}>{ouvert === t.id ? 'Réduire' : 'Lire la suite'}</T>
          </Carte>
        </Animated.View>
      ))}
      <T size={12.5} color={c.muted} center>Beta : témoignages d'exemple. Les vrais récits seront relus avant d'être publiés.</T>
    </Ecran>
  );
}
