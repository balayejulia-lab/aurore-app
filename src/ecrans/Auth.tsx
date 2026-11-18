import { router } from 'expo-router';
import { Lock, LogIn, Mail, UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useApp } from '@/store';
import { T, t, tap } from '@/ui';

// Page de connexion / inscription du site (AuthLayout), avec en plus Apple et Google.
// Beta : aucun vrai compte, chaque bouton mène à la suite du parcours.
export function EcranAuth({ mode }: { mode: 'connexion' | 'inscription' }) {
  const { setConnecte, profil } = useApp();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [mdp2, setMdp2] = useState('');
  const [erreur, setErreur] = useState('');
  const inscription = mode === 'inscription';
  const Icone = inscription ? UserPlus : LogIn;

  const entrer = () => { setConnecte(true); router.replace(profil ? (`/${profil}` as const) : '/bienvenue'); };
  const valider = () => {
    if (!email.includes('@') || mdp.length < 6) return setErreur(inscription ? t('auth.registerError') : t('auth.loginError'));
    if (inscription && mdp !== mdp2) return setErreur(t('auth.passwordMismatch'));
    setErreur(''); entrer();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: '#171717', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Icone size={28} color="#FAFAFA" />
          </View>
          <T size={30} weight="700" color="#0A0A0A" lh={36} center>{inscription ? t('auth.createAccount') : t('auth.welcomeBack')}</T>
          <T color="#737373" center style={{ marginTop: 8 }}>{inscription ? t('auth.registerSubtitle') : t('auth.loginSubtitle')}</T>
        </View>

        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E5E5', padding: 24, gap: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } }}>
          <BoutonSocial titre="Continuer avec Apple" noir onPress={entrer} logo={<LogoApple />} />
          <BoutonSocial titre="Continuer avec Google" onPress={entrer} logo={<LogoGoogle />} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E5E5E5' }} />
            <T size={13} color="#737373">{t('auth.or')}</T>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E5E5E5' }} />
          </View>
          {!!erreur && <View style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.1)' }}><T size={14} color="#DC2626">{erreur}</T></View>}
          <ChampIcone label={t('auth.email')} Icone={Mail} value={email} onChangeText={setEmail} placeholder={t('auth.emailPlaceholder')} email />
          <ChampIcone label={t('auth.password')} Icone={Lock} value={mdp} onChangeText={setMdp} placeholder="••••••••" secret
            droite={!inscription ? <T size={12} color="#171717" onPress={() => {}}>{t('auth.forgotPassword')}</T> : undefined} />
          {inscription && <ChampIcone label={t('auth.confirmPassword')} Icone={Lock} value={mdp2} onChangeText={setMdp2} placeholder="••••••••" secret />}
          <Pressable accessibilityRole="button" onPress={() => { tap(); valider(); }}
            style={({ pressed }) => ({ height: 48, borderRadius: 8, backgroundColor: '#171717', alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.9 : 1 })}>
            <T size={14} weight="500" color="#FAFAFA">{inscription ? t('auth.registerBtn') : t('auth.loginBtn')}</T>
          </Pressable>
          {inscription && (
            <T size={12} color="#737373" center lh={18}>En créant un compte, tu acceptes nos <T size={12} color="#171717">conditions générales d'utilisation</T> et notre <T size={12} color="#171717">politique de confidentialité</T>.</T>
          )}
        </View>

        <T size={14} color="#737373" center style={{ marginTop: 24 }}>
          {inscription ? t('auth.alreadyAccount') : t('auth.noAccount')}{' '}
          <T size={14} weight="600" color="#171717" onPress={() => (inscription ? router.back() : router.push('/inscription'))}>{inscription ? t('auth.loginBtn') : t('auth.createOne')}</T>
        </T>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ChampIcone({ label, Icone, value, onChangeText, placeholder, secret, email, droite }: { label: string; Icone: typeof Mail; value: string; onChangeText: (v: string) => void; placeholder: string; secret?: boolean; email?: boolean; droite?: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <T size={14} weight="500" color="#0A0A0A">{label}</T>
        {droite}
      </View>
      <View style={{ justifyContent: 'center' }}>
        <View style={{ position: 'absolute', left: 12, zIndex: 1 }}><Icone size={16} color="#737373" /></View>
        <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#A3A3A3" accessibilityLabel={label}
          secureTextEntry={secret} keyboardType={email ? 'email-address' : 'default'} autoCapitalize="none" autoComplete={email ? 'email' : secret ? 'password' : undefined}
          style={{ height: 48, borderRadius: 8, borderWidth: 1, borderColor: '#E5E5E5', paddingLeft: 40, paddingRight: 12, fontSize: 15, color: '#0A0A0A' }} />
      </View>
    </View>
  );
}

function BoutonSocial({ titre, onPress, logo, noir }: { titre: string; onPress: () => void; logo: React.ReactNode; noir?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={() => { tap(); onPress(); }}
      style={({ pressed }) => ({ height: 48, borderRadius: 8, borderWidth: noir ? 0 : 1, borderColor: '#E5E5E5', backgroundColor: noir ? '#000000' : '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: pressed ? 0.85 : 1 })}>
      {logo}
      <T size={15} weight="600" color={noir ? '#FFFFFF' : '#0A0A0A'}>{titre}</T>
    </Pressable>
  );
}

const LogoApple = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24"><Path fill="#FFFFFF" d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.45-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.27-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.39-.92-2.41-3.64zM14.1 5.86c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.6-2.66 1.37-.58.67-1.09 1.75-.95 2.79 1.01.08 2.04-.51 2.67-1.27z" /></Svg>
);
const LogoGoogle = () => (
  <Svg width={18} height={18} viewBox="0 0 48 48">
    <Path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <Path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <Path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <Path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </Svg>
);
