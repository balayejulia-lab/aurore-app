import { Bell, Check, ChevronDown, ChevronUp, ExternalLink, Heart, Pencil, Plus, RotateCw, Save, Search, Sparkles, Target, Trash2, X, Youtube, type LucideIcon } from 'lucide-react-native';
import { useMemo, useState, type ReactNode } from 'react';
import { Linking, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { APRES_QUESTIONS } from '@/contenu/apresQuestions';
import { CITATIONS } from '@/contenu/citations';
import { DEFIS_CHALLENGES } from '@/contenu/defisChallenges';
import { cleanText, containsSearchRisk } from '@/contenu/filtre';
import { useApp, type Objectif } from '@/store';
import { Bulle, Carte, confirmer, Ecran, EnTetePage, Feuille, H, Pastille, Sourcil, T, t, tap } from '@/ui';

const THEMES_PIN = ['Voyage', 'Aquarelle', 'Cuisine', 'Surf', 'Lecture', 'Musique', 'Randonnée', 'Jardinage', 'Art', 'Poterie', 'Couture', 'Yoga', 'Bricolage', 'Danse'];
const THEMES_YT = ['DIY', 'Voyage', 'Cuisine', 'Yoga', 'Dessin', 'Musique', 'Danse', 'Randonnée', 'Podcast', 'Film'];
const SCENES = [
  ['villagegrec', '1f66cb790'], ['villageitalie', 'ad617710a'], ['sousmarin', 'c31274c3b'], ['montagne', 'e01b4a492'], ['newyork', '232840f8d'],
].map(([id, f]) => ({ id, image: `https://media.base44.com/images/public/6a97389dbd72d73a3080da53/${f}_generated_image.png`, label: t(`landscape.scene${id.charAt(0).toUpperCase()}${id.slice(1)}`) }));

export default function Inspiration() {
  const { c } = useApp();
  return (
    <Ecran>
      <EnTetePage Icone={Sparkles} fond={c.amber200} couleur="#78350F" sourcil="Faire entrer la lumière" titre="Inspirations" />
      <View style={{ gap: 32 }}>
        <Citation />
        <Possibles />
        <DeuxChoix Icone={Sparkles} fond="#fbf0e8" couleur="#c08552" sourcil="Défis & questions" choix={[['Défis quotidiens', <Defis key="d" />], ['Questions inspirantes', <Apres key="a" />]]} />
        <DeuxChoix Icone={Search} fond={c.amber50} couleur={c.amber700} sourcil="Pinterest" choix={[['Rechercher', <Recherche key="r" site="pinterest" />], ['Vidéos copiées', <Copie key="c" site="pinterest" />]]} />
        <DeuxChoix Icone={Youtube} fond={c.rose50} couleur={c.rose700} sourcil="YouTube" choix={[['Rechercher', <Recherche key="r" site="youtube" />], ['Vidéos copiées', <Copie key="c" site="youtube" />]]} />
      </View>
    </Ecran>
  );
}

/* ---------- Notification du jour (double-tap pour garder) ---------- */
function Citation() {
  const { c, estFavori, basculerFavori } = useApp();
  const index = useMemo(() => Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000) % CITATIONS.length, []);
  const q = CITATIONS[index];
  const fav = { id: `notif-${index}`, type: 'Citation', texte: q.text, auteur: q.author };
  const garde = estFavori(fav.id);
  const [dernier, setDernier] = useState(0);
  return (
    <Pressable onPress={() => { const n = Date.now(); if (n - dernier < 300 && !garde) { tap(); basculerFavori(fav); } setDernier(n); }}>
      <Carte>
        <View style={{ marginBottom: 16 }}><Bulle Icone={Bell} iconTaille={17} /></View>
        <T size={20} weight="600" lh={28}>“{q.text}”</T>
        <T size={14} color={c.muted} style={{ marginTop: 8, fontStyle: 'italic' }}>— {q.author}{q.source ? `, ${q.source}` : ''}</T>
        <View style={{ marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <T size={12} color={c.faint}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</T>
          <Pressable onPress={() => Linking.openURL(q.link)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: c.stone100 }}>
            <ExternalLink size={13} color={c.teal700} /><T size={12} weight="600" color={c.teal700}>{t('dailyNotif.search')}</T>
          </Pressable>
        </View>
        <Pressable onPress={() => { tap(); basculerFavori(fav); }} style={{ marginTop: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: garde ? c.rose100 : c.stone100 }}>
          <Heart size={14} color={garde ? c.rose600 : c.muted} fill={garde ? c.rose600 : 'none'} /><T size={12} weight="600" color={garde ? c.rose600 : c.muted}>{garde ? t('dailyNotif.kept') : t('dailyNotif.keep')}</T>
        </Pressable>
      </Carte>
    </Pressable>
  );
}

/* ---------- Mes prochains possibles + paysage qui se colore ---------- */
function Possibles() {
  const app = useApp();
  const { c } = app;
  const [ouvert, setOuvert] = useState(false);
  const [titre, setTitre] = useState('');
  return (
    <Carte>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Bulle Icone={Target} fond="#FEFCE8" couleur="#FED7AA" />
        <View style={{ flex: 1 }}><H size={20}>{t('goals.title')}</H></View>
        <Pastille titre={ouvert ? t('common.collapse') : t('common.open')} onPress={() => setOuvert(!ouvert)} />
      </View>
      <Paysage />
      {ouvert && (
        <>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
            <TextInput value={titre} onChangeText={setTitre} maxLength={100} placeholder={t('goals.placeholder')} placeholderTextColor={c.faint} accessibilityLabel={t('goals.title')}
              onSubmitEditing={() => { if (titre.trim()) { app.ajouterObjectif(cleanText(titre.trim())); setTitre(''); } }}
              style={{ flex: 1, height: 46, borderRadius: 12, borderWidth: 1, borderColor: c.ring, backgroundColor: c.stone50, paddingHorizontal: 16, fontSize: 14, color: c.ink }} />
            <Pressable accessibilityLabel={t('common.add')} onPress={() => { if (titre.trim()) { tap(); app.ajouterObjectif(cleanText(titre.trim())); setTitre(''); } }} style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: '#FED7AA', alignItems: 'center', justifyContent: 'center' }}><Plus size={19} color="#FFFFFF" /></Pressable>
          </View>
          <View style={{ gap: 8 }}>
            {app.objectifs.length === 0 ? <View style={{ borderRadius: 12, backgroundColor: c.stone50, padding: 16 }}><T size={14} color={c.muted}>{t('goals.empty')}</T></View> : app.objectifs.map((o) => <Objectif key={o.id} o={o} />)}
          </View>
        </>
      )}
    </Carte>
  );
}

function Paysage() {
  const app = useApp();
  const { c } = app;
  const [ouvert, setOuvert] = useState(true);
  const [choix, setChoix] = useState(false);
  const etapes = app.objectifs.flatMap((o) => (o.steps.length ? o.steps : [{ done: o.completed }]));
  const progres = etapes.length ? etapes.filter((s) => s.done).length / etapes.length : 0;
  const scene = SCENES.find((s) => s.id === app.scene);
  return (
    <View style={{ marginBottom: 20, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: c.ring, backgroundColor: c.heroBg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
        <Pressable disabled={!scene} onPress={() => setOuvert(!ouvert)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, opacity: scene ? 1 : 0.5 }}>
          {ouvert ? <ChevronUp size={15} color={c.soft} /> : <ChevronDown size={15} color={c.soft} />}
          <T size={12} weight="600" color={c.soft}>{ouvert ? t('landscape.closeLandscape') : t('landscape.openLandscape')}</T>
        </Pressable>
        <Pressable onPress={() => { tap(); setChoix(true); }} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.8)' }}><T size={12} weight="600" color="#475569">{t('landscape.sceneLabel')}</T></Pressable>
      </View>
      {scene && ouvert && (
        <View style={{ height: 190 }}>
          {/* Le paysage gagne en couleurs à chaque étape accomplie, il ne perd jamais rien sans action. */}
          <Image source={{ uri: scene.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" accessibilityLabel={scene.label} />
          <View style={{ position: 'absolute', inset: 0, backgroundColor: '#F5F3ED', opacity: 0.55 * (1 - progres) }} />
        </View>
      )}
      <Feuille visible={choix} fermer={() => setChoix(false)}>
        <H size={18} style={{ marginBottom: 16 }}>{t('landscape.sceneLabel')}</H>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {SCENES.map((s) => (
            <Pressable key={s.id} onPress={() => { tap(); app.setScene(s.id); setOuvert(true); setChoix(false); }} style={{ width: '30%', aspectRatio: 3 / 4, borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: app.scene === s.id ? '#14B8A6' : 'transparent' }}>
              <Image source={{ uri: s.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
              <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 6, backgroundColor: 'rgba(0,0,0,0.45)' }}><T size={10} weight="500" color="#FFFFFF">{s.label}</T></View>
            </Pressable>
          ))}
        </View>
      </Feuille>
    </View>
  );
}

function Rond({ fait, onPress }: { fait: boolean; onPress: () => void }) {
  const { c } = useApp();
  return (
    <Pressable onPress={() => { tap(); onPress(); }} hitSlop={6} style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: fait ? '#0F766E' : '#CBD5E1', backgroundColor: fait ? '#0F766E' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
      {fait && <Check size={13} color="#FFFFFF" />}
    </Pressable>
  );
}

function Objectif({ o }: { o: Objectif }) {
  const app = useApp();
  const { c } = app;
  const [etape, setEtape] = useState('');
  const [edit, setEdit] = useState<null | number | 'titre'>(null);
  const [texte, setTexte] = useState('');
  const valider = () => { const v = cleanText(texte.trim()); if (v) { if (edit === 'titre') app.renommerObjectif(o.id, v); else if (typeof edit === 'number') app.modifierEtape(o.id, edit, v); } setEdit(null); };
  const champ = { flex: 1, borderRadius: 8, borderWidth: 1, borderColor: c.ring, backgroundColor: c.stone50, paddingHorizontal: 8, paddingVertical: 4, fontSize: 14, color: c.ink };
  return (
    <View style={{ borderRadius: 12, borderWidth: 1, borderColor: c.ring, backgroundColor: 'rgba(255,255,255,0.6)', padding: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {edit === 'titre' ? <TextInput autoFocus value={texte} onChangeText={setTexte} onBlur={valider} onSubmitEditing={valider} style={champ} />
          : <T size={14} weight="500" color={o.completed ? c.faint : c.text} style={{ flex: 1 }}>{o.title}</T>}
        <Pressable accessibilityLabel={t('goals.edit')} onPress={() => { setTexte(o.title); setEdit('titre'); }} style={{ padding: 4 }}><Pencil size={14} color="#CBD5E1" /></Pressable>
        <Pressable onPress={() => { tap(); app.basculerObjectif(o.id); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Rond fait={o.completed} onPress={() => app.basculerObjectif(o.id)} />
          <T size={14} weight="500" color={o.completed ? c.faint : '#0F766E'}>{t('goals.done')}</T>
        </Pressable>
        <Pressable accessibilityLabel={t('common.delete')} onPress={() => confirmer('Supprimer cet objectif ?', 'Il ne sera plus dans tes prochains possibles.', 'Le garder', () => app.supprimerObjectif(o.id))} style={{ padding: 4 }}><Trash2 size={15} color="#CBD5E1" /></Pressable>
      </View>
      {o.steps.map((s, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 6 }}>
          {edit === i ? <TextInput autoFocus value={texte} onChangeText={setTexte} onBlur={valider} onSubmitEditing={valider} style={champ} /> : (
            <>
              <T size={14} lh={24} color={s.done ? c.faint : c.soft} style={{ flex: 1, textDecorationLine: s.done ? 'line-through' : 'none' }}>{s.text}</T>
              <Rond fait={s.done} onPress={() => app.basculerEtape(o.id, i)} />
              <Pressable accessibilityLabel={t('goals.edit')} onPress={() => { setTexte(s.text); setEdit(i); }} style={{ padding: 4 }}><Pencil size={13} color="#CBD5E1" /></Pressable>
              <Pressable accessibilityLabel={t('common.delete')} onPress={() => app.supprimerEtape(o.id, i)} style={{ padding: 4 }}><Trash2 size={13} color="#CBD5E1" /></Pressable>
            </>
          )}
        </View>
      ))}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
        <TextInput value={etape} onChangeText={setEtape} maxLength={100} placeholder={t('goals.branchPlaceholder')} placeholderTextColor={c.faint} accessibilityLabel={t('goals.addBranch')}
          onSubmitEditing={() => { if (etape.trim()) { app.ajouterEtape(o.id, cleanText(etape.trim())); setEtape(''); } }}
          style={{ flex: 1, borderRadius: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: '#D6D3D1', paddingHorizontal: 12, paddingVertical: 6, fontSize: 14, color: c.ink }} />
        <Pressable accessibilityLabel={t('goals.addBranch')} disabled={!etape.trim()} onPress={() => { app.ajouterEtape(o.id, cleanText(etape.trim())); setEtape(''); }} style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center', opacity: etape.trim() ? 1 : 0.3 }}><Plus size={16} color="#0F766E" /></Pressable>
      </View>
    </View>
  );
}

/* ---------- Carte à deux choix (Défis / Pinterest / YouTube) ---------- */
function DeuxChoix({ Icone, fond, couleur, sourcil, choix }: { Icone: LucideIcon; fond: string; couleur: string; sourcil: string; choix: [string, ReactNode][] }) {
  const { c } = useApp();
  const [ouvert, setOuvert] = useState(false);
  const [actif, setActif] = useState(0);
  return (
    <View style={{ borderRadius: 24, backgroundColor: c.surface, padding: 24, borderWidth: 1, borderColor: c.ring }}>
      <Pressable onPress={() => { tap(); setOuvert(!ouvert); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Bulle Icone={Icone} fond={fond} couleur={couleur} iconTaille={17} />
        <View style={{ flex: 1 }}><H size={18}>{sourcil}</H></View>
        <Pastille titre={ouvert ? t('common.collapse') : t('common.open')} onPress={() => setOuvert(!ouvert)} />
      </Pressable>
      {ouvert && (
        <View style={{ marginTop: 16 }}>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            {choix.map(([label], i) => (
              <Pressable key={label} onPress={() => { tap(); setActif(i); }} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: actif === i ? c.dark : c.stone100 }}>
                <T size={14} weight="600" color={actif === i ? c.bg : c.soft}>{label}</T>
              </Pressable>
            ))}
          </View>
          {choix[actif][1]}
        </View>
      )}
    </View>
  );
}

function Pioche({ titre, sousTitre, couleur, fond, onPress }: { titre: string; sousTitre: string; couleur: string; fond: string; onPress: () => void }) {
  return (
    <Pressable onPress={() => { tap(); onPress(); }} style={({ pressed }) => ({ height: 224, borderRadius: 24, borderWidth: 1, borderColor: '#e7d9c8', backgroundColor: fond, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32, transform: [{ scale: pressed ? 0.98 : 1 }] })}>
      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e7d9c8' }}><RotateCw size={22} color={couleur} /></View>
      <T size={18} weight="500" color="#5a4332">{titre}</T>
    </Pressable>
  );
}

function Defis() {
  const [defi, setDefi] = useState<string | null>(null);
  const tirer = () => setDefi(DEFIS_CHALLENGES[Math.floor(Math.random() * DEFIS_CHALLENGES.length)]);
  if (!defi) return <Pioche titre={t('defis.drawCard')} sousTitre={t('defis.subtitle')} couleur="#c08552" fond="#f8eadd" onPress={tirer} />;
  return (
    <Animated.View key={defi} entering={FadeInDown.duration(500)} style={{ minHeight: 224, borderRadius: 24, borderWidth: 1, borderColor: '#e7d9c8', backgroundColor: '#FFFFFF', padding: 28, alignItems: 'center', justifyContent: 'center' }}>
      <Sourcil color="#c08552">{t('defis.challengeLabel')}</Sourcil>
      <T size={20} weight="400" lh={28} color="#5a4332" center style={{ marginTop: 12 }}>{defi}</T>
      <Pressable onPress={() => { tap(); tirer(); }} style={{ marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 999, backgroundColor: '#c08552' }}>
        <RotateCw size={15} color="#FFFFFF" /><T size={14} weight="600" color="#FFFFFF">{t('defis.drawAgain')}</T>
      </Pressable>
    </Animated.View>
  );
}

function Apres() {
  const app = useApp();
  const { c } = app;
  const [carte, setCarte] = useState<(typeof APRES_QUESTIONS)[number] | null>(null);
  const [reponse, setReponse] = useState('');
  const [edit, setEdit] = useState<string | null>(null);
  const [brouillon, setBrouillon] = useState('');
  const tirer = () => { setCarte(APRES_QUESTIONS[Math.floor(Math.random() * APRES_QUESTIONS.length)]); setReponse(''); };
  return (
    <View>
      {!carte ? <Pioche titre={t('apres.drawCard')} sousTitre={t('apres.subtitle')} couleur="#6b8e7f" fond="#f3f5ee" onPress={tirer} /> : (
        <Animated.View key={carte.q} entering={FadeInDown.duration(500)} style={{ minHeight: 224, borderRadius: 24, borderWidth: 1, borderColor: '#e7e1d4', backgroundColor: '#FFFFFF', padding: 28 }}>
          <Sourcil>{t('apres.questionLabel')}</Sourcil>
          <T size={20} weight="400" lh={28} color="#3b5149" style={{ marginTop: 12 }}>{carte.q}</T>
          <TextInput value={reponse} onChangeText={setReponse} multiline autoFocus placeholder={t('apres.answerPlaceholder')} placeholderTextColor="#94A3B8" accessibilityLabel={t('apres.answerPlaceholder')}
            style={{ marginTop: 20, minHeight: 90, borderRadius: 16, borderWidth: 1, borderColor: '#e7e1d4', backgroundColor: '#fbf7f0', padding: 16, fontSize: 15, lineHeight: 26, color: '#1E293B', textAlignVertical: 'top' }} />
          <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
            <Pressable onPress={tirer} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8 }}><RotateCw size={15} color="#64748B" /><T size={14} weight="500" color="#64748B">{t('apres.drawAgain')}</T></Pressable>
            <Pressable disabled={!reponse.trim()} onPress={() => { tap(); app.garderEnvie(carte.q, cleanText(reponse.trim()), carte.category); setCarte(null); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 999, backgroundColor: '#6b8e7f', opacity: reponse.trim() ? 1 : 0.4 }}>
              <Save size={15} color="#FFFFFF" /><T size={14} weight="600" color="#FFFFFF">{t('apres.keep')}</T>
            </Pressable>
          </View>
        </Animated.View>
      )}
      <View style={{ marginTop: 32 }}>
        <Sourcil>{t('apres.carnetEyebrow')}</Sourcil>
        <T size={18} weight="500" color={c.ink} style={{ marginBottom: 16, marginTop: 4 }}>{t('apres.carnetTitle')}</T>
        {app.envies.length === 0 ? (
          <View style={{ borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: '#e7e1d4', backgroundColor: 'rgba(251,247,240,0.5)', paddingHorizontal: 20, paddingVertical: 32 }}><T size={14} color={c.faint} center>{t('apres.carnetEmpty')}</T></View>
        ) : (
          <View style={{ gap: 12 }}>
            {app.envies.map((d) => (
              <View key={d.id} style={{ borderRadius: 16, borderWidth: 1, borderColor: '#e7e1d4', backgroundColor: c.surface, padding: 20 }}>
                <T size={12} weight="500" upper color={c.faint} style={{ letterSpacing: 0.6 }}>{d.question}</T>
                {edit === d.id ? (
                  <View style={{ marginTop: 8 }}>
                    <TextInput value={brouillon} onChangeText={setBrouillon} multiline autoFocus style={{ minHeight: 60, borderRadius: 12, borderWidth: 1, borderColor: '#e7e1d4', backgroundColor: '#fbf7f0', padding: 12, fontSize: 15, color: '#1E293B' }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                      <Pressable onPress={() => setEdit(null)} style={{ padding: 8 }}><X size={14} color="#64748B" /></Pressable>
                      <Pressable disabled={!brouillon.trim()} onPress={() => { app.modifierEnvie(d.id, cleanText(brouillon.trim())); setEdit(null); }} style={{ paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, backgroundColor: '#6b8e7f' }}><T size={14} weight="600" color="#FFFFFF">OK</T></Pressable>
                    </View>
                  </View>
                ) : (
                  <>
                    <T size={15} lh={28} color={c.text} style={{ marginTop: 4 }}>{d.answer}</T>
                    {d.transformed && <View style={{ marginTop: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, backgroundColor: '#eef4f0' }}><Check size={13} color="#6b8e7f" /><T size={12} weight="500" color="#6b8e7f">{t('apres.transformed')}</T></View>}
                    <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0ebe1', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      {!d.transformed && <Pressable onPress={() => { tap(); app.transformerEnvie(d); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: '#fbf7f0' }}><Target size={13} color="#6b8e7f" /><T size={12} weight="600" color="#6b8e7f">{t('apres.transform')}</T></Pressable>}
                      <Pressable onPress={() => { setBrouillon(d.answer); setEdit(d.id); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Pencil size={13} color={c.faint} /><T size={12} color={c.faint}>{t('apres.edit')}</T></Pressable>
                      <View style={{ flex: 1 }} />
                      <Pressable accessibilityLabel={t('apres.delete')} onPress={() => confirmer(t('apres.deleteTitle'), t('apres.deleteDesc'), t('apres.keepOne'), () => app.supprimerEnvie(d.id))}><Trash2 size={13} color={c.faint} /></Pressable>
                    </View>
                  </>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

/* ---------- Pinterest / YouTube ---------- */
const URLS = {
  pinterest: (q: string) => `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(q)}`,
  youtube: (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
};

function Recherche({ site }: { site: 'pinterest' | 'youtube' }) {
  const { c } = useApp();
  const [q, setQ] = useState('');
  const risque = containsSearchRisk(q.trim());
  const pin = site === 'pinterest';
  const ok = !!q.trim() && !risque;
  const ouvrir = (x: string) => Linking.openURL(URLS[site](x));
  return (
    <View>
      <TextInput value={q} onChangeText={setQ} onSubmitEditing={() => ok && ouvrir(q.trim())} returnKeyType="search" placeholderTextColor={c.faint} accessibilityLabel="Recherche"
        placeholder={pin ? 'Tape un thème : voyage, poterie, surf, intérieur…' : 'Tape une recherche : tutoriel, podcast, voyage en vidéo…'}
        style={{ height: 46, borderRadius: 999, borderWidth: 1, borderColor: c.ring, backgroundColor: c.stone50, paddingHorizontal: 20, fontSize: 14, color: c.ink }} />
      <Pressable disabled={!ok} onPress={() => { tap(); ouvrir(q.trim()); }} style={{ marginTop: 8, height: 46, borderRadius: 999, backgroundColor: pin ? '#DC2626' : '#E11D48', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: ok ? 1 : 0.5 }}>
        <ExternalLink size={16} color="#FFFFFF" /><T size={14} weight="600" color="#FFFFFF">{pin ? 'Ouvrir sur Pinterest' : 'Ouvrir sur YouTube'}</T>
      </Pressable>
      {risque && <T size={12} weight="500" color={c.rose600} style={{ marginTop: 8 }}>Cette recherche touche un sujet sensible pour ton rétablissement — essaie plutôt un des thèmes ci-dessous 💛</T>}
      <ScrollView horizontal={false}>
        <View style={{ marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {(pin ? THEMES_PIN : THEMES_YT).map((x) => (
            <Pressable key={x} onPress={() => ouvrir(x)} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: pin ? c.amber50 : c.rose50 }}>
              <T size={12} weight="500" color={pin ? '#92400E' : '#9F1239'}>{x}</T>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Copie({ site }: { site: 'pinterest' | 'youtube' }) {
  const { c, basculerFavori } = useApp();
  const [url, setUrl] = useState('');
  const [titre, setTitre] = useState('');
  const pin = site === 'pinterest';
  const yt = (u: string) => u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/)?.[1];
  const valide = !!url.trim() && (pin || !!yt(url.trim()));
  const champ = { height: 44, borderRadius: 12, borderWidth: 1, borderColor: c.ring, backgroundColor: c.stone50, paddingHorizontal: 16, fontSize: 14, color: c.ink };
  return (
    <View style={{ gap: 12 }}>
      <TextInput value={url} onChangeText={setUrl} autoCapitalize="none" placeholder={pin ? 'Lien du pin Pinterest' : 'Lien YouTube (youtube.com/watch… ou youtu.be/…)'} placeholderTextColor={c.faint} style={champ} />
      <TextInput value={titre} onChangeText={setTitre} placeholder="Titre (optionnel)" placeholderTextColor={c.faint} style={champ} />
      <Pressable disabled={!valide} onPress={() => { tap(); basculerFavori({ id: `${site}-${url.trim()}`, type: pin ? 'Pinterest' : 'YouTube', texte: titre.trim() || (pin ? 'Mon pin Pinterest' : 'Ma vidéo YouTube'), auteur: url.trim() }); setUrl(''); setTitre(''); }}
        style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, backgroundColor: pin ? '#B45309' : '#BE123C', opacity: valide ? 1 : 0.5 }}>
        <Plus size={16} color="#FFFFFF" /><T size={14} weight="600" color="#FFFFFF">Ajouter à mes favoris</T>
      </Pressable>
      {!pin && !!url.trim() && !valide && <T size={12} color={c.rose500}>Ce lien ne ressemble pas à un lien YouTube valide.</T>}
    </View>
  );
}
