import { View } from 'react-native';
import { useApp } from '@/store';
import { Carte, CoeurFavori, Ecran, Icon, T } from '@/ui';

export default function Favoris() {
  const { c, favoris } = useApp();
  return (
    <Ecran titre="Mes favoris" retour>
      {favoris.length === 0 ? (
        <View style={{ alignItems: 'center', gap: 12, paddingTop: 60, paddingHorizontal: 20 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: c.peach, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="heart" size={30} color={c.link} />
          </View>
          <T size={18} weight="title" center>Rien ici pour l'instant</T>
          <T color={c.muted} center>Touche le ♡ sur une phrase, un témoignage ou une idée pour la retrouver ici.</T>
        </View>
      ) : favoris.map((f) => (
        <Carte key={f.id}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <T size={12.5} weight="bold" color={c.link} style={{ flex: 1 }}>{f.type.toUpperCase()}{f.auteur ? ` · ${f.auteur}` : ''}</T>
            <CoeurFavori favori={f} />
          </View>
          <T size={16.5}>{f.texte}</T>
        </Carte>
      ))}
    </Ecran>
  );
}
