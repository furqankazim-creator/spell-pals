# Recorded story narration (optional)

The app reads stories with the phone's built-in voice. To use a real recording instead:

1. Record each story page as a short audio file (`.m4a` or `.mp3`), one file per page.
2. Name it `<story-id>-<page number>.m4a`, for example `picnic-1.m4a`, `picnic-2.m4a`, ...
   (story ids are in `src/data/stories.ts`, e.g. `cat-hat`, `picnic`, `rocket-planet`).
3. Put the files in this folder and add one line per file to `src/data/narration.ts`:
   `'picnic-1': require('../../assets/narration/picnic-1.m4a'),`
4. Reload the app. "Read to me" now plays your recording for that page; pages without a recording
   still use the phone's voice.

Personal stories (ids starting with `me-`) always use the phone's voice, because they contain the child's name.
