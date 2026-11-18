import { BookOpen, ExternalLink, Film, Headphones, Heart, Quote, RefreshCw, Search, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { FlatList, Linking, Pressable, TextInput, View } from 'react-native';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useBottomTabBarHeight } from 'expo-router/js-tabs';
import type { Temoignage } from '@/contenu/temoignages';
import { useApp } from '@/store';
import { BoutonAide, T, tap } from '@/ui';

const FIN = 'Nous recherchons des témoignages à te proposer, reviens plus tard.';

function Fond() {
  return (
    <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} preserveAspectRatio="none">
      <Defs><LinearGradient id="g" x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#fbe8a0" /><Stop offset="0.5" stopColor="#f8de7f" /><Stop offset="1" stopColor="#f3d364" /></LinearGradient></Defs>
      <Rect width="100%" height="100%" fill="url(#g)" />
    </Svg>
  );
}

// Fil vertical plein écran du site : une carte par témoignage, double-tap ou ♥ pour garder.
export function Temoignages({ liste, proche }: { liste: Temoignage[]; proche?: boolean }) {
  const { estFavori, basculerFavori } = useApp();
  const insets = useSafeAreaInsets();
  const bas = useBottomTabBarHeight();
  const [hauteur, setHauteur] = useState(0);
  const [recherche, setRecherche] = useState('');
  const [requete, setRequete] = useState('');
  const [cherche, setCherche] = useState(false);
  const [eclat, setEclat] = useState<string | null>(null);
  const dernierTap = useRef<{ id: string; t: number } | null>(null);
  const items = liste.filter((x) => !requete || `${x.title} ${x.text}`.toLowerCase().includes(requete.toLowerCase()));
  const favori = (x: Temoignage) => ({ id: `temoignage-${x.id}`, type: 'Témoignage', texte: x.title, auteur: x.name, resume: x.text, lien: x.link });
  const toucher = (x: Temoignage) => {
    const now = Date.now();
    if (dernierTap.current?.id === x.id && now - dernierTap.current.t < 300) {
      if (!estFavori(`temoignage-${x.id}`)) basculerFavori(favori(x));
      tap(); setEclat(x.id); setTimeout(() => setEclat(null), 700);
    }
    dernierTap.current = { id: x.id, t: now };
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8de7f' }} onLayout={(e) => setHauteur(e.nativeEvent.layout.height)}>
      {hauteur > 0 && (items.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <T size={14} color="#475569" center style={{ marginBottom: 16 }}>{requete ? `Aucun témoignage pour « ${requete} ».` : "Aucun témoignage chargé pour l'instant."}</T>
          <Pressable onPress={() => { setRecherche(''); setRequete(''); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <RefreshCw size={15} color="#1E293B" /><T size={14} weight="600">Réessayer</T>
          </Pressable>
        </View>
      ) : (
        <FlatList data={[...items, null]} keyExtractor={(x) => x?.id ?? 'fin'} pagingEnabled showsVerticalScrollIndicator={false} decelerationRate="fast"
          getItemLayout={(_, i) => ({ length: hauteur, offset: hauteur * i, index: i })}
          renderItem={({ item: x }) => (
            <Pressable onPress={() => x && toucher(x)} style={{ height: hauteur, paddingHorizontal: 24, paddingTop: insets.top + 64, paddingBottom: bas + 32, justifyContent: 'center' }}>
              <Fond />
              {!x ? <T size={16} weight="500" lh={32} color="#334155" center>{FIN}</T> : (
                <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                  {x.name && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center' }}><T size={14} weight="600">{x.name.charAt(0).toUpperCase()}</T></View>
                      <T size={14} weight="600">{x.name}</T>
                    </View>
                  )}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.1)', marginBottom: 16 }}>
                    {x.type === 'podcast' ? <Headphones size={13} color="#334155" /> : x.type === 'video' ? <Film size={13} color="#334155" /> : <BookOpen size={13} color="#334155" />}
                    <T size={11} weight="700" upper color="#334155" style={{ letterSpacing: 2 }}>{x.type === 'podcast' ? 'Podcast' : x.type === 'video' ? 'Vidéo' : 'Texte'}</T>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 12, alignSelf: 'stretch' }}>
                    {!proche && <Quote size={17} color="#B45309" style={{ marginTop: 6 }} />}
                    <T size={24} weight="700" lh={32} style={{ flex: 1 }}>{x.title}</T>
                  </View>
                  <T size={15} lh={28} color="#334155" style={{ alignSelf: 'stretch' }}>{x.text}</T>
                  <T size={12} upper color="#64748B" center style={{ marginTop: 12, letterSpacing: 1.8 }}>Résumé · {x.source}</T>
                  <Pressable onPress={() => Linking.openURL(x.link)} style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.1)' }}>
                    <ExternalLink size={13} color="#1E293B" /><T size={12} weight="600">{x.type === 'podcast' ? 'Écouter le podcast' : 'Lire le témoignage complet'}</T>
                  </Pressable>
                </View>
              )}
              {x && eclat === x.id && (
                <Animated.View entering={ZoomIn.duration(250)} exiting={FadeOut.duration(400)} pointerEvents="none" style={{ position: 'absolute', alignSelf: 'center', top: '42%' }}>
                  <Heart size={110} color="rgba(225,29,72,0.9)" fill="rgba(225,29,72,0.9)" />
                </Animated.View>
              )}
              {x && (
                <Pressable accessibilityRole="button" accessibilityLabel="Aimer" onPress={() => { tap(); basculerFavori(favori(x)); }}
                  style={{ position: 'absolute', right: 20, bottom: bas + 40, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: estFavori(`temoignage-${x.id}`) ? '#E11D48' : 'rgba(0,0,0,0.1)' }}>
                  <Heart size={24} color={estFavori(`temoignage-${x.id}`) ? '#FFFFFF' : '#334155'} fill={estFavori(`temoignage-${x.id}`) ? '#FFFFFF' : 'none'} />
                </Pressable>
              )}
            </Pressable>
          )} />
      ))}

      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: insets.top + 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {cherche ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ position: 'absolute', left: 14, zIndex: 1 }}><Search size={16} color="#64748B" /></View>
            <TextInput autoFocus value={recherche} onChangeText={setRecherche} onSubmitEditing={() => setRequete(recherche.trim())} returnKeyType="search"
              placeholder="Recherche : passion, métier, relations…" placeholderTextColor="#64748B" accessibilityLabel="Rechercher un témoignage"
              style={{ height: 42, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.6)', paddingLeft: 40, paddingRight: 40, fontSize: 14, color: '#1E293B' }} />
            <Pressable accessibilityLabel="Fermer la recherche" onPress={() => { setCherche(false); setRecherche(''); setRequete(''); }} style={{ position: 'absolute', right: 12 }}><X size={16} color="#64748B" /></Pressable>
          </View>
        ) : (
          <>
            <Pressable accessibilityRole="button" accessibilityLabel="Rechercher" onPress={() => { tap(); setCherche(true); }} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={17} color="#334155" />
            </Pressable>
            <View style={{ flex: 1 }} />
            <BoutonAide />
          </>
        )}
      </View>
    </View>
  );
}
