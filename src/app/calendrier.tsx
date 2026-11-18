import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Plus, StickyNote, Trash2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useApp } from '@/store';
import { Bulle, Carte, confirmer, Ecran, H, LienRetour, T, tap } from '@/ui';

const JOURS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const pad = (n: number) => String(n).padStart(2, '0');
const cle = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function Calendrier() {
  const app = useApp();
  const { c } = app;
  const auj = useMemo(() => new Date(), []);
  const [mois, setMois] = useState(() => new Date(auj.getFullYear(), auj.getMonth(), 1));
  const [jour, setJour] = useState(cle(auj));
  const [form, setForm] = useState(false);
  const [titre, setTitre] = useState('');
  const [heure, setHeure] = useState('');
  const [lieu, setLieu] = useState('');
  const [note, setNote] = useState('');
  const [erreur, setErreur] = useState('');

  const cases: (Date | null)[] = [];
  const decalage = (new Date(mois.getFullYear(), mois.getMonth(), 1).getDay() + 6) % 7;
  for (let i = 0; i < decalage; i++) cases.push(null);
  for (let d = 1; d <= new Date(mois.getFullYear(), mois.getMonth() + 1, 0).getDate(); d++) cases.push(new Date(mois.getFullYear(), mois.getMonth(), d));
  while (cases.length % 7) cases.push(null);
  const duJour = app.evenements.filter((e) => e.jour === jour).sort((a, b) => a.heure.localeCompare(b.heure));
  const libelle = new Date(`${jour}T00:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/(^|\s)\S/g, (x) => x.toUpperCase());
  const enregistrer = () => {
    if (!titre.trim() || !/^\d{1,2}[:h]\d{2}$/.test(heure.trim())) return setErreur('Titre, date et heure sont requis.');
    app.ajouterEvenement({ jour, titre: titre.trim(), heure: heure.trim().replace('h', ':'), lieu: lieu.trim(), note: note.trim() });
    setForm(false); setTitre(''); setHeure(''); setLieu(''); setNote(''); setErreur('');
  };
  const champ = { height: 44, borderRadius: 12, borderWidth: 1, borderColor: c.ring, backgroundColor: c.stone50, paddingHorizontal: 14, fontSize: 14, color: c.ink };

  return (
    <Ecran>
      <LienRetour />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Bulle Icone={Calendar} taille={44} />
        <View style={{ flex: 1 }}><H size={30}>Calendrier</H><T size={14} color={c.muted}>Rendez-vous, sorties, événements à ne pas manquer</T></View>
      </View>
      <Carte style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Pressable accessibilityLabel="Mois précédent" onPress={() => setMois(new Date(mois.getFullYear(), mois.getMonth() - 1, 1))} style={{ padding: 8 }}><ChevronLeft size={18} color={c.muted} /></Pressable>
          <T size={16} weight="700">{mois.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).replace(/^\S/, (x) => x.toUpperCase())}</T>
          <Pressable accessibilityLabel="Mois suivant" onPress={() => setMois(new Date(mois.getFullYear(), mois.getMonth() + 1, 1))} style={{ padding: 8 }}><ChevronRight size={18} color={c.muted} /></Pressable>
        </View>
        <View style={{ flexDirection: 'row' }}>{JOURS.map((j, i) => <T key={i} size={11} weight="600" color={c.faint} center style={{ flex: 1 }}>{j}</T>)}</View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
          {cases.map((d, i) => {
            const k = d && cle(d);
            const sel = k === jour;
            const a = k && app.evenements.some((e) => e.jour === k);
            return (
              <View key={i} style={{ width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 3 }}>
                {d && (
                  <Pressable accessibilityLabel={d.toLocaleDateString('fr-FR')} onPress={() => { tap(); setJour(k!); }} style={{ width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: sel ? c.accent : 'transparent' }}>
                    <T size={15} weight={k === cle(auj) ? '700' : '500'} color={sel ? '#FFFFFF' : c.text}>{d.getDate()}</T>
                    {a && <View style={{ position: 'absolute', bottom: 5, width: 4, height: 4, borderRadius: 2, backgroundColor: sel ? '#FFFFFF' : c.accent }} />}
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      </Carte>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 12 }}>
        <T size={15} weight="700" color={c.soft}>{libelle}</T>
        <Pressable onPress={() => { tap(); setForm(true); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999, backgroundColor: c.accent }}>
          <Plus size={16} color="#FFFFFF" /><T size={14} weight="600" color="#FFFFFF">Ajouter</T>
        </Pressable>
      </View>
      {form && (
        <Carte style={{ gap: 10, marginBottom: 12 }}>
          <TextInput value={titre} onChangeText={setTitre} placeholder="Titre (ex : rendez-vous, concert…)" placeholderTextColor={c.faint} style={champ} autoFocus />
          <TextInput value={heure} onChangeText={setHeure} placeholder="Heure (ex : 14:30)" placeholderTextColor={c.faint} keyboardType="numbers-and-punctuation" style={champ} />
          <TextInput value={lieu} onChangeText={setLieu} placeholder="Lieu (optionnel)" placeholderTextColor={c.faint} style={champ} />
          <TextInput value={note} onChangeText={setNote} placeholder="Note (optionnel)" placeholderTextColor={c.faint} style={champ} />
          {!!erreur && <T size={12} color={c.rose600}>{erreur}</T>}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
            <T size={14} color={c.muted} style={{ padding: 8 }} onPress={() => { setForm(false); setErreur(''); }}>Annuler</T>
            <Pressable onPress={() => { tap(); enregistrer(); }} style={{ paddingHorizontal: 18, paddingVertical: 8, borderRadius: 999, backgroundColor: c.accent }}><T size={14} weight="600" color="#FFFFFF">Enregistrer</T></Pressable>
          </View>
        </Carte>
      )}
      {duJour.length === 0 ? (
        <Carte style={{ padding: 20 }}><T size={14} color={c.muted}>Rien de prévu ce jour-là.</T></Carte>
      ) : (
        <View style={{ gap: 10 }}>
          {duJour.map((e) => (
            <Carte key={e.id} style={{ padding: 18, gap: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <T size={15} weight="700" style={{ flex: 1 }}>{e.titre}</T>
                <Pressable accessibilityLabel="Supprimer" onPress={() => confirmer('Supprimer ce rendez-vous ?', 'Il ne sera plus dans ton calendrier.', 'Le garder', () => app.supprimerEvenement(e.id))}><Trash2 size={15} color={c.faint} /></Pressable>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Clock size={13} color={c.muted} /><T size={13} color={c.muted}>{e.heure}</T></View>
              {!!e.lieu && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><MapPin size={13} color={c.muted} /><T size={13} color={c.muted}>{e.lieu}</T></View>}
              {!!e.note && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><StickyNote size={13} color={c.muted} /><T size={13} color={c.muted}>{e.note}</T></View>}
            </Carte>
          ))}
        </View>
      )}
    </Ecran>
  );
}
