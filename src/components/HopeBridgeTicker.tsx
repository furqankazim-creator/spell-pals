import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

interface TickerItem {
  tag: string;
  text: string;
  action?: string;
}

const ITEMS: TickerItem[] = [
  { tag: '✨ HOPE BRIDGE DIGITAL', text: 'Family-first learning tools for every child', action: 'About Us' },
  { tag: '🔒 100% PRIVATE & OFFLINE', text: 'Zero ads, zero accounts, zero tracking' },
  { tag: '💜 SLP GUIDED', text: 'Calm phonics for autism, speech & attention needs' },
  { tag: '🌱 SPELL PALS', text: 'Gentle reading playground tailored to your child’s pace', action: 'Learn More ›' },
];

export default function HopeBridgeTicker() {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (contentWidth <= 0) return;

    translateX.setValue(0);
    // Smooth, consistent scrolling speed (~38 pixels per second)
    const duration = Math.round((contentWidth / 38) * 1000);

    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -contentWidth,
        duration,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );

    animation.start();
    return () => animation.stop();
  }, [contentWidth, translateX]);

  const renderSegment = (keyPrefix: string) => (
    <View
      key={keyPrefix}
      style={styles.segment}
      onLayout={keyPrefix === 'seg1' ? (e) => setContentWidth(e.nativeEvent.layout.width) : undefined}
    >
      {ITEMS.map((item, idx) => (
        <View key={`${keyPrefix}-${idx}`} style={styles.itemWrap}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
          <Text style={styles.itemText}>{item.text}</Text>
          {item.action ? (
            <View style={styles.actionPill}>
              <Text style={styles.actionText}>{item.action}</Text>
            </View>
          ) : null}
          <Text style={styles.separator}>✦</Text>
        </View>
      ))}
    </View>
  );

  return (
    <Pressable
      onPress={() => router.push('/about-hope-bridge')}
      accessibilityRole="button"
      accessibilityLabel="About Hope Bridge Digital - Tap to learn about our mission"
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <View style={styles.innerBox}>
        {/* Animated Infinite Marquee Track */}
        <Animated.View style={[styles.track, { transform: [{ translateX }] }]}>
          {renderSegment('seg1')}
          {renderSegment('seg2')}
        </Animated.View>

        {/* Soft edge fade masks on both sides for premium look */}
        <LinearGradient
          colors={['#252349', 'rgba(37,35,73,0)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.fadeLeft}
          pointerEvents="none"
        />
        <LinearGradient
          colors={['rgba(37,35,73,0)', '#252349']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.fadeRight}
          pointerEvents="none"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 34,
    backgroundColor: '#252349',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  pressed: {
    backgroundColor: '#1E1C3D',
  },
  innerBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  tagBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  tagText: {
    color: '#FDE047',
    fontSize: 11,
    fontFamily: 'Baloo2_700Bold',
    letterSpacing: 0.4,
  },
  itemText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    letterSpacing: 0.2,
  },
  actionPill: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 999,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Baloo2_700Bold',
  },
  separator: {
    color: '#A5B4FC',
    fontSize: 12,
    marginLeft: 6,
  },
  fadeLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 28,
    zIndex: 2,
  },
  fadeRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 28,
    zIndex: 2,
  },
});
