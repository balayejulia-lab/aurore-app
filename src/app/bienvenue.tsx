import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, type Envie, type Profil } from '@/store';
import { Bouton, Champ, Icon, Puce, RondBouton, SoleilEntier, T, Titre, tap, type IconName } from '@/ui';

const ETAPES = 6;
const ENVIES_PROPOSEES: [Envie['categorie'], string][] = [
  ['Passion', 'Reprendre la musique'], ['Passion', 'Dessiner, peindre'], ['Rêve', 'Voyager'],
  ['Projet', 'Reprendre mes études'], ['Passion', 'Faire du jardinage'], ['Rêve', 'Aller à un concert'],
  ['Projet', 'Retrouver mes amis'], ['Passion', 'Lire à nouveau'],
];

export default function Bienvenue() {
  const app = useApp();
  const { c } = app;
  const insets = useSafeAreaInsets();
  const [etape, setEtape] = useState(0);
  const [profil, setProfil] = useState<Profil | null>(null);
  const [prenom, setPrenom] = useState('');
  const [lettreOuverte, setLettreOuverte] = useState(false);
  const [choix, setChoix] = useState<string[]>([]);
  const [code, setCode] = useState('');

  const suivant = () => {
    if (etape === 1) app.setPrenom(prenom.trim());
    if (etape === 3 && profil === 'patient') ENVIES_PROPOSEES.filter(([, t]) => choix.includes(t)).forEach(([cat, t]) => app.ajouterEnvie(cat, t));
    if (etape < ETAPES - 1) return setEtape(etape + 1);
    app.setProfil(profil!);
    app.setLien(profil === 'proche' ? 'Juju' : 'Maman'); // beta : un proche fictif déjà lié pour voir les petits mots
    router.replace(profil === 'proche' ? '/proche' : '/patient');
  };
  const peutContinuer = [!!profil, prenom.trim().length > 0, lettreOuverte, true, true, true][etape];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 24, gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 }}>
          {etape > 0 ? <RondBouton icone="left" label="Étape précédente" onPress={() => setEtape(etape - 1)} /> : <View style={{ width: 44 }} />}
          <View accessibilityLabel={`Étape ${etape + 1} sur ${ETAPES}`} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: c.line }}>
            <View style={{ width: `${((etape + 1) / ETAPES) * 100}%`, height: 6, borderRadius: 3, backgroundColor: c.gold }} />
          </View>
          <T size={13} weight="semibold" color={c.muted}>{etape + 1}/{ETAPES}</T>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, gap: 22 }} keyboardShouldPersistTaps="handled">
        <Animated.View key={etape} entering={FadeInDown.duration(500)} style={{ gap: 22 }}>
          {etape === 0 && (
            <>
              <EnTete titre="Qui es-tu sur Aurore ?" texte="Pour te proposer l'espace qui te correspond." />
              <ChoixProfil icone="sparkle" titre="Je reprends ma vie en main" texte="Un espace pour retrouver tes envies, à ton rythme." actif={profil === 'patient'} onPress={() => setProfil('patient')} />
              <ChoixProfil icone="heart" titre="J'accompagne un proche" texte="Des idées et du soutien pour être là, et prendre soin de toi aussi." actif={profil === 'proche'} onPress={() => setProfil('proche')} />
            </>
          )}

          {etape === 1 && (
            <>
              <EnTete titre="Comment veux-tu qu'on t'appelle ?" texte="Un prénom, un surnom… ce qui te fait du bien." />
              <Champ label="Ton prénom ou surnom" value={prenom} onChangeText={setPrenom} placeholder="Juju" autoFocus maxLength={30} returnKeyType="next" onSubmitEditing={() => prenom.trim() && suivant()} />
            </>
          )}

          {etape === 2 && (
            <>
              <EnTete titre="Une lettre t'attend" texte={lettreOuverte ? 'Prends ton temps pour la lire.' : "Touche l'enveloppe pour l'ouvrir."} />
              {!lettreOuverte ? (
                <Pressable accessibilityRole="button" accessibilityLabel="Ouvrir la lettre" onPress={() => { tap(); setLettreOuverte(true); }}
                  style={({ pressed }) => ({ alignSelf: 'center', marginTop: 20, transform: [{ scale: pressed ? 0.96 : 1 }] })}>
                  <View style={{ width: 260, height: 170, borderRadius: 20, backgroundColor: c.peach, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <View style={{ position: 'absolute', top: -130, width: 260, height: 260, transform: [{ rotate: '45deg' }], backgroundColor: c.soft, borderRadius: 24 }} />
                    <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: c.card, alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                      <SoleilEntier size={34} />
                    </View>
                  </View>
                </Pressable>
              ) : (
                <Animated.View entering={FadeIn.duration(700)} style={{ backgroundColor: c.card, borderRadius: 24, padding: 22, gap: 12 }}>
                  <T size={17} weight="title">{profil === 'proche' ? 'À toi qui accompagnes,' : `À toi, ${prenom.trim() || 'qui arrives ici'},`}</T>
                  {profil === 'proche' ? (
                    <>
                      <T>Si tu es ici, c'est que tu aimes quelqu'un qui traverse une période difficile. Ça demande du courage, et beaucoup d'amour.</T>
                      <T>Tu n'as pas besoin d'être parfait·e pour être un vrai soutien. Ici, tu trouveras des idées, des mots, et un espace rien que pour toi.</T>
                    </>
                  ) : (
                    <>
                      <T>Aurore n'est pas un endroit pour parler de la maladie. C'est un endroit pour parler de toi, de ce que tu aimes, de ce qui t'attend.</T>
                      <T>Ici, rien ne se perd et rien ne recule. Chaque petit pas compte, même les plus discrets.</T>
                    </>
                  )}
                  <T weight="semibold" color={c.link}>L'équipe Aurore</T>
                </Animated.View>
              )}
            </>
          )}

          {etape === 3 && profil === 'patient' && (
            <>
              <EnTete titre="Qu'est-ce qui te fait envie ?" texte="Choisis-en quelques-unes, tu pourras en ajouter d'autres plus tard." />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {ENVIES_PROPOSEES.map(([, t]) => (
                  <Puce key={t} titre={t} actif={choix.includes(t)} onPress={() => setChoix((l) => (l.includes(t) ? l.filter((x) => x !== t) : [...l, t]))} />
                ))}
              </View>
            </>
          )}
          {etape === 3 && profil === 'proche' && (
            <>
              <EnTete titre="Ce que tu trouveras ici" texte="Trois choses simples, pour toi." />
              <Point icone="gift" titre="Des petites attentions" texte="Des idées concrètes pour faire du bien, sans pression." />
              <Point icone="sparkle" titre="Un assistant bienveillant" texte="Pour trouver les mots quand c'est difficile." />
              <Point icone="smile" titre="Un espace pour toi" texte="Parce que prendre soin de toi compte aussi." />
            </>
          )}

          {etape === 4 && (
            <>
              <EnTete
                titre={profil === 'proche' ? 'Te lier à ton proche' : 'Inviter un proche'}
                texte={profil === 'proche' ? 'Entre le code que ton proche t’a donné pour vous envoyer des petits mots.' : 'Si tu veux, un proche peut te rejoindre pour t’envoyer des petits mots. Rien d’autre n’est partagé.'} />
              {profil === 'proche' ? (
                <Champ label="Code d'invitation" value={code} onChangeText={(t) => setCode(t.toUpperCase())} placeholder="AURORE-1234" autoCapitalize="characters" maxLength={11} />
              ) : (
                <View style={{ backgroundColor: c.soft, borderRadius: 24, padding: 22, alignItems: 'center', gap: 6 }}>
                  <T size={14} color={c.muted}>Ton code à partager</T>
                  <T size={28} weight="bold" style={{ letterSpacing: 2 }}>AURORE-4821</T>
                </View>
              )}
              <T size={14} color={c.muted} center>Tu peux aussi le faire plus tard dans les réglages.</T>
            </>
          )}

          {etape === 5 && (
            <>
              <View style={{ alignItems: 'center', paddingTop: 10 }}><SoleilEntier size={90} /></View>
              <EnTete titre="Avant de commencer" texte="Deux choses importantes." />
              <Point icone="aide" titre="Le bouton « Aide » est toujours là" texte="En haut de chaque écran. Un geste suffit pour trouver quelqu'un à qui parler, à tout moment." />
              <Point icone="shield" titre="Aurore ne remplace pas un suivi médical" texte="L'app t'accompagne vers l'avenir, aux côtés des professionnels qui te suivent." />
            </>
          )}
        </Animated.View>

        <View style={{ flex: 1 }} />
        <View style={{ gap: 10, paddingBottom: insets.bottom + 8 }}>
          <Bouton titre={etape === ETAPES - 1 ? 'Commencer' : 'Continuer'} onPress={suivant} disabled={!peutContinuer} />
          {etape === 4 && <Bouton variante="doux" titre="Plus tard" onPress={suivant} />}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function EnTete({ titre, texte }: { titre: string; texte: string }) {
  const { c } = useApp();
  return (
    <View style={{ gap: 8 }}>
      <Titre size={28}>{titre}</Titre>
      <T color={c.muted}>{texte}</T>
    </View>
  );
}

function ChoixProfil({ icone, titre, texte, actif, onPress }: { icone: IconName; titre: string; texte: string; actif: boolean; onPress: () => void }) {
  const { c } = useApp();
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ checked: actif }} onPress={() => { tap(); onPress(); }}
      style={{ flexDirection: 'row', gap: 14, alignItems: 'center', padding: 20, borderRadius: 26, borderWidth: 2, borderColor: actif ? c.gold : c.line, backgroundColor: actif ? c.soft : c.card }}>
      <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: c.peach, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icone} size={24} color={c.link} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <T size={17} weight="semibold">{titre}</T>
        <T size={14.5} color={c.muted}>{texte}</T>
      </View>
      {actif && <Icon name="check" size={22} color={c.link} width={2.4} />}
    </Pressable>
  );
}

function Point({ icone, titre, texte }: { icone: IconName; titre: string; texte: string }) {
  const { c } = useApp();
  return (
    <View style={{ flexDirection: 'row', gap: 14, padding: 18, borderRadius: 24, backgroundColor: c.card }}>
      <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: c.peach, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icone} size={22} color={c.link} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <T weight="semibold">{titre}</T>
        <T size={14.5} color={c.muted}>{texte}</T>
      </View>
    </View>
  );
}
