import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { SoleilLevant, T } from '@/ui';

// Écran de chargement : c'est le seul endroit où le soleil se lève derrière la barre.
function Point({ delai }: { delai: number }) {
  const o = useSharedValue(0.25);
  useEffect(() => { o.value = withDelay(delai, withRepeat(withSequence(withTiming(1, { duration: 500 }), withTiming(0.25, { duration: 500 })), -1)); }, [delai, o]);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#5C4636' }, style]} />;
}

export default function Ouverture() {
  const montee = useSharedValue(30);
  useEffect(() => {
    montee.value = withTiming(0, { duration: 1400, easing: Easing.out(Easing.cubic) });
    const t = setTimeout(() => router.replace('/connexion'), 2200);
    return () => clearTimeout(t);
  }, [montee]);
  const soleil = useAnimatedStyle(() => ({ transform: [{ translateY: montee.value }] }));

  return (
    <View style={{ flex: 1, backgroundColor: '#F8DE7E', alignItems: 'center', justifyContent: 'center', gap: 28, overflow: 'hidden' }}>
      <View style={{ position: 'absolute', left: -80, right: -80, bottom: -260, height: 520, borderRadius: 400, backgroundColor: '#FBEFC2' }} />
      <Animated.View style={soleil}><SoleilLevant width={150} /></Animated.View>
      <Animated.View entering={FadeIn.duration(1200).delay(400)} style={{ alignItems: 'center', gap: 8 }}>
        <T size={46} weight="title" color="#3B2A20" style={{ lineHeight: 56 }}>Aurore</T>
        <T size={17} color="#5C4636">La vie qui revient, à ton rythme</T>
      </Animated.View>
      <View accessibilityLabel="Chargement" style={{ position: 'absolute', bottom: 64, flexDirection: 'row', gap: 8 }}>
        <Point delai={0} /><Point delai={180} /><Point delai={360} />
      </View>
    </View>
  );
}
