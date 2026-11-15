import { Tabs } from 'expo-router/js-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useC } from './store';
import { font } from './theme';
import { Icon, type IconName } from './ui';

export function Onglets({ onglets }: { onglets: [string, string, IconName][] }) {
  const c = useC();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: c.bg },
        tabBarActiveTintColor: c.ink,
        tabBarInactiveTintColor: c.muted,
        tabBarLabelStyle: { fontFamily: font.semibold, fontSize: 10.5 },
        tabBarStyle: { backgroundColor: c.card, borderTopColor: c.line, height: 66 + insets.bottom, paddingTop: 8 },
      }}>
      {onglets.map(([name, titre, icone]) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: titre,
            tabBarIcon: ({ focused, color }) => (
              <View style={{ width: 52, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: focused ? c.soft : 'transparent' }}>
                <Icon name={icone} size={22} color={color as string} width={focused ? 2 : 1.75} />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
