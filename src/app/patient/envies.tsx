import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { DEFIS_DOUX } from '@/data';
import { useApp, type Envie } from '@/store';
import { Bouton, Carte, Champ, Ecran, Icon, Puce, Section, T, tap } from '@/ui';

const CATEGORIES: Envie['categorie'][] = ['Passion', 'Rêve', 'Projet'];

export default function MesEnvies() {
  const app = useApp();
  const { c } = app;
  const [filtre, setFiltre] = useState<Envie['categorie'] | 'Tout'>('Tout');
  const [ajout, setAjout] = useState(false);
  const [titre, setTitre] = useState('');
  const [cat, setCat] = useState<Envie['categorie']>('Passion');
  const liste = app.envies.filter((e) => filtre === 'Tout' || e.categorie === filtre);

  return (
    <Ecran titre="Mes envies" sousTitre={`${app.petitsPas} petits pas faits jusqu'ici`}>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {(['Tout', ...CATEGORIES] as const).map((f) => <Puce key={f} titre={f === 'Tout' ? 'Tout' : `${f}s`} actif={filtre === f} onPress={() => setFiltre(f)} />)}
      </View>

      {ajout ? (
        <Carte>
          <Champ label="Mon envie" value={titre} onChangeText={setTitre} placeholder="Ex. : refaire du vélo" autoFocus maxLength={60} />
          <View style={{ flexDirection: 'row', gap: 8 }}>{CATEGORIES.map((k) => <Puce key={k} titre={k} actif={cat === k} onPress={() => setCat(k)} />)}</View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Bouton titre="Ajouter" style={{ flex: 1 }} disabled={!titre.trim()} onPress={() => { app.ajouterEnvie(cat, titre.trim()); setTitre(''); setAjout(false); }} />
            <Bouton variante="doux" titre="Annuler" onPress={() => setAjout(false)} />
          </View>
        </Carte>
      ) : (
        <Bouton icone="plus" titre="Ajouter une envie" onPress={() => setAjout(true)} />
      )}

      {liste.map((e) => <CarteEnvie key={e.id} envie={e} />)}

      <Section titre="Défis doux">
        <T size={14.5} color={c.muted}>Des petites idées, sans obligation. Fais-les si ça te tente.</T>
        {DEFIS_DOUX.map((d) => <Defi key={d} texte={d} />)}
      </Section>
    </Ecran>
  );
}

function CarteEnvie({ envie }: { envie: Envie }) {
  const app = useApp();
  const { c } = app;
  const [nouveau, setNouveau] = useState('');
  const [ouvert, setOuvert] = useState(false);
  const faits = envie.pas.filter((p) => p.fait).length;
  return (
    <Animated.View layout={LinearTransition} entering={FadeInDown}>
      <Carte couleur={envie.categorie === 'Rêve' ? c.peach : c.card}>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: ouvert }} onPress={() => { tap(); setOuvert(!ouvert); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, gap: 2 }}>
            <T size={12.5} weight="bold" color={c.link}>{envie.categorie.toUpperCase()}</T>
            <T size={18} weight="semibold">{envie.titre}</T>
            <T size={14} color={c.muted}>{faits > 0 ? `${faits} petit${faits > 1 ? 's' : ''} pas déjà fait${faits > 1 ? 's' : ''}` : 'Le chemin commence quand tu veux'}</T>
          </View>
          <View style={{ transform: [{ rotate: ouvert ? '90deg' : '0deg' }] }}><Icon name="right" color={c.muted} /></View>
        </Pressable>
        {ouvert && (
          <View style={{ gap: 10, paddingTop: 4 }}>
            {envie.pas.map((p) => (
              <Pressable key={p.id} disabled={p.fait} accessibilityRole="checkbox" accessibilityState={{ checked: p.fait }}
                onPress={() => { tap(); app.faireLePas(envie.id, p.id); }} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: 44 }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: p.fait ? c.gold : c.line, backgroundColor: p.fait ? c.gold : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                  {p.fait && <Icon name="check" size={16} color="#3B2A20" width={2.6} />}
                </View>
                <T style={{ flex: 1 }} color={p.fait ? c.muted : c.ink}>{p.texte}</T>
              </Pressable>
            ))}
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-end' }}>
              <View style={{ flex: 1 }}><Champ label="Un petit pas vers cette envie" value={nouveau} onChangeText={setNouveau} placeholder="Ex. : chercher un cours près de chez moi" maxLength={80} /></View>
              <Pressable accessibilityRole="button" accessibilityLabel="Ajouter ce petit pas" disabled={!nouveau.trim()} onPress={() => { tap(); app.ajouterPas(envie.id, nouveau.trim()); setNouveau(''); }}
                style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: c.gold, alignItems: 'center', justifyContent: 'center', opacity: nouveau.trim() ? 1 : 0.4 }}>
                <Icon name="plus" color="#3B2A20" width={2.4} />
              </Pressable>
            </View>
          </View>
        )}
      </Carte>
    </Animated.View>
  );
}

function Defi({ texte }: { texte: string }) {
  const app = useApp();
  const { c } = app;
  const [fait, setFait] = useState(false);
  return (
    <Carte style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <T style={{ flex: 1 }}>{texte}</T>
      {fait ? <Icon name="check" color={c.link} width={2.4} /> : <Puce titre="Fait !" onPress={() => { setFait(true); app.unPasDePlus(); }} />}
    </Carte>
  );
}
