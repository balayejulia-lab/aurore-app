import { useState } from 'react';
import { View } from 'react-native';
import { Encouragement, Journal, Raisons, Victoires } from '@/ecrans/Accueil';
import { useApp } from '@/store';
import { Avertissement, CarteAccueil, ChoixCouleurs, Ecran, EnTeteAccueil, Feuille, t } from '@/ui';

export default function AccueilPatient() {
  const { surnom } = useApp();
  const [couleurs, setCouleurs] = useState(false);
  return (
    <Ecran>
      <EnTeteAccueil nom={surnom || undefined} />
      <View style={{ gap: 24 }}>
        <CarteAccueil phrase={t('home.landscapeHeading')} ouvrirCouleurs={() => setCouleurs(true)} />
        <View style={{ gap: 16 }}>
          <Journal />
          <Raisons />
          <Victoires />
          <Encouragement />
        </View>
      </View>
      <Avertissement />
      <Feuille visible={couleurs} fermer={() => setCouleurs(false)}><ChoixCouleurs fermer={() => setCouleurs(false)} /></Feuille>
    </Ecran>
  );
}
