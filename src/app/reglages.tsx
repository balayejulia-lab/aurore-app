import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Switch, View } from 'react-native';
import { useApp } from '@/store';
import { Bouton, Carte, Champ, Ecran, Icon, Puce, SoleilEntier, T, type IconName } from '@/ui';

export default function Reglages() {
  const app = useApp();
  const { c } = app;
  const [prenom, setPrenom] = useState(app.prenom);
  return (
    <Ecran titre="Réglages" retour>
      <View style={{ alignItems: 'center', gap: 6, paddingVertical: 6 }}>
        <SoleilEntier size={64} />
        <T weight="semibold">{app.prenom}</T>
        <T size={14} color={c.muted}>{app.profil === 'proche' ? "J'accompagne un proche" : 'Je reprends ma vie en main'}</T>
      </View>

      <Carte>
        <Champ label="Mon prénom ou surnom" value={prenom} onChangeText={setPrenom} onEndEditing={() => prenom.trim() && app.setPrenom(prenom.trim())} maxLength={30} />
      </Carte>

      <Carte>
        <Ligne icone="moon" titre="Mode nuit doux">
          <Switch value={app.modeNuit} onValueChange={app.setModeNuit} trackColor={{ true: c.gold, false: c.line }} thumbColor="#FFFFFF" accessibilityLabel="Mode nuit doux" />
        </Ligne>
        <View style={{ height: 1, backgroundColor: c.line }} />
        <Ligne icone="type" titre="Taille du texte" />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {([['Normal', 1], ['Grand', 1.15], ['Très grand', 1.3]] as const).map(([n, v]) => <Puce key={n} titre={n} actif={app.taille === v} onPress={() => app.setTaille(v)} />)}
        </View>
      </Carte>

      <Carte>
        <Ligne icone="link" titre={app.lien ? `Lié·e avec ${app.lien}` : 'Aucun proche lié'} />
        <T size={14.5} color={c.muted}>{app.profil === 'proche' ? 'Vous pouvez vous envoyer des petits mots.' : 'Ton code à partager : AURORE-4821. Seuls les petits mots sont partagés.'}</T>
        {app.lien && <Bouton variante="doux" titre="Délier ce compte" onPress={() => app.setLien(null)} />}
      </Carte>

      <Carte>
        <Ligne icone="shield" titre="Confidentialité" />
        <T size={14.5} color={c.muted}>Ton carnet, tes envies et tes photos restent privés. Aucune donnée n'est vendue ni utilisée pour de la publicité.</T>
      </Carte>

      <Bouton variante="contour" icone="out" titre="Se déconnecter" onPress={() => router.replace('/connexion')} />
      <T size={12.5} color={c.muted} center>Aurore · version beta{'\n'}Ne remplace pas un suivi médical ou psychologique.</T>
    </Ecran>
  );
}

function Ligne({ icone, titre, children }: { icone: IconName; titre: string; children?: ReactNode }) {
  const { c } = useApp();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 }}>
      <Icon name={icone} color={c.link} />
      <T weight="semibold" style={{ flex: 1 }}>{titre}</T>
      {children}
    </View>
  );
}
