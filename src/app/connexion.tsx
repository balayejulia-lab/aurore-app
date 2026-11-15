import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useC } from '@/store';
import { Bouton, Champ, Icon, RondBouton, SoleilEntier, T, Titre } from '@/ui';

// Beta : aucun vrai compte. Chaque bouton mène à l'inscription simulée.
export default function Connexion() {
  const c = useC();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState(false);
  const [adresse, setAdresse] = useState('');
  const [mdp, setMdp] = useState('');
  const continuer = () => router.replace('/bienvenue');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ height: email ? 220 : 320, backgroundColor: c.soft, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', paddingTop: insets.top }}>
          <Svg width="100%" height="100%" viewBox="0 0 390 330" preserveAspectRatio="none" style={{ position: 'absolute' }}>
            <Path d="M0 250 C 80 210, 150 230, 210 250 S 330 280, 390 240 L 390 330 L 0 330 Z" fill={c.peach} />
            <Path d="M0 285 C 90 260, 180 270, 260 290 S 360 300, 390 290 L 390 330 L 0 330 Z" fill={c.bg} />
          </Svg>
          <SoleilEntier size={email ? 80 : 120} />
          {email && <View style={{ position: 'absolute', top: insets.top + 8, left: 20 }}><RondBouton icone="left" label="Retour" onPress={() => setEmail(false)} /></View>}
        </View>

        <View style={{ flex: 1, padding: 28, paddingBottom: insets.bottom + 24, gap: 22 }}>
          <View style={{ gap: 8 }}>
            <Titre size={32} center>{email ? 'Avec ton email' : 'Bienvenue sur Aurore'}</Titre>
            <T color={c.muted} center>{email ? 'Crée ton compte ou reconnecte-toi.' : 'Un espace doux pour retrouver ce qui te fait vivre.'}</T>
          </View>

          {email ? (
            <View style={{ gap: 14 }}>
              <Champ label="Email" value={adresse} onChangeText={setAdresse} keyboardType="email-address" autoCapitalize="none" autoComplete="email" placeholder="toi@exemple.fr" />
              <Champ label="Mot de passe" value={mdp} onChangeText={setMdp} secureTextEntry autoComplete="password" placeholder="••••••••" />
              <Bouton titre="Continuer" onPress={continuer} disabled={!adresse.includes('@') || mdp.length < 6} />
              <T size={14} color={c.link} weight="semibold" center>Mot de passe oublié ?</T>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              <Bouton variante="noir" titre="Continuer avec Apple" onPress={continuer} logo={<LogoApple />} />
              <Bouton variante="contour" titre="Continuer avec Google" onPress={continuer} logo={<LogoGoogle />} />
              <Bouton variante="doux" titre="Continuer avec un email" onPress={() => setEmail(true)} icone="mail" />
            </View>
          )}

          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="shield" size={14} color={c.muted} />
            <T size={12.5} color={c.muted} center>En continuant, tu acceptes les conditions d'utilisation et la politique de confidentialité.</T>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const LogoApple = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24"><Path fill="#FFFFFF" d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.45-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.27-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.39-.92-2.41-3.64zM14.1 5.86c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.6-2.66 1.37-.58.67-1.09 1.75-.95 2.79 1.01.08 2.04-.51 2.67-1.27z" /></Svg>
);
const LogoGoogle = () => (
  <Svg width={20} height={20} viewBox="0 0 48 48">
    <Path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <Path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <Path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <Path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </Svg>
);
