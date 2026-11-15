// Palette Aurore : jaune pâle, pêche, corail doux, crème. Contrastes texte ≥ AA.
export const jour = {
  bg: '#FFF9EE',
  card: '#FFFFFF',
  soft: '#FBEFC2',
  peach: '#FFE3CF',
  sun: '#F8DE7E',
  gold: '#E9B93A',
  ink: '#3B2A20',
  muted: '#6B5444',
  link: '#9A4424',
  help: '#8F3A1A',
  helpBg: '#FFE3CF',
  line: '#E8D9C6',
  glass: 'rgba(255,249,238,0.88)',
  bubbleMe: '#3B2A20',
  bubbleMeText: '#FFF9EE',
  shadow: '#785019',
};

export const nuit: typeof jour = {
  bg: '#221B1E',
  card: '#2E2427',
  soft: '#3A2F2A',
  peach: '#4A3530',
  sun: '#E9C766',
  gold: '#E9B93A',
  ink: '#F6EBDD',
  muted: '#CDBBA9',
  link: '#F2B48F',
  help: '#FFD2BC',
  helpBg: '#5A3428',
  line: '#4A3C38',
  glass: 'rgba(34,27,30,0.82)',
  bubbleMe: '#F6EBDD',
  bubbleMeText: '#221B1E',
  shadow: '#000000',
};

export type Palette = typeof jour;

export const font = {
  title: 'Fraunces_600SemiBold',
  regular: 'Figtree_400Regular',
  medium: 'Figtree_500Medium',
  semibold: 'Figtree_600SemiBold',
  bold: 'Figtree_700Bold',
};
