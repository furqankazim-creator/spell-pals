import { Platform, TextStyle } from 'react-native';

// Universal Spell Pals logo font family (Baloo 2) across the entire app
export const APP_FONT_FAMILY = Platform.select({
  web: '"Baloo 2", Baloo2_700Bold, cursive, sans-serif',
  default: 'Baloo2_700Bold',
});

export const fontFamilies = {
  display: Platform.select({ web: '"Baloo 2", Baloo2_800ExtraBold, cursive, sans-serif', default: 'Baloo2_800ExtraBold' }),
  displaySemi: Platform.select({ web: '"Baloo 2", Baloo2_700Bold, cursive, sans-serif', default: 'Baloo2_700Bold' }),
  body: Platform.select({ web: '"Baloo 2", Baloo2_700Bold, cursive, sans-serif', default: 'Baloo2_700Bold' }),
  bodyRegular: Platform.select({ web: '"Baloo 2", Baloo2_500Medium, cursive, sans-serif', default: 'Baloo2_500Medium' }),
};

export const typography: Record<string, TextStyle> = {
  h1: {
    fontFamily: fontFamilies.display,
    fontWeight: '800',
    fontSize: 32,
    lineHeight: 38,
    color: '#2B2A52',
  },
  h2: {
    fontFamily: fontFamilies.display,
    fontWeight: '800',
    fontSize: 24,
    lineHeight: 30,
    color: '#2B2A52',
  },
  h3: {
    fontFamily: fontFamilies.displaySemi,
    fontWeight: '800',
    fontSize: 20,
    lineHeight: 26,
    color: '#2B2A52',
  },
  body: {
    fontFamily: fontFamilies.body,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: '#2B2A52',
  },
  bodySmall: {
    fontFamily: fontFamilies.bodyRegular,
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 18,
    color: '#5F6490',
  },
  button: {
    fontFamily: fontFamilies.display,
    fontWeight: '800',
    fontSize: 18,
    lineHeight: 24,
    color: '#2B2A52',
    textAlign: 'center',
  },
};
