import { Image } from 'react-native';

/** Spell Pals logo (SP letter tiles + wordmark). Image is 700x420. */
export default function Logo({ width = 220 }: { width?: number }) {
  return <Image source={require('../../assets/logo.png')} style={{ width, height: (width * 420) / 700, alignSelf: 'center' }} resizeMode="contain" accessibilityLabel="Spell Pals" />;
}
