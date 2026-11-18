import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenShell from '../components/ScreenShell';

export default function BloomFocusShowcase() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) router.back();
  };

  const handleRequestAccess = () => {
    Linking.openURL('mailto:hello@bloomfocus.app?subject=Request Early Access for Bloom Focus');
  };

  const handleVisitWebsite = () => {
    Linking.openURL('https://bloomfocus.app');
  };

  return (
      <ScreenShell max={820} onBack={handleBack} backLabel="‹">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. HERO BANNER */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroAppIcon}>
              <Text style={{ fontSize: 26 }}>🌱</Text>
            </View>
            <View>
              <Text style={styles.heroOverline}>FROM THE MAKERS OF ANGEL TALK</Text>
              <Text style={styles.heroAppName}>Bloom Focus 🌱</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Where therapy meets play, every day.</Text>
          <Text style={styles.heroDescription}>
            Clinically grounded attention training that adapts to every child. Prescribed by therapists, loved by kids, and practised peacefully at home.
          </Text>

          <View style={styles.heroBadgesRow}>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>🎯 15 Clinical Games</Text>
            </View>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>📴 Works 100% offline</Text>
            </View>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>🚫 Strictly no ads</Text>
            </View>
          </View>

          <Pressable style={styles.heroButton} onPress={handleRequestAccess}>
            <Text style={styles.heroButtonText}>✉️ Request early access</Text>
          </Pressable>
        </View>

        {/* 2. HOW IT WORKS */}
        <Text style={styles.sectionHeading}>How it works</Text>

        <View style={styles.stepCard}>
          <View style={styles.stepCircle}><Text style={styles.stepNum}>1</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>🌈 Check in & pick a hero</Text>
            <Text style={styles.stepDesc}>Children share feelings and pick a 3D buddy. Dysregulated kids get guided breathing first.</Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepCircle}><Text style={styles.stepNum}>2</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>🎮 Play 4 adaptive games</Text>
            <Text style={styles.stepDesc}>6–8 minutes of daily clinical training that calibrates to the child's exact threshold in real time.</Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepCircle}><Text style={styles.stepNum}>3</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>📈 Grow, celebrate & shine</Text>
            <Text style={styles.stepDesc}>Unlock the Fun Zone reward, earn stars, and send objective data directly to the therapist.</Text>
          </View>
        </View>

        {/* 3. EVERYTHING A CHILD NEEDS */}
        <Text style={[styles.sectionHeading, { marginTop: 24 }]}>
          Everything a child needs to build focus
        </Text>

        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <Text style={styles.gridIcon}>🎯</Text>
            <Text style={styles.gridTitle}>Real-time adaptation</Text>
            <Text style={styles.gridDesc}>Algorithms step up when ready and step back when tired to keep kids in the optimal zone.</Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.gridIcon}>🦸</Text>
            <Text style={styles.gridTitle}>40+ Hero companions</Text>
            <Text style={styles.gridDesc}>Space, Dinos, Super City heroes, or upload a photo of your real-life pet or favorite toy.</Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.gridIcon}>🧩</Text>
            <Text style={styles.gridTitle}>15 Clinical paradigms</Text>
            <Text style={styles.gridDesc}>Targets sustained attention, visual search, working memory, speed, and impulse control.</Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.gridIcon}>🩺</Text>
            <Text style={styles.gridTitle}>Therapist Studio</Text>
            <Text style={styles.gridDesc}>Clinicians build custom picture puzzles, word searches, and individualized weekly plans.</Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.gridIcon}>🌿</Text>
            <Text style={styles.gridTitle}>Calm Corner</Text>
            <Text style={styles.gridDesc}>Hero box-breathing and customizable visual clutter modes (Off/Subtle/Bold) for sensory ease.</Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.gridIcon}>🔒</Text>
            <Text style={styles.gridTitle}>Private by design</Text>
            <Text style={styles.gridDesc}>No tracking, zero ads, kid-safe offline play, and encrypted private therapist-family chat.</Text>
          </View>
        </View>

        {/* 4. SPELL PALS + BLOOM FOCUS */}
        <Text style={[styles.sectionHeading, { marginTop: 24 }]}>Two apps. Different strengths.</Text>
        <View style={styles.ecosystemRow}>
          <View style={[styles.ecoCard, { backgroundColor: '#E2F4EE' }]}>
            <Text style={styles.ecoTag}>SPELL PALS</Text>
            <Text style={styles.ecoTitle}>Learning to read & spell</Text>
            <Text style={styles.ecoDesc}>Play short, fun activities to practise phonics, spelling and reading words. Choose it when the goal is literacy and language confidence.</Text>
          </View>

          <View style={[styles.ecoCard, { backgroundColor: '#FFEAE6' }]}>
            <Text style={styles.ecoTag}>BLOOM FOCUS</Text>
            <Text style={styles.ecoTitle}>Building attention & focus</Text>
            <Text style={styles.ecoDesc}>Use adaptive clinical games, calming check-ins and therapist-guided plans to practise concentration, impulse control and focus at home.</Text>
          </View>
        </View>
        <Text style={styles.togetherText}>Use Spell Pals for literacy practice and Bloom Focus for attention support—together they support learning from two different angles.</Text>

        {/* 5. MADE FOR */}
        <Text style={[styles.sectionHeading, { marginTop: 24 }]}>Made for</Text>
        <View style={styles.pillsWrap}>
          {[
            'ADHD & Inattention',
            'Autism Spectrum',
            'Speech & Language Delay',
            'Sensory Processing Needs',
            'Down Syndrome',
            'Executive Function Support',
            'Therapists & Parents',
          ].map((item) => (
            <View key={item} style={styles.audiencePill}>
              <Text style={styles.audienceText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* 6. BE AMONG THE FIRST TO TRY IT */}
        <View style={styles.earlyAccessCard}>
          <Text style={styles.earlyAccessTitle}>Bring therapy home with Bloom Focus</Text>
          <Text style={styles.earlyAccessDesc}>
            iOS, Android, and clinic portal versions are entering early access. Request your invitation today for your clinic or home.
          </Text>

          <Pressable style={styles.redButton} onPress={handleRequestAccess}>
            <Text style={styles.redButtonText}>✉️ Request early access</Text>
          </Pressable>

          <Pressable style={styles.outlineButton} onPress={handleVisitWebsite}>
            <Text style={styles.outlineButtonText}>🌐 See Bloom Focus online</Text>
          </Pressable>
        </View>

        {/* 7. PUBLISHER FOOTER */}
        <View style={styles.footerBox}>
          <Text style={styles.footerIcon}>🌟 From Hope Bridge Digital</Text>
          <Text style={styles.footerDesc}>
            Bloom Focus and Angel Talk are developed by Hope Bridge Digital, dedicated to creating world-class assistive technology for neurodivergent minds.
          </Text>
          <Pressable style={styles.footerLinkBtn} onPress={handleVisitWebsite}>
            <Text style={styles.footerLinkText}>About Hope Bridge Digital ›</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, alignItems: 'center', paddingBottom: 50 },

  heroCard: {
    backgroundColor: '#5A52E0',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  heroAppIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  heroOverline: { fontSize: 10, fontWeight: '800', color: '#D5D1FC', letterSpacing: 0.5 },
  heroAppName: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  heroDescription: { fontSize: 14, lineHeight: 20, color: '#E4E0FD', marginBottom: 16 },
  heroBadgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  badgePill: {
    backgroundColor: '#FFFFFF24',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  heroButton: {
    backgroundColor: '#FDCB36',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  heroButtonText: { fontSize: 15, fontWeight: '800', color: '#27254A' },

  sectionHeading: { fontSize: 18, fontWeight: '800', color: '#1E1C2A', marginBottom: 12 },

  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ECEAE4',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6459',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNum: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: '700', color: '#1E1C2A', marginBottom: 2 },
  stepDesc: { fontSize: 13, color: '#6A677B' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECEAE4',
  },
  gridIcon: { fontSize: 24, marginBottom: 8 },
  gridTitle: { fontSize: 14, fontWeight: '700', color: '#1E1C2A', marginBottom: 4 },
  gridDesc: { fontSize: 12, color: '#6A677B', lineHeight: 16 },

  ecosystemRow: { flexDirection: 'row', gap: 10 },
  ecoCard: { flex: 1, borderRadius: 18, padding: 14 },
  ecoTag: { fontSize: 11, fontWeight: '800', color: '#5A52E0', marginBottom: 4 },
  ecoTitle: { fontSize: 15, fontWeight: '800', color: '#1E1C2A', marginBottom: 4 },
  ecoDesc: { fontSize: 12, color: '#585568', lineHeight: 16 },
  togetherText: { fontSize: 12, color: '#686579', lineHeight: 17, textAlign: 'center', marginTop: 10, paddingHorizontal: 8 },

  pillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  audiencePill: {
    backgroundColor: '#E2F4EE',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  audienceText: { fontSize: 13, fontWeight: '700', color: '#1E5846' },

  earlyAccessCard: {
    backgroundColor: '#FFF2C6',
    borderRadius: 22,
    padding: 20,
    marginTop: 24,
    alignItems: 'center',
  },
  earlyAccessTitle: { fontSize: 18, fontWeight: '800', color: '#3A311A', marginBottom: 6 },
  earlyAccessDesc: { fontSize: 13, color: '#68593A', textAlign: 'center', marginBottom: 16, lineHeight: 18 },
  redButton: {
    backgroundColor: '#FF6459',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  redButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  outlineButton: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#5A52E0',
  },
  outlineButtonText: { color: '#5A52E0', fontSize: 15, fontWeight: '800' },

  footerBox: {
    backgroundColor: '#FFFCEB',
    borderRadius: 20,
    padding: 18,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3EAC2',
  },
  footerIcon: { fontSize: 15, fontWeight: '800', color: '#7E6800', marginBottom: 6 },
  footerDesc: { fontSize: 12, color: '#68593A', textAlign: 'center', lineHeight: 18, marginBottom: 12 },
  footerLinkBtn: { backgroundColor: '#FF6459', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 },
  footerLinkText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
});
