import { Onglets } from '@/onglets';

export default function ProcheLayout() {
  return (
    <Onglets onglets={[
      ['index', 'Accueil', 'home'],
      ['pour-toi', 'Pour toi', 'smile'],
      ['attentions', 'Attentions', 'gift'],
      ['assistant', 'Assistant', 'sparkle'],
      ['temoignages', 'Témoignages', 'book'],
    ]} />
  );
}
