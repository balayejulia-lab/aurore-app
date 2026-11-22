import { router } from 'expo-router';
import { ArrowLeft, Bell, Compass, Heart, HeartHandshake, LifeBuoy, Mail, Sparkles, Target, Users, type LucideIcon } from 'lucide-react-native';
import { useEffect, useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CO_FOUNDERS_LETTER_PARAGRAPHS } from '@/contenu/coFoundersLetter';
import { FOUNDERS_LETTER_PARAGRAPHS } from '@/contenu/foundersLetter';
import { autoriser } from '@/notifications';
import { useApp, type Profil } from '@/store';
import { BoutonPlein, ChoixAmbiance, H, T, tap } from '@/ui';

// Inscription du site, étape par étape, avec les lettres d'origine.
const FONCTIONS: [LucideIcon, string, string, string, string][] = [
  [Compass, '#0F766E', '#F0FDFA', 'Ton paysage évolutif', 'Ton parcours se transforme en un paysage qui se colore et prend vie à mesure que tu coches tes objectifs.'],
  [Target, '#B45309', '#FFFBEB', 'Ton avenir, à ton rythme', "Note tes projets, tes passions, tes raisons d'avancer — petits pas après petits pas."],
  [Sparkles, '#BE123C', '#FFF1F2', "De l'inspiration chaque jour", 'Phrases, témoignages et images pour nourrir ton élan et te recentrer.'],
  [Users, '#7D34C5', '#F5E3E6', 'Un espace pour tes proches', "Des réponses fondées et des témoignages pour celles et ceux qui t'aiment."],
  [LifeBuoy, '#0369A1', '#F0F9FF', 'Une présence rassurante', "Ressources d'urgence et contacts, toujours à portée quand tu en as besoin."],
];

export default function Bienvenue() {
  const app = useApp();
  const { c } = app;
  const insets = useSafeAreaInsets();
  const [etape, setEtape] = useState(0);
  const [profil, setProfil] = useState<Profil | null>(null);
  const [surnom, setSurnom] = useState('');
  // Un compte qui a déjà choisi son côté ne repasse jamais par ce choix.
  useEffect(() => { if (app.profil) router.replace(`/${app.profil}`); }, [app.profil]);

  const terminer = (p: Profil) => {
    app.choisirProfil(p);
    app.setSurnom(surnom.trim());
    router.replace(`/${p}`);
  };
  const choisir = (p: Profil) => { setProfil(p); setEtape(1); };
  const retour = () => setEtape((e) => e - 1);
  // Patient : 1 lettre, 2 rappel, 3 bienvenue, 4 surnom, 5 notifications. Proche : 1 lettre, 2 prénom, 3 notifications.
  const etapeNom = profil === 'proche' ? 2 : 4;
  const fin = etapeNom + 1;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16, paddingTop: insets.top + 32, paddingBottom: insets.bottom + 40 }} keyboardShouldPersistTaps="handled">
        <Animated.View key={etape} entering={FadeIn.duration(350)}>
          {etape === 0 && (
            <>
              <View style={{ marginBottom: 40 }}>
                <H size={30} center>Pour t'accompagner au mieux</H>
                <T color={c.muted} center style={{ marginTop: 12 }}>Indique qui tu es. Tu accèderas ensuite à l'espace fait pour toi.</T>
              </View>
              <View style={{ gap: 20 }}>
                <CarteChoix Icone={Heart} fond="#F0FDFA" couleur="#0F766E" titre="Je reprends ma vie en main" texte="Je vis cette épreuve et je veux avancer vers mes projets et mon avenir." onPress={() => choisir('patient')} />
                <CarteChoix Icone={Users} fond={c.av100} couleur={c.av700} titre="Je suis un proche" texte="J'accompagne une personne atteinte et je veux l'aider au mieux, au quotidien." onPress={() => choisir('proche')} />
              </View>
              <T size={12} color={c.faint} center style={{ marginTop: 32 }}>Ce choix oriente simplement ton espace. Tu pourras le personnaliser ensuite.</T>
            </>
          )}

          {etape === 1 && (
            <Lettre proche={profil === 'proche'} onBack={retour} onContinue={() => setEtape(2)} />
          )}

          {etape === 2 && profil === 'patient' && (
            <>
              <Retour onPress={retour} />
              <View style={{ marginBottom: 32, alignItems: 'center' }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#CCFBF1', alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(153,246,228,0.7)' }}><Heart size={26} color="#0D9488" /></View>
                <H size={30} center>Ce qu'Aurore peut faire pour toi</H>
              </View>
              <Boite>
                <T size={18} weight="500" color={c.ink} lh={32}>Elle ne guérit pas à ta place.</T>
                <T size={15} color={c.soft} lh={32}>Elle ne remplace pas les professionnels qui t'accompagnent.</T>
                <T size={15} weight="600" color={c.ink} lh={32}>Mais elle peut être là, chaque jour, pour te rappeler pourquoi tu continues.</T>
              </Boite>
              <Suivant titre="Continuer" onPress={() => setEtape(3)} />
            </>
          )}

          {etape === 3 && (
            <>
              <View style={{ marginBottom: 40, alignItems: 'center' }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1, borderColor: c.ring }}><Sparkles size={30} color="#F59E0B" /></View>
                <H size={30} center>Bienvenue sur Aurore</H>
                <T color={c.muted} center style={{ marginTop: 12 }}>Un espace doux et lumineux pour reconstruire, à ton rythme, après une épreuve liée aux troubles alimentaires. Ici, on parle d'avenir, de projets et de ce qui te fait tenir.</T>
              </View>
              <View style={{ gap: 16 }}>
                {FONCTIONS.map(([Icone, col, fond, titre, texte]) => (
                  <View key={titre} style={{ flexDirection: 'row', gap: 16, padding: 20, borderRadius: 24, backgroundColor: c.surface, borderWidth: 1, borderColor: c.ring }}>
                    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: fond, alignItems: 'center', justifyContent: 'center' }}><Icone size={20} color={col} /></View>
                    <View style={{ flex: 1 }}>
                      <H size={16}>{titre}</H>
                      <T size={14} color={c.muted} lh={24} style={{ marginTop: 4 }}>{texte}</T>
                    </View>
                  </View>
                ))}
              </View>
              <Ambiance />
              <T size={12} lh={20} color={c.faint} center style={{ marginTop: 24 }}>Aurore t'accompagne et ne remplace pas un suivi médical ou psychologique. En cas de détresse, tu trouves des ressources d'urgence dans l'app.</T>
              <Suivant titre="Commencer" onPress={() => setEtape(4)} />
            </>
          )}

          {etape === etapeNom && profil && (
            <>
              <Retour onPress={retour} />
              <View style={{ marginBottom: 32 }}>
                <H size={30} center>Comment veux-tu qu'on t'appelle ?</H>
                <T color={c.muted} center style={{ marginTop: 12 }}>{profil === 'proche' ? "Ton prénom ou un surnom, c'est toi qui choisis." : 'Choisis ton surnom pour ton aventure dans Aurore.'}</T>
              </View>
              <Boite>
                <T size={14} weight="600" color={c.text}>{profil === 'proche' ? 'Ton prénom' : 'Ton surnom'} <T size={14} weight="400" color={c.faint}>(optionnel)</T></T>
                <TextInput value={surnom} onChangeText={setSurnom} maxLength={30} placeholder="Un surnom, comme tu veux qu'on te salue…" placeholderTextColor={c.faint}
                  accessibilityLabel="Ton surnom" returnKeyType="next" onSubmitEditing={() => setEtape(fin)}
                  style={{ marginTop: 8, height: 44, borderRadius: 12, borderWidth: 1, borderColor: c.ring, paddingHorizontal: 16, fontSize: 14, color: c.ink, backgroundColor: c.surface }} />
              </Boite>
              <Suivant titre="Continuer" onPress={() => setEtape(fin)} />
            </>
          )}

          {etape === fin && profil && (
            <Notifications proche={profil === 'proche'} onBack={retour} onContinue={() => terminer(profil)} />
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function CarteChoix({ Icone, fond, couleur, titre, texte, onPress }: { Icone: LucideIcon; fond: string; couleur: string; titre: string; texte: string; onPress: () => void }) {
  const { c } = useApp();
  return (
    <Pressable accessibilityRole="button" onPress={() => { tap(); onPress(); }}
      style={({ pressed }) => ({ alignItems: 'center', padding: 32, borderRadius: 24, backgroundColor: c.surface, borderWidth: 1, borderColor: c.ring, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, transform: [{ scale: pressed ? 0.98 : 1 }] })}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: fond, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}><Icone size={28} color={couleur} /></View>
      <H size={20} center>{titre}</H>
      <T size={14} color={c.muted} center style={{ marginTop: 8 }}>{texte}</T>
    </Pressable>
  );
}

function Retour({ onPress }: { onPress: () => void }) {
  const { c } = useApp();
  return (
    <Pressable accessibilityRole="button" hitSlop={8} onPress={() => { tap(); onPress(); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', marginBottom: 24 }}>
      <ArrowLeft size={16} color={c.muted} /><T size={14} color={c.muted}>Retour</T>
    </Pressable>
  );
}

function Boite({ children }: { children: ReactNode }) {
  const { c } = useApp();
  return <View style={{ padding: 28, borderRadius: 24, backgroundColor: c.surface, borderWidth: 1, borderColor: c.ring, gap: 20 }}>{children}</View>;
}

const Suivant = ({ titre, onPress }: { titre: string; onPress: () => void }) => (
  <View style={{ marginTop: 32, alignItems: 'center' }}><BoutonPlein titre={titre} onPress={onPress} /></View>
);

function Ambiance() {
  const { c } = useApp();
  return (
    <View style={{ marginTop: 24, alignItems: 'center', gap: 12, padding: 20, borderRadius: 24, backgroundColor: c.surface, borderWidth: 1, borderColor: c.ring }}>
      <View style={{ alignItems: 'center' }}>
        <H size={16}>Choisis ton ambiance</H>
        <T size={14} color={c.muted} center style={{ marginTop: 4 }}>Tu pourras en changer à tout moment dans les Réglages.</T>
      </View>
      <ChoixAmbiance />
    </View>
  );
}

function Lettre({ proche, onBack, onContinue }: { proche: boolean; onBack: () => void; onContinue: () => void }) {
  const { c } = useApp();
  const [ouverte, setOuverte] = useState(false);
  const paragraphes = proche ? CO_FOUNDERS_LETTER_PARAGRAPHS : FOUNDERS_LETTER_PARAGRAPHS;
  return (
    <>
      <Retour onPress={onBack} />
      <View style={{ marginBottom: 32 }}><H size={30} center>{proche ? 'Un mot du co-fondateur' : 'Un mot de la co-fondatrice principale'}</H></View>
      {!ouverte ? (
        <View style={{ alignItems: 'center', padding: 32, borderRadius: 24, backgroundColor: c.surface, borderWidth: 1, borderColor: c.ring }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: proche ? '#F5F3FF' : '#FFFBEB', alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1, borderColor: c.ring }}>
            <Mail size={28} color={proche ? '#6D28D9' : '#D97706'} />
          </View>
          <T size={14} color={c.muted} center>Un petit mot t'attend avant de continuer.</T>
          <BoutonPlein titre="Ouvrir la lettre" onPress={() => setOuverte(true)} style={{ marginTop: 20, alignSelf: 'stretch' }} />
          <T size={14} color={c.faint} center style={{ marginTop: 12, paddingVertical: 4 }} onPress={onContinue}>Continuer sans la lire</T>
        </View>
      ) : (
        <Animated.View entering={FadeIn.duration(500)}>
          <Boite>
            {paragraphes.map((p, i) => (
              <T key={i} size={p.emphasis ? 18 : 15} weight={p.emphasis ? '500' : '400'} lh={p.emphasis ? 28 : 32} color={p.emphasis ? c.ink : c.soft}>{p.text}</T>
            ))}
          </Boite>
          {proche && (
            <>
              <View style={{ marginTop: 24, flexDirection: 'row', gap: 12, padding: 20, borderRadius: 24, backgroundColor: 'rgba(245,243,255,0.6)', borderWidth: 1, borderColor: '#EDE9FE' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}><HeartHandshake size={17} color="#6D28D9" /></View>
                <T size={14} lh={24} color={c.soft} style={{ flex: 1 }}>On n'est pas des professionnels de santé, mais on va t'aider du mieux qu'on peut, à chaque étape. Aurore ne remplace pas un avis médical ou psychologique — si tu as un doute sur une urgence, les ressources et contacts d'urgence sont toujours accessibles dans l'app.</T>
              </View>
              <Ambiance />
            </>
          )}
          <Suivant titre="Continuer" onPress={onContinue} />
        </Animated.View>
      )}
    </>
  );
}

function Notifications({ proche, onBack, onContinue }: { proche: boolean; onBack: () => void; onContinue: () => void }) {
  const { c } = useApp();
  const [active, setActive] = useState(false);
  return (
    <>
      <Retour onPress={onBack} />
      <View style={{ marginBottom: 32, alignItems: 'center' }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFFBEB', alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1, borderColor: c.ring }}><Bell size={28} color="#D97706" /></View>
        <H size={30} center>Active tes notifications</H>
        <T color={c.muted} center style={{ marginTop: 12 }}>{proche
          ? "Tu recevras une notification quand la personne que tu accompagnes t'envoie un mot de soutien. C'est le seul moyen de le recevoir en dehors de l'app — pense à accepter."
          : "Une citation chaque matin pour t'accompagner, et un mot si un proche t'en envoie un. Une seule notification par jour pour la citation, jamais plus — pense à accepter."}</T>
      </View>
      <View style={{ padding: 24, borderRadius: 24, backgroundColor: c.surface, borderWidth: 1, borderColor: c.ring, alignItems: 'center' }}>
        {/* Vraie demande d'autorisation iOS ; le contenu quotidien est programmé ailleurs. */}
        {active ? <T size={14} weight="600" color="#0F766E">Activées, merci !</T> : <BoutonPlein titre="Activer les notifications" onPress={() => autoriser().then(setActive)} style={{ alignSelf: 'stretch' }} />}
      </View>
      <Suivant titre={active ? 'Continuer' : 'Plus tard'} onPress={onContinue} />
    </>
  );
}
