import { Text, View } from 'react-native';

/** Colourful flat icons (emoji) on soft tiles, like the Spell Pals reference design. */
export const GAME_ICONS: Record<string, { icon: string; bg: string }> = {
  spell: { icon: '🔤', bg: '#DDF1FF' },
  pick: { icon: '👆', bg: '#D9F7F1' },
  sound: { icon: '🧩', bg: '#ECE8FF' },
  match: { icon: '🖼️', bg: '#FFF1CC' },
  vowel: { icon: '🅰️', bg: '#FFE3E3' },
  rhyme: { icon: '🎵', bg: '#FFE3EE' },
  memory: { icon: '🧠', bg: '#D6F6F2' },
  rewards: { icon: '🎁', bg: '#FFF1CC' },
  map: { icon: '🗺️', bg: '#D9F7F1' },
  stories: { icon: '📖', bg: '#ECE8FF' },
  home: { icon: '🏠', bg: '#DDF1FF' },
  parent: { icon: '🔒', bg: '#EEF1F5' },
};

export function IconTile({ id, size = 64 }: { id: string; size?: number }) {
  const g = GAME_ICONS[id] ?? GAME_ICONS.spell;
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.31, backgroundColor: g.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: size * 0.5 }}>{g.icon}</Text>
    </View>
  );
}

export function TabIcon({ id, active }: { id: string; active: boolean }) {
  const g = GAME_ICONS[id] ?? GAME_ICONS.home;
  return <Text style={{ fontSize: 26, opacity: active ? 1 : 0.65 }}>{g.icon}</Text>;
}
