import { TEMOIGNAGES_PROCHE } from '@/data';
import { Temoignages } from '@/temoignages';

export default function TemoignagesProche() {
  return <Temoignages liste={TEMOIGNAGES_PROCHE} sousTitre="D'autres proches racontent" />;
}
