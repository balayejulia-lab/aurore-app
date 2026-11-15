import { TEMOIGNAGES_PATIENT } from '@/data';
import { Temoignages } from '@/temoignages';

export default function TemoignagesPatient() {
  return <Temoignages liste={TEMOIGNAGES_PATIENT} sousTitre="Des vies qui ont refleuri" />;
}
