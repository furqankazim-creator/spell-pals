#!/usr/bin/env python3
"""Verify content/words.json: unique lowercase words, levels 1-5, emoji + sounds present."""
import io, json
from collections import Counter

words = json.load(io.open('content/words.json', encoding='utf-8'))
names = [w['word'] for w in words]
assert len(set(names)) == len(names), 'duplicate words found'
assert all(w.get('emoji') and w.get('sounds') for w in words), 'missing emoji/sounds'
assert all(w['level'] in (1, 2, 3, 4, 5) for w in words), 'bad level'
assert all(w['word'].islower() and w['word'].isalpha() for w in words), 'bad word format'
print('OK:', len(words), 'words', dict(sorted(Counter(w['level'] for w in words).items())))
print('For the full content check (words + stories + pictures) run: npx tsx scripts/verify-content.ts')
