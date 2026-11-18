import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function HopeBridgeTicker() {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -640,
          duration: 14000,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [translateX]);

  const copy = 'HOPE BRIDGE DIGITAL · Every child deserves tools that help them thrive.   ';

  return (
    <Pressable
      onPress={() => router.push('/about-hope-bridge')}
      accessibilityRole="button"
      accessibilityLabel="About Hope Bridge Digital"
      style={styles.wrap}
    >
      <View style={styles.messageBox}>
        <Animated.View style={[styles.track, { transform: [{ translateX }] }]}>
          <Text style={styles.text}>{copy}{copy}{copy}</Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F62E58',
    borderBottomWidth: 0,
    overflow: 'hidden',
  },
  messageBox: { width: '100%', height: 34, justifyContent: 'center', overflow: 'hidden' },
  track: { width: 1200 },
  text: { color: '#15154A', fontSize: 12, lineHeight: 34, fontWeight: '900', letterSpacing: 0.1 },
});
