import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { PHRASES_PROCHE, phraseDuJour } from '@/data';
import { useApp } from '@/store';
import { Bouton, Carte, CoeurFavori, Ecran, Icon, Pastille, PhotosApaisantes, Puce, RappelMedical, Section, T } from '@/ui';

export default function AccueilProche() {
  const app = useApp();
  const { c } = app;
  const lie = app.lien ?? 'ton proche';
  const [cat, setCat] = useState('Soutien');
  const [envoye, setEnvoye] = useState<string | null>(null);
  const phrase = phraseDuJour();
  const cats = [...new Set(PHRASES_PROCHE.map((p) => p.cat))];

  return (
    <Ecran titre={`Bonjour ${app.prenom}`} sousTitre="Merci d'être là">
      <PhotosApaisantes bas={<Pastille>Ton coin à toi</Pastille>} />

      <Carte couleur={c.soft}>
        <T size={22} weight="title">Tu n'as pas besoin d'être parfait·e pour être un vrai soutien.</T>
      </Carte>

      {app.lien ? (
        <Carte style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: c.peach, alignItems: 'center', justifyContent: 'center' }}><Icon name="link" color={c.link} /></View>
          <View style={{ flex: 1 }}>
            <T weight="semibold">Lié·e avec {lie}</T>
            <T size={14} color={c.muted}>{lie} a fait de nouveaux petits pas cette semaine ✿</T>
          </View>
        </Carte>
      ) : null}

      {app.motsEnvoyes.length === 0 && (
        <Carte couleur={c.peach}>
          <T size={13} color={c.muted}>{lie} t'a envoyé un petit mot · hier</T>
          <T size={18} weight="title">« Merci d'être là. »</T>
        </Carte>
      )}

      <Section titre={`Un petit mot pour ${lie}`}>
        {envoye ? (
          <Animated.View entering={FadeIn}>
            <Carte><T weight="semibold" color={c.link}>Envoyé avec douceur ♡</T><T color={c.muted}>« {envoye} »</T>
              <Bouton variante="doux" titre="Envoyer un autre mot" onPress={() => setEnvoye(null)} /></Carte>
          </Animated.View>
        ) : (
          <>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>{cats.map((k) => <Puce key={k} titre={k} actif={cat === k} onPress={() => setCat(k)} />)}</View>
            {PHRASES_PROCHE.filter((p) => p.cat === cat).map((p) => (
              <Carte key={p.key} onPress={() => { app.envoyerMot(p.texte); setEnvoye(p.texte); }} label={`Envoyer : ${p.texte}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <T style={{ flex: 1 }}>{p.texte}</T>
                <Icon name="send" size={20} color={c.link} />
              </Carte>
            ))}
          </>
        )}
      </Section>

      <Carte>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <T size={13} weight="bold" color={c.link} style={{ letterSpacing: 1 }}>LA PHRASE DU JOUR</T>
          <CoeurFavori favori={{ id: `phrase-${phrase}`, type: 'Phrase', texte: phrase }} />
        </View>
        <T size={18} weight="title">{phrase}</T>
      </Carte>

      <RappelMedical />
    </Ecran>
  );
}
