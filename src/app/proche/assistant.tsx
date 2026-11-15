import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View, type ScrollViewInstance } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { repondre } from '@/assistant';
import { useApp } from '@/store';
import { font } from '@/theme';
import { Ecran, Icon, Puce, T, tap } from '@/ui';

type Bulle = { moi: boolean; texte: string };
const SUGGESTIONS = ['Elle ne veut pas en parler', 'Quoi lui dire ce soir ?', 'Et moi, je fais comment ?'];

export default function Assistant() {
  const { c, taille } = useApp();
  const [bulles, setBulles] = useState<Bulle[]>([
    { moi: false, texte: "Bonjour. Je suis là pour t'aider à comprendre ce que vit ton proche, et à prendre soin de toi aussi. Qu'aimerais-tu savoir ?" },
  ]);
  const [saisie, setSaisie] = useState('');
  const [ecrit, setEcrit] = useState(false);
  const scroll = useRef<ScrollViewInstance>(null);

  const envoyer = (q: string) => {
    if (!q.trim() || ecrit) return;
    tap();
    setBulles((b) => [...b, { moi: true, texte: q.trim() }]);
    setSaisie('');
    setEcrit(true);
    // Petit délai pour une conversation naturelle (beta : réponses pré-écrites).
    setTimeout(() => { setBulles((b) => [...b, { moi: false, texte: repondre(q) }]); setEcrit(false); }, 900);
  };

  return (
    <Ecran titre="Ton assistant" sousTitre="Des réponses douces, sans jugement" scroll={false}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <ScrollView ref={scroll} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })} contentContainerStyle={{ padding: 20, gap: 12 }}>
          <View style={{ alignSelf: 'center', paddingVertical: 7, paddingHorizontal: 14, borderRadius: 16, backgroundColor: c.soft }}>
            <T size={12.5} color={c.muted} center>Ne remplace pas l'avis d'un professionnel de santé</T>
          </View>
          {bulles.map((b, i) => (
            <Animated.View key={i} entering={FadeInUp.duration(350)}
              style={{ alignSelf: b.moi ? 'flex-end' : 'flex-start', maxWidth: '84%', padding: 14, borderRadius: 22, borderBottomRightRadius: b.moi ? 6 : 22, borderBottomLeftRadius: b.moi ? 22 : 6, backgroundColor: b.moi ? c.bubbleMe : c.card }}>
              <T size={15.5} color={b.moi ? c.bubbleMeText : c.ink}>{b.texte}</T>
            </Animated.View>
          ))}
          {ecrit && <T size={14} color={c.muted}>L'assistant écrit…</T>}
          {bulles.length === 1 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {SUGGESTIONS.map((s) => <Puce key={s} titre={s} onPress={() => envoyer(s)} />)}
            </View>
          )}
        </ScrollView>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 }}>
          <TextInput
            value={saisie} onChangeText={setSaisie} placeholder="Écris ta question…" placeholderTextColor={c.muted}
            accessibilityLabel="Ta question" onSubmitEditing={() => envoyer(saisie)} returnKeyType="send"
            style={{ flex: 1, minHeight: 50, borderRadius: 25, borderWidth: 1.5, borderColor: c.line, backgroundColor: c.card, paddingHorizontal: 18, fontFamily: font.regular, fontSize: 16 * taille, color: c.ink }} />
          <Pressable accessibilityRole="button" accessibilityLabel="Envoyer" onPress={() => envoyer(saisie)}
            style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: c.gold, alignItems: 'center', justifyContent: 'center', opacity: saisie.trim() ? 1 : 0.5 }}>
            <Icon name="up" color="#3B2A20" width={2.2} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Ecran>
  );
}
