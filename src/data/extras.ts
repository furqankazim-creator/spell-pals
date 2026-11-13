export const STICKERS = [
  {
    "id": "star",
    "emoji": "⭐",
    "label": "Super Star"
  },
  {
    "id": "rainbow",
    "emoji": "🌈",
    "label": "Rainbow Reader"
  },
  {
    "id": "rocket",
    "emoji": "🚀",
    "label": "Word Rocket"
  },
  {
    "id": "flower",
    "emoji": "🌸",
    "label": "Blooming Brain"
  },
  {
    "id": "sun",
    "emoji": "🌞",
    "label": "Sunny Speller"
  },
  {
    "id": "heart",
    "emoji": "💖",
    "label": "Kind Heart"
  },
  {
    "id": "butterfly",
    "emoji": "🦋",
    "label": "Butterfly Wings"
  },
  {
    "id": "apple",
    "emoji": "🍎",
    "label": "Smart Apple"
  },
  {
    "id": "crown",
    "emoji": "👑",
    "label": "Spelling Royal"
  },
  {
    "id": "balloon",
    "emoji": "🎈",
    "label": "Up, Up, Away!"
  },
  {
    "id": "gem",
    "emoji": "💎",
    "label": "Bright Gem"
  },
  {
    "id": "trophy",
    "emoji": "🏆",
    "label": "Champion Cup"
  },
  {
    "id": "music",
    "emoji": "🎵",
    "label": "Rhyme Star"
  },
  {
    "id": "puzzle",
    "emoji": "🧩",
    "label": "Memory Master"
  },
  {
    "id": "book",
    "emoji": "📚",
    "label": "Story Explorer"
  },
  {
    "id": "sun2",
    "emoji": "🌻",
    "label": "Word of the Day Star"
  },
  {
    "id": "reader",
    "emoji": "🏅",
    "label": "Reading Champion"
  }
];

export const RHYME_FAMILIES: string[][] = [
  [
    "cat",
    "hat",
    "bat",
    "rat",
    "mat"
  ],
  [
    "dog",
    "log",
    "frog"
  ],
  [
    "sun",
    "run",
    "bun"
  ],
  [
    "cap",
    "map",
    "nap",
    "tap"
  ],
  [
    "van",
    "fan",
    "man",
    "pan",
    "tan"
  ],
  [
    "hen",
    "pen",
    "ten"
  ],
  [
    "net",
    "jet",
    "pet"
  ],
  [
    "bug",
    "hug",
    "rug",
    "jug"
  ],
  [
    "lip",
    "sip",
    "rip"
  ],
  [
    "top",
    "pop"
  ],
  [
    "bed",
    "red"
  ],
  [
    "fox",
    "box"
  ],
  [
    "car",
    "star"
  ],
  [
    "hand",
    "sand"
  ],
  [
    "king",
    "ring",
    "sing"
  ],
  [
    "sock",
    "rock",
    "clock"
  ],
  [
    "moon",
    "spoon"
  ],
  [
    "ice",
    "rice"
  ]
];

export const PRAISE = [
  "Well done!",
  "Great job!",
  "You are a star!",
  "Wonderful!",
  "Hooray!",
  "Super spelling!"
];

export const AVATARS = [
  "🦁",
  "🐰",
  "🦊",
  "🐼",
  "🦉",
  "🐨",
  "🦄",
  "🐙"
];

export const GAME_ORDER = [
  "spell",
  "pick",
  "sound",
  "match",
  "vowel",
  "rhyme",
  "memory"
] as const;

export type GameId = 'spell' | 'pick' | 'sound' | 'match' | 'vowel' | 'rhyme' | 'memory';

export const GAMES: { id: GameId; title: string; desc: string; icon: string; color: string; route: string }[] = [
  { id: 'spell', title: 'Spell the Word', desc: 'Build the whole word, letter by letter', icon: 'abc', color: '#BAE6FD', route: '/spell' },
  { id: 'pick', title: 'Pick the Letter', desc: 'Hear the first sound of the word', icon: '👉', color: '#CCFBF1', route: '/pick' },
  { id: 'sound', title: 'Sound Out', desc: 'Put the letter sounds together', icon: '🧩', color: '#EDE9FE', route: '/sound' },
  { id: 'match', title: 'Match the Picture', desc: 'Read the word, find its picture', icon: '🖼️', color: '#FEF3C7', route: '/match' },
  { id: 'vowel', title: 'Fill the Vowel', desc: 'Find the missing middle sound', icon: 'A', color: '#DBEAFE', route: '/vowel' },
  { id: 'rhyme', title: 'Rhyme Time', desc: 'Find the word that sounds the same at the end', icon: '🎵', color: '#FCE7F3', route: '/rhyme' },
  { id: 'memory', title: 'Memory Match', desc: 'Flip the cards and find the pairs', icon: '🧠', color: '#CCFBF1', route: '/memory' },
];

export const ISLANDS = [
  { name: 'Letter Land', emoji: '🔤', desc: 'First sounds, letter pieces & rhymes', color: '#99F0E3', games: ['pick', 'sound', 'rhyme'] as GameId[] },
  { name: 'Vowel Valley', emoji: '🅰️', desc: 'Short vowel sounds a · e · i · o · u', color: '#BAE6FD', games: ['vowel'] as GameId[] },
  { name: 'Word World', emoji: '🏰', desc: 'Spelling, reading & remembering whole words', color: '#FFB4BA', games: ['spell', 'match', 'memory'] as GameId[] },
];
