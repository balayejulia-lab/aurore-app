import { Coffee, Film, Footprints, Gift, HandHeart, Heart, Lightbulb, MessageCircle, RotateCw, Sparkles, Users, type LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ENERGY_LEVELS, IDEAS_BY_ENERGY } from '@/contenu/procheAttentionIdeas';
import { useApp } from '@/store';
import { Bulle, Ecran, EnTetePage, H, Sourcil, T, tap } from '@/ui';

const IDEES: [LucideIcon, string, string, string, string][] = [
  [Coffee, '#B45309', '#FFFBEB', 'Proposer une boisson chaude', "Un moment simple, juste pour être ensemble autour d'une boisson chaude."],
  [Footprints, '#0F766E', '#F0FDFA', 'Une promenade', "Prendre l'air à deux, sans pression, juste pour marcher un peu."],
  [Film, '#7D34C5', '#F5E3E6', 'Regarder un film', 'Se poser côte à côte devant un film qui lui plaît.'],
  [Users, '#BE123C', '#FFF1F2', 'Passer un moment simple ensemble', "Pas besoin d'activité particulière — juste être présent·e."],
  [MessageCircle, '#0369A1', '#F0F9FF', 'Envoyer un message sincère', 'Quelques mots, sans attendre de réponse, juste pour montrer que tu penses à cette personne.'],
  [HandHeart, '#047857', '#ECFDF5', 'Demander si cette personne a besoin de quelque chose', "Une question simple, qui montre qu'on est là sans rien imposer."],
];
const RAPPELS = ["Laisser de l'espace.", 'Ne pas poser de questions.', 'Ne pas chercher de solution.', 'Accepter un « non ».', 'Continuer à parler normalement, comme avant.', "Rappeler à cette personne que votre relation ne se résume pas à ce qu'elle traverse."];
const COULEURS_ENERGIE: Record<string, [string, string]> = { high: ['#047857', '#ECFDF5'], mid: ['#B45309', '#FFFBEB'], low: ['#BE123C', '#FFF1F2'] };

export default function Attentions() {
  const app = useApp();
  const { c } = app;
  return (
    <Ecran>
      <EnTetePage Icone={Gift} fond={c.av200} couleur="#4C1D95" sourcil="Pour la personne que tu accompagnes, au quotidien" titre="Petites attentions" />
      <DuJour />
      <T size={14} weight="600" color={c.text} style={{ marginTop: 40, marginBottom: 16 }}>D'autres idées, à piocher quand tu veux</T>
      <View style={{ gap: 16 }}>
        {IDEES.map(([Icone, col, fond, titre, texte]) => {
          const id = `petite-attention-${titre}`;
          const garde = app.estFavori(id);
          return (
            <View key={titre} style={{ borderRadius: 16, backgroundColor: c.surface, padding: 20, borderWidth: 1, borderColor: c.ring }}>
              <View style={{ marginBottom: 12 }}><Bulle Icone={Icone} fond={fond} couleur={col} iconTaille={18} /></View>
              <H size={16} style={{ marginBottom: 6 }}>{titre}</H>
              <T size={14} lh={24} color={c.soft}>{texte}</T>
              <Pressable onPress={() => { tap(); app.basculerFavori({ id, type: 'Attention', texte: titre, resume: texte }); }}
                style={{ marginTop: 16, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: garde ? c.rose100 : c.stone100 }}>
                <Heart size={14} color={garde ? c.rose600 : c.muted} fill={garde ? c.rose600 : 'none'} /><T size={12} weight="600" color={garde ? c.rose600 : c.muted}>{garde ? 'Gardée' : "Garder l'idée"}</T>
              </Pressable>
            </View>
          );
        })}
      </View>
      <View style={{ marginTop: 40, borderRadius: 24, backgroundColor: 'rgba(255,241,242,0.6)', padding: 24, borderWidth: 1, borderColor: c.rose100 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}><Lightbulb size={18} color={c.rose700} /><T size={12} weight="700" upper color={c.rose700} style={{ letterSpacing: 1.8 }}>Et surtout</T></View>
        <T size={16} weight="500">Une « attention » ne doit pas toujours vouloir dire « faire quelque chose ».</T>
        <T size={12} weight="700" upper color={c.rose600} style={{ letterSpacing: 1.8, marginTop: 24, marginBottom: 12 }}>🤍 Parfois, la meilleure attention, c'est…</T>
        <View style={{ gap: 8 }}>{RAPPELS.map((r) => <View key={r} style={{ borderRadius: 12, backgroundColor: c.surface, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: c.rose100 }}><T size={14} lh={24} color={c.text}>{r}</T></View>)}</View>
        <T size={14} lh={24} color={c.soft} style={{ marginTop: 24 }}>Être là ne signifie pas toujours faire quelque chose. Parfois, c'est simplement faire sentir à cette personne qu'elle n'est pas seule.</T>
      </View>
    </Ecran>
  );
}

function DuJour() {
  const app = useApp();
  const { c } = app;
  const [energie, setEnergie] = useState<string | null>(null);
  const [idee, setIdee] = useState<string | null>(null);
  const niveau = ENERGY_LEVELS.find((e) => e.id === energie);
  const tirer = (id: string) => {
    const pool = IDEAS_BY_ENERGY[id as keyof typeof IDEAS_BY_ENERGY];
    const options = idee ? pool.filter((x) => x !== idee) : pool;
    setIdee(options[Math.floor(Math.random() * options.length)] ?? pool[0]);
  };
  const id = idee ? `petite-attention-jour-${idee}` : '';
  const garde = !!idee && app.estFavori(id);
  return (
    <View style={{ borderRadius: 24, backgroundColor: c.surface, padding: 24, borderWidth: 1, borderColor: c.ring }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <Bulle Icone={Sparkles} fond={c.rose50} couleur={c.rose700} iconTaille={17} />
        <View style={{ flex: 1 }}><H size={20}>L'attention du jour</H></View>
      </View>
      {!niveau ? (
        <>
          <T size={14} weight="600" color={c.text} style={{ marginBottom: 12 }}>Combien d'énergie as-tu aujourd'hui ?</T>
          <View style={{ gap: 8, alignItems: 'flex-start' }}>
            {ENERGY_LEVELS.map((n) => (
              <Pressable key={n.id} onPress={() => { tap(); setEnergie(n.id); tirer(n.id); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: COULEURS_ENERGIE[n.id][1] }}>
                <T size={14}>{n.emoji}</T><T size={14} weight="500" color={COULEURS_ENERGIE[n.id][0]}>{n.label}</T>
              </Pressable>
            ))}
          </View>
        </>
      ) : (
        <Animated.View key={idee} entering={FadeInDown.duration(500)} style={{ borderRadius: 16, backgroundColor: c.stone50, padding: 20 }}>
          <Sourcil>{niveau.emoji} {niveau.label}</Sourcil>
          <T size={18} lh={32} style={{ marginTop: 12 }}>{idee}</T>
          <View style={{ marginTop: 20, gap: 10 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Pressable onPress={() => { tap(); tirer(niveau.id); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8 }}><RotateCw size={15} color={c.muted} /><T size={14} weight="500" color={c.muted}>Une autre idée</T></Pressable>
              <Pressable onPress={() => { tap(); app.basculerFavori({ id, type: 'Attention', texte: idee!, resume: `Idée du jour · ${niveau.emoji} ${niveau.label}` }); }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: garde ? c.rose100 : '#E11D48' }}>
                <Heart size={15} color={garde ? c.rose600 : '#FFFFFF'} fill={garde ? c.rose600 : 'none'} /><T size={14} weight="600" color={garde ? c.rose600 : '#FFFFFF'}>{garde ? 'Gardée' : "J'aime cette idée"}</T>
              </Pressable>
            </View>
            <T size={12} weight="500" color={c.faint} onPress={() => { setEnergie(null); setIdee(null); }}>Changer mon énergie</T>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
