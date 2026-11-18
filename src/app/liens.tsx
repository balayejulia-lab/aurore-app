import { Copy, KeyRound, Share2, Trash2, Users } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, Share, TextInput, View } from 'react-native';
import { useApp } from '@/store';
import { BoutonPlein, Bulle, Carte, confirmer, Ecran, H, LienRetour, T, tap } from '@/ui';

// Comptes liés du site. Beta : le code « rejoint » un proche fictif pour voir les petits mots.
export default function Liens() {
  const app = useApp();
  const { c } = app;
  const proche = app.profil === 'proche';
  const [code, setCode] = useState<string | null>(null);
  const [saisie, setSaisie] = useState('');
  const creer = () => setCode(Math.random().toString(36).slice(2, 10).toUpperCase());
  const rejoindre = () => {
    if (saisie.trim().length < 6) return Alert.alert("Ça n'a pas fonctionné", "Ce code n'existe pas ou plus.");
    const nom = proche ? 'Juju' : 'Maman';
    app.setPartenaire(nom); setSaisie('');
    Alert.alert('Vous êtes liés !', `Tu es maintenant lié·e à ${nom}.`);
  };
  return (
    <Ecran>
      <LienRetour libelle="Retour aux réglages" />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <Bulle Icone={Users} fond={c.av100} couleur={c.av700} />
        <H size={30}>Comptes liés</H>
      </View>
      <T size={14} color={c.muted}>Lie ton compte à celui d'un proche ou de la personne que tu accompagnes pour pouvoir vous envoyer des petits mots de soutien.</T>
      <View style={{ gap: 20, marginTop: 20 }}>
        <Carte>
          <H size={20}>Personnes liées à toi</H>
          {!app.partenaire ? <T size={14} color={c.muted} style={{ marginTop: 12 }}>Personne n'est encore lié·e à toi.</T> : (
            <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 16, backgroundColor: c.surface, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: c.ring }}>
              <View><T size={14} weight="600">{app.partenaire}</T><T size={12} color={c.faint}>{proche ? 'Personne accompagnée' : 'Proche'}</T></View>
              <Pressable accessibilityLabel="Délier" onPress={() => confirmer('Délier ce compte ?', 'Vous ne serez plus liés et ne pourrez plus vous envoyer de petits mots. Cette action est définitive.', 'Garder le lien', () => app.setPartenaire(null))} style={{ padding: 8 }}><Trash2 size={16} color={c.faint} /></Pressable>
            </View>
          )}
        </Carte>

        {!app.partenaire && (
          <Carte>
            <H size={20}>Inviter quelqu'un</H>
            <T size={14} color={c.muted} style={{ marginTop: 4 }}>{proche ? 'Crée un code pour te lier à la personne que tu accompagnes.' : 'Crée un code pour te lier à un proche.'}</T>
            {code ? (
              <>
                <View style={{ marginTop: 16, borderRadius: 16, backgroundColor: c.stone50, padding: 20, alignItems: 'center' }}>
                  <T size={12} weight="600" upper color={c.faint} style={{ letterSpacing: 1.8 }}>Ton code d'invitation</T>
                  <T size={30} weight="700" style={{ marginTop: 8, letterSpacing: 3 }}>{code}</T>
                </View>
                <View style={{ marginTop: 16, gap: 8 }}>
                  <BoutonPlein titre="Partager" Icone={Share2} onPress={() => Share.share({ message: `Rejoins-moi sur Aurore avec ce code : ${code}` })} />
                  <Pressable onPress={() => { tap(); Alert.alert('Code', code); }} style={{ minHeight: 48, borderRadius: 999, backgroundColor: c.stone100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Copy size={15} color={c.text} /><T size={14} weight="600" color={c.text}>Copier le code</T>
                  </Pressable>
                </View>
              </>
            ) : <BoutonPlein titre="Créer un code d'invitation" Icone={KeyRound} onPress={creer} style={{ marginTop: 16, alignSelf: 'flex-start', paddingHorizontal: 24 }} />}
          </Carte>
        )}

        <Carte>
          <H size={20}>Tu as reçu un code ?</H>
          <T size={14} color={c.muted} style={{ marginTop: 4 }}>Entre le code que la personne t'a envoyé pour vous lier.</T>
          <TextInput value={saisie} onChangeText={(v) => setSaisie(v.toUpperCase())} onSubmitEditing={rejoindre} maxLength={12} autoCapitalize="characters" placeholder="Ex : AB3D9K2Q" placeholderTextColor={c.faint} accessibilityLabel="Code reçu"
            style={{ marginTop: 16, height: 46, borderRadius: 999, borderWidth: 1, borderColor: c.ring, backgroundColor: c.stone50, paddingHorizontal: 20, fontSize: 14, letterSpacing: 1, color: c.ink }} />
          <BoutonPlein titre="Rejoindre" onPress={rejoindre} disabled={!saisie.trim()} style={{ marginTop: 8 }} />
        </Carte>
      </View>
    </Ecran>
  );
}
