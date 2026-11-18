import { router } from 'expo-router';
import { ArrowLeft, Lock, Mail, Shield } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useApp } from '@/store';
import { H, SoleilEntier, T, t, tap } from '@/ui';

// Page de connexion de la 1re beta (bandeau de l'aube, soleil entier, gros boutons ronds),
// avec la connexion et la création de compte par email du site.
export function EcranAuth({ mode }: { mode: 'connexion' | 'inscription' }) {
  const { c, ouvrirCompte, existe } = useApp();
  const insets = useSafeAreaInsets();
  const [vue, setVue] = useState<'choix' | 'connexion' | 'inscription'>(mode === 'inscription' ? 'inscription' : 'choix');
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [mdp2, setMdp2] = useState('');
  const [erreur, setErreur] = useState('');
  const inscription = vue === 'inscription';

  // Un compte = un seul profil : s'il existe déjà, on retrouve son côté (patient OU proche), sinon on passe par l'inscription.
  const entrer = (id: string) => { const p = ouvrirCompte(id); router.replace(p ? (`/${p}` as const) : '/bienvenue'); };
  const valider = () => {
    const id = email.trim().toLowerCase();
    if (!id.includes('@') || mdp.length < 6) return setErreur(inscription ? t('auth.registerError') : t('auth.loginError'));
    if (inscription && mdp !== mdp2) return setErreur(t('auth.passwordMismatch'));
    if (inscription && existe(id)) return setErreur('Un compte existe déjà avec cet email. Connecte-toi.');
    if (!inscription && !existe(id)) return setErreur("Aucun compte avec cet email. Crée-en un.");
    setErreur(''); entrer(id);
  };
  const changer = (v: typeof vue) => { tap(); setVue(v); setErreur(''); };
  const pilule = { height: 54, borderRadius: 27, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 10 };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ height: vue === 'choix' ? 320 : 210, backgroundColor: '#FBEFC2', borderBottomLeftRadius: 40, borderBottomRightRadius: 40, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', paddingTop: insets.top }}>
          <Svg width="100%" height="100%" viewBox="0 0 390 330" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <Path d="M0 250 C 80 210, 150 230, 210 250 S 330 280, 390 240 L 390 330 L 0 330 Z" fill="#FFE3CF" />
            <Path d="M0 285 C 90 260, 180 270, 260 290 S 360 300, 390 290 L 390 330 L 0 330 Z" fill={c.bg} />
          </Svg>
          <SoleilEntier size={vue === 'choix' ? 120 : 76} />
          {vue !== 'choix' && mode !== 'inscription' && (
            <Pressable accessibilityRole="button" accessibilityLabel="Retour" onPress={() => changer('choix')} style={{ position: 'absolute', top: insets.top + 8, left: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeft size={20} color="#1E293B" />
            </Pressable>
          )}
        </View>

        <View style={{ flex: 1, padding: 28, paddingBottom: insets.bottom + 24, gap: 20 }}>
          <View style={{ gap: 8 }}>
            <H size={30} center>{vue === 'choix' ? 'Bienvenue sur Aurore' : inscription ? t('auth.createAccount') : t('auth.welcomeBack')}</H>
            {vue === 'choix' && <T color={c.muted} center>Un espace doux pour retrouver ce qui te fait vivre.</T>}
          </View>

          {vue === 'choix' ? (
            <View style={{ gap: 12 }}>
              <Pressable accessibilityRole="button" onPress={() => { tap(); entrer('apple'); }} style={({ pressed }) => [pilule, { backgroundColor: '#000000', opacity: pressed ? 0.85 : 1 }]}>
                <LogoApple /><T size={17} weight="600" color="#FFFFFF">Continuer avec Apple</T>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => { tap(); entrer('google'); }} style={({ pressed }) => [pilule, { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E8D9C6', opacity: pressed ? 0.85 : 1 }]}>
                <LogoGoogle /><T size={17} weight="600" color="#1E293B">Continuer avec Google</T>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => changer('connexion')} style={({ pressed }) => [pilule, { backgroundColor: c.navPill, opacity: pressed ? 0.85 : 1 }]}>
                <Mail size={20} color={c.ink} /><T size={17} weight="600">Continuer avec un email</T>
              </Pressable>
            </View>
          ) : (
            <View style={{ gap: 14 }}>
              {!!erreur && <View style={{ padding: 12, borderRadius: 14, backgroundColor: c.rose50 }}><T size={14} color={c.rose600}>{erreur}</T></View>}
              <ChampIcone label={t('auth.email')} Icone={Mail} value={email} onChangeText={setEmail} placeholder={t('auth.emailPlaceholder')} email />
              <ChampIcone label={t('auth.password')} Icone={Lock} value={mdp} onChangeText={setMdp} placeholder="••••••••" secret
                droite={!inscription ? <T size={12} color={c.accent} onPress={() => {}}>{t('auth.forgotPassword')}</T> : undefined} />
              {inscription && <ChampIcone label={t('auth.confirmPassword')} Icone={Lock} value={mdp2} onChangeText={setMdp2} placeholder="••••••••" secret />}
              <Pressable accessibilityRole="button" onPress={() => { tap(); valider(); }} style={({ pressed }) => [pilule, { backgroundColor: c.dark, opacity: pressed ? 0.9 : 1 }]}>
                <T size={16} weight="600" color={c.bg}>{inscription ? t('auth.registerBtn') : t('auth.loginBtn')}</T>
              </Pressable>
              <T size={14} color={c.muted} center>
                {inscription ? t('auth.alreadyAccount') : t('auth.noAccount')}{' '}
                <T size={14} weight="700" color={c.ink} onPress={() => changer(inscription ? 'connexion' : 'inscription')}>{inscription ? t('auth.loginBtn') : t('auth.createOne')}</T>
              </T>
            </View>
          )}

          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 }}>
            <Shield size={14} color={c.faint} />
            <T size={12} lh={18} color={c.faint} style={{ flexShrink: 1 }}>En continuant, tu acceptes les conditions générales d'utilisation et la politique de confidentialité.</T>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ChampIcone({ label, Icone, value, onChangeText, placeholder, secret, email, droite }: { label: string; Icone: typeof Mail; value: string; onChangeText: (v: string) => void; placeholder: string; secret?: boolean; email?: boolean; droite?: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <T size={14} weight="600" color="#475569">{label}</T>
        {droite}
      </View>
      <View style={{ justifyContent: 'center' }}>
        <View style={{ position: 'absolute', left: 12, zIndex: 1 }}><Icone size={16} color="#737373" /></View>
        <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#A3A3A3" accessibilityLabel={label}
          secureTextEntry={secret} keyboardType={email ? 'email-address' : 'default'} autoCapitalize="none" autoComplete={email ? 'email' : secret ? 'password' : undefined}
          style={{ height: 52, borderRadius: 16, borderWidth: 1, borderColor: '#E8D9C6', backgroundColor: '#FFFFFF', paddingLeft: 40, paddingRight: 12, fontSize: 15, color: '#1E293B' }} />
      </View>
    </View>
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
