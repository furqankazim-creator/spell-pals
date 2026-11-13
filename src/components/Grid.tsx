import { Children } from 'react';
import { View } from 'react-native';

/** Equal-width responsive grid: `cols` columns with `gap` spacing. */
export default function Grid({ cols, gap = 16, children }: { cols: number; gap?: number; children: React.ReactNode }) {
  const items = Children.toArray(children);
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -gap / 2 }}>
      {items.map((c, i) => (
        <View key={i} style={{ width: `${100 / cols}%`, padding: gap / 2 }}>{c}</View>
      ))}
    </View>
  );
}
