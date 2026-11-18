import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, Heart, Images, LifeBuoy, MoreHorizontal, Moon, Plus, Settings, Sun, SunMoon, type LucideIcon } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import {
  ActionSheetIOS, Alert, Modal, Platform, Pressable, ScrollView, Text, TextInput, View,
  type StyleProp, type TextInputProps, type TextStyle, type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, ClipPath, Defs, G, Line, Path, Rect } from 'react-native-svg';
import { fr } from './contenu/textes';
import { useApp, useC, type Favori } from './store';

/* ---------- Textes du site (mêmes clés que l'ancienne version) ---------- */
export function t(cle: string, vars?: Record<string, string | number>): string {
  const v = cle.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], fr);
  if (typeof v !== 'string') return cle;
  return vars ? v.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? '')) : v;
}

export const tap = () => { if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {}); };

/* ---------- Typo : police système de l'iPhone, comme le site ---------- */
type Poids = '400' | '500' | '600' | '700' | '800';
type TProps = { children: ReactNode; size?: number; weight?: Poids; color?: string; style?: StyleProp<TextStyle>; center?: boolean; lh?: number; lines?: number; onPress?: () => void; upper?: boolean };
export function T({ children, size = 16, weight = '500', color, style, center, lh, lines, onPress, upper }: TProps) {
  const c = useC();
  return (
    <Text numberOfLines={lines} onPress={onPress} suppressHighlighting
      style={[{ fontSize: size, fontWeight: weight, lineHeight: lh ?? Math.round(size * 1.5), color: color ?? c.ink, textAlign: center ? 'center' : undefined, textTransform: upper ? 'uppercase' : undefined }, style]}>
      {children}
    </Text>
  );
}
export const H = (p: Omit<TProps, 'weight'>) => <T weight="700" lh={Math.round((p.size ?? 20) * 1.25)} {...p} size={p.size ?? 20} />;

export function Sourcil({ children, color }: { children: ReactNode; color?: string }) {
  const c = useC();
  return <T size={11} weight="800" upper lh={13} color={color ?? c.accent} style={{ letterSpacing: 1.3, marginBottom: 2 }}>{children}</T>;
}

/* ---------- Surfaces ---------- */
export function Carte({ children, style, onPress, label }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; label?: string }) {
  const c = useC();
  // Cartes douces de la 1re beta : plus arrondies, sans bordure, ombre légère.
  const base: ViewStyle = { backgroundColor: c.surface, borderRadius: 24, padding: 22, shadowColor: c.shadow, shadowOpacity: 0.07, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } };
  if (!onPress) return <View style={[base, style]}>{children}</View>;
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={() => { tap(); onPress(); }} style={({ pressed }) => [base, style, pressed && { transform: [{ scale: 0.98 }] }]}>{children}</Pressable>;
}

export function Bulle({ Icone, fond, couleur, taille = 40, rayon = 12, iconTaille = 19 }: { Icone: LucideIcon; fond?: string; couleur?: string; taille?: number; rayon?: number; iconTaille?: number }) {
  const c = useC();
  return (
    <View style={{ width: taille, height: taille, borderRadius: rayon, backgroundColor: fond ?? c.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
      <Icone size={iconTaille} color={couleur ?? c.accent} strokeWidth={2} />
    </View>
  );
}

/* ---------- Boutons ---------- */
export function BoutonPlein({ titre, onPress, disabled, style, Icone, fond, couleur }: { titre: string; onPress: () => void; disabled?: boolean; style?: StyleProp<ViewStyle>; Icone?: LucideIcon; fond?: string; couleur?: string }) {
  const c = useC();
  const texte = couleur ?? (c.dark === '#1E293B' ? '#FFFFFF' : '#17162A');
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={() => { tap(); onPress(); }}
      style={({ pressed }) => [{ minHeight: 48, paddingHorizontal: 32, borderRadius: 999, backgroundColor: fond ?? c.dark, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: disabled ? 0.5 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }, style]}>
      {Icone && <Icone size={16} color={texte} />}
      <T size={14} weight="600" color={texte}>{titre}</T>
    </Pressable>
  );
}

/** Pastille « Ouvrir / Replier » des cartes de l'accueil. */
export function Pastille({ titre, onPress, fond, couleur }: { titre: string; onPress: () => void; fond?: string; couleur?: string }) {
  const c = useC();
  return (
    <Pressable accessibilityRole="button" hitSlop={8} onPress={() => { tap(); onPress(); }}
      style={({ pressed }) => ({ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: fond ?? c.accentSoft, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
      <T size={12} weight="700" color={couleur ?? c.accent} lh={16}>{titre}</T>
    </Pressable>
  );
}

export function Puce({ titre, actif, onPress, fond, couleur, Icone, fondActif }: { titre: string; actif?: boolean; onPress: () => void; fond?: string; couleur?: string; Icone?: LucideIcon; fondActif?: string }) {
  const c = useC();
  const col = actif ? '#FFFFFF' : couleur ?? c.soft;
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: actif }} onPress={() => { tap(); onPress(); }}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: actif ? fondActif ?? c.dark : fond ?? c.stone100, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
      {Icone && <Icone size={14} color={col} />}
      <T size={13} weight="600" color={col} lh={18}>{titre}</T>
    </Pressable>
  );
}

export function RondIcone({ Icone, label, onPress, couleur, fond, taille = 40 }: { Icone: LucideIcon; label: string; onPress: () => void; couleur?: string; fond?: string; taille?: number }) {
  const c = useC();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} hitSlop={6} onPress={() => { tap(); onPress(); }}
      style={({ pressed }) => ({ width: taille, height: taille, borderRadius: taille / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: pressed ? c.surface : fond ?? 'transparent' })}>
      <Icone size={18} color={couleur ?? c.muted} />
    </Pressable>
  );
}

export function Champ(props: TextInputProps & { label?: string; fond?: string }) {
  const c = useC();
  return (
    <View style={{ gap: 6 }}>
      {props.label && <T size={14} weight="600" color={c.text}>{props.label}</T>}
      <TextInput placeholderTextColor={c.faint} accessibilityLabel={props.label ?? props.placeholder} {...props}
        style={[{ minHeight: props.multiline ? 96 : 46, borderRadius: 12, borderWidth: 1, borderColor: c.ring, backgroundColor: props.fond ?? c.surface, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: c.ink, textAlignVertical: 'top' }, props.style]} />
    </View>
  );
}

/** Confirmation avant suppression : jamais immédiate, comme sur le site. */
export function confirmer(titre: string, message: string, garder: string, onOk: () => void) {
  Alert.alert(titre, message, [{ text: garder, style: 'cancel' }, { text: t('common.delete'), style: 'destructive', onPress: onOk }]);
}

/* ---------- Logo ---------- */
const RAYONS: [number, number, number, number][] = [
  [680, 457, 745, 457], [649, 341, 705, 308.5], [564, 256, 596.5, 200], [448, 225, 448, 160],
  [332, 256, 299.5, 200], [247, 341, 191, 308.5], [216, 457, 151, 457], [247, 573, 191, 605.5],
  [332, 658, 299.5, 714], [448, 689, 448, 754], [564, 658, 596.5, 714], [649, 573, 705, 605.5],
];
export function SoleilEntier({ size = 96, color = '#E9B93A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="128 137 640 640" accessibilityLabel="Logo Aurore, un soleil">
      <Circle cx={448} cy={457} r={154} fill="none" stroke={color} strokeWidth={52} />
      <G stroke={color} strokeWidth={45} strokeLinecap="round">{RAYONS.map(([a, b, x, y]) => <Line key={`${a}-${b}`} x1={a} y1={b} x2={x} y2={y} />)}</G>
    </Svg>
  );
}
/** Soleil levant : uniquement pour les chargements. Le cercle ne passe jamais sous la barre. */
export function SoleilLevant({ width = 150, color = '#FFFFFF' }: { width?: number; color?: string }) {
  return (
    <Svg width={width} height={width * 0.6} viewBox="40 110 838 500" accessibilityLabel="Logo Aurore, un soleil qui se lève">
      <Defs><ClipPath id="audessus"><Rect x={0} y={0} width={918} height={525} /></ClipPath></Defs>
      <Circle cx={448} cy={457} r={154} fill="none" stroke={color} strokeWidth={52} clipPath="url(#audessus)" />
      <G stroke={color} strokeWidth={45} strokeLinecap="round">
        <Line x1={448} y1={160} x2={448} y2={225} /><Line x1={565} y1={256} x2={598} y2={200} /><Line x1={330} y1={256} x2={297} y2={200} />
        <Line x1={650} y1={340} x2={707} y2={308} /><Line x1={247} y1={340} x2={190} y2={308} /><Line x1={682} y1={458} x2={746} y2={458} />
        <Line x1={150} y1={458} x2={214} y2={458} />
      </G>
      <Rect x={71} y={525} width={782} height={61} rx={30.5} fill={color} />
    </Svg>
  );
}

/* ---------- Illustrations des états vides (copie du site) ---------- */
export function Illustration({ icone }: { icone: 'sunrise' | 'sprout' | 'photoFrame' | 'envelope' | 'heart' }) {
  const { c, nuit } = useApp();
  const S = c.sunStrong, D = nuit ? 'rgba(241,239,230,0.7)' : 'rgba(44,42,74,0.7)';
  const p = { strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const dessins = {
    sunrise: <><Path d="M26 64 Q60 44 94 64" stroke={D} {...p} /><Path d="M44 64a16 16 0 0 1 32 0" stroke={S} {...p} /><G stroke={S} strokeWidth={2} strokeLinecap="round"><Line x1={60} y1={30} x2={60} y2={38} /><Line x1={38} y1={40} x2={43} y2={45} /><Line x1={82} y1={40} x2={77} y2={45} /></G></>,
    sprout: <><Path d="M60 72V46" stroke={S} {...p} /><Path d="M60 50c0-10-9-15-18-14 1 9 8 16 18 14Z" stroke={S} {...p} /><Path d="M60 58c0-8 8-12 16-11-1 8-7 14-16 11Z" stroke={S} {...p} /><Path d="M44 72h32" stroke={D} {...p} /></>,
    photoFrame: <><Rect x={35} y={30} width={50} height={40} rx={6} stroke={D} {...p} /><Circle cx={52} cy={46} r={6} stroke={S} {...p} /><G stroke={S} strokeWidth={2} strokeLinecap="round"><Line x1={52} y1={34} x2={52} y2={36.5} /><Line x1={43} y1={46} x2={45.5} y2={46} /><Line x1={58.5} y1={46} x2={61} y2={46} /><Line x1={45.7} y1={39.3} x2={47.5} y2={41} /><Line x1={56.5} y1={51} x2={58.3} y2={52.7} /></G><Path d="M40 62l9-9 7 6 10-11 10 14" stroke={D} {...p} /></>,
    envelope: <><Rect x={32} y={34} width={56} height={38} rx={5} stroke={D} {...p} /><Path d="M33 37l27 20 27-20" stroke={D} {...p} /><Path d="M60 54c-5-6-14-2-13 5 1 5 7 8 13 12 6-4 12-7 13-12 1-7-8-11-13-5Z" stroke={S} {...p} /></>,
    heart: <Path d="M60 68c-9-7-24-16-24-29 0-9 8-14 15-10 4 2 7 6 9 10 2-4 5-8 9-10 7-4 15 1 15 10 0 13-15 22-24 29Z" stroke={S} {...p} />,
  };
  return <Svg width={120} height={96} viewBox="0 0 120 96"><Circle cx={60} cy={48} r={44} fill={c.sun} opacity={0.4} />{dessins[icone]}</Svg>;
}

export function EtatVide({ icone = 'heart', titre, message, action }: { icone?: Parameters<typeof Illustration>[0]['icone']; titre?: string; message?: string; action?: { label: string; onPress: () => void } }) {
  const c = useC();
  return (
    <View style={{ alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingVertical: 32 }}>
      <Illustration icone={icone} />
      {titre && <H size={18} center>{titre}</H>}
      {message && <T size={14} color={c.muted} center style={{ maxWidth: 300 }}>{message}</T>}
      {action && <BoutonPlein titre={action.label} onPress={action.onPress} fond={c.accent} couleur="#FFFFFF" style={{ minHeight: 44, paddingHorizontal: 20 }} />}
    </View>
  );
}

/* ---------- Favori (« Garder ») ---------- */
export function BoutonGarder({ favori, libelle = t('common.keep') }: { favori: Favori; libelle?: string }) {
  const { c, estFavori, basculerFavori } = useApp();
  const on = estFavori(favori.id);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={on ? t('common.removeFromFavorites') : t('common.addToFavorites')}
      onPress={() => { tap(); basculerFavori(favori); }}
      style={({ pressed }) => ({ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: on ? c.rose50 : c.stone100, transform: [{ scale: pressed ? 0.96 : 1 }] })}>
      <Heart size={14} color={on ? c.rose600 : c.soft} fill={on ? c.rose600 : 'none'} />
      <T size={12} weight="600" color={on ? c.rose600 : c.soft}>{on ? t('common.kept') : libelle}</T>
    </Pressable>
  );
}

/* ---------- En-têtes ---------- */
export function BoutonAide() {
  const c = useC();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Besoin d'aide maintenant" hitSlop={6} onPress={() => { tap(); router.push('/aide'); }}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 5, height: 36, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.coral, opacity: pressed ? 0.85 : 1 })}>
      <LifeBuoy size={15} color="#FFFFFF" />
      <T size={13} weight="700" color="#FFFFFF" lh={16}>Aide</T>
    </Pressable>
  );
}

/** En-tête de l'accueil : « Hey prénom », Aide, calendrier, réglages. */
export function EnTeteAccueil({ nom }: { nom?: string }) {
  const { profil } = useApp();
  return (
    <View style={{ paddingBottom: 20, gap: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
        <BoutonAide />
        {profil !== 'proche' && <RondIcone Icone={Calendar} label="Calendrier" onPress={() => router.push('/calendrier')} />}
        <RondIcone Icone={Settings} label={t('settings.title')} onPress={() => router.push('/reglages')} />
      </View>
      <H size={30} lines={1}>{nom ? t('nav.bonjour', { name: nom }) : t('nav.bonjourDefault')}</H>
    </View>
  );
}

/** Haut des pages d'onglet : le nom est déjà sous l'icône de la barre, on ne garde que le bouton Aide. */
export function EnTetePage({ aide = true }: { Icone?: LucideIcon; fond?: string; couleur?: string; sourcil?: string; sourcilCouleur?: string; titre?: string; sousTitre?: string; aide?: boolean }) {
  return <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16, minHeight: 36 }}>{aide && <BoutonAide />}</View>;
}

export function LienRetour({ libelle = 'Retour au profil' }: { libelle?: string }) {
  const c = useC();
  return (
    <Pressable accessibilityRole="button" onPress={() => { tap(); router.back(); }} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', marginBottom: 20 }}>
      <ArrowLeft size={16} color={c.muted} />
      <T size={14} color={c.muted}>{libelle}</T>
    </Pressable>
  );
}

/** Écran défilant avec le fond crème du site. */
export function Ecran({ children, scroll = true, padTop = 24 }: { children: ReactNode; scroll?: boolean; padTop?: number }) {
  const c = useC();
  const insets = useSafeAreaInsets();
  if (!scroll) return <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>{children}</View>;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingTop: insets.top + padTop, paddingHorizontal: 16, paddingBottom: 64 }}>
      {children}
    </ScrollView>
  );
}

export function Avertissement({ texte = t('home.medicalDisclaimer') }: { texte?: string }) {
  const c = useC();
  return <T size={12} lh={20} color={c.faint} center style={{ marginTop: 24, paddingHorizontal: 8 }}>{texte}</T>;
}

/* ---------- Carte d'accueil : phrase, soleil, couleur + photos apaisantes ---------- */
const COULEURS = ['#f0f0ee', '#c5b9b5', '#dccdbf', '#d9bba3', '#b99a80', '#b9bda3', '#f9d9ea', '#c8a2c8', '#b784a7', '#ff968a', '#f5968e', '#c58682', '#d5e6e6', '#c5d6e0', '#d0e0e6', '#89a9d0', '#d9f9b5', '#c5f9d5', '#a5d6a5', '#759da5', '#557d7d', '#f5f5c5', '#f5e6b5', '#f0d090', '#ffffff', '#fff965', '#fad000', '#ff7f00', '#ff91af', '#ff0000', '#c50000', '#9fe525', '#00b900', '#008900', '#004910', '#00c9f5', '#0079ff', '#0039ff', '#002985', '#790089', '#f5d9b0', '#653925', '#d5d5d5', '#859595', '#454945', '#000000', '#b5b5b5', '#b59535', '#eef4f0'];

export function CarteAccueil({ phrase, ouvrirCouleurs }: { phrase: string; ouvrirCouleurs: () => void }) {
  const { c, visites, fondHero, nuit } = useApp();
  const fond = nuit && fondHero === '#eef4f0' ? c.heroBg : fondHero;
  return (
    <View style={{ borderRadius: 28, backgroundColor: fond, shadowColor: c.shadow, shadowOpacity: 0.2, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16 }}>
        <T size={14} weight="600" lh={20} color={nuit ? c.ink : '#334155'} style={{ flex: 1 }}>{phrase}</T>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <View accessibilityLabel={`${visites} jours de présence`} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.8)' }}>
            <Text style={{ fontSize: 14 }}>☀️</Text><T size={12} weight="600" color="#475569" lh={16}>{visites}</T>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={t('home.personalize')} onPress={() => { tap(); ouvrirCouleurs(); }}
            style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.8)' }}>
            <PaletteIcone />
          </Pressable>
        </View>
      </View>
      <PhotosApaisantes fond={fond} />
    </View>
  );
}

function PaletteIcone() {
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={13.5} cy={6.5} r={0.5} fill="#475569" /><Circle cx={17.5} cy={10.5} r={0.5} fill="#475569" /><Circle cx={8.5} cy={7.5} r={0.5} fill="#475569" /><Circle cx={6.5} cy={12.5} r={0.5} fill="#475569" />
      <Path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </Svg>
  );
}

export function ChoixCouleurs({ fermer }: { fermer: () => void }) {
  const { c, fondHero, setFondHero } = useApp();
  return (
    <View style={{ gap: 12 }}>
      <H size={18}>{t('home.personalize')}</H>
      <T size={14} weight="600" color={c.soft}>{t('landscape.pickerColor')}</T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {COULEURS.map((col) => (
          <Pressable key={col} accessibilityLabel={`Couleur ${col}`} onPress={() => { tap(); setFondHero(col); fermer(); }}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: col, borderWidth: fondHero === col ? 2 : 1, borderColor: fondHero === col ? '#334155' : '#E7E5E4' }} />
        ))}
      </View>
    </View>
  );
}

function PhotosApaisantes({ fond }: { fond: string }) {
  const { c, photos, ajouterPhoto, retirerPhoto } = useApp();
  const [ouvert, setOuvert] = useState(true);
  const [index, setIndex] = useState(0);
  const [largeur, setLargeur] = useState(0);
  // Sans recadrage : la photo s'ajoute en un geste.
  const ajouter = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, allowsMultipleSelection: true, selectionLimit: 10 });
    if (!r.canceled) { r.assets.forEach((a) => ajouterPhoto(a.uri)); setIndex(0); }
  };
  const options = (uri: string) => {
    const supprimer = () => confirmer(t('comfort.deleteTitle'), t('comfort.deleteDesc'), t('comfort.keepPhoto'), () => retirerPhoto(uri));
    if (Platform.OS === 'ios') ActionSheetIOS.showActionSheetWithOptions({ options: [t('comfort.deletePhoto'), t('common.cancel')], destructiveButtonIndex: 0, cancelButtonIndex: 1 }, (i) => i === 0 && supprimer());
    else supprimer();
  };
  const cadre: ViewStyle = { height: 210, aspectRatio: 4 / 5, borderRadius: 20, overflow: 'hidden', alignSelf: 'center' };
  return (
    <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: ouvert }} onPress={() => { tap(); setOuvert(!ouvert); }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.8)' }}>
          {ouvert ? <ChevronUp size={15} color="#475569" /> : <ChevronDown size={15} color="#475569" />}
          <Images size={14} color="#475569" />
          <T size={12} weight="600" color="#475569" lh={16}>{t('comfort.title')}</T>
        </Pressable>
        {ouvert && (
          <Pressable accessibilityRole="button" accessibilityLabel={t('comfort.add')} onPress={() => { tap(); ajouter(); }}
            style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={16} color="#475569" />
          </Pressable>
        )}
      </View>
      {ouvert && (photos.length === 0 ? (
        <View style={[cadre, { backgroundColor: fond, justifyContent: 'center' }]}>
          <EtatVide icone="photoFrame" message={t('comfort.uploadFirst')} action={{ label: t('comfort.add'), onPress: ajouter }} />
        </View>
      ) : (
        <View onLayout={(e) => setLargeur(e.nativeEvent.layout.width)}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => largeur && setIndex(Math.round(e.nativeEvent.contentOffset.x / largeur))}>
            {photos.map((uri, i) => (
              <View key={uri} style={{ width: largeur, alignItems: 'center' }}>
                <View style={[cadre, { backgroundColor: c.bg }]}>
                  <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" accessibilityLabel={t('comfort.photoAlt', { index: i + 1, total: photos.length })} />
                  <Pressable accessibilityRole="button" accessibilityLabel={t('comfort.photoOptions')} onPress={() => options(uri)}
                    style={{ position: 'absolute', top: 10, right: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' }}>
                    <MoreHorizontal size={18} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
          {photos.length > 1 && (
            <View pointerEvents="none" style={{ position: 'absolute', bottom: 10, alignSelf: 'center', flexDirection: 'row', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.25)' }}>
              {photos.map((u, i) => <View key={u} style={{ height: 6, width: i === index ? 16 : 6, borderRadius: 3, backgroundColor: i === index ? '#FFFFFF' : 'rgba(255,255,255,0.5)' }} />)}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

/* ---------- Choix d'ambiance (Automatique / Clair / Sombre) ---------- */
export function ChoixAmbiance() {
  const { c, ambiance, setAmbiance } = useApp();
  const options = [['system', t('settings.themeAuto'), SunMoon], ['light', t('settings.themeLight'), Sun], ['dark', t('settings.themeDark'), Moon]] as const;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, padding: 6, borderRadius: 16, backgroundColor: c.stone100 }}>
      {options.map(([id, label, Icone]) => {
        const actif = ambiance === id;
        return (
          <Pressable key={id} accessibilityRole="button" accessibilityState={{ selected: actif }} onPress={() => { tap(); setAmbiance(id); }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: actif ? c.surface : 'transparent', shadowColor: '#000', shadowOpacity: actif ? 0.06 : 0, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } }}>
            <Icone size={15} color={actif ? c.ink : c.muted} />
            <T size={14} weight="600" color={actif ? c.ink : c.muted}>{label}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------- Feuille iOS (fenêtre qui glisse du bas) ---------- */
export function Feuille({ visible, fermer, children }: { visible: boolean; fermer: () => void; children: ReactNode }) {
  const c = useC();
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={fermer}>
      <ScrollView style={{ flex: 1, backgroundColor: c.surface }} contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
        <View style={{ alignItems: 'flex-end', marginBottom: 8 }}><T size={16} weight="600" color={c.accent} onPress={fermer}>{t('home.close')}</T></View>
        {children}
      </ScrollView>
    </Modal>
  );
}
