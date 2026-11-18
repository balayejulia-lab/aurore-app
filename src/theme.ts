// Palette reprise à l'identique du site Aurore (index.css + couleurs Tailwind utilisées).
export const clair = {
  bg: '#F6EED5',
  surface: '#FFFFFF',
  ink: '#1E293B', // slate-800
  text: '#334155', // slate-700
  soft: '#475569', // slate-600
  muted: '#64748B', // slate-500
  faint: '#94A3B8', // slate-400
  line: 'rgba(44,42,74,0.08)',
  ring: '#E7E5E4', // stone-200
  stone50: '#FAFAF9',
  stone100: '#F5F5F4',
  paper: '#FDFAF3',
  accent: '#6B8E7F',
  accentSoft: '#EEF4F0',
  heroBg: '#EEF4F0',
  sun: '#F8DE7E',
  sunStrong: '#E9B93A',
  navPill: '#FBEDB8',
  dark: '#1E293B', // boutons pleins slate-800
  coral: '#D97A56',
  amber50: '#FFFBEB', amber100: '#FEF3C7', amber200: '#FDE68A', amber500: '#F59E0B', amber600: '#D97706', amber700: '#B45309',
  rose50: '#FFF1F2', rose100: '#FFE4E6', rose200: '#FECDD3', rose400: '#FB7185', rose500: '#F43F5E', rose600: '#E11D48', rose700: '#BE123C', rose900: '#881337',
  teal50: '#F0FDFA', teal100: '#CCFBF1', teal600: '#0D9488', teal700: '#0F766E',
  emerald50: '#ECFDF5', emerald700: '#047857',
  sky50: '#F0F9FF', sky700: '#0369A1',
  violet50: '#F5F3FF', violet100: '#EDE9FE', violet700: '#6D28D9',
  av50: '#F5E3E6', av100: '#EFD8E6', av200: '#E7C7E6', av300: '#D8ABE5', av500: '#9761DE', av600: '#8A44D6', av700: '#7D34C5',
  white: '#FFFFFF',
  shadow: '#2C2A4A',
};

// Mode nuit du site : violet nuit, jamais de noir pur.
export const sombre: typeof clair = {
  ...clair,
  bg: '#17162A',
  surface: '#232240',
  ink: '#F1EFE6',
  text: '#D7D4E8',
  soft: '#D7D4E8',
  muted: '#B3B0C9',
  faint: '#9490AC',
  line: 'rgba(241,239,230,0.10)',
  ring: 'rgba(241,239,230,0.10)',
  stone50: '#2A2847',
  stone100: '#302D52',
  paper: '#2A2847',
  accent: '#9CC2B2',
  accentSoft: 'rgba(156,194,178,0.16)',
  heroBg: '#2A2847',
  navPill: 'rgba(248,222,126,0.35)',
  dark: '#F1EFE6',
  amber50: 'rgba(245,158,11,0.14)', amber100: 'rgba(245,158,11,0.2)', amber700: '#FCD34D',
  rose50: 'rgba(244,63,94,0.14)', rose100: 'rgba(244,63,94,0.2)', rose600: '#FDA4AF', rose700: '#FDA4AF', rose900: '#FFE4E6',
  teal50: 'rgba(13,148,136,0.16)', teal700: '#5EEAD4',
  emerald50: 'rgba(16,185,129,0.16)', emerald700: '#6EE7B7',
  sky50: 'rgba(14,165,233,0.16)', sky700: '#7DD3FC',
  av50: 'rgba(246,230,240,0.12)', av100: 'rgba(246,230,240,0.16)', av200: 'rgba(214,170,210,0.24)', av300: '#D9AEE0', av500: '#C68FD8', av600: '#B97FCE', av700: '#D9AEE0',
  white: '#232240',
  shadow: '#000000',
};

export type Palette = typeof clair;
