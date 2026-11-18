import { router } from 'expo-router';
import { Anchor, BookHeart, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Heart, Lock, LockOpen, PenLine, Plus, Send, Trash2, Trophy, type LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PHRASES_PATIENT, PHRASES_PROCHE } from '@/contenu/phrases';
import { useApp } from '@/store';
import { BoutonPlein, Bulle, Carte, confirmer, EtatVide, H, Pastille, Puce, Sourcil, T, t, tap } from '@/ui';

/* ---------- Mon journal (avec code) ---------- */
export function Journal({ Icone = BookHeart, fond, couleur, titre, sousTitre, placeholder, premier, premierDesc }: { Icone?: LucideIcon; fond?: string; couleur?: string; titre?: string; sousTitre?: string; placeholder?: string; premier?: string; premierDesc?: string }) {
  const app = useApp();
  const { c } = app;
  const [ouvert, setOuvert] = useState(false);
  const [page, setPage] = useState(0);
  const [ecriture, setEcriture] = useState<false | 'new' | 'edit'>(false);
  const [contenu, setContenu] = useState('');
  const [modal, setModal] = useState<null | 'create' | 'unlock'>(null);
  const pages = app.pages;
  const courante = Math.max(0, Math.min(page, pages.length - 1));
  const lettre = pages[courante];

  const cadenas = () => { if (app.verrouille) setModal('unlock'); else if (app.pin) app.verrouiller(); else setModal('create'); };
  const enregistrer = () => {
    const texte = contenu.trim();
    if (!texte) return;
    if (ecriture === 'edit' && lettre) app.modifierPage(lettre.id, texte);
    else { app.ecrirePage(texte); setPage(pages.length); }
    setEcriture(false); setContenu('');
  };
  const aller = (d: number) => { setEcriture(false); setPage((p) => Math.max(0, Math.min(p + d, pages.length - 1))); };

  return (
    <Carte>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <Bulle Icone={Icone} fond={fond ?? c.rose50} couleur={couleur ?? c.rose600} />
        <View style={{ flex: 1 }}>
          <H size={20}>{titre ?? t('letter.title')}</H>
          <T size={14} color={c.muted} style={{ marginTop: 4 }}>{sousTitre ?? t('letter.subtitle')}</T>
        </View>
        <Pastille titre={ouvert ? t('common.collapse') : t('common.open')} onPress={() => setOuvert(!ouvert)} />
        <Pressable accessibilityRole="button" accessibilityLabel={app.verrouille ? t('letter.unlock') : t('letter.lock')} onPress={() => { tap(); cadenas(); }}
          style={{ marginTop: 2, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: app.verrouille ? c.dark : c.stone100 }}>
          {app.verrouille ? <Lock size={16} color={c.bg} /> : <LockOpen size={16} color={c.faint} />}
        </Pressable>
      </View>

      {ouvert && (app.verrouille ? (
        <View style={{ alignItems: 'center', gap: 12, paddingVertical: 40 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.stone100, alignItems: 'center', justifyContent: 'center' }}><Lock size={22} color={c.faint} /></View>
          <T size={14} color={c.muted}>{t('letter.locked')}</T>
          <BoutonPlein titre={t('letter.unlock')} onPress={() => setModal('unlock')} style={{ minHeight: 38, paddingHorizontal: 16 }} />
        </View>
      ) : (
        <View style={{ marginTop: 24 }}>
          {ecriture ? (
            <View style={{ borderRadius: 16, backgroundColor: c.paper, padding: 20, borderWidth: 1, borderColor: c.ring }}>
              <T size={12} weight="600" upper color={c.rose600} style={{ letterSpacing: 0.6, marginBottom: 12 }}>{ecriture === 'edit' ? t('letter.editPage') : t('letter.newPage')}</T>
              <TextInput value={contenu} onChangeText={setContenu} multiline autoFocus placeholder={placeholder ?? t('letter.placeholder')} placeholderTextColor={c.faint} accessibilityLabel={t('letter.newPage')}
                style={{ minHeight: 180, borderRadius: 12, borderWidth: 1, borderColor: c.ring, backgroundColor: c.surface, padding: 16, fontSize: 15, lineHeight: 26, color: c.ink, textAlignVertical: 'top' }} />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <T size={14} color={c.muted} style={{ padding: 8 }} onPress={() => { setEcriture(false); setContenu(''); }}>{t('letter.cancelBtn')}</T>
                <Pressable accessibilityRole="button" onPress={() => { tap(); enregistrer(); }} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#E11D48' }}>
                  <T size={14} weight="600" color="#FFFFFF">{ecriture === 'edit' ? t('letter.saveBtn') : t('letter.keepPage')}</T>
                </Pressable>
              </View>
            </View>
          ) : pages.length === 0 ? (
            <Pressable accessibilityRole="button" onPress={() => { tap(); setEcriture('new'); }}
              style={({ pressed }) => ({ alignItems: 'center', gap: 4, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: c.rose200, backgroundColor: 'rgba(255,241,242,0.4)', paddingVertical: 32, paddingHorizontal: 16, transform: [{ scale: pressed ? 0.98 : 1 }] })}>
              <EtatVideCompact icone="sprout" />
              <T weight="600" color={c.rose700} center>{premier ?? t('letter.openFirst')}</T>
              <T size={14} color={c.muted} center style={{ maxWidth: 280 }}>{premierDesc ?? t('letter.openFirstDesc')}</T>
            </Pressable>
          ) : (
            <View style={{ borderRadius: 16, backgroundColor: c.paper, padding: 24, borderWidth: 1, borderColor: c.ring }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <T size={12} weight="500" upper color={c.faint} style={{ letterSpacing: 0.6, flex: 1 }}>{new Date(lettre.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</T>
                <Pressable accessibilityLabel={t('letter.edit')} onPress={() => { tap(); setEcriture('edit'); setContenu(lettre.content); }} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}><PenLine size={15} color={c.faint} /></Pressable>
                <Pressable accessibilityLabel={t('letter.deletePage')} onPress={() => confirmer(t('letter.deleteTitle'), t('letter.deleteDesc'), t('letter.keepOnDelete'), () => { app.supprimerPage(lettre.id); setPage((p) => Math.max(0, p - 1)); })} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}><Trash2 size={15} color={c.faint} /></Pressable>
              </View>
              <T size={16} lh={32} color={c.text} style={{ minHeight: 140 }}>{lettre.content}</T>
              <View style={{ marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: c.ring, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Pressable disabled={courante === 0} onPress={() => aller(-1)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, padding: 6, opacity: courante === 0 ? 0.3 : 1 }}><ChevronLeft size={16} color={c.muted} /><T size={14} color={c.muted}>{t('letter.previous')}</T></Pressable>
                <T size={12} weight="600" color={c.muted}>page {courante + 1} <T size={12} weight="600" color={c.faint}>/ {pages.length}</T></T>
                <Pressable disabled={courante === pages.length - 1} onPress={() => aller(1)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, padding: 6, opacity: courante === pages.length - 1 ? 0.3 : 1 }}><T size={14} color={c.muted}>{t('letter.next')}</T><ChevronRight size={16} color={c.muted} /></Pressable>
              </View>
            </View>
          )}
          {!ecriture && pages.length > 0 && (
            <Pressable accessibilityRole="button" onPress={() => { tap(); setEcriture('new'); setContenu(''); }}
              style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: c.rose200, backgroundColor: 'rgba(255,241,242,0.5)' }}>
              <PenLine size={16} color={c.rose700} /><T size={14} weight="600" color={c.rose700}>{t('letter.writeNew')}</T>
            </Pressable>
          )}
        </View>
      ))}
      {modal && <ModalCode mode={modal} fermer={() => setModal(null)} />}
    </Carte>
  );
}

function EtatVideCompact({ icone }: { icone: 'sprout' | 'envelope' }) {
  return <View style={{ marginVertical: -24 }}><EtatVide icone={icone} /></View>;
}

function ModalCode({ mode, fermer }: { mode: 'create' | 'unlock'; fermer: () => void }) {
  const app = useApp();
  const { c } = app;
  const [code, setCode] = useState('');
  const [code2, setCode2] = useState('');
  const [erreur, setErreur] = useState('');
  const creer = mode === 'create';
  const valider = () => {
    if (creer) {
      if (code.length < 4) return setErreur(t('pinModal.errMin'));
      if (code !== code2) return setErreur(t('pinModal.errMismatch'));
      app.creerPin(code); fermer();
    } else if (app.deverrouiller(code)) fermer(); else setErreur(t('pinModal.errWrong'));
  };
  const champ = { marginBottom: 12, borderRadius: 12, borderWidth: 1, borderColor: c.ring, backgroundColor: c.stone50, paddingVertical: 12, fontSize: 24, letterSpacing: 7, textAlign: 'center' as const, color: c.ink };
  return (
    <Modal transparent animationType="fade" onRequestClose={fermer}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <View style={{ width: '100%', maxWidth: 320, borderRadius: 16, backgroundColor: c.surface, padding: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.stone100, alignItems: 'center', justifyContent: 'center' }}><Lock size={18} color={c.muted} /></View>
            <View style={{ flex: 1 }}>
              <T weight="600">{creer ? t('pinModal.createTitle') : t('pinModal.enterTitle')}</T>
              <T size={12} color={c.muted}>{creer ? t('pinModal.createDesc') : t('pinModal.enterDesc')}</T>
            </View>
          </View>
          <TextInput value={code} onChangeText={setCode} secureTextEntry autoFocus placeholder="••••" placeholderTextColor={c.faint} accessibilityLabel="Code" style={champ} />
          {creer && <TextInput value={code2} onChangeText={setCode2} secureTextEntry placeholder={t('pinModal.confirmPlaceholder')} placeholderTextColor={c.faint} accessibilityLabel={t('pinModal.confirmPlaceholder')} style={[champ, { fontSize: 16, letterSpacing: 0 }]} />}
          {!!erreur && <T size={12} color={c.rose500} center style={{ marginBottom: 12 }}>{erreur}</T>}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable onPress={fermer} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: c.stone100, alignItems: 'center' }}><T size={14} weight="600" color={c.soft}>{t('pinModal.cancelBtn')}</T></Pressable>
            <Pressable onPress={() => { tap(); valider(); }} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: c.dark, alignItems: 'center' }}><T size={14} weight="600" color={c.bg}>{creer ? t('pinModal.continueBtn') : t('pinModal.unlockBtn')}</T></Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ---------- Mes raisons de tenir ---------- */
export function Raisons() {
  const app = useApp();
  const { c } = app;
  const [texte, setTexte] = useState('');
  const [ouvert, setOuvert] = useState(false);
  return (
    <Carte>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          <Bulle Icone={Anchor} fond={c.amber100} couleur={c.amber700} taille={44} rayon={16} iconTaille={20} />
          <View style={{ flex: 1 }}>
            <Sourcil color={c.amber700}>{t('reasons.eyebrow')}</Sourcil>
            <H size={20}>{t('reasons.title')}</H>
          </View>
        </View>
        <Pastille titre={ouvert ? t('common.collapse') : t('common.open')} onPress={() => setOuvert(!ouvert)} />
      </View>
      {ouvert && (
        <View style={{ marginTop: 16 }}>
          <T size={14} lh={24} color={c.muted} style={{ marginBottom: 16 }}>{t('reasons.desc')}</T>
          <View style={{ borderRadius: 16, backgroundColor: c.surface, padding: 16, borderWidth: 1, borderColor: c.ring }}>
            <TextInput value={texte} onChangeText={setTexte} multiline placeholder={t('reasons.placeholder')} placeholderTextColor={c.faint} accessibilityLabel={t('reasons.title')}
              style={{ minHeight: 76, borderRadius: 12, borderWidth: 1, borderColor: c.ring, backgroundColor: c.stone50, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, lineHeight: 22, color: c.ink, textAlignVertical: 'top' }} />
            <Pressable accessibilityRole="button" disabled={!texte.trim()} onPress={() => { tap(); app.ajouterRaison(texte.trim()); setTexte(''); }}
              style={{ marginTop: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: '#B45309', opacity: texte.trim() ? 1 : 0.5 }}>
              <Plus size={15} color="#FFFFFF" /><T size={14} weight="600" color="#FFFFFF">{t('reasons.add')}</T>
            </Pressable>
          </View>
          {app.raisons.length > 0 ? (
            <View style={{ marginTop: 16, gap: 12 }}>
              {app.raisons.map((r) => (
                <View key={r.id} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 16, backgroundColor: c.surface, padding: 16, borderWidth: 1, borderColor: c.ring }}>
                  <Heart size={16} color="#FBBF24" fill="#FBBF24" style={{ marginTop: 5 }} />
                  <T size={14} lh={28} color={c.text} style={{ flex: 1 }}>{r.text}</T>
                  <Pressable accessibilityLabel={t('common.delete')} onPress={() => confirmer(t('reasons.deleteTitle'), t('reasons.deleteDesc'), t('reasons.keepOne'), () => app.supprimerRaison(r.id))} style={{ padding: 8 }}><Trash2 size={15} color={c.faint} /></Pressable>
                </View>
              ))}
            </View>
          ) : (
            <View style={{ marginTop: 16, alignItems: 'center' }}>
              <EtatVideCompact icone="sprout" />
              <T size={14} color={c.faint} center>{t('reasons.empty')}</T>
            </View>
          )}
        </View>
      )}
    </Carte>
  );
}

/* ---------- Carnet de victoires ---------- */
export function Victoires({ sousTitre = 'Chaque pas compte, même petit — et tu choisis ce que tu partages' }: { sousTitre?: string }) {
  const app = useApp();
  const { c } = app;
  const [titre, setTitre] = useState('');
  const [ouvert, setOuvert] = useState(true);
  const ajouter = () => { if (!titre.trim()) return; tap(); app.ajouterVictoire(titre.trim()); setTitre(''); };
  return (
    <Carte>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: ouvert ? 20 : 0 }}>
        <Bulle Icone={Trophy} fond={c.amber50} couleur={c.amber600} />
        <View style={{ flex: 1 }}>
          <H size={20}>Carnet de victoires</H>
          <T size={14} color={c.muted}>{sousTitre}</T>
        </View>
        <Pastille titre={ouvert ? 'Replier' : 'Ouvrir'} onPress={() => setOuvert(!ouvert)} fond={c.amber50} couleur={c.amber700} />
      </View>
      {ouvert && (
        <>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
            <TextInput value={titre} onChangeText={setTitre} maxLength={150} placeholder="Une petite victoire aujourd'hui…" placeholderTextColor={c.faint} accessibilityLabel="Une petite victoire" onSubmitEditing={ajouter} returnKeyType="done"
              style={{ flex: 1, height: 46, borderRadius: 12, borderWidth: 1, borderColor: c.ring, backgroundColor: c.stone50, paddingHorizontal: 16, fontSize: 14, color: c.ink }} />
            <Pressable accessibilityRole="button" accessibilityLabel="Ajouter" onPress={ajouter} style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: '#F59E0B', alignItems: 'center', justifyContent: 'center' }}><Plus size={19} color="#FFFFFF" /></Pressable>
          </View>
          <View style={{ gap: 8 }}>
            {app.victoires.length === 0 ? (
              <View style={{ borderRadius: 12, backgroundColor: c.stone50, padding: 16 }}><T size={14} color={c.muted}>Rien pour l'instant — note ici tes petites et grandes victoires.</T></View>
            ) : app.victoires.map((v) => (
              <View key={v.id} style={{ borderRadius: 12, backgroundColor: c.surface, padding: 14, borderWidth: 1, borderColor: c.ring }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                  <View style={{ marginTop: 2, width: 24, height: 24, borderRadius: 12, backgroundColor: c.amber100, alignItems: 'center', justifyContent: 'center' }}><Trophy size={12} color={c.amber700} /></View>
                  <T size={14} lh={24} color={c.text} style={{ flex: 1 }}>{v.title}</T>
                  <Pressable accessibilityLabel="Supprimer" onPress={() => confirmer('Supprimer cette victoire ?', 'Elle ne sera plus dans ton carnet de victoires. Cette action est définitive.', 'Garder la victoire', () => app.supprimerVictoire(v.id))} style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} color="#CBD5E1" /></Pressable>
                </View>
                {app.partenaire && (
                  <View style={{ flexDirection: 'row', paddingLeft: 32, marginTop: 10 }}>
                    <Pressable disabled={v.shared.length > 0} onPress={() => { tap(); app.partagerVictoire(v.id); }}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: v.shared.length ? c.teal50 : c.amber50, opacity: v.shared.length ? 0.6 : 1 }}>
                      {v.shared.length ? <Check size={12} color={c.teal700} /> : <Send size={12} color={c.amber700} />}
                      <T size={12} weight="600" color={v.shared.length ? c.teal700 : c.amber700}>{v.shared.length ? `Partagé avec ${app.partenaire}` : `Partager avec ${app.partenaire}`}</T>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
          </View>
        </>
      )}
    </Carte>
  );
}

/* ---------- Petits mots avec le compte lié ---------- */
export function Encouragement() {
  const app = useApp();
  const { c } = app;
  const [ouvert, setOuvert] = useState(false);
  const [cat, setCat] = useState('soutien');
  const [envoye, setEnvoye] = useState(false);
  if (!app.partenaire) {
    return (
      <Carte onPress={() => router.push('/liens')} label="Lier ton compte à un proche" style={{ alignItems: 'center', padding: 20 }}>
        <EtatVideCompact icone="envelope" />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <Noeud />
          <T size={14} color={c.muted} center style={{ flexShrink: 1 }}>Lie ton compte à un proche pour échanger des petits mots de soutien</T>
        </View>
      </Carte>
    );
  }
  const phrases = app.profil === 'proche' ? PHRASES_PROCHE : PHRASES_PATIENT;
  const cats = [['soutien', 'Soutien', c.teal50, c.teal700], ['remerciement', 'Remerciement', c.amber50, c.amber700], ['difficile', 'Difficile à dire en face', c.rose50, c.rose700]] as const;
  return (
    <Carte>
      <View style={{ marginBottom: 16, borderRadius: 16, backgroundColor: c.rose50, padding: 16 }}>
        <T size={12} weight="600" upper color={c.rose500} style={{ letterSpacing: 0.6 }}>De la part de {app.partenaire}</T>
        <T size={14} lh={24} color={c.rose900} style={{ marginTop: 4 }}>« {app.profil === 'proche' ? "Merci d'être là." : 'Je suis fier·ère de chaque pas que tu fais, même les petits.'} »</T>
      </View>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: ouvert }} onPress={() => { tap(); setOuvert(!ouvert); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: c.rose50, alignItems: 'center', justifyContent: 'center' }}><Noeud taille={17} couleur={c.rose600} /></View>
        <View style={{ flex: 1 }}>
          <Sourcil>Envoyer un mot</Sourcil>
          <T size={12} color={c.faint}>Une phrase toute prête, pour dire ce qui est parfois difficile en face</T>
        </View>
        {ouvert ? <ChevronUpPetit /> : <ChevronDownPetit />}
      </Pressable>
      {ouvert && (
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {cats.map(([k, label, fond, col]) => <Puce key={k} titre={label} actif={cat === k} fond={fond} couleur={col} onPress={() => setCat(k)} />)}
          </View>
          <View style={{ gap: 8 }}>
            {phrases.filter((p) => p.category === cat).map((p) => (
              <Pressable key={p.key} accessibilityRole="button" onPress={() => { tap(); setEnvoye(true); setTimeout(() => setEnvoye(false), 3000); }}
                style={({ pressed }) => ({ borderRadius: 12, backgroundColor: c.surface, padding: 12, borderWidth: 1, borderColor: pressed ? c.rose200 : c.ring })}>
                <T size={14} lh={24} color={c.text}>{p.text}</T>
              </Pressable>
            ))}
          </View>
          {envoye && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 }}><Check size={14} color={c.teal600} /><T size={12} weight="600" color={c.teal600}>Envoyé</T></View>}
        </View>
      )}
    </Carte>
  );
}

const ChevronUpPetit = () => <ChevronUp size={18} color="#94A3B8" />;
const ChevronDownPetit = () => <ChevronDown size={18} color="#94A3B8" />;

/** Icône « nœud » du site (deux cordes entrelacées). */
export function Noeud({ taille = 16, couleur = '#FB7185' }: { taille?: number; couleur?: string }) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 24 24" fill="none" stroke={couleur} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9h6" /><Path d="M3 15h6" /><Path d="M15 9h6" /><Path d="M15 15h6" /><Path d="M9 9h6v6h-6z" /><Path d="M9 9l6 6" /><Path d="M15 9l-6 6" />
    </Svg>
  );
}
