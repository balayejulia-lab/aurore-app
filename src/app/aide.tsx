import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { EcranUrgence } from '@/ecrans/Urgence';
import { useC } from '@/store';

// Bouton « Aide » du haut : les ressources d'urgence, accessibles d'un geste depuis tous les écrans.
export default function Aide() {
  const c = useC();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 48 }}>
        <View style={{ alignItems: 'flex-end', marginBottom: 4 }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Fermer" onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }}><X size={20} color={c.muted} /></Pressable>
        </View>
        <EcranUrgence />
      </ScrollView>
    </View>
  );
}
