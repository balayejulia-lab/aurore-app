import { Tabs } from 'expo-router/js-tabs';
import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useC } from './store';

// Barre du bas du site : icônes seules, pastille jaune Aurore sous l'onglet actif.
export function Onglets({ onglets }: { onglets: [string, string, LucideIcon, string?][] }) {
  const c = useC();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        sceneStyle: { backgroundColor: c.bg },
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.line, height: 64 + insets.bottom, paddingTop: 8 },
      }}>
      {onglets.map(([name, titre, Icone, teinte]) => (
        <Tabs.Screen key={name} name={name} options={{
          title: titre,
          tabBarAccessibilityLabel: titre,
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 56, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: focused ? c.navPill : 'transparent' }}>
              <Icone size={24} color={focused ? c.ink : teinte ?? c.muted} strokeWidth={2} />
            </View>
          ),
        }} />
      ))}
    </Tabs>
  );
}
