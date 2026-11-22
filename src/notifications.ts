// Rappels du calendrier : vraies notifications locales, programmées sur le téléphone (rien ne passe par un serveur).
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { contenuMatin, numeroJour } from './matin';
import { declencheur, type Ev } from './rappels';
export * from './rappels';

const QUAND: Record<number, string> = { 0: "C'est maintenant", 5: 'Dans 5 minutes', 15: 'Dans 15 minutes', 30: 'Dans 30 minutes', 60: 'Dans 1 heure', 1440: 'Demain' };

/** Demande l'autorisation iOS (une seule fois : ensuite iOS répond sans redemander). */
export async function autoriser(): Promise<boolean> {
  if (Platform.OS === 'web') return true;
  const { granted } = await Notifications.getPermissionsAsync();
  return granted || (await Notifications.requestPermissionsAsync()).granted;
}

/** Programme la notification. Renvoie ses identifiants, ou un message si ce n'est pas possible. */
export async function programmer(e: Ev): Promise<{ ids: string[]; souci?: string }> {
  // Les valeurs « date », « daily »… sont celles de SchedulableTriggerInputTypes.
  const trigger = declencheur(e) as Notifications.SchedulableNotificationTriggerInput | null;
  if (!trigger) return { ids: [], souci: e.rappel == null ? undefined : "Ce moment est déjà passé : pas de notification." };
  if (Platform.OS === 'web') return { ids: [], souci: 'Les notifications marchent seulement sur le téléphone.' };
  let { granted } = await Notifications.getPermissionsAsync();
  if (!granted) granted = (await Notifications.requestPermissionsAsync()).granted;
  if (!granted) return { ids: [], souci: 'Autorise les notifications d\'Aurore dans Réglages iPhone pour recevoir ce rappel.' };
  const id = await Notifications.scheduleNotificationAsync({
    content: { title: e.titre, body: `${QUAND[e.rappel!] ?? 'Bientôt'} · ${e.heure.replace(':', 'h')}`, sound: true },
    trigger,
  });
  return { ids: [id] };
}

export function annuler(ids: string[] = []) {
  if (Platform.OS !== 'web') ids.forEach((id) => Notifications.cancelScheduledNotificationAsync(id).catch(() => {}));
}

// Affiche aussi la notification quand l'app est ouverte.
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }) });
}

// Notification du matin : on programme les 30 prochains jours, chacun avec son message.
// Sans ouverture de l'app pendant 30 jours, elles s'arrêtent d'elles-mêmes (on n'insiste pas).
export async function planifierMatin(profil: 'patient' | 'proche' | null, heure: string, actif: boolean, perso: Parameters<typeof contenuMatin>[2]) {
  if (Platform.OS === 'web') return;
  const prevues = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(prevues.filter((x) => x.identifier.startsWith('matin-')).map((x) => Notifications.cancelScheduledNotificationAsync(x.identifier)));
  if (!profil || !actif || !(await Notifications.getPermissionsAsync()).granted) return;
  const [h, m] = heure.split(':').map(Number);
  const maintenant = new Date();
  for (let i = 0; i < 31; i++) {
    const quand = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate() + i, h, m);
    if (quand <= maintenant) continue;
    const { titre, corps, url } = contenuMatin(profil, numeroJour(quand), perso);
    await Notifications.scheduleNotificationAsync({
      identifier: `matin-${i}`,
      content: { title: titre, body: corps, data: { url }, sound: true },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: quand },
    });
  }
}
