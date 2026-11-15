import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useC } from '@/store';
import { Bouton, Carte, Icon, RondBouton, T, Titre, tap, type IconName } from '@/ui';

// Numéros vérifiés (nov. 2026) : 3114 sur info.gouv.fr / sante.fr ; 09 69 325 900 = Anorexie Boulimie Info Écoute (FFAB).
const NUMEROS = [
  { nom: 'Prévention du suicide', detail: 'Gratuit, 24h/24, 7j/7', tel: '3114', affiche: '3114' },
  { nom: 'Anorexie Boulimie Info Écoute', detail: 'Écoute pour toi et tes proches, appel non surtaxé', tel: '0969325900', affiche: '09 69 325 900' },
  { nom: 'SAMU', detail: 'Urgence médicale', tel: '15', affiche: '15' },
  { nom: 'Numéro d’urgence européen', detail: 'Depuis tout pays de l’UE', tel: '112', affiche: '112' },
];

export default function Aide() {
  const c = useC();
  const insets = useSafeAreaInsets();
  const [outil, setOutil] = useState<'respiration' | 'ancrage' | null>(null);
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Titre>Besoin d'aide maintenant</Titre>
          <T size={14} color={c.muted}>Tu n'es pas seul·e. Des personnes sont là pour t'écouter.</T>
        </View>
        <RondBouton icone="x" label="Fermer" onPress={() => router.back()} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: insets.bottom + 30 }}>
        {NUMEROS.map((n, i) => (
          <Pressable key={n.tel} accessibilityRole="button" accessibilityLabel={`Appeler ${n.nom}, ${n.affiche}`} onPress={() => { tap(); Linking.openURL(`tel:${n.tel}`); }}
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 24, backgroundColor: i === 0 ? '#B0461F' : c.card, opacity: pressed ? 0.85 : 1 })}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: i === 0 ? 'rgba(255,255,255,0.2)' : c.helpBg, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="phone" color={i === 0 ? '#FFFFFF' : c.help} />
            </View>
            <View style={{ flex: 1 }}>
              <T size={22} weight="bold" color={i === 0 ? '#FFFFFF' : c.ink}>{n.affiche}</T>
              <T weight="semibold" color={i === 0 ? '#FFFFFF' : c.ink}>{n.nom}</T>
              <T size={13.5} color={i === 0 ? '#FFF1E8' : c.muted}>{n.detail}</T>
            </View>
          </Pressable>
        ))}

        <T size={19} weight="title" style={{ marginTop: 10 }}>Pour te poser, là, maintenant</T>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Outil icone="wind" titre="Respirer" actif={outil === 'respiration'} onPress={() => setOutil(outil === 'respiration' ? null : 'respiration')} />
          <Outil icone="eye" titre="Ancrage 5-4-3-2-1" actif={outil === 'ancrage'} onPress={() => setOutil(outil === 'ancrage' ? null : 'ancrage')} />
        </View>
        {outil === 'respiration' && <Respiration />}
        {outil === 'ancrage' && (
          <Carte couleur={c.soft}>
            {['5 choses que tu vois', '4 choses que tu peux toucher', '3 sons que tu entends', '2 odeurs autour de toi', '1 chose que tu aimes chez toi'].map((e) => <T key={e} size={16.5}>• {e}</T>)}
          </Carte>
        )}

        <Carte style={{ marginTop: 8 }}>
          <T size={14} color={c.muted}>En cas de danger immédiat, appelle le 15 ou le 112. Aurore ne remplace pas un suivi médical ou psychologique.</T>
        </Carte>
        <Bouton variante="doux" titre="Revenir à Aurore" onPress={() => router.back()} />
      </ScrollView>
    </View>
  );
}

function Outil({ icone, titre, actif, onPress }: { icone: IconName; titre: string; actif: boolean; onPress: () => void }) {
  const c = useC();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: actif }} onPress={() => { tap(); onPress(); }}
      style={{ flex: 1, padding: 16, gap: 8, borderRadius: 22, borderWidth: 2, borderColor: actif ? c.gold : 'transparent', backgroundColor: c.card, alignItems: 'center' }}>
      <Icon name={icone} size={26} color={c.link} />
      <T weight="semibold" center>{titre}</T>
    </Pressable>
  );
}

function Respiration() {
  const c = useC();
  const s = useSharedValue(0.8);
  const [phase, setPhase] = useState('Inspire…');
  useEffect(() => {
    s.value = withRepeat(withSequence(withTiming(1.3, { duration: 4000, easing: Easing.inOut(Easing.sin) }), withTiming(0.8, { duration: 4000, easing: Easing.inOut(Easing.sin) })), -1);
    const t = setInterval(() => setPhase((p) => (p === 'Inspire…' ? 'Expire…' : 'Inspire…')), 4000);
    return () => clearInterval(t);
  }, [s]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Carte couleur={c.soft} style={{ alignItems: 'center', paddingVertical: 40 }}>
      <Animated.View style={[{ width: 120, height: 120, borderRadius: 60, backgroundColor: c.sun, alignItems: 'center', justifyContent: 'center' }, style]} />
      <T size={20} weight="title" style={{ marginTop: 26 }}>{phase}</T>
    </Carte>
  );
}
