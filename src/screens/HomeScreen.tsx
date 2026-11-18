import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { wordOfTheDay } from '../lib/game';
import { speak } from '../lib/audio';
import { GAMES } from '../data/extras';
import { STORIES } from '../data/stories';
import BloomFocusPromoCard from '../components/BloomFocusPromoCard';
import HopeBridgePublisherCard from '../components/HopeBridgePublisherCard';
import ScreenShell from '../components/ScreenShell';
import Pic from '../components/Pic';
import { colors } from '../theme/colors';
import { useLayout } from '../lib/useLayout';
import ChildTopBar from '../components/ChildTopBar';

export default function HomeScreen() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const stickers = useStore((s) => s.stickers);
  const wotd = wordOfTheDay(profile.level);
  const { width } = useLayout();
  const compact = width < 700;

  const items = [
    ...GAMES.map((g) => ({ key: g.id, title: g.title, desc: g.desc, icon: g.id, route: g.route, color: '#E7F4FF' })),
  ];

  return (
    <ScreenShell max={compact ? 460 : 820}>
      <ChildTopBar />

      <View style={styles.speechCard}>
        <Text style={[styles.speechText, compact && styles.speechTextCompact]}>Leo says: “Let&apos;s spell some words!”</Text>
        <Text style={[styles.speechSub, compact && styles.speechSubCompact]}>Pick a game below — every game ends with a sticker.</Text>
      </View>

      <View style={[styles.infoRow, compact && styles.infoRowCompact]}>
        <View style={[styles.wordCard, compact && styles.wordCardCompact]}>
          <View style={styles.wordHeader}>
            <View style={styles.wordIconWrap}><Pic emoji={wotd.emoji} size={compact ? 30 : 42} /></View>
            <Text style={[styles.wordBadge, compact && styles.wordBadgeCompact]}>WORD OF THE DAY</Text>
          </View>
          <Text style={[styles.wordTitle, compact && styles.wordTitleCompact]}>{wotd.word}</Text>
          <View style={[styles.wordActions, compact && styles.wordActionsCompact]}>
            <Pressable onPress={() => speak(wotd.word)} style={[styles.button, styles.buttonPurple, compact && styles.buttonCompact]}>
              <Text style={[styles.buttonText, compact && styles.buttonTextCompact]}>Hear it</Text>
            </Pressable>
            <Pressable onPress={() => router.push({ pathname: '/spell', params: { word: wotd.word } } as never)} style={[styles.button, styles.buttonGold, compact && styles.buttonCompact]}>
              <Text style={[styles.buttonText, compact && styles.buttonTextCompact]}>Spell it!</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={[styles.grid, compact && styles.gridCompact]}>
        {items.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => router.push(item.route as never)}
            accessibilityRole="button"
            style={[styles.gameCard, { backgroundColor: item.color }, compact && styles.gameCardCompact]}
          >
            <View style={[styles.gameIcon, compact && styles.gameIconCompact]}>
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
              } size={compact ? 26 : 34} />
            </View>
            <View style={styles.gameTextBox}>
              <Text style={[styles.gameTitle, compact && styles.gameTitleCompact]}>{item.title}</Text>
              <Text style={[styles.gameDesc, compact && styles.gameDescCompact]}>{item.desc}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <BloomFocusPromoCard onPress={() => router.push('/bloom-focus')} />

      <HopeBridgePublisherCard onPress={() => router.push('/about-hope-bridge')} />

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
  topRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
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
  profilePillCompact: {
    flex: 1,
    minHeight: 54,
    paddingVertical: 8,
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
  profileTextWrap: {
    flex: 1,
  },
  hello: {
    fontSize: 20,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '900',
    color: colors.ink,
    lineHeight: 24,
  },
  helloCompact: {
    fontSize: 18,
    lineHeight: 22,
  },
  stickerText: {
    fontSize: 14,
    color: colors.ink,
    fontWeight: '700',
  },
  stickerTextCompact: {
    fontSize: 12,
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
  grownPillCompact: {
    minWidth: 110,
    minHeight: 54,
    paddingVertical: 8,
  },
  grownIcon: { fontSize: 20, marginRight: 8 },
  grownText: {
    fontSize: 20,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '900',
    color: colors.ink,
  },
  grownTextCompact: {
    fontSize: 18,
  },
  hopeCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(43,42,82,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 12,
  },
  hopeCardCompact: { paddingVertical: 8 },
  hopeBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D7EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hopeInfo: { flex: 1 },
  hopeTitle: {
    fontSize: 18,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '900',
    color: colors.ink,
  },
  hopeTitleCompact: { fontSize: 16 },
  hopeTagline: { fontSize: 12, color: colors.muted, marginTop: 2 },
  hopeTaglineCompact: { fontSize: 11 },
  hopeApps: { fontSize: 11, color: colors.muted, marginTop: 2, fontWeight: '700' },
  hopeAppsCompact: { fontSize: 10 },
  hopeButton: {
    backgroundColor: '#F7C94C',
    borderRadius: 18,
    borderBottomWidth: 4,
    borderBottomColor: '#00000033',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hopeButtonCompact: { paddingVertical: 6, minHeight: 36 },
  hopeButtonText: { fontSize: 14, fontWeight: '800', color: '#2B2A52' },
  hopeButtonTextCompact: { fontSize: 13 },
  speechCard: {
    width: '100%',
    backgroundColor: '#F7F7F7',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(43,42,82,0.12)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  speechText: {
    fontSize: 28,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 34,
  },
  speechTextCompact: {
    fontSize: 20,
    lineHeight: 26,
  },
  speechSub: {
    marginTop: 8,
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
  },
  speechSubCompact: {
    fontSize: 13,
  },
  infoRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 22,
  },
  infoRowCompact: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 16,
  },
  wordCard: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(43,42,82,0.12)',
    padding: 16,
  },
  wordCardCompact: {
    padding: 10,
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
  wordBadgeCompact: {
    fontSize: 14,
  },
  wordTitle: {
    fontSize: 46,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 12,
  },
  wordTitleCompact: {
    fontSize: 32,
    marginBottom: 8,
  },
  wordActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  wordActionsCompact: {
    gap: 8,
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
  buttonCompact: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 8,
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
  buttonTextCompact: {
    fontSize: 17,
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridCompact: {
    gap: 10,
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
  gameCardCompact: {
    width: '100%',
    minHeight: 78,
    padding: 10,
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
  gameIconCompact: {
    width: 42,
    height: 42,
    borderRadius: 14,
    marginRight: 10,
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
  gameTitleCompact: {
    fontSize: 18,
    lineHeight: 22,
  },
  gameDesc: {
    fontSize: 14,
    color: colors.ink,
    lineHeight: 18,
    marginTop: 3,
  },
  gameDescCompact: {
    fontSize: 12,
    lineHeight: 16,
  },
});
