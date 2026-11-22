import { BriefcaseMedical, Eye, Heart, HeartPulse, PartyPopper, PenLine, Phone, Plus, Shapes, ShieldCheck, Trash2, Wind, X, type LucideIcon } from 'lucide-react-native';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Linking, Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/store';
import { Avertissement, Bulle, confirmer, H, Pastille, Sourcil, T, tap } from '@/ui';

// Numéros vérifiés (nov. 2026) : 3114 (info.gouv.fr, sante.fr), 09 69 325 900 (Anorexie Boulimie Info Écoute),
// 0 800 858 858 (Croix-Rouge Écoute), 0 800 235 236 (Fil Santé Jeunes, sante.fr), 09 72 39 40 50 (SOS Amitié),
// 15 / 17 / 18 / 112 / 114 (numéros d'urgence nationaux). L'ancien 0810 037 037 n'est plus listé.
const RAPIDES = [['Prévention suicide', '3114', '3114'], ['SAMU', '15', '15'], ['Numéro européen', '112', '112']];
const GROUPES = [
  { titre: 'Urgences immédiates', desc: '24h/24 · 7j/7', fond: '#FFF1F2', icone: '#E11D48', texte: '#BE123C', nums: [['Pompiers', '18', '18'], ['Police secours', '17', '17'], ['Urgences SMS (sourds/malentendants)', '114', '114']] },
  { titre: 'Écoute & soutien', desc: 'Pour ne pas rester seul(e)', fond: '#F0FDFA', icone: '#0D9488', texte: '#0F766E', nums: [['Croix-Rouge Écoute', '0800858858', '0 800 858 858'], ['Fil Santé Jeunes', '0800235236', '0 800 235 236'], ['SOS Amitié', '0972394050', '09 72 39 40 50']] },
  { titre: 'Spécialisé TCA', desc: 'Anorexie · boulimie · hyperphagie', fond: '#FFFBEB', icone: '#D97706', texte: '#B45309', nums: [['Anorexie Boulimie Info Écoute', '0969325900', '09 69 325 900']] },
];
const appeler = (tel: string) => { tap(); Linking.openURL(`tel:${tel}`); };

function CarteSection({ Icone, fond, couleur, sourcil, titre, bouton, children }: { Icone: LucideIcon; fond: string; couleur: string; sourcil: string; titre: string; bouton?: ReactNode; children: ReactNode }) {
  const { c } = useApp();
  return (
    <View style={{ backgroundColor: c.surface, borderRadius: 20, borderWidth: 1, borderColor: c.line, overflow: 'hidden', shadowColor: c.shadow, shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          <Bulle Icone={Icone} fond={fond} couleur={couleur} taille={44} rayon={16} iconTaille={20} />
          <View style={{ flex: 1 }}><H size={20}>{titre}</H></View>
        </View>
        {bouton}
      </View>
      {children}
    </View>
  );
}

export function EcranUrgence() {
  const { c } = useApp();
  return (
    <View style={{ gap: 20 }}>
      <Numeros />
      <Trousse />
      <Contacts />
      <Avertissement texte="Cet espace accompagne l'élan vers l'avenir et ne remplace pas un suivi médical ou psychologique. En cas de danger immédiat, contacte les services d'urgence de ton pays." />
    </View>
  );
}

function Numeros() {
  const { c } = useApp();
  const [ouvert, setOuvert] = useState(false);
  const lien = (n: string) => <T size={14} weight="600" color={c.rose700} onPress={() => appeler(n)}>{n}</T>;
  return (
    <CarteSection Icone={Phone} fond={c.rose100} couleur={c.rose600} sourcil="EN CAS DE BESOIN" titre="Numéros à appeler"
      bouton={<Pastille titre={ouvert ? 'Replier' : 'Ouvrir'} onPress={() => setOuvert(!ouvert)} fond={c.rose50} couleur={c.rose700} />}>
      <T size={14} weight="500" color={c.muted} style={{ paddingHorizontal: 24, paddingBottom: 12 }}>Tu n'as pas à traverser ça seul(e).</T>
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 24, paddingBottom: 20 }}>
        {RAPIDES.map(([nom, tel, aff]) => (
          <Pressable key={tel} accessibilityRole="button" accessibilityLabel={`Appeler ${nom}, ${aff}`} onPress={() => appeler(tel)}
            style={({ pressed }) => ({ flex: 1, alignItems: 'center', gap: 4, borderRadius: 16, backgroundColor: '#D97A56', paddingHorizontal: 8, paddingVertical: 14, transform: [{ scale: pressed ? 0.95 : 1 }] })}>
            <Phone size={17} color="#FFFFFF" />
            <T size={18} weight="700" color="#FFFFFF" lh={22}>{aff}</T>
            <T size={11} weight="500" color="rgba(255,255,255,0.9)" lh={14} center>{nom}</T>
          </Pressable>
        ))}
      </View>
      {ouvert && (
        <View style={{ gap: 20, paddingHorizontal: 24, paddingBottom: 28 }}>
          {GROUPES.map((g) => (
            <View key={g.titre}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <T size={12} weight="700" upper color={c.muted} style={{ letterSpacing: 1.8 }}>{g.titre}</T>
                <T size={12} color={c.faint}>{g.desc}</T>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {g.nums.map(([nom, tel, aff]) => (
                  <Pressable key={tel} accessibilityRole="button" accessibilityLabel={`Appeler ${nom}, ${aff}`} onPress={() => appeler(tel)}
                    style={({ pressed }) => ({ width: '48%', alignItems: 'center', gap: 4, borderRadius: 16, backgroundColor: g.fond, padding: 12, transform: [{ scale: pressed ? 0.95 : 1 }] })}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: g.icone, alignItems: 'center', justifyContent: 'center' }}><Phone size={14} color="#FFFFFF" /></View>
                    <T size={12} weight="600" color={g.texte} center lines={2} lh={15}>{nom}</T>
                    <T size={14} weight="700" color={g.texte}>{aff}</T>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
          <T size={12} lh={20} color={c.faint}>Ces numéros concernent la France. En cas de danger immédiat hors de France, contacte les urgences locales.</T>
        </View>
      )}
    </CarteSection>
  );
}

/* ---------- Un moment pour toi ---------- */
const OUTILS: [string, LucideIcon, string, string, string][] = [
  ['breathing', Wind, 'Respiration guidée', '#CCFBF1', '#0F766E'],
  ['grounding', Eye, 'Ancrage 5-4-3-2-1', '#EDE9FE', '#6D28D9'],
  ['comfort', Heart, 'Mon mot doux', '#FFE4E6', '#BE123C'],
  ['game', Shapes, 'Petit jeu apaisant', '#CCFBF1', '#0F766E'],
];

function Trousse() {
  const { c } = useApp();
  const [actif, setActif] = useState<string | null>(null);
  return (
    <View style={{ backgroundColor: c.surface, borderRadius: 20, borderWidth: 1, borderColor: c.line, padding: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Bulle Icone={BriefcaseMedical} fond={c.amber50} couleur={c.amber600} />
        <H size={20}>Un moment pour toi</H>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {OUTILS.map(([k, Icone, label, fond, col]) => (
          <Pressable key={k} accessibilityRole="button" onPress={() => { tap(); setActif(k); }}
            style={({ pressed }) => ({ width: '47.5%', alignItems: 'center', gap: 8, borderRadius: 16, backgroundColor: c.stone50, padding: 16, borderWidth: 1, borderColor: c.ring, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: fond, alignItems: 'center', justifyContent: 'center' }}><Icone size={20} color={col} /></View>
            <T size={14} weight="600" color={c.text} center>{label}</T>
          </Pressable>
        ))}
      </View>
      {actif === 'breathing' && <Coque titre="Respiration guidée" couleur="#0F766E" fermer={() => setActif(null)}><Respiration /></Coque>}
      {actif === 'grounding' && <Coque titre="Ancrage 5-4-3-2-1" couleur="#6D28D9" fermer={() => setActif(null)}><Ancrage fermer={() => setActif(null)} /></Coque>}
      {actif === 'comfort' && <Coque titre="Mon mot doux" couleur="#BE123C" fermer={() => setActif(null)}><MotDoux /></Coque>}
      {actif === 'game' && <Coque titre="Petit jeu apaisant" couleur="#0F766E" fermer={() => setActif(null)}><Jeu fermer={() => setActif(null)} /></Coque>}
    </View>
  );
}

function Coque({ titre, couleur, fermer, children }: { titre: string; couleur: string; fermer: () => void; children: ReactNode }) {
  const { c } = useApp();
  const insets = useSafeAreaInsets();
  return (
    <Modal animationType="fade" onRequestClose={fermer}>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: insets.top + 12, paddingBottom: 8 }}>
          <T size={14} weight="600" color={couleur}>{titre}</T>
          <Pressable accessibilityLabel="Fermer" onPress={fermer} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}><X size={20} color={c.faint} /></Pressable>
        </View>
        {/* Défile au-dessus du clavier, et un glissement vers le bas le ferme : le bouton reste toujours accessible. */}
        <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" automaticallyAdjustKeyboardInsets
          contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 64 }}>{children}</ScrollView>
      </View>
    </Modal>
  );
}

const PHASES = [['Inspire…', 1.35], ['Retiens…', 1.35], ['Expire…', 0.85], ['Retiens…', 0.85]] as const;
function Respiration() {
  const { c } = useApp();
  const [i, setI] = useState(0);
  const s = useSharedValue(0.85);
  useEffect(() => {
    s.value = withTiming(PHASES[i][1], { duration: 4000, easing: Easing.inOut(Easing.ease) });
    const t = setTimeout(() => setI((x) => (x + 1) % 4), 4000);
    return () => clearTimeout(t);
  }, [i, s]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <>
      <View style={{ width: 256, height: 256, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={[{ position: 'absolute', width: 256, height: 256, borderRadius: 128, backgroundColor: 'rgba(153,246,228,0.6)' }, style]} />
        <Animated.View style={[{ position: 'absolute', width: 192, height: 192, borderRadius: 96, backgroundColor: 'rgba(94,234,212,0.7)' }, style]} />
        <View style={{ width: 128, height: 128, borderRadius: 64, backgroundColor: '#14B8A6', alignItems: 'center', justifyContent: 'center' }}><T size={18} weight="700" color="#FFFFFF">{PHASES[i][0]}</T></View>
      </View>
      <T size={14} lh={24} color={c.muted} center style={{ marginTop: 40, maxWidth: 300 }}>Suis le cercle : il grandit quand tu inspires, il se resserre quand tu expires. Reste ici aussi longtemps que tu en as besoin.</T>
    </>
  );
}

const ANCRAGE = [[5, 'Nomme 5 choses que tu peux voir autour de toi.'], [4, 'Nomme 4 choses que tu peux toucher.'], [3, 'Nomme 3 choses que tu peux entendre.'], [2, 'Nomme 2 choses que tu peux sentir.'], [1, 'Nomme 1 chose que tu peux goûter.']] as const;
function Ancrage({ fermer }: { fermer: () => void }) {
  const { c } = useApp();
  const [e, setE] = useState(0);
  const bouton = (titre: string, onPress: () => void) => <Pressable onPress={() => { tap(); onPress(); }} style={{ marginTop: 40, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 999, backgroundColor: '#6D28D9' }}><T size={14} weight="600" color="#FFFFFF">{titre}</T></Pressable>;
  if (e >= ANCRAGE.length) return (
    <>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#DDD6FE', alignItems: 'center', justifyContent: 'center' }}><Heart size={26} color="#4C1D95" fill="#4C1D95" /></View>
      <T size={18} lh={28} color={c.text} center style={{ marginTop: 24, maxWidth: 300 }}>Tu es ici, maintenant, et c'est déjà beaucoup.</T>
      {bouton('Terminer', fermer)}
    </>
  );
  return (
    <>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#DDD6FE', alignItems: 'center', justifyContent: 'center' }}><Eye size={26} color="#4C1D95" /></View>
      <T size={48} weight="700" color="#6D28D9" lh={56} style={{ marginTop: 24 }}>{ANCRAGE[e][0]}</T>
      <T size={18} lh={28} color={c.text} center style={{ marginTop: 16, maxWidth: 300 }}>{ANCRAGE[e][1]}</T>
      <T size={12} color={c.faint} center style={{ marginTop: 8 }}>Prends ton temps, il n'y a rien à faire d'autre que ça.</T>
      {bouton('Suivant', () => setE(e + 1))}
    </>
  );
}

function MotDoux() {
  const { c, motDoux, setMotDoux } = useApp();
  const [edition, setEdition] = useState(!motDoux);
  const [brouillon, setBrouillon] = useState(motDoux);
  if (edition) return (
    <View style={{ width: '100%', maxWidth: 360 }}>
      <View style={{ alignSelf: 'center', width: 56, height: 56, borderRadius: 28, backgroundColor: '#FECDD3', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><PenLine size={22} color="#881337" /></View>
      <T size={14} lh={24} color={c.muted} center style={{ marginBottom: 16 }}>Écris, à tête reposée, un mot doux que tu pourras te relire dans un moment difficile.</T>
      <TextInput value={brouillon} onChangeText={setBrouillon} multiline autoFocus placeholder="Ex : Tu as déjà traversé des moments difficiles, tu peux traverser celui-ci aussi…" placeholderTextColor={c.faint} accessibilityLabel="Mon mot doux"
        style={{ minHeight: 140, borderRadius: 16, borderWidth: 1, borderColor: c.ring, backgroundColor: c.surface, padding: 16, fontSize: 15, lineHeight: 26, color: c.ink, textAlignVertical: 'top' }} />
      <Pressable disabled={!brouillon.trim()} onPress={() => { tap(); setMotDoux(brouillon.trim()); setEdition(false); }} style={{ marginTop: 16, paddingVertical: 12, borderRadius: 999, backgroundColor: '#E11D48', alignItems: 'center', opacity: brouillon.trim() ? 1 : 0.5 }}>
        <T size={14} weight="600" color="#FFFFFF">Enregistrer mon mot doux</T>
      </Pressable>
    </View>
  );
  return (
    <View style={{ alignItems: 'center', maxWidth: 360 }}>
      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#FECDD3', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}><Heart size={24} color="#881337" fill="#881337" /></View>
      <T size={20} lh={32} center>« {motDoux} »</T>
      <Pressable onPress={() => { setBrouillon(motDoux); setEdition(true); }} style={{ marginTop: 32, flexDirection: 'row', alignItems: 'center', gap: 6 }}><PenLine size={13} color="#E11D48" /><T size={12} weight="600" color="#E11D48">Modifier mon mot doux</T></Pressable>
    </View>
  );
}

const COULEURS = [['teal', "vert d'eau", '#2DD4BF'], ['violet', 'violet', '#A78BFA'], ['rose', 'rose', '#FB7185'], ['amber', 'ambre', '#FBBF24']] as const;
const CIBLE = 15;
function Jeu({ fermer }: { fermer: () => void }) {
  const { c } = useApp();
  const tirer = (sauf?: string) => { const l = COULEURS.filter((x) => x[0] !== sauf); return l[Math.floor(Math.random() * l.length)]; };
  const [score, setScore] = useState(0);
  const [cible, setCible] = useState(() => tirer());
  const [fini, setFini] = useState(false);
  const occupe = useRef(false);
  const x = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const toucher = (k: string) => {
    if (occupe.current) return;
    if (k === cible[0]) {
      occupe.current = true; tap();
      const n = score + 1; setScore(n);
      setTimeout(() => { if (n >= CIBLE) setFini(true); else setCible(tirer(cible[0])); occupe.current = false; }, 260);
    } else x.value = withSequence(withTiming(-6, { duration: 80 }), withTiming(6, { duration: 80 }), withTiming(0, { duration: 80 }));
  };
  if (fini) return (
    <>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#99F6E4', alignItems: 'center', justifyContent: 'center' }}><PartyPopper size={26} color="#134E4A" /></View>
      <H size={20} center style={{ marginTop: 24 }}>Bravo, {CIBLE} couleurs triées !</H>
      <T size={14} color={c.muted} center style={{ marginTop: 8 }}>Un petit moment rien que pour toi.</T>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 32 }}>
        <Pressable onPress={() => { setScore(0); setCible(tirer()); setFini(false); }} style={{ paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999, backgroundColor: '#0D9488' }}><T size={14} weight="600" color="#FFFFFF">Rejouer</T></Pressable>
        <Pressable onPress={fermer} style={{ paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999, backgroundColor: c.stone100 }}><T size={14} weight="600" color={c.soft}>Fermer</T></Pressable>
      </View>
    </>
  );
  return (
    <>
      <T size={12} weight="600" upper color={c.faint} style={{ marginBottom: 24, letterSpacing: 0.6 }}>Score : {score} / {CIBLE}</T>
      <Animated.View style={[{ width: 112, height: 112, borderRadius: 56, backgroundColor: cible[2], marginBottom: 40 }, style]} />
      <T size={14} lh={24} color={c.muted} center style={{ marginBottom: 24, maxWidth: 300 }}>Touche le rond de la même couleur. Aucune pression, prends ton temps.</T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 152, gap: 16 }}>
        {COULEURS.map(([k, label, col]) => <Pressable key={k} accessibilityLabel={`Couleur ${label}`} onPress={() => toucher(k)} style={({ pressed }) => ({ width: 64, height: 64, borderRadius: 32, backgroundColor: col, transform: [{ scale: pressed ? 0.9 : 1 }] })} />)}
      </View>
    </>
  );
}

/* ---------- Contacts de confiance ---------- */
function Contacts() {
  const app = useApp();
  const { c } = app;
  const [ouvert, setOuvert] = useState(false);
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const champ = { height: 44, borderRadius: 12, borderWidth: 1, borderColor: c.ring, backgroundColor: c.stone50, paddingHorizontal: 14, fontSize: 14, color: c.ink };
  return (
    <CarteSection Icone={HeartPulse} fond="#D1FAE5" couleur={c.emerald700} sourcil="TON RÉSEAU PERSONNEL" titre="Tes contacts de confiance"
      bouton={<Pastille titre={ouvert ? 'Replier' : 'Ouvrir'} onPress={() => setOuvert(!ouvert)} fond={c.emerald50} couleur={c.emerald700} />}>
      {!ouvert && <View style={{ height: 2 }} />}
      {ouvert && (
        <View style={{ gap: 12, paddingHorizontal: 24, paddingBottom: 28 }}>
          <View style={{ borderRadius: 16, backgroundColor: c.surface, padding: 16, borderWidth: 1, borderColor: c.ring, gap: 8 }}>
            <TextInput value={nom} onChangeText={setNom} placeholder="Prénom (ex : ma psy)" placeholderTextColor={c.faint} style={champ} />
            <TextInput value={tel} onChangeText={setTel} placeholder="Téléphone" keyboardType="phone-pad" placeholderTextColor={c.faint} style={champ} />
            <Pressable disabled={!nom.trim() || !tel.trim()} onPress={() => { tap(); app.ajouterContact(nom.trim(), tel.trim()); setNom(''); setTel(''); }}
              style={{ marginTop: 4, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: '#059669', opacity: nom.trim() && tel.trim() ? 1 : 0.5 }}>
              <Plus size={15} color="#FFFFFF" /><T size={14} weight="600" color="#FFFFFF">Enregistrer</T>
            </Pressable>
          </View>
          {app.contacts.length === 0 ? <T size={14} color={c.faint}>Tu n'as encore ajouté personne ici.</T> : app.contacts.map((x) => (
            <View key={x.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, backgroundColor: c.surface, padding: 14, borderWidth: 1, borderColor: c.ring }}>
              <Pressable accessibilityLabel={`Appeler ${x.nom}`} onPress={() => appeler(x.tel.replace(/\s/g, ''))} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center' }}><Phone size={16} color={c.emerald700} /></Pressable>
              <View style={{ flex: 1 }}><T size={14} weight="600" lines={1}>{x.nom}</T><T size={12} weight="600" color={c.emerald700}>{x.tel}</T></View>
              <Pressable accessibilityLabel="Supprimer" onPress={() => confirmer('Supprimer ce contact ?', 'Il ne sera plus dans tes contacts de confiance. Cette action est définitive.', 'Garder le contact', () => app.supprimerContact(x.id))} style={{ padding: 8 }}><Trash2 size={15} color={c.faint} /></Pressable>
            </View>
          ))}
        </View>
      )}
    </CarteSection>
  );
}
