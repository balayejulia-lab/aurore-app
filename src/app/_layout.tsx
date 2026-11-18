import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppProvider, useApp } from '@/store';

SplashScreen.preventAutoHideAsync();

function Navigation() {
  const { c, nuit } = useApp();
  useEffect(() => { SplashScreen.hideAsync(); }, []);
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
