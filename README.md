# Spell Pals

A spelling and reading app for children aged **4 to 9** (Expo / React Native, runs on Android, iPhone and the web).

## Run it

```bash
npm install
npx expo start
```

- **Phone:** install **Expo Go** from the store (it must support Expo SDK 58), put the phone on the same Wi-Fi, scan the QR code.
  Choose *Proceed anonymously* if Expo asks you to log in. Do not use `--tunnel` (it needs a login).
- **Computer browser:** press `w` in the terminal. Wide screens get a desktop layout (top menu, multi-column cards).
- Check the code: `npx tsc --noEmit`, and the content: `npx tsx scripts/verify-content.ts`.

## How the app adapts to each child

First run opens a **set-up screen** (name, age 4–9, buddy, daily goal). The age sets the starting **level**:

| Level | Age | Words |
|---|---|---|
| 1 Seedling | 4 | 3-letter words |
| 2 Sprout | 5 | 4–5 letter words |
| 3 Star Speller | 6 | everyday words |
| 4 Word Wizard | 7 | 6–7 letter words |
| 5 Spelling Champion | 8–9 | long words |

The level moves up or down by itself (last 8 answers: 80% or better goes up, 40% or worse goes down, never more than
one level from the age's start). Words the child got wrong come back in later games. Grown-ups can switch auto-level off
and set the level by hand in **Grown-ups → Settings** (PIN 1234 by default).

Games (7): Spell the Word, Pick the Letter, Sound Out, Match the Picture, Fill the Vowel, Rhyme Time, Memory Match.
They get harder with level (more choices, more pairs, decoy letters, fewer hints). Every answer has a sound and a spoken
reaction ("Great job!", "Try again!").

## Stories

30 stories, 6 per level (5 written stories + 1 **personal story** that uses the child's name and buddy).
Each story has a picture on every page, **Read to me** with word highlighting, tap-a-word, 2–3 questions, and 1–3 stars.
Words the child taps or misses feed back into the spelling games. Story text lives in `src/data/stories.ts`.

Recorded narration is optional: see `assets/narration/README.md`.

## Project layout

- `app/` Expo Router routes · `src/screens`, `src/components` UI · `src/store/useStore.ts` progress (saved on the device)
- `src/data` words, stories, levels, rhymes · `content/words.json` the 332 words
- `src/lib/audio.ts` sound effects, text-to-speech, read-aloud · `assets/sounds` (made by `scripts/make-sounds.js`)
- `assets/emoji` the picture files (Noto Emoji, Apache-2.0; downloaded by `scripts/fetch-emoji.py`)
- `scripts/build-content.py` builds `content/words.json` (levels 4–5 added to the original 208 words)

## Build an installable Android app (APK)

```bash
npx eas login
npx eas project init            # replaces the placeholder projectId in app.json
npx eas build -p android --profile preview
```

## Release

See the `release/` folder: `LAUNCH_CHECKLIST.md` (device test script and publishing steps), `STORE_LISTING.md` (store text, ratings, screenshots) and `PRIVACY_POLICY.md`.

## Notes

- No server and no login: progress is stored on the device only.
- Voice is the phone's built-in text-to-speech unless you add recordings. Pictures are emoji-style images, not illustrations.
- The story questions and the 124 words added for levels 4–5 were written for this project; have a teacher read them through.
