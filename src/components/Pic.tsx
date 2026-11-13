import { Image, Text } from 'react-native';
import { EMOJI_IMAGES } from '../data/emojiImages';

/** Big, crisp full-colour picture (Noto Emoji PNG) for a word/sticker/avatar; falls back to the emoji text. */
export default function Pic({ emoji, size = 96 }: { emoji: string; size?: number }) {
  const key = emoji.replace(/️/g, '');
  const src = EMOJI_IMAGES[key];
  if (src) return <Image source={src} style={{ width: size, height: size }} resizeMode="contain" accessibilityLabel={emoji} />;
  return <Text style={{ fontSize: size * 0.78, textAlign: 'center' }}>{emoji}</Text>;
}
