import { Linking } from 'react-native';

/** Hope Bridge Digital — publisher of Spell Pals. Single source of truth for promo copy. */
export const HOPE_BRIDGE = {
  publisher: 'Hope Bridge Digital',
  app: 'Spell Pals',
  star: '✦',
  tagline: 'Family-first reading for every child.',
  mission:
    'Hope Bridge Digital builds gentle, private learning tools that help every child read with confidence. No accounts, no ads, no tracking — progress stays on this device.',
  website: 'https://hopebridgedigital.site',
  email: 'hello@hopebridgedigital.com',
  emailSubject: 'Hope Bridge Digital Inquiry',
  labels: ['100% Private & Offline', 'SLP Guided', 'Zero Ads or Tracking', 'Bilingual (EN & AR)'],
  closingTitle: "Empowering Every Child's Unique Voice",
  closingDescription:
    'Hope Bridge Digital makes safe, offline-first reading apps for children and their families. Spell Pals is our phonics playground — built for growing readers, with no ads and no tracking.',
} as const;

export function openHopeBridgeWebsite() {
  return Linking.openURL(HOPE_BRIDGE.website);
}

export function openHopeBridgeEmail() {
  const url = `mailto:${HOPE_BRIDGE.email}?subject=${encodeURIComponent(HOPE_BRIDGE.emailSubject)}`;
  return Linking.openURL(url);
}
