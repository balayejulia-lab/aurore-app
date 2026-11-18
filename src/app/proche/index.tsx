import { router } from 'expo-router';
import { Check, CircleHelp, CloudLightning, CloudRain, CloudSun, Flame, Languages, Moon, NotebookPen, Send, Sprout, Sun, Trophy, Wind, X, type LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { traduireEnJe } from '@/assistant';
import { Encouragement, Journal } from '@/ecrans/Accueil';
import { useApp } from '@/store';
import { Avertissement, Bulle, Carte, CarteAccueil, ChoixCouleurs, Ecran, EnTeteAccueil, Feuille, H, Sourcil, T, t, tap } from '@/ui';

const HUMEURS: [LucideIcon, string, string, string[]][] = [
  [Sun, 'Ça va', "Un bon jour ne te rend pas moins concerné·e. Pas besoin de culpabiliser d'aller bien.", ["Note ce qui t'a fait du bien aujourd'hui, sans lien avec la maladie", 'Profite de ce répit sans arrière-pensée']],
  [CloudSun, 'Moyen', "La vigilance permanente use, même sans rien de grave. C'est normal d'être fatigué·e.", ['Accorde-toi 10 minutes où tu ne surveilles rien', 'Fais une petite chose pour toi aujourd\'hui']],
  [CloudRain, 'Triste', "Tu peux avoir de la peine pour la relation d'avant. Cette tristesse n'a pas besoin d'être justifiée.", ['Écris ce que tu regrettes, sans te censurer', "Contacte quelqu'un à qui tu n'as rien à réexpliquer"]],
  [Wind, 'Inquiet', "Scanner chaque détail, c'est épuisant — et ça ne veut pas dire que tu en fais trop.", ['Écris précisément ce que tu redoutes', 'Marche quelques minutes sans ton téléphone']],
  [Moon, 'Épuisé / à bout', "Être en colère contre la maladie, parfois malgré toi contre la personne, ne fait pas de toi quelqu'un de mauvais.", ["Accorde-toi le droit de ne rien faire d'utile un moment", "Demande à quelqu'un de prendre le relais, même sur une petite chose"]],
  [CloudLightning, 'Dépassé', "Ne plus savoir ce qui aide vraiment, c'est le signe que tu portes seul·e des décisions à partager.", ["Pose la question que tu n'oses poser à personne", 'Repère une décision que tu pourrais partager']],
];
const RESSENTIS: [string, LucideIcon, string][] = [['inquietude', Wind, 'inquiétude'], ['frustration', Flame, 'frustration'], ['tristesse', CloudRain, 'tristesse'], ['incomprehension', CircleHelp, 'incompréhension']];

export default function AccueilProche() {
  const app = useApp();
  const { c } = app;
  const [couleurs, setCouleurs] = useState(false);
  return (
    <Ecran>
      <EnTeteAccueil nom={app.surnom || undefined} />
      <View style={{ gap: 24 }}>
        <CarteAccueil phrase={t('home.landscapeHeadingProche')} ouvrirCouleurs={() => setCouleurs(true)} />
        <EtToi />
        <Encouragement />
        {app.partenaire && (
          <Carte>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Bulle Icone={Trophy} fond={c.amber50} couleur={c.amber600} />
              <View style={{ flex: 1 }}><H size={20}>Carnet de victoires</H></View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 12, backgroundColor: 'rgba(255,251,235,0.6)', padding: 14, borderWidth: 1, borderColor: c.amber100 }}>
              <View style={{ marginTop: 2, width: 28, height: 28, borderRadius: 14, backgroundColor: c.amber100, alignItems: 'center', justifyContent: 'center' }}><Trophy size={14} color={c.amber700} /></View>
              <View style={{ flex: 1 }}>
                <T size={14} lh={24} color={c.text}>J'ai ressorti mon carnet de dessin</T>
                <T size={12} color={c.faint} style={{ marginTop: 2 }}>{app.partenaire} · {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</T>
              </View>
            </View>
          </Carte>
        )}
      </View>
      <Avertissement />
      <Feuille visible={couleurs} fermer={() => setCouleurs(false)}><ChoixCouleurs fermer={() => setCouleurs(false)} /></Feuille>
    </Ecran>
  );
}

function EtToi() {
  const { c } = useApp();
  const [humeur, setHumeur] = useState<string | null>(null);
  const [ressentis, setRessentis] = useState<string[]>([]);
  const [pensee, setPensee] = useState('');
  const [resultat, setResultat] = useState('');
  const h = HUMEURS.find((x) => x[1] === humeur);
  const boite = { borderRadius: 24, backgroundColor: c.surface, padding: 24, borderWidth: 1, borderColor: c.ring } as const;
  return (
    <View style={{ gap: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Bulle Icone={Sprout} fond="#D1FAE5" couleur={c.emerald700} taille={44} rayon={22} />
        <H size={26}>Comment tu te sens ?</H>
      </View>

      <View style={boite}>
        <T size={14} lh={24} color={c.soft}>Accompagner quelqu'un, ça use aussi. <T size={14} weight="600" color={c.ink}>Tu as le droit d'être fatigué·e, et le droit d'avoir besoin de quelque chose pour toi.</T></T>
        <T size={14} weight="600" color={c.text} style={{ marginTop: 28, marginBottom: 12 }}>Aujourd'hui, je me sens…</T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {HUMEURS.map(([Icone, label]) => {
            const on = humeur === label;
            return (
              <Pressable key={label} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => { tap(); setHumeur(label); }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: on ? '#047857' : c.emerald50 }}>
                <Icone size={16} color={on ? '#FFFFFF' : c.emerald700} strokeWidth={1.75} /><T size={14} weight="500" color={on ? '#FFFFFF' : c.emerald700}>{label}</T>
                {on && <Check size={14} color="#FFFFFF" />}
              </Pressable>
            );
          })}
        </View>
        {h && (
          <Animated.View entering={FadeInDown} style={{ marginTop: 24, borderRadius: 16, backgroundColor: c.emerald50, padding: 20 }}>
            <T size={14} lh={24} color="#064E3B">{h[2]}</T>
            <View style={{ marginTop: 16, gap: 8 }}>
              {h[3].map((s) => <View key={s} style={{ borderRadius: 12, backgroundColor: c.surface, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: '#D1FAE5' }}><T size={14} color={c.text}>{s}</T></View>)}
            </View>
            <T size={14} color="#065F46" style={{ marginTop: 16 }}>Si une de ces questions reste sans réponse, tu peux aussi <T size={14} weight="600" color="#065F46" style={{ textDecorationLine: 'underline' }} onPress={() => router.navigate('/proche/assistant')}>en parler à l'assistant des proches</T>.</T>
          </Animated.View>
        )}
      </View>

      <View style={boite}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Bulle Icone={Languages} fond={c.av200} couleur="#4C1D95" taille={44} rayon={22} />
          <View style={{ flex: 1 }}><H size={22}>Traduire ce que je ressens</H></View>
        </View>
        <T size={14} lh={22} color={c.muted} style={{ marginBottom: 20 }}>Écris ce que tu souhaiterais lui dire, on t'aide avec d'autres mots.</T>
        <T size={14} weight="600" color={c.text} style={{ marginBottom: 12 }}>Je ressens :</T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {RESSENTIS.map(([id, Icone, label]) => {
            const on = ressentis.includes(id);
            return (
              <Pressable key={id} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => { tap(); setRessentis((l) => (on ? l.filter((x) => x !== id) : [...l, id])); }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: on ? c.av700 : c.av50 }}>
                <Icone size={16} color={on ? '#FFFFFF' : c.av700} strokeWidth={1.75} /><T size={14} weight="500" color={on ? '#FFFFFF' : c.av700}>{label}</T>
                {on && <Check size={14} color="#FFFFFF" />}
              </Pressable>
            );
          })}
        </View>
        <T size={14} weight="600" color={c.text} style={{ marginTop: 24, marginBottom: 8 }}>Ce que j'ai envie de lui dire :</T>
        <TextInput value={pensee} onChangeText={setPensee} multiline maxLength={500} placeholder="Ex. : Tu ne me dis jamais rien." placeholderTextColor={c.faint} accessibilityLabel="Ce que j'ai envie de lui dire"
          style={{ minHeight: 84, borderRadius: 16, borderWidth: 1, borderColor: c.ring, backgroundColor: c.stone50, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: c.ink, textAlignVertical: 'top' }} />
        <Pressable disabled={!pensee.trim()} onPress={() => { tap(); setResultat(traduireEnJe(pensee, ressentis)); }}
          style={{ marginTop: 16, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999, backgroundColor: c.av700, opacity: pensee.trim() ? 1 : 0.5 }}>
          <Send size={16} color="#FFFFFF" /><T size={14} weight="600" color="#FFFFFF">Traduire en « je »</T>
        </Pressable>
        {!!resultat && (
          <Animated.View entering={FadeInDown} style={{ marginTop: 24, gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8, borderRadius: 16, backgroundColor: c.rose50, paddingHorizontal: 16, paddingVertical: 12 }}><X size={16} color={c.rose700} style={{ marginTop: 2 }} /><T size={14} color={c.rose700} style={{ flex: 1 }}>« {pensee.trim()} »</T></View>
            <View style={{ flexDirection: 'row', gap: 8, borderRadius: 16, backgroundColor: c.emerald50, paddingHorizontal: 16, paddingVertical: 12 }}><Check size={16} color="#065F46" style={{ marginTop: 2 }} /><T size={14} color="#065F46" style={{ flex: 1 }}>« {resultat} »</T></View>
          </Animated.View>
        )}
        <T size={12} lh={20} color={c.faint} center style={{ marginTop: 24 }}>Cet outil aide à formuler ce que tu ressens sans accuser. Il ne remplace pas un accompagnement professionnel.</T>
      </View>

      <Journal Icone={NotebookPen} fond={c.emerald50} couleur={c.emerald700} titre="Mon journal" sousTitre="Un espace pour tout déposer, sans jugement"
        placeholder="Écris ce que tu as besoin de dire, sans filtre…" premier="Ouvrir la première page" premierDesc="Dépose ici ce que tu ne peux pas toujours dire à voix haute. Personne d'autre que toi ne le lira." />
    </View>
  );
}
