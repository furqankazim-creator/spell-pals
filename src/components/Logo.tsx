import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

let logoSource: ImageSourcePropType | null = null;
try {
  const asset = require('../../assets/logo.png');
  logoSource = asset && asset.default ? asset.default : asset;
} catch {
  logoSource = null;
}

/** Spell Pals logo (SP letter tiles + wordmark). Image is 700x420. */
export default function Logo({ width = 220 }: { width?: number }) {
  const height = (width * 420) / 700;
  if (logoSource) {
    return (
      <Image
        source={logoSource}
        style={{ width, height, alignSelf: 'center' }}
        resizeMode="contain"
        accessibilityLabel="Spell Pals"
      />
    );
  }
  return (
    <View style={[styles.fallback, { width, height }]}>
      <Text style={styles.fallbackTitle}>✨ Spell Pals</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  fallbackTitle: {
    fontSize: 28,
    fontFamily: 'Baloo2_800ExtraBold',
    color: '#2B2A52',
  },
});
