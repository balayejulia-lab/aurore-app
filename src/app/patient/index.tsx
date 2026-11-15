import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { PHRASES_PATIENT, petitPasDuJour, phraseDuJour } from '@/data';
import { useApp } from '@/store';
import { Bouton, Carte, CoeurFavori, Ecran, Icon, Pastille, PhotosApaisantes, Puce, RappelMedical, Section, T } from '@/ui';

export default function AccueilPatient() {
  const app = useApp();
  const { c } = app;
  const [pasFait, setPasFait] = useState(false);
  const [ecrire, setEcrire] = useState(false);
  const [envoye, setEnvoye] = useState<string | null>(null);
  const phrase = phraseDuJour();
  const pas = petitPasDuJour();

  return (
    <Ecran titre={`Bonjour ${app.prenom}`} sousTitre="Content de te retrouver">
      <PhotosApaisantes bas={<Pastille>{app.petitsPas} petits pas</Pastille>} />

      <Carte couleur={c.soft}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <T size={13} weight="bold" color={c.link} style={{ letterSpacing: 1 }}>LA PHRASE DU JOUR</T>
          <CoeurFavori favori={{ id: `phrase-${phrase}`, type: 'Phrase', texte: phrase }} />
        </View>
        <T size={20} weight="title">{phrase}</T>
      </Carte>

      <Carte>
        <T size={13} weight="bold" color={c.link} style={{ letterSpacing: 1 }}>UN PETIT PAS POUR AUJOURD'HUI</T>
        <T size={17} weight="semibold">{pas}</T>
        {pasFait ? (
          <Animated.View entering={ZoomIn.duration(400)} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Icon name="check" color={c.link} width={2.4} />
            <T weight="semibold" color={c.link}>Bravo, un pas de plus vers ce que tu aimes.</T>
          </Animated.View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Bouton titre="Je l'ai fait" icone="check" onPress={() => { setPasFait(true); app.unPasDePlus(); }} style={{ flex: 1 }} />
            <Bouton variante="doux" titre="Plus tard" onPress={() => setPasFait(true)} />
          </View>
        )}
      </Carte>

      <Section titre="Ce que je veux vivre" action={<T size={14} weight="semibold" color={c.link} onPress={() => router.navigate('/patient/envies')}>Tout voir</T>}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {app.envies.slice(0, 3).map((e) => (
            <Carte key={e.id} style={{ width: '47%', minHeight: 110 }} couleur={e.categorie === 'Rêve' ? c.peach : c.card} onPress={() => router.navigate('/patient/envies')} label={e.titre}>
              <T size={12.5} weight="bold" color={c.link}>{e.categorie.toUpperCase()}</T>
              <T weight="semibold">{e.titre}</T>
            </Carte>
          ))}
          <Carte style={{ width: '47%', minHeight: 110, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderStyle: 'dashed', borderColor: c.line, shadowOpacity: 0 }} couleur={c.bg} onPress={() => router.navigate('/patient/envies')} label="Ajouter une envie">
            <Icon name="plus" color={c.muted} />
            <T size={14.5} weight="semibold" color={c.muted}>Ajouter</T>
          </Carte>
        </View>
      </Section>

      {app.lien && (
        <Section titre={`Avec ${app.lien}`}>
          {app.motsRecus.slice(0, 1).map((m) => (
            <Carte key={m.id} couleur={c.peach}>
              <T size={13} color={c.muted}>{m.de} t'a envoyé un petit mot · {m.quand}</T>
              <T size={18} weight="title">« {m.texte} »</T>
            </Carte>
          ))}
          {envoye ? (
            <Animated.View entering={FadeIn}><Carte><T weight="semibold" color={c.link}>Ton petit mot est parti vers {app.lien} ♡</T><T size={14.5} color={c.muted}>« {envoye} »</T></Carte></Animated.View>
          ) : ecrire ? (
            <Carte>
              <T weight="semibold">Choisis un petit mot pour {app.lien}</T>
              <View style={{ gap: 8 }}>
                {PHRASES_PATIENT.map((p) => <Puce key={p.key} titre={p.texte} onPress={() => { app.envoyerMot(p.texte); setEnvoye(p.texte); }} />)}
              </View>
            </Carte>
          ) : (
            <Bouton variante="contour" icone="send" titre={`Envoyer un petit mot à ${app.lien}`} onPress={() => setEcrire(true)} />
          )}
        </Section>
      )}

      <RappelMedical />
    </Ecran>
  );
}
