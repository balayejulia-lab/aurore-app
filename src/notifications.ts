// Rappels du calendrier : vraies notifications locales, programmées sur le téléphone (rien ne passe par un serveur).
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

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
