import { Brain, Lightbulb, ChevronDown, ChevronUp, Heart, History, Send, Sparkles, SquarePen, Trash2, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, TextInput, View, type ScrollViewInstance } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from 'expo-router/js-tabs';
import { demander, souvenirs } from '@/assistant';
import { nid, useApp, type Message as Msg } from '@/store';
import { BoutonAide, confirmer, H, T, tap } from '@/ui';

// Assistant des proches du site : vraie IA via worker/, réponses pré-écrites si hors ligne.
const SUGGESTIONS = [
  "Que dire, et ne pas dire, à mon enfant aujourd'hui ?",
  "Comment se sent cette personne mentalement, même quand le moral s'améliore ?",
  'Comment expliquer la maladie simplement, à mon entourage ?',
  'Comment accompagner sans brusquer, au quotidien ?',
  'Comment prendre soin de moi en tant que proche ?',
  "Où trouver de l'aide professionnelle pour cette personne et pour nous ?",
];
const AVERTISSEMENT = "Cet assistant est informatif et ne remplace pas un avis médical. En cas d'urgence, appelle le 15 (ou le 3114, ligne Nationale de prévention du suicide).";

// Rend le **gras** des réponses comme sur le site.
function Markdown({ texte, color }: { texte: string; color: string }) {
  return (
    <View style={{ gap: 8 }}>
      {texte.split('\n\n').map((para, i) => (
        <T key={i} size={14} lh={26} color={color}>{para.split(/(\*\*[^*]+\*\*)/).map((m, j) => (m.startsWith('**') ? <T key={j} size={14} weight="700" color={color}>{m.slice(2, -2)}</T> : m))}</T>
      ))}
    </View>
  );
}

export default function Assistant() {
  const app = useApp();
  const { c } = app;
  const insets = useSafeAreaInsets();
  const bas = useBottomTabBarHeight();
  const { conversations: convs, setConversations: setConvs } = app;
  const [courante, setCourante] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [ecrit, setEcrit] = useState(false);
  const [memoire, setMemoire] = useState(false);
  const [historique, setHistorique] = useState(false);
  const [idees, setIdees] = useState(false);
  const premiere = !app.assistantUtilise;
  const scroll = useRef<ScrollViewInstance>(null);
  const conv = convs.find((x) => x.id === courante);
  const messages = conv?.messages ?? [];
  const vide = messages.length === 0;

  const poser = (q?: string) => {
    const texte = (q ?? question).trim();
    if (!texte || ecrit) return;
    tap(); setQuestion(''); setEcrit(true); setIdees(false);
    if (premiere) app.setAssistantUtilise(true);
    const id = courante ?? nid();
    const ajout = (m: Msg) => setConvs((l) => (l.some((x) => x.id === id) ? l.map((x) => (x.id === id ? { ...x, messages: [...x.messages, m] } : x)) : [{ id, messages: [m], date: Date.now() }, ...l]));
    ajout({ role: 'user', content: texte, id: nid() });
    setCourante(id);
    const historique = [...(convs.find((x) => x.id === id)?.messages ?? []), { role: 'user' as const, content: texte }].map(({ role, content }) => ({ role, content }));
    demander(historique, souvenirs(convs, id)).then((r) => { ajout({ role: 'assistant', content: r, id: nid() }); setEcrit(false); });
  };

  const barre = (centre?: boolean) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <TextInput value={question} onChangeText={setQuestion} onSubmitEditing={() => poser()} returnKeyType="send" placeholderTextColor={c.faint} accessibilityLabel="Ta question"
        placeholder={centre ? 'Pose ta question…' : 'Réponds, ou pose une nouvelle question…'}
        style={{ flex: 1, height: 46, borderRadius: 999, borderWidth: 1, borderColor: c.ring, backgroundColor: c.surface, paddingHorizontal: 20, fontSize: 14, color: c.ink }} />
      <Pressable accessibilityRole="button" accessibilityLabel="Envoyer" disabled={!question.trim() || ecrit} onPress={() => poser()}
        style={{ height: 46, paddingHorizontal: 20, borderRadius: 999, backgroundColor: c.av700, alignItems: 'center', justifyContent: 'center', opacity: question.trim() && !ecrit ? 1 : 0.5 }}>
        <Send size={16} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, paddingTop: insets.top + 10, paddingBottom: 8 }}>
        <Pressable accessibilityLabel="Historique des conversations" onPress={() => { tap(); setHistorique(true); }} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}><History size={19} color={c.av700} /></Pressable>
        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: c.av50, alignItems: 'center', justifyContent: 'center' }}><Sparkles size={15} color={c.av700} /></View>
        <View style={{ flex: 1 }} />
        <BoutonAide />
        <Pressable accessibilityLabel="Nouvelle conversation" onPress={() => { tap(); setCourante(null); setMemoire(false); }} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}><SquarePen size={18} color={c.av700} /></Pressable>
      </View>

      {!vide && (
        <View style={{ alignItems: 'center', paddingHorizontal: 16 }}>
          <Pressable onPress={() => setMemoire(!memoire)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, backgroundColor: c.av50 }}>
            <Brain size={13} color={c.av700} /><T size={12} weight="600" color={c.av700}>Ce dont il se souvient</T>{memoire ? <ChevronUp size={13} color={c.av700} /> : <ChevronDown size={13} color={c.av700} />}
          </Pressable>
          {memoire && (
            <Animated.View entering={FadeIn} style={{ alignSelf: 'stretch', marginTop: 8, borderRadius: 16, backgroundColor: c.av50, padding: 16, borderWidth: 1, borderColor: c.av100 }}>
              <T size={14} lh={24} color={c.soft}>Il se souvient de {convs.length > 1 ? `tes ${convs.length} conversations` : 'cette conversation'}, pour mieux comprendre ta situation. Ici, tu m'as parlé de : {messages.filter((m) => m.role === 'user').map((m) => m.content).join(' · ')}</T>
              <Pressable onPress={() => confirmer('Oublier cette conversation ?', "L'assistant ne s'en souviendra plus.", 'La garder', () => { setConvs((l) => l.filter((x) => x.id !== courante)); setCourante(null); setMemoire(false); })} style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Trash2 size={13} color="#E11D48" /><T size={12} weight="600" color="#E11D48">Oublier cette conversation</T>
              </Pressable>
            </Animated.View>
          )}
        </View>
      )}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={-bas + 20}>
        {vide ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: 20, paddingHorizontal: 24, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: c.av50, alignItems: 'center', justifyContent: 'center' }}><Sparkles size={24} color={c.av700} /></View>
            <View style={{ alignItems: 'center' }}>
              <H size={20}>Une question ?</H>
              <T size={14} color={c.muted} center style={{ marginTop: 4 }}>S'appuie sur des sources médicales et des témoignages · se souvient de vos échanges</T>
            </View>
            <View style={{ alignSelf: 'stretch' }}>
              {barre(true)}
              {/* Questions proposées d'office la 1re fois seulement, ensuite sur demande. */}
              {premiere || idees ? (
                <Animated.View entering={FadeIn} style={{ marginTop: 16, gap: 10 }}>
                  {premiere && <T size={13} weight="600" color={c.soft} center>Tu ne sais pas par où commencer ? En voici quelques-unes :</T>}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                    {SUGGESTIONS.map((s) => (
                      <Pressable key={s} onPress={() => poser(s)} style={{ maxWidth: '100%', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: c.av50 }}>
                        <T size={12} weight="500" color={c.av700} center style={{ flexShrink: 1 }}>{s}</T>
                      </Pressable>
                    ))}
                  </View>
                </Animated.View>
              ) : (
                <Pressable accessibilityRole="button" onPress={() => { tap(); setIdees(true); }} style={{ marginTop: 16, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: c.av50 }}>
                  <Lightbulb size={15} color={c.av700} /><T size={13} weight="600" color={c.av700}>Des idées de questions</T>
                </Pressable>
              )}
            </View>
            <T size={11} lh={16} color={c.faint} center style={{ marginTop: 24 }}>{AVERTISSEMENT}</T>
          </ScrollView>
        ) : (
          <>
            <ScrollView ref={scroll} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })} contentContainerStyle={{ padding: 16, gap: 16 }}>
              {messages.map((m, i) => m.role === 'user' ? (
                <Animated.View key={m.id} entering={FadeInUp.duration(250)} style={{ alignSelf: 'flex-end', maxWidth: '85%', borderRadius: 16, borderTopRightRadius: 4, backgroundColor: c.av700, paddingHorizontal: 16, paddingVertical: 10 }}>
                  <T size={14} color="#FFFFFF">{m.content}</T>
                </Animated.View>
              ) : (
                <Animated.View key={m.id} entering={FadeInUp.duration(250)} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, maxWidth: '92%' }}>
                  <View style={{ marginTop: 2, width: 28, height: 28, borderRadius: 14, backgroundColor: c.av700, alignItems: 'center', justifyContent: 'center' }}><Sparkles size={13} color="#FFFFFF" /></View>
                  <View style={{ flexShrink: 1, borderRadius: 20, borderTopLeftRadius: 4, backgroundColor: c.surface, padding: 16, borderWidth: 1, borderColor: c.line }}>
                    <Markdown texte={m.content} color={c.text} />
                    <Reponse id={`reponse-${m.id}`} question={messages[i - 1]?.content ?? ''} reponse={m.content} />
                  </View>
                </Animated.View>
              ))}
              {ecrit && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c.av700, alignItems: 'center', justifyContent: 'center' }}><Sparkles size={13} color="#FFFFFF" /></View>
                  <View style={{ flexDirection: 'row', gap: 6, borderRadius: 20, backgroundColor: c.surface, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: c.line }}>
                    {[0, 1, 2].map((k) => <View key={k} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.av300 }} />)}
                  </View>
                </View>
              )}
            </ScrollView>
            <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 }}>
              {barre()}
              <T size={11} lh={16} color={c.faint} center style={{ marginTop: 8 }}>{AVERTISSEMENT}</T>
            </View>
          </>
        )}
      </KeyboardAvoidingView>

      <Modal visible={historique} transparent animationType="fade" onRequestClose={() => setHistorique(false)}>
        <Pressable onPress={() => setHistorique(false)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <Pressable onPress={() => {}} style={{ width: '82%', maxWidth: 320, height: '100%', backgroundColor: c.surface, paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
              <H size={18}>Conversations</H>
              <Pressable accessibilityLabel="Fermer" onPress={() => setHistorique(false)} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}><X size={18} color={c.faint} /></Pressable>
            </View>
            <Pressable onPress={() => { setCourante(null); setHistorique(false); }} style={{ marginHorizontal: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, backgroundColor: c.av50, paddingHorizontal: 12, paddingVertical: 10 }}>
              <SquarePen size={15} color={c.av700} /><T size={14} weight="600" color={c.av700}>Nouvelle conversation</T>
            </Pressable>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 16, gap: 4 }}>
              {convs.length === 0 ? <T size={14} color={c.faint} style={{ padding: 12 }}>Aucune conversation pour l'instant.</T> : convs.map((x) => {
                const premiere = x.messages.find((m) => m.role === 'user')?.content ?? 'Conversation';
                return (
                  <Pressable key={x.id} onPress={() => { setCourante(x.id); setHistorique(false); }} style={{ borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: x.id === courante ? c.av50 : 'transparent' }}>
                    <T size={14} weight="500" lines={1}>{premiere}</T>
                    <T size={12} color={c.faint}>{new Date(x.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</T>
                  </Pressable>
                );
              })}
            </ScrollView>
            {convs.length > 0 && (
              <Pressable onPress={() => confirmer('Tout oublier ?', "L'assistant oubliera toutes vos conversations et ce que tu lui as confié.", 'Annuler', () => { setConvs(() => []); setCourante(null); setHistorique(false); })} style={{ margin: 16, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Trash2 size={13} color="#E11D48" /><T size={12} weight="600" color="#E11D48">Tout oublier</T>
              </Pressable>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function Reponse({ id, question, reponse }: { id: string; question: string; reponse: string }) {
  const { c, estFavori, basculerFavori } = useApp();
  const garde = estFavori(id);
  return (
    <Pressable onPress={() => { tap(); basculerFavori({ id, type: 'Réponse', texte: question, resume: reponse.replace(/\*\*/g, '') }); }}
      style={{ marginTop: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: garde ? c.rose100 : c.stone100 }}>
      <Heart size={14} color={garde ? c.rose600 : c.muted} fill={garde ? c.rose600 : 'none'} /><T size={12} weight="600" color={garde ? c.rose600 : c.muted}>{garde ? 'Gardée' : 'Garder cette réponse'}</T>
    </Pressable>
  );
}
