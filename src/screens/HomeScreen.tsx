import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { wordOfTheDay } from '../lib/game';
import { speak } from '../lib/audio';
import { GAMES } from '../data/extras';
import { STORIES } from '../data/stories';
import ScreenShell from '../components/ScreenShell';
import Pic from '../components/Pic';
import { colors } from '../theme/colors';

export default function HomeScreen() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const stickers = useStore((s) => s.stickers);
  const minutes = useStore((s) => s.minutesToday);
  const wotd = wordOfTheDay(profile.level);

  const items = [
    ...GAMES.map((g) => ({ key: g.id, title: g.title, desc: g.desc, icon: g.id, route: g.route, color: '#E7F4FF' })),
  ];

  return (
    <ScreenShell max={820}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.push('/setup')} style={styles.profilePill} accessibilityRole="button">
          <View style={styles.avatarWrap}><Pic emoji={profile.avatar} size={34} /></View>
          <View>
            <Text style={styles.hello}>Hi, {profile.name}!</Text>
            <Text style={styles.stickerText}>★ {stickers.length} stickers collected</Text>
          </View>
        </Pressable>

        <Pressable onPress={() => router.push('/parent')} style={styles.grownPill} accessibilityRole="button">
          <Text style={styles.grownIcon}>🔒</Text>
          <Text style={styles.grownText}>Grown-ups</Text>
        </Pressable>
      </View>

      <View style={styles.speechCard}>
        <Text style={styles.speechText}>Leo says: “Let&apos;s spell some words!”</Text>
        <Text style={styles.speechSub}>Pick a game below — every game ends with a sticker.</Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.wordCard}>
          <View style={styles.wordHeader}>
            <View style={styles.wordIconWrap}><Pic emoji={wotd.emoji} size={42} /></View>
            <Text style={styles.wordBadge}>WORD OF THE DAY</Text>
          </View>
          <Text style={styles.wordTitle}>{wotd.word}</Text>
          <View style={styles.wordActions}>
            <Pressable onPress={() => speak(wotd.word)} style={[styles.button, styles.buttonPurple]}>
              <Text style={styles.buttonText}>Hear it</Text>
            </Pressable>
            <Pressable onPress={() => router.push({ pathname: '/spell', params: { word: wotd.word } } as never)} style={[styles.button, styles.buttonGold]}>
              <Text style={styles.buttonText}>Spell it!</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.goalCard}>
          <View style={styles.goalRing}><Text style={styles.goalMinutes}>{minutes}m</Text></View>
          <Text style={styles.goalTitle}>Today&apos;s goal</Text>
          <Text style={styles.goalSub}>{minutes} of 10 minutes played</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {items.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => router.push(item.route as never)}
            accessibilityRole="button"
            style={[styles.gameCard, { backgroundColor: item.color }]}
          >
            <View style={styles.gameIcon}
            >
              <Pic emoji={
                item.icon === 'spell' ? '🔤' :
                item.icon === 'pick' ? '👆' :
                item.icon === 'sound' ? '🔊' :
                item.icon === 'match' ? '🖼️' :
                item.icon === 'vowel' ? 'A' :
                item.icon === 'rhyme' ? '🎵' :
                item.icon === 'memory' ? '🧠' :
                item.icon === 'rewards' ? '🎁' :
                item.icon === 'map' ? '🗺️' :
                item.icon === 'stories' ? '📚' : '🎈'
              } size={34} />
            </View>
            <View style={styles.gameTextBox}>
              <Text style={styles.gameTitle}>{item.title}</Text>
              <Text style={styles.gameDesc}>{item.desc}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  profilePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(43,42,82,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 11,
    minHeight: 62,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  hello: {
    fontSize: 20,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '900',
    color: colors.ink,
    lineHeight: 24,
  },
  stickerText: {
    fontSize: 14,
    color: colors.ink,
    fontWeight: '700',
  },
  grownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(43,42,82,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 62,
    minWidth: 150,
  },
  grownIcon: { fontSize: 20, marginRight: 8 },
  grownText: {
    fontSize: 20,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '900',
    color: colors.ink,
  },
  speechCard: {
    width: '100%',
    backgroundColor: '#F7F7F7',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(43,42,82,0.12)',
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 18,
  },
  speechText: {
    fontSize: 28,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 34,
  },
  speechSub: {
    marginTop: 8,
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
  },
  infoRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 22,
  },
  wordCard: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(43,42,82,0.12)',
    padding: 16,
  },
  wordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  wordIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#D9F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordBadge: {
    fontSize: 18,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: 0.5,
  },
  wordTitle: {
    fontSize: 46,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 12,
  },
  wordActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    minWidth: 122,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#00000033',
  },
  buttonPurple: {
    backgroundColor: '#C89AEF',
  },
  buttonGold: {
    backgroundColor: '#F7C94C',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '900',
    color: '#2B2A52',
  },
  goalCard: {
    flex: 0.9,
    backgroundColor: '#F7F7F7',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(43,42,82,0.12)',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 8,
    borderColor: '#A0EAD3',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalMinutes: {
    fontSize: 24,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '900',
    color: colors.ink,
  },
  goalTitle: {
    fontSize: 24,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '900',
    color: colors.ink,
    marginBottom: 2,
  },
  goalSub: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '700',
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gameCard: {
    width: '48%',
    minHeight: 120,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(43,42,82,0.10)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  gameIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#ffffffdd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gameTextBox: {
    flex: 1,
    alignItems: 'flex-start',
  },
  gameTitle: {
    fontSize: 22,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '900',
    color: colors.ink,
    lineHeight: 28,
  },
  gameDesc: {
    fontSize: 14,
    color: colors.ink,
    lineHeight: 18,
    marginTop: 3,
  },
});
