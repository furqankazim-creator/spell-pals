# Launch checklist — Spell Pals

Tick every box before you publish. Items 1 and 2 need real devices, so they have to be done by a person.

## 1. Test on a real phone (about 30 minutes)

Install the preview build (step 3) or open the app in Expo Go, then check:

**First run**
- [ ] The Welcome screen appears; name, age, buddy, goal and PIN can be set; "Let's play!" opens Home
- [ ] Home greets the child by name and shows the right level for the age

**Sound and voice** (turn the phone volume up, silent mode off)
- [ ] Sound effects play (chime, "uh-oh", tap, card flip, fanfare)
- [ ] The voice says right/wrong phrases and reads game instructions
- [ ] Settings → Sound off really silences everything

**Games** (play one round of each)
- [ ] Spell the Word, Pick the Letter, Sound Out, Match the Picture, Fill the Vowel, Rhyme Time, Memory Match
- [ ] A wrong answer says "try again" and does not lock the game; the hint appears
- [ ] Finishing a game shows the celebration and a sticker

**Stories**
- [ ] A Level 1 story and a Level 5 story open; pictures show on every page
- [ ] "Read to me" reads the page and highlights words (Android may drift slightly)
- [ ] Tapping a word says it; the questions appear after the last page; stars and the finish screen show
- [ ] A personal story ("My Pal") uses the child's name and buddy

**Map**
- [ ] Stage 1 opens a game; finishing it returns to the map and unlocks stage 2; locked stages say they are locked
- [ ] The three world cards switch worlds; the boss stage has 8 rounds

**Grown-ups**
- [ ] The PIN screen works; a wrong PIN is refused; the weekly summary, Star Words and settings open
- [ ] "Reset this child" asks for confirmation before deleting
- [ ] Rotate the phone and use a small and a large phone; nothing is cut off

**Stability**
- [ ] Close and reopen the app: name, stars and map progress are still there
- [ ] Play for 10 minutes without a crash or blank screen

## 2. Content review
- [ ] A teacher or parent has read all 30 stories and their questions (`src/data/stories.ts`) and the level 4 and 5 words (`content/words.json`)
- [ ] `npx tsx scripts/verify-content.ts` prints "All content checks passed."

## 3. Build the app (needs a free Expo account)
```bash
cd D:\Download\spell-pals-client-code
npx eas login
npx eas project init                                # replaces the placeholder projectId in app.json
npx eas build -p android --profile preview          # APK to install on phones and test
npx eas build -p android --profile production       # AAB for Google Play
npx eas build -p ios --profile production           # needs an Apple Developer account
```

## 4. Publish
**Google Play** (one-time $25 developer fee)
- [ ] Create the app in Play Console → fill the store listing from `release/STORE_LISTING.md`
- [ ] Host the privacy policy (`release/PRIVACY_POLICY.md`) on a web page and paste its URL
- [ ] Complete the content rating and the Data safety form ("no data collected"), join Designed for Families
- [ ] Upload the `.aab`, run an internal test, then production

**Apple App Store** ($99/year developer account)
- [ ] Create the app in App Store Connect, add the listing, privacy labels ("Data Not Collected") and screenshots
- [ ] `npx eas submit -p ios` after the iOS build, then submit for review

## 5. Before and after launch
- [ ] Replace the placeholders in the privacy policy: [DATE], [YOUR NAME OR COMPANY], [YOUR EMAIL ADDRESS]
- [ ] Change nothing about data collection without updating the privacy policy and store forms
- [ ] Keep a copy of the Android upload key (EAS stores it for you; run `npx eas credentials` to download a backup)
- [ ] Plan updates: each new store build needs a higher version (EAS `autoIncrement` does this for production builds)
