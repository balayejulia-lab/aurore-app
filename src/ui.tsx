import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import {
  Platform, Pressable, ScrollView, Text, TextInput, View,
  type StyleProp, type TextInputProps, type TextStyle, type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, ClipPath, Defs, G, Line, Path, Rect } from 'react-native-svg';
import { useApp, useC, type Favori } from './store';
import { font } from './theme';

/* ---------- Icônes (traits fins, style Feather) ---------- */
const ICONS: Record<string, string[]> = {
  home: ['M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z'],
  star: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  book: ['M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z', 'M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z'],
  sparkle: ['M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z', 'M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z'],
  pen: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'],
  heart: ['M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'],
  gift: ['M5 8h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z', 'M12 8v13M3 12h18M12 8c-2-4-6-4-6-1s6 1 6 1zm0 0c2-4 6-4 6-1s-6 1-6 1z'],
  sliders: ['M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6'],
  aide: ['M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18z', 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7z'],
  plus: ['M12 5v14M5 12h14'],
  x: ['M18 6 6 18M6 6l12 12'],
  right: ['M9 18l6-6-6-6'],
  left: ['M15 18l-6-6 6-6'],
  up: ['M12 19V5M5 12l7-7 7 7'],
  check: ['M20 6 9 17l-5-5'],
  mail: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M22 6l-10 7L2 6'],
  image: ['M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M8.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3z', 'M21 15l-5-5L5 21'],
  phone: ['M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z'],
  wind: ['M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2'],
  eye: ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6z'],
  link: ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
  user: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z'],
  moon: ['M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'],
  type: ['M4 7V4h16v3M9 20h6M12 4v16'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  out: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9'],
  smile: ['M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z', 'M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01'],
  send: ['M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z'],
  chat: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
};
export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 22, color, width = 1.8, fill }: { name: IconName; size?: number; color?: string; width?: number; fill?: string }) {
  const c = useC();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill ?? 'none'} stroke={color ?? c.ink} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name].map((d) => <Path key={d} d={d} />)}
    </Svg>
  );
}

/* ---------- Logo ---------- */
const RAYONS_ENTIERS: [number, number, number, number][] = [
  [680, 457, 745, 457], [649, 341, 705, 308.5], [564, 256, 596.5, 200], [448, 225, 448, 160],
  [332, 256, 299.5, 200], [247, 341, 191, 308.5], [216, 457, 151, 457], [247, 573, 191, 605.5],
  [332, 658, 299.5, 714], [448, 689, 448, 754], [564, 658, 596.5, 714], [649, 573, 705, 605.5],
];
/** Soleil entier : logo par défaut (icône, connexion, réglages…). */
export function SoleilEntier({ size = 96, color = '#E9B93A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="128 137 640 640" accessibilityLabel="Logo Aurore, un soleil">
      <Circle cx={448} cy={457} r={154} fill="none" stroke={color} strokeWidth={52} />
      <G stroke={color} strokeWidth={45} strokeLinecap="round">
        {RAYONS_ENTIERS.map(([a, b, x, y]) => <Line key={`${a}-${b}`} x1={a} y1={b} x2={x} y2={y} />)}
      </G>
    </Svg>
  );
}

/** Soleil levant avec la barre : uniquement pour les chargements. Le cercle est coupé au-dessus de la barre. */
export function SoleilLevant({ width = 150, color = '#FFFFFF' }: { width?: number; color?: string }) {
  return (
    <Svg width={width} height={width * 0.6} viewBox="40 110 838 500" accessibilityLabel="Logo Aurore, un soleil qui se lève">
      <Defs><ClipPath id="audessus"><Rect x={0} y={0} width={918} height={525} /></ClipPath></Defs>
      <Circle cx={448} cy={457} r={154} fill="none" stroke={color} strokeWidth={52} clipPath="url(#audessus)" />
      <G stroke={color} strokeWidth={45} strokeLinecap="round">
        <Line x1={448} y1={160} x2={448} y2={225} />
        <Line x1={565} y1={256} x2={598} y2={200} />
        <Line x1={330} y1={256} x2={297} y2={200} />
        <Line x1={650} y1={340} x2={707} y2={308} />
        <Line x1={247} y1={340} x2={190} y2={308} />
        <Line x1={682} y1={458} x2={746} y2={458} />
        <Line x1={150} y1={458} x2={214} y2={458} />
      </G>
      <Rect x={71} y={525} width={782} height={61} rx={30.5} fill={color} />
    </Svg>
  );
}

/* ---------- Texte (respecte la taille choisie dans les réglages) ---------- */
type TProps = { children: ReactNode; onPress?: () => void; size?: number; weight?: keyof typeof font; color?: string; style?: StyleProp<TextStyle>; center?: boolean; lines?: number };
export function T({ children, onPress, size = 16, weight = 'regular', color, style, center, lines }: TProps) {
  const { c, taille } = useApp();
  return (
    <Text
      onPress={onPress}
      suppressHighlighting
      accessibilityRole={onPress ? 'link' : undefined}
      numberOfLines={lines}
      style={[{ fontFamily: font[weight], fontSize: size * taille, lineHeight: size * taille * (weight === 'title' ? 1.2 : 1.45), color: color ?? c.ink, textAlign: center ? 'center' : undefined }, style]}>
      {children}
    </Text>
  );
}
export const Titre = (p: Omit<TProps, 'weight'>) => <T size={26} weight="title" {...p} />;

/* ---------- Surfaces & boutons ---------- */
export function Carte({ children, style, couleur, onPress, label }: { children: ReactNode; style?: StyleProp<ViewStyle>; couleur?: string; onPress?: () => void; label?: string }) {
  const c = useC();
  const base: ViewStyle = { backgroundColor: couleur ?? c.card, borderRadius: 24, padding: 18, gap: 10, shadowColor: c.shadow, shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 2 };
  if (!onPress) return <View style={[base, style]}>{children}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={() => { tap(); onPress(); }} style={({ pressed }) => [base, style, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}>
      {children}
    </Pressable>
  );
}

export const tap = () => { if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {}); };

type BoutonProps = { titre: string; onPress: () => void; variante?: 'principal' | 'doux' | 'contour' | 'noir'; icone?: IconName; logo?: ReactNode; disabled?: boolean; style?: StyleProp<ViewStyle> };
export function Bouton({ titre, onPress, variante = 'principal', icone, logo, disabled, style }: BoutonProps) {
  const c = useC();
  const fonds = { principal: c.gold, doux: c.soft, contour: c.card, noir: '#000000' };
  const texte = variante === 'noir' ? '#FFFFFF' : variante === 'principal' ? '#3B2A20' : c.ink;
  return (
    <Pressable
      accessibilityRole="button" disabled={disabled}
      onPress={() => { tap(); onPress(); }}
      style={({ pressed }) => [{
        minHeight: 54, borderRadius: 27, paddingHorizontal: 22, backgroundColor: fonds[variante],
        borderWidth: variante === 'contour' ? 1.5 : 0, borderColor: c.line,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        opacity: disabled ? 0.45 : pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }],
      }, style]}>
      {logo}
      {icone && <Icon name={icone} size={20} color={texte} />}
      <T size={17} weight="semibold" color={texte}>{titre}</T>
    </Pressable>
  );
}

export function Puce({ titre, actif, onPress }: { titre: string; actif?: boolean; onPress: () => void }) {
  const c = useC();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: actif }} onPress={() => { tap(); onPress(); }}
      style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 22, borderWidth: 1.5, borderColor: actif ? c.ink : c.line, backgroundColor: actif ? c.soft : c.card }}>
      <T size={14.5} weight="semibold">{titre}</T>
    </Pressable>
  );
}

export function RondBouton({ icone, label, onPress, fond, couleur, size = 44 }: { icone: IconName; label: string; onPress: () => void; fond?: string; couleur?: string; size?: number }) {
  const c = useC();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} hitSlop={6} onPress={() => { tap(); onPress(); }}
      style={({ pressed }) => ({ width: size, height: size, borderRadius: size / 2, backgroundColor: fond ?? c.card, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.7 : 1 })}>
      <Icon name={icone} size={size * 0.46} color={couleur ?? c.ink} />
    </Pressable>
  );
}

export function Champ(props: TextInputProps & { label: string }) {
  const { c, taille } = useApp();
  return (
    <View style={{ gap: 6 }}>
      <T size={14} weight="semibold" color={c.muted}>{props.label}</T>
      <TextInput
        placeholderTextColor={c.muted}
        accessibilityLabel={props.label}
        {...props}
        style={[{ minHeight: props.multiline ? 110 : 52, borderRadius: 20, borderWidth: 1.5, borderColor: c.line, backgroundColor: c.card, paddingHorizontal: 16, paddingVertical: 14, fontFamily: font.regular, fontSize: 16 * taille, color: c.ink, textAlignVertical: 'top' }, props.style]}
      />
    </View>
  );
}

/* ---------- Favori ---------- */
export function CoeurFavori({ favori }: { favori: Favori }) {
  const { c, estFavori, basculerFavori } = useApp();
  const on = estFavori(favori.id);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={on ? 'Retirer des favoris' : 'Ajouter aux favoris'} hitSlop={10}
      onPress={() => { tap(); basculerFavori(favori); }} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="heart" size={22} color={on ? '#C2563A' : c.muted} fill={on ? '#E27B5C' : 'none'} />
    </Pressable>
  );
}

/* ---------- Écran avec en-tête : Aide toujours visible ---------- */
export function Ecran({ titre, sousTitre, children, retour, scroll = true }: { titre: string; sousTitre?: string; children: ReactNode; retour?: boolean; scroll?: boolean }) {
  const c = useC();
  const insets = useSafeAreaInsets();
  const corps = scroll
    ? <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 18 }} keyboardShouldPersistTaps="handled">{children}</ScrollView>
    : <View style={{ flex: 1 }}>{children}</View>;
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ paddingTop: insets.top + 6, paddingHorizontal: 20, paddingBottom: 6, gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {retour && <RondBouton icone="left" label="Retour" onPress={() => router.back()} />}
          <View style={{ flex: 1 }} />
          <BoutonAide />
          {!retour && <RondBouton icone="heart" label="Mes favoris" onPress={() => router.push('/favoris')} />}
          {!retour && <RondBouton icone="sliders" label="Réglages" onPress={() => router.push('/reglages')} />}
        </View>
        <View>
          <Titre size={30}>{titre}</Titre>
          {sousTitre && <T size={15} color={c.muted}>{sousTitre}</T>}
        </View>
      </View>
      {corps}
    </View>
  );
}

export function BoutonAide() {
  const c = useC();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Besoin d'aide maintenant" onPress={() => { tap(); router.push('/aide'); }}
      style={({ pressed }) => ({ height: 44, paddingHorizontal: 14, borderRadius: 22, backgroundColor: c.helpBg, flexDirection: 'row', alignItems: 'center', gap: 6, opacity: pressed ? 0.8 : 1 })}>
      <Icon name="aide" size={17} color={c.help} width={2.2} />
      <T size={14.5} weight="bold" color={c.help}>Aide</T>
    </Pressable>
  );
}

export function RappelMedical() {
  const c = useC();
  return (
    <T size={12.5} color={c.muted} center style={{ paddingHorizontal: 16 }}>
      Aurore t'accompagne vers l'avenir et ne remplace pas un suivi médical ou psychologique.
    </T>
  );
}

/* ---------- Photos apaisantes (ajoutées par la personne, comme sur le site) ---------- */
export function PhotosApaisantes({ bas }: { bas?: ReactNode }) {
  const { c, photos, ajouterPhoto } = useApp();
  const [index, setIndex] = useState(0);
  const [largeur, setLargeur] = useState(0);
  const ajouter = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, allowsEditing: true, aspect: [4, 3] });
    if (!r.canceled && r.assets[0]) { ajouterPhoto(r.assets[0].uri); setIndex(photos.length); }
  };
  return (
    <View onLayout={(e) => setLargeur(e.nativeEvent.layout.width)} style={{ height: 260, borderRadius: 28, overflow: 'hidden', backgroundColor: c.peach }}>
      {photos.length === 0 ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Ajouter ta première photo apaisante" onPress={ajouter}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 30, backgroundColor: c.soft }}>
          <Icon name="image" size={34} color={c.muted} width={1.5} />
          <T weight="semibold" color={c.muted} center>Ajoute une photo qui t'apaise</T>
          <T size={13.5} color={c.muted} center>Un paysage, un souvenir, ton animal, un lieu que tu aimes…</T>
        </Pressable>
      ) : (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => largeur && setIndex(Math.round(e.nativeEvent.contentOffset.x / largeur))}>
          {photos.map((uri) => <Image key={uri} source={{ uri }} style={{ width: largeur, height: 260 }} contentFit="cover" accessibilityLabel="Une de tes photos apaisantes" />)}
        </ScrollView>
      )}
      <View pointerEvents="box-none" style={{ position: 'absolute', top: 14, left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 18, backgroundColor: c.glass }}>
          <T size={14} weight="semibold">Mes photos apaisantes</T>
        </View>
        <RondBouton icone="plus" label="Ajouter une photo" onPress={ajouter} fond={c.glass} />
      </View>
      <View pointerEvents="none" style={{ position: 'absolute', bottom: 14, left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {bas ?? <View />}
        {photos.length > 1 && (
          <View style={{ flexDirection: 'row', gap: 5, padding: 8, borderRadius: 14, backgroundColor: c.glass }}>
            {photos.map((u, i) => <View key={u} style={{ width: i === index ? 16 : 6, height: 6, borderRadius: 3, backgroundColor: i === index ? c.ink : c.muted, opacity: i === index ? 1 : 0.5 }} />)}
          </View>
        )}
      </View>
    </View>
  );
}

export function Pastille({ children }: { children: ReactNode }) {
  const c = useC();
  return (
    <View style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 18, backgroundColor: c.glass }}>
      <T size={14} weight="semibold">{children}</T>
    </View>
  );
}

export function Section({ titre, children, action }: { titre: string; children: ReactNode; action?: ReactNode }) {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <T size={19} weight="title">{titre}</T>
        {action}
      </View>
      {children}
    </View>
  );
}
