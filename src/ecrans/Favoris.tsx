import { router } from 'expo-router';
import { BookOpen, ExternalLink, Gift, Heart, HeartHandshake, MessageCircle, Quote, Sparkles, Trash2, Youtube, type LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { useApp, type Favori } from '@/store';
import { Avertissement, Ecran, EnTetePage, EtatVide, H, T, tap } from '@/ui';

function CarteFav({ f, children }: { f: Favori; children: React.ReactNode }) {
  const { c, basculerFavori } = useApp();
  return (
    <View style={{ borderRadius: 16, backgroundColor: c.surface, padding: 20, borderWidth: 1, borderColor: c.ring }}>
      <Pressable accessibilityLabel="Retirer des favoris" onPress={() => { tap(); basculerFavori(f); }} style={{ position: 'absolute', right: 12, top: 12, width: 28, height: 28, borderRadius: 14, backgroundColor: c.stone100, alignItems: 'center', justifyContent: 'center', zIndex: 1 }}><Trash2 size={14} color={c.faint} /></Pressable>
      {children}
    </View>
  );
}

// Favoris du site : onglets Pinterest / YouTube / Citations / Témoignages (patient), sections (proche).
export function Favoris({ proche }: { proche?: boolean }) {
  const { c, favoris } = useApp();
  const ONGLETS: [string, string, LucideIcon, string][] = [['Pinterest', 'Pinterest', Sparkles, '#D97706'], ['YouTube', 'YouTube', Youtube, '#E11D48'], ['Citation', 'Citations', Quote, '#0D9488'], ['Témoignage', 'Témoignages', BookOpen, '#E11D48']];
  const [actif, setActif] = useState(() => ONGLETS.find(([k]) => favoris.some((f) => f.type === k))?.[0] ?? 'Pinterest');
  const de = (k: string) => favoris.filter((f) => f.type === k);

  const vide = (
    <View style={{ borderRadius: 16, backgroundColor: c.surface, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: c.ring }}>
      <View style={{ marginVertical: -24 }}><EtatVide icone="heart" /></View>
      <T size={14} color={c.muted} center style={{ marginTop: 8, marginBottom: 8 }}>Tu n'as encore rien gardé.</T>
      {proche ? <T size={12} color={c.faint} center>Depuis l'espace des proches, clique sur « Garder » sous un témoignage ou « Garder cette réponse » sous une réponse de l'assistant.</T>
        : <T size={12} color={c.faint} center>Clique sur le cœur d'une citation, d'un témoignage, ou ajoute un pin Pinterest / une vidéo YouTube depuis l'onglet <T size={12} weight="600" color={c.amber700} style={{ textDecorationLine: 'underline' }} onPress={() => router.navigate('/patient/inspiration')}>Inspirations</T>.</T>}
    </View>
  );

  if (proche) {
    const sections: [string, string, LucideIcon][] = [['Témoignage', 'Témoignages', HeartHandshake], ['Réponse', "Réponses de l'assistant", MessageCircle], ['Attention', 'Petites attentions', Gift]];
    return (
      <Ecran>
        <EnTetePage Icone={Heart} fond={c.rose200} couleur={c.rose900} titre="Favoris" />
        {favoris.length === 0 ? vide : (
          <View style={{ gap: 40 }}>
            {sections.filter(([k]) => de(k).length).map(([k, titre, Icone]) => (
              <View key={k} style={{ gap: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Icone size={18} color={c.av600} /><H size={20}>{titre} <T size={14} weight="400" color={c.faint}>· {de(k).length}</T></H></View>
                {de(k).map((f) => (
                  <CarteFav key={f.id} f={f}>
                    {k === 'Réponse' && <T size={12} weight="700" upper color={c.av600} style={{ letterSpacing: 2, marginBottom: 4 }}>Ta question</T>}
                    <H size={16} style={{ paddingRight: 24 }}>{f.texte}</H>
                    {f.resume && <T size={14} lh={24} color={c.soft} style={{ marginTop: 8 }}>{f.resume}</T>}
                    {f.lien && <Pressable onPress={() => Linking.openURL(f.lien!)} style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 6 }}><ExternalLink size={12} color={c.rose700} /><T size={12} weight="600" color={c.rose700}>Lire le témoignage</T></Pressable>}
                  </CarteFav>
                ))}
              </View>
            ))}
          </View>
        )}
        <Avertissement texte="Retrouve ici les témoignages et réponses que tu as gardés, dans ton espace de proche." />
      </Ecran>
    );
  }

  return (
    <Ecran>
      <EnTetePage Icone={Heart} fond={c.rose200} couleur={c.rose900} sourcil="TOUT CE QUI T'INSPIRE RÉUNIT AU MÊME ENDROIT" titre="Favoris" />
      {favoris.length === 0 ? vide : (
        <>
          <View style={{ gap: 8, marginBottom: 24 }}>
            {ONGLETS.map(([k, label, Icone, col]) => {
              const on = actif === k;
              return (
                <Pressable key={k} onPress={() => { tap(); setActif(k); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: on ? c.dark : c.surface, borderWidth: on ? 0 : 1, borderColor: c.ring }}>
                  <Icone size={15} color={on ? c.bg : col} />
                  <T size={14} weight="600" color={on ? c.bg : c.soft} style={{ flex: 1 }}>{label}</T>
                  <T size={14} weight="600" color={on ? c.bg : c.faint} style={{ opacity: on ? 0.7 : 1 }}>{de(k).length}</T>
                </Pressable>
              );
            })}
          </View>
          {de(actif).length === 0 ? (
            <View style={{ borderRadius: 16, backgroundColor: c.surface, padding: 32, borderWidth: 1, borderColor: c.ring }}>
              <T size={14} color={c.faint} center>{{ Pinterest: 'Aucun pin Pinterest gardé pour l\'instant.', YouTube: 'Aucune vidéo YouTube gardée pour l\'instant.', Citation: 'Aucune citation gardée pour l\'instant.', 'Témoignage': 'Aucun témoignage gardé pour l\'instant.' }[actif]}</T>
            </View>
          ) : (
            <View style={{ gap: 16 }}>
              {de(actif).map((f) => (
                <CarteFav key={f.id} f={f}>
                  {actif === 'Citation' ? (
                    <>
                      <T size={18} weight="500" lh={28} style={{ paddingRight: 24 }}>“{f.texte}”</T>
                      {f.auteur && <T size={14} color={c.muted} style={{ marginTop: 8, fontStyle: 'italic' }}>— {f.auteur}</T>}
                    </>
                  ) : actif === 'Témoignage' ? (
                    <>
                      {f.auteur && <T size={12} weight="700" upper color={c.rose600} style={{ letterSpacing: 2, marginBottom: 4 }}>{f.auteur}</T>}
                      <H size={16} style={{ paddingRight: 24 }}>{f.texte}</H>
                      {f.resume && <T size={14} lh={24} color={c.soft} lines={3} style={{ marginTop: 8 }}>{f.resume}</T>}
                      {f.lien && <Pressable onPress={() => Linking.openURL(f.lien!)} style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 6 }}><ExternalLink size={12} color={c.rose700} /><T size={12} weight="600" color={c.rose700}>Lire le témoignage</T></Pressable>}
                    </>
                  ) : (
                    <>
                      <H size={16} style={{ paddingRight: 24 }}>{f.texte}</H>
                      {f.auteur && <Pressable onPress={() => Linking.openURL(f.auteur!)} style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}><ExternalLink size={12} color={c.amber700} /><T size={12} weight="600" color={c.amber700}>Ouvrir</T></Pressable>}
                    </>
                  )}
                </CarteFav>
              ))}
            </View>
          )}
        </>
      )}
    </Ecran>
  );
}
