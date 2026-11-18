import { Clapperboard, Gift, Heart, Home, Sparkles } from 'lucide-react-native';
import { Onglets } from '@/onglets';
import { t } from '@/ui';

export default function ProcheLayout() {
  return (
    <Onglets onglets={[
      ['index', t('nav.accueil'), Home],
      ['attentions', t('nav.attentionsLabel'), Gift],
      ['assistant', t('nav.assistantProches'), Sparkles],
      ['temoignages', t('nav.temoignages'), Clapperboard],
      ['favoris', t('nav.favoris'), Heart],
    ]} />
  );
}
