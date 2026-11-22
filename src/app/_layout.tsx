import * as Notifications from 'expo-notifications';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { AppProvider, useApp } from '@/store';
import { planifierMatin } from '@/notifications';

SplashScreen.preventAutoHideAsync();

function Navigation() {
  const app = useApp();
  const { c, nuit } = app;
  useEffect(() => { SplashScreen.hideAsync(); }, []);

  // Notification du matin : reprogrammée à chaque ouverture et à chaque changement (heure, raisons, mot doux…).
  const perso = { raisons: app.raisons, motDoux: app.motDoux, victoires: app.victoires };
  useEffect(() => {
    planifierMatin(app.connecte ? app.profil : null, app.heureMatin, app.rappels, perso).catch(() => {});
  }, [app.connecte, app.profil, app.heureMatin, app.rappels, JSON.stringify(perso)]);

  // Toucher une notification ouvre ce qu'elle annonce.
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const ouvrir = (r: Notifications.NotificationResponse | null, delai: number) => {
      const url = r?.notification.request.content.data?.url;
      if (typeof url === 'string') setTimeout(() => router.push(url as never), delai);
      Notifications.clearLastNotificationResponse(); // sinon elle rouvrirait la même page au prochain lancement
    };
    // App lancée par la notification : on attend la fin de l'écran de chargement (2,3 s) qui redirige.
    Notifications.getLastNotificationResponseAsync().then((r) => ouvrir(r, 2600));
    const sub = Notifications.addNotificationResponseReceivedListener((r) => ouvrir(r, 0));
    return () => sub.remove();
  }, []);
  return (
    <>
      <StatusBar style={nuit ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg }, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="connexion" />
        <Stack.Screen name="inscription" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="bienvenue" options={{ gestureEnabled: false }} />
        <Stack.Screen name="patient" />
        <Stack.Screen name="proche" />
        <Stack.Screen name="aide" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="reglages" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="calendrier" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="liens" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <Navigation />
    </AppProvider>
  );
}
