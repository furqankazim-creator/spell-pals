import { Image, Text } from 'react-native';
import { EMOJI_IMAGES } from '../data/emojiImages';

/** Big, crisp full-colour picture (Noto Emoji PNG) for a word/sticker/avatar; falls back to the emoji text. */
export default function Pic({ emoji, size = 96, imageUri }: { emoji: string; size?: number; imageUri?: string }) {
  if (imageUri) return <Image source={{ uri: imageUri }} style={{ width: size, height: size, borderRadius: Math.round(size * 0.16) }} resizeMode="cover" accessibilityLabel={emoji || 'Custom word picture'} />;
  const key = emoji.replace(/️/g, '');
  const src = EMOJI_IMAGES[key];
  if (src) return <Image source={src} style={{ width: size, height: size }} resizeMode="contain" accessibilityLabel={emoji} />;
  return <Text style={{ fontSize: size * 0.78, textAlign: 'center' }}>{emoji}</Text>;
}
