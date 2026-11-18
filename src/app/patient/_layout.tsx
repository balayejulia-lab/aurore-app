import { Clapperboard, Heart, Home, Images, Shield } from 'lucide-react-native';
import { Onglets } from '@/onglets';
import { t } from '@/ui';

export default function PatientLayout() {
  return (
    <Onglets onglets={[
      ['index', t('nav.profil'), Home],
      ['temoignages', t('nav.temoignages'), Clapperboard],
      ['inspiration', t('nav.inspirations'), Images],
      ['favoris', t('nav.favoris'), Heart],
      ['urgence', t('nav.urgence'), Shield, '#D97A56'],
    ]} />
  );
}
