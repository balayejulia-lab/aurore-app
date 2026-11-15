import { useState } from 'react';
import { View } from 'react-native';
import { ATTENTIONS } from '@/data';
import { useC } from '@/store';
import { Carte, CoeurFavori, Ecran, Icon, Puce, T } from '@/ui';

export default function Attentions() {
  const c = useC();
  const cats = ['Toutes', ...new Set(ATTENTIONS.map((a) => a.cat))];
  const [cat, setCat] = useState('Toutes');
  const [faites, setFaites] = useState<string[]>([]);
  return (
    <Ecran titre="Petites attentions" sousTitre="Des idées simples, sans pression">
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {cats.map((k) => <Puce key={k} titre={k} actif={cat === k} onPress={() => setCat(k)} />)}
      </View>
      {faites.length > 0 && (
        <Carte couleur={c.soft}><T weight="semibold">{faites.length} attention{faites.length > 1 ? 's' : ''} offerte{faites.length > 1 ? 's' : ''} cette semaine. C'est beau ✿</T></Carte>
      )}
      {ATTENTIONS.filter((a) => cat === 'Toutes' || a.cat === cat).map((a) => {
        const fait = faites.includes(a.id);
        return (
          <Carte key={a.id} couleur={a.cat === 'Prendre soin de toi' ? c.peach : c.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <T size={12.5} weight="bold" color={c.link} style={{ flex: 1 }}>{a.cat.toUpperCase()}</T>
              <CoeurFavori favori={{ id: a.id, type: 'Attention', texte: a.texte }} />
            </View>
            <T size={16.5}>{a.texte}</T>
            {fait
              ? <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><Icon name="check" color={c.link} width={2.4} /><T weight="semibold" color={c.link}>Fait, merci pour ce geste</T></View>
              : <View style={{ flexDirection: 'row' }}><Puce titre="Je l'ai fait" onPress={() => setFaites((l) => [...l, a.id])} /></View>}
          </Carte>
        );
      })}
    </Ecran>
  );
}
