import { Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold, Figtree_700Bold } from '@expo-google-fonts/figtree';
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppProvider, useApp } from '@/store';

SplashScreen.preventAutoHideAsync();

function Navigation() {
  const { c, modeNuit } = useApp();
  return (
    <>
      <StatusBar style={modeNuit ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg }, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="connexion" />
        <Stack.Screen name="bienvenue" options={{ gestureEnabled: false }} />
        <Stack.Screen name="patient" />
        <Stack.Screen name="proche" />
        <Stack.Screen name="aide" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="favoris" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="reglages" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [pret] = useFonts({ Fraunces_600SemiBold, Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold, Figtree_700Bold });
  useEffect(() => { if (pret) SplashScreen.hideAsync(); }, [pret]);
  if (!pret) return null;
  return (
    <AppProvider>
      <Navigation />
    </AppProvider>
  );
}
