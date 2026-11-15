import { Onglets } from '@/onglets';

export default function PatientLayout() {
  return (
    <Onglets onglets={[
      ['index', 'Accueil', 'home'],
      ['envies', 'Mes envies', 'star'],
      ['temoignages', 'Témoignages', 'book'],
      ['inspiration', 'Inspiration', 'sparkle'],
      ['carnet', 'Carnet', 'pen'],
    ]} />
  );
}
