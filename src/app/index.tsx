import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, withDelay } from 'react-native-reanimated';
import Svg, { Circle, G, Line, Rect } from 'react-native-svg';
import { useApp } from '@/store';
import { T } from '@/ui';

// Écran de chargement du site : soleil blanc qui se lève derrière la barre, sur fond jaune.
// Le soleil est coupé au niveau de la barre : il ne passe jamais dessous.
const W = 180, H = (W * 500) / 838, COUPE = ((525 - 110) / 500) * H, U = H / 500;

export default function Ouverture() {
  const { nuit, connecte, profil } = useApp();
  const y = useSharedValue(260 * U);
  const o = useSharedValue(1);
  useEffect(() => {
    y.value = withRepeat(withSequence(withTiming(0, { duration: 1500, easing: Easing.bezier(0.22, 0.8, 0.3, 1) }), withDelay(520, withTiming(46 * U, { duration: 360 })), withTiming(260 * U, { duration: 1 })), -1);
    o.value = withRepeat(withSequence(withDelay(2020, withTiming(0, { duration: 360 })), withTiming(1, { duration: 1 })), -1);
    const t = setTimeout(() => router.replace(!connecte ? '/connexion' : profil ? (`/${profil}` as const) : '/bienvenue'), 2300);
    return () => clearTimeout(t);
  }, [y, o, connecte, profil]);
  const soleil = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }], opacity: o.value }));
  const couleur = nuit ? '#F8DE7E' : '#FFFFFF';

  return (
    <View accessibilityRole="progressbar" accessibilityLabel="Chargement d'Aurore" style={{ flex: 1, backgroundColor: nuit ? '#17162A' : '#F8DE7E', alignItems: 'center', justifyContent: 'center', gap: 28, overflow: 'hidden' }}>
      {/* Écran de chargement de la 1re beta : halo clair en bas, nom et phrase sous le soleil. */}
      <View style={{ position: 'absolute', left: -80, right: -80, bottom: -260, height: 520, borderRadius: 400, backgroundColor: nuit ? '#232240' : '#FBEFC2' }} />
      <View style={{ width: W, height: H }}>
        <View style={{ height: COUPE, overflow: 'hidden' }}>
          <Animated.View style={soleil}>
            <Svg width={W} height={H} viewBox="40 110 838 500">
              <Circle cx={448} cy={457} r={154} fill="none" stroke={couleur} strokeWidth={52} />
              <G stroke={couleur} strokeWidth={45} strokeLinecap="round">
                <Line x1={448} y1={160} x2={448} y2={225} /><Line x1={565} y1={256} x2={598} y2={200} /><Line x1={330} y1={256} x2={297} y2={200} />
                <Line x1={650} y1={340} x2={707} y2={308} /><Line x1={247} y1={340} x2={190} y2={308} />
                <Line x1={682} y1={458} x2={746} y2={458} /><Line x1={150} y1={458} x2={214} y2={458} />
              </G>
            </Svg>
          </Animated.View>
        </View>
        <Svg width={W} height={H} viewBox="40 110 838 500" style={{ position: 'absolute', top: 0 }}>
          <Rect x={71} y={525} width={782} height={61} rx={30.5} fill={couleur} />
        </Svg>
      </View>
      <Animated.View entering={FadeIn.duration(1000).delay(300)} style={{ alignItems: 'center', gap: 8 }}>
        <T size={46} weight="700" lh={54} color={nuit ? '#F1EFE6' : '#1E293B'}>Aurore</T>
        <T size={17} color={nuit ? '#B3B0C9' : '#475569'}>La vie qui revient, à ton rythme</T>
      </Animated.View>
      <View style={{ position: 'absolute', bottom: 64, flexDirection: 'row', gap: 8 }}>
        {[1, 0.45, 0.2].map((o) => <View key={o} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: nuit ? '#B3B0C9' : '#5C4636', opacity: o }} />)}
      </View>
    </View>
  );
}
