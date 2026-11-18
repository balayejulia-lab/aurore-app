import { router } from 'expo-router';
import { Bell, Check, ChevronDown, ChevronRight, Globe, LogOut, Settings, Users } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, Switch, TextInput, View } from 'react-native';
import { CO_FOUNDERS_LETTER_PARAGRAPHS } from '@/contenu/coFoundersLetter';
import { FOUNDERS_LETTER_PARAGRAPHS } from '@/contenu/foundersLetter';
import { EcranUrgence } from '@/ecrans/Urgence';
import { useApp } from '@/store';
import { Bulle, Carte, ChoixAmbiance, Ecran, H, LienRetour, T, t, tap } from '@/ui';

export default function Reglages() {
  const app = useApp();
  const { c } = app;
  const proche = app.profil === 'proche';
  const [surnom, setSurnom] = useState(app.surnom);
  const [enregistre, setEnregistre] = useState(false);
  const [lettre, setLettre] = useState(false);
  const paragraphes = proche ? CO_FOUNDERS_LETTER_PARAGRAPHS : FOUNDERS_LETTER_PARAGRAPHS;

  const deconnexion = () => Alert.alert('Te déconnecter ?', 'Tu pourras te reconnecter à tout moment avec ton compte.', [
    { text: 'Rester connecté·e', style: 'cancel' },
    { text: 'Me déconnecter', style: 'destructive', onPress: () => { app.deconnecter(); router.replace('/connexion'); } },
  ]);

  return (
    <Ecran>
      <LienRetour />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Bulle Icone={Settings} />
        <H size={30}>{t('settings.title')}</H>
      </View>
      <View style={{ gap: 20 }}>
        <Carte>
          <H size={20}>{t('settings.nickname')}</H>
          <T size={14} color={c.muted} style={{ marginTop: 4 }}>{t('settings.nicknameDesc')}</T>
          <TextInput value={surnom} onChangeText={(v) => { setSurnom(v); setEnregistre(false); }} maxLength={30} placeholder={t('settings.nicknamePlaceholder')} placeholderTextColor={c.faint} accessibilityLabel={t('settings.nickname')}
            style={{ marginTop: 16, height: 46, borderRadius: 12, borderWidth: 1, borderColor: c.ring, backgroundColor: c.surface, paddingHorizontal: 16, fontSize: 14, color: c.ink }} />
          <Pressable onPress={() => { tap(); app.setSurnom(surnom.trim()); setEnregistre(true); }} style={{ marginTop: 12, height: 46, borderRadius: 999, backgroundColor: c.dark, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Check size={16} color={c.bg} /><T size={14} weight="600" color={c.bg}>{enregistre ? t('settings.nicknameSaved') : t('common.save')}</T>
          </Pressable>
        </Carte>

        <Carte>
          <H size={20}>{t('settings.language')}</H>
          <T size={14} color={c.muted} style={{ marginTop: 4 }}>{t('settings.languageDesc')}</T>
          <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}><Globe size={16} color={c.soft} /><T size={14}>🇫🇷 Français</T></View>
        </Carte>

        <Carte>
          <H size={20}>{t('settings.appearance')}</H>
          <T size={14} color={c.muted} style={{ marginTop: 4, marginBottom: 16 }}>{t('settings.appearanceDesc')}</T>
          <ChoixAmbiance />
        </Carte>

        {!proche && (
          <Carte>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Bulle Icone={Bell} iconTaille={18} />
              <View style={{ flex: 1 }}><H size={20}>Petits rappels doux</H><T size={14} color={c.muted}>Un message si tu ne reviens pas depuis quelques jours — jamais insistant</T></View>
              <Switch value={app.rappels} onValueChange={app.setRappels} trackColor={{ true: c.accent, false: '#D6D3D1' }} accessibilityLabel="Petits rappels doux" />
            </View>
          </Carte>
        )}

        <Carte onPress={() => router.push('/liens')} label="Comptes liés">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.av100, alignItems: 'center', justifyContent: 'center' }}><Users size={17} color={c.av700} /></View>
            <View style={{ flex: 1 }}><H size={20}>Comptes liés</H><T size={14} color={c.muted}>Inviter un proche, ou la personne que tu accompagnes</T></View>
            <ChevronRight size={20} color={c.faint} />
          </View>
        </Carte>

        <Carte>
          <Pressable onPress={() => { tap(); setLettre(!lettre); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <H size={20}>{proche ? 'Le mot du co-fondateur' : 'Le mot de la co-fondatrice principale'}</H>
              <T size={14} color={c.muted}>{proche ? 'Relire la lettre du co-fondateur' : 'Relire la lettre de la co-fondatrice principale'}</T>
            </View>
            <View style={{ transform: [{ rotate: lettre ? '180deg' : '0deg' }] }}><ChevronDown size={20} color={c.faint} /></View>
          </Pressable>
          {lettre && <View style={{ marginTop: 20, gap: 16 }}>{paragraphes.map((p, i) => <T key={i} size={p.emphasis ? 16 : 15} weight={p.emphasis ? '500' : '400'} lh={32} color={p.emphasis ? c.ink : c.soft}>{p.text}</T>)}</View>}
        </Carte>

        {proche && <EcranUrgence />}

        <Carte style={{ gap: 8 }}>
          <T size={14} weight="500" color={c.ink}>Politique de confidentialité</T>
          <T size={14} weight="500" color={c.ink}>Conditions générales d'utilisation</T>
        </Carte>

        <Carte>
          <H size={20}>{t('settings.account')}</H>
          <View style={{ marginTop: 16, gap: 12, alignItems: 'flex-start' }}>
            <Pressable onPress={() => { tap(); deconnexion(); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, backgroundColor: c.surface, borderWidth: 1, borderColor: c.ring }}>
              <LogOut size={16} color={c.text} /><T size={14} weight="600" color={c.text}>{t('nav.logout')}</T>
            </Pressable>
            <T size={12} color={c.faint} style={{ textDecorationLine: 'underline' }} onPress={() => Alert.alert(t('settings.deleteAccount'), 'Dans la beta, il n’y a pas encore de vrai compte à supprimer.')}>{t('settings.deleteAccount')}</T>
          </View>
        </Carte>
      </View>
    </Ecran>
  );
}
