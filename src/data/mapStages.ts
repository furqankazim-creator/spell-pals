export interface QuestQuestion {
  storyPrompt: string;
  word: string;
  emoji: string;
  hint: string;
  clue: string;
  choices: string[];
}

export interface MapStage {
  id: string;
  level: number;
  lockNumber: number; // 1 to 10
  title: string;
  story: string;
  character: string;
  characterName: string;
  boss: boolean;
  accent: string;
  questions: QuestQuestion[];
  rewardBadge: string;
}

export interface MapWorld {
  id: string;
  level: number;
  name: string;
  subtitle: string;
  emoji: string;
  desc: string;
  bg: string;
  grad: [string, string];
  accent: string;
  dark: string;
  art: 'hills' | 'mountains' | 'beach';
  pic: string;
  cardGrad: [string, string];
  deco: string[];
}

export const MAP_WORLDS: MapWorld[] = [
  {
    id: 'w1',
    level: 1,
    name: 'Seedling Valley',
    subtitle: 'Ages 3–4 · Level 1',
    emoji: '🌱',
    desc: 'Gentle meadow quests, friendly baby animals & first sounds',
    bg: '#DDF6D2',
    grad: ['#F0FCE8', '#CDEFBE'],
    accent: '#7CCB6B',
    dark: '#2E7D23',
    art: 'hills',
    pic: '🐰',
    cardGrad: ['#D9F5C9', '#86D46F'],
    deco: ['🌸', '🍄', '🦋', '🌷', '🌿', '🍎', '🐝', '🌻', '🪵', '👑'],
  },
  {
    id: 'w2',
    level: 2,
    name: 'Sprout Jungle',
    subtitle: 'Age 5 · Level 2',
    emoji: '🌿',
    desc: 'Dense rainforest trail, 4–5 letter blends & hidden waterfalls',
    bg: '#D2F5F0',
    grad: ['#E6FFFA', '#B2F5EA'],
    accent: '#38B2AC',
    dark: '#234E52',
    art: 'hills',
    pic: '🦜',
    cardGrad: ['#B2F5EA', '#38B2AC'],
    deco: ['🌴', '🐒', '🌺', '🐸', '🥥', '🦜', '🐅', '💧', '💎', '👑'],
  },
  {
    id: 'w3',
    level: 3,
    name: 'Explorer Archipelago',
    subtitle: 'Age 6 · Level 3',
    emoji: '🗺️',
    desc: 'Sunken coral reefs, pirate grottos & knight island keeps',
    bg: '#FFF0C9',
    grad: ['#FFF8E1', '#FFE2A0'],
    accent: '#F5B73A',
    dark: '#975A16',
    art: 'beach',
    pic: '⛵',
    cardGrad: ['#FFE9B0', '#F7B53C'],
    deco: ['🐚', '🐬', '🦀', '🏝️', '⚓', '🧭', '🏴‍☠️', '🏖️', '💎', '👑'],
  },
  {
    id: 'w4',
    level: 4,
    name: 'Pathfinder Skies',
    subtitle: 'Age 7 · Level 4',
    emoji: '🚀',
    desc: 'Floating cloud sanctuaries, prism towers & celestial winds',
    bg: '#E8E1FF',
    grad: ['#F5F1FF', '#D8CCFF'],
    accent: '#9F7AEA',
    dark: '#44337A',
    art: 'mountains',
    pic: '🦅',
    cardGrad: ['#E3DAFF', '#9F7AEA'],
    deco: ['☁️', '⚡', '🪁', '🏰', '🌈', '🦉', '🛡️', '🔮', '✨', '👑'],
  },
  {
    id: 'w5',
    level: 5,
    name: 'Master Odyssey',
    subtitle: 'Age 8+ · Level 5',
    emoji: '👑',
    desc: 'Ancient cosmic nexus, starlight gates & mythical enigmas',
    bg: '#CDE5FF',
    grad: ['#E8F2FF', '#B8DCFF'],
    accent: '#3182CE',
    dark: '#1A365D',
    art: 'mountains',
    pic: '🐉',
    cardGrad: ['#BEE3F8', '#3182CE'],
    deco: ['🪐', '🚀', '🛰️', '☄️', '🛸', '🌌', '🌟', '🌀', '💎', '👑'],
  },
];

/** 10 Tailored Quest Locks for Level 1 (Seedling) */
const LEVEL_1_STAGES: MapStage[] = [
  {
    id: 'l1s1',
    level: 1,
    lockNumber: 1,
    title: 'Bunny’s Clover Trail',
    story: 'Benny the Bunny needs to cross the stream. Spell the secret clover words to build stepping stones!',
    character: '🐰',
    characterName: 'Benny Bunny',
    boss: false,
    accent: '#10B981',
    rewardBadge: '🌱 First Stepping Stone',
    questions: [
      { storyPrompt: 'What fluffy friend is waiting at the stream?', word: 'cat', emoji: '🐱', hint: 'Starts with C', clue: 'Purrs and loves milk', choices: ['cat', 'dog', 'pig'] },
      { storyPrompt: 'Look up in the blue sky! What is shining brightly?', word: 'sun', emoji: '☀️', hint: 'Warm middle U sound', clue: 'Gives warm golden light', choices: ['sun', 'hat', 'bus'] },
      { storyPrompt: 'Lock-Breaker Challenge: Spell the loyal pal who wags its tail!', word: 'dog', emoji: '🐶', hint: 'D - O - G', clue: 'Barks and loves to play fetch', choices: ['dog', 'cup', 'bed'] },
    ],
  },
  {
    id: 'l1s2',
    level: 1,
    lockNumber: 2,
    title: 'Duckling Splash Pond',
    story: 'Pippin Duckling lost his feather in the pond. Help him crack the water riddles to open Lock 2!',
    character: '🦆',
    characterName: 'Pippin Duckling',
    boss: false,
    accent: '#06B6D4',
    rewardBadge: '💧 Water Sprite',
    questions: [
      { storyPrompt: 'What does Pippin drink fresh water from?', word: 'cup', emoji: '🥛', hint: 'C - U - P', clue: 'You drink milk or water from this', choices: ['cup', 'cap', 'can'] },
      { storyPrompt: 'What keeps the little duck warm when resting?', word: 'bed', emoji: '🛏️', hint: 'B - E - D', clue: 'Soft and cozy for sleeping at night', choices: ['bed', 'bat', 'box'] },
      { storyPrompt: 'Lock-Breaker Challenge: What hops into the cool pond water?', word: 'frog', emoji: '🐸', hint: 'F - R - O - G', clue: 'Green and leaps across water lilies', choices: ['frog', 'fox', 'fish'] },
    ],
  },
  {
    id: 'l1s3',
    level: 1,
    lockNumber: 3,
    title: 'Sunny Apple Orchard',
    story: 'Rosie Fox is gathering sweet red apples. Solve the orchard runes to unlock Lock 3!',
    character: '🦊',
    characterName: 'Rosie Fox',
    boss: false,
    accent: '#F97316',
    rewardBadge: '🍎 Orchard Harvester',
    questions: [
      { storyPrompt: 'What covers Rosie’s head from the hot sun?', word: 'hat', emoji: '👒', hint: 'H - A - T', clue: 'Worn on your head', choices: ['hat', 'hot', 'hut'] },
      { storyPrompt: 'What crunchy fruit hangs from the low branch?', word: 'fig', emoji: '🫐', hint: 'F - I - G', clue: 'A sweet small fruit from a tree', choices: ['fig', 'fox', 'fan'] },
      { storyPrompt: 'Lock-Breaker Challenge: What small creature buzzes by the flowers?', word: 'bug', emoji: '🐛', hint: 'B - U - G', clue: 'Tiny critter with legs that crawls', choices: ['bug', 'bag', 'bun'] },
    ],
  },
  {
    id: 'l1s4',
    level: 1,
    lockNumber: 4,
    title: 'The Yellow Bus Stop',
    story: 'The school forest bus is arriving. Find the travel words to unlock Lock 4!',
    character: '🚌',
    characterName: 'Captain Bear',
    boss: false,
    accent: '#EAB308',
    rewardBadge: '🚌 Forest Navigator',
    questions: [
      { storyPrompt: 'What big vehicle brings the animal friends to school?', word: 'bus', emoji: '🚌', hint: 'B - U - S', clue: 'Big wheels roll through town', choices: ['bus', 'bag', 'box'] },
      { storyPrompt: 'What holds all the pencils and lunch inside?', word: 'bag', emoji: '🎒', hint: 'B - A - G', clue: 'Carried on shoulders with straps', choices: ['bag', 'bug', 'bat'] },
      { storyPrompt: 'Lock-Breaker Challenge: What writes all the magical stories?', word: 'pen', emoji: '🖊️', hint: 'P - E - N', clue: 'Draws and writes with colored ink', choices: ['pen', 'pan', 'pin'] },
    ],
  },
  {
    id: 'l1s5',
    level: 1,
    lockNumber: 5,
    title: 'Midway Meadow Gate',
    story: 'You’ve reached the halfway gate! Break the enchanted mid-valley lock with your phonics power!',
    character: '🦔',
    characterName: 'Hedgie',
    boss: false,
    accent: '#8B5CF6',
    rewardBadge: '🗝️ Midway Keymaster',
    questions: [
      { storyPrompt: 'What friendly animal rolls into a cute ball?', word: 'pig', emoji: '🐷', hint: 'P - I - G', clue: 'Curly tail and loves puddles', choices: ['pig', 'pan', 'peg'] },
      { storyPrompt: 'What shiny metal tool turns in the keyhole?', word: 'key', emoji: '🔑', hint: 'K - E - Y', clue: 'Unlocks doors and secret chests', choices: ['key', 'kite', 'kit'] },
      { storyPrompt: 'Lock-Breaker Challenge: What bright star gives us the daytime light?', word: 'sun', emoji: '☀️', hint: 'S - U - N', clue: 'Bright golden ball in the morning sky', choices: ['sun', 'star', 'sky'] },
    ],
  },
  {
    id: 'l1s6',
    level: 1,
    lockNumber: 6,
    title: 'Teddy’s Honey Hollow',
    story: 'Barnaby Bear is looking for sweet honeycomb. Guide him through the trees to open Lock 6!',
    character: '🐻',
    characterName: 'Barnaby Bear',
    boss: false,
    accent: '#D97706',
    rewardBadge: '🍯 Honey Explorer',
    questions: [
      { storyPrompt: 'What big tree part has leaves on top?', word: 'log', emoji: '🪵', hint: 'L - O - G', clue: 'Fallen wooden trunk resting in grass', choices: ['log', 'leg', 'lid'] },
      { storyPrompt: 'What tiny insect makes sweet golden honey?', word: 'bee', emoji: '🐝', hint: 'B - E - E', clue: 'Black and yellow with fluttering wings', choices: ['bee', 'bug', 'bat'] },
      { storyPrompt: 'Lock-Breaker Challenge: What red juicy berry grows on tiny bushes?', word: 'jam', emoji: '🍓', hint: 'J - A - M', clue: 'Sweet spread made from boiled fruit', choices: ['jam', 'jug', 'jar'] },
    ],
  },
  {
    id: 'l1s7',
    level: 1,
    lockNumber: 7,
    title: 'Rainbow Butterfly Bower',
    story: 'A flurry of rainbow butterflies is dancing. Read their flutter code to unlock Lock 7!',
    character: '🦋',
    characterName: 'Flutter',
    boss: false,
    accent: '#EC4899',
    rewardBadge: '🌈 Rainbow Wing',
    questions: [
      { storyPrompt: 'What beautiful petal does the butterfly land on?', word: 'bud', emoji: '🌸', hint: 'B - U - D', clue: 'A baby flower before it opens', choices: ['bud', 'bed', 'bad'] },
      { storyPrompt: 'What red fruit is round and sweet in the garden?', word: 'fig', emoji: '🫐', hint: 'F - I - G', clue: 'A small sweet soft garden fruit', choices: ['fig', 'fan', 'fog'] },
      { storyPrompt: 'Lock-Breaker Challenge: What bright colors arch across the rainy sky?', word: 'bow', emoji: '🌈', hint: 'B - O - W', clue: 'Rainbow curve shining after the storm', choices: ['bow', 'box', 'boy'] },
    ],
  },
  {
    id: 'l1s8',
    level: 1,
    lockNumber: 8,
    title: 'Puppy’s Hidden Bone Cave',
    story: 'Scout Puppy found an ancient cave hidden behind the daisies. Crack Lock 8 to enter!',
    character: '🐶',
    characterName: 'Scout Puppy',
    boss: false,
    accent: '#0284C7',
    rewardBadge: '🦴 Cave Scout',
    questions: [
      { storyPrompt: 'What square cardboard container holds the treasure?', word: 'box', emoji: '📦', hint: 'B - O - X', clue: 'Has four corners and a lid to open', choices: ['box', 'fox', 'bus'] },
      { storyPrompt: 'What warm wool piece keeps Scout’s paws warm?', word: 'rug', emoji: '🧶', hint: 'R - U - G', clue: 'Cozy mat resting on the floor', choices: ['rug', 'run', 'red'] },
      { storyPrompt: 'Lock-Breaker Challenge: What quick animal runs fast like Scout?', word: 'fox', emoji: '🦊', hint: 'F - O - X', clue: 'Orange bushy tail and clever ears', choices: ['fox', 'box', 'fix'] },
    ],
  },
  {
    id: 'l1s9',
    level: 1,
    lockNumber: 9,
    title: 'The Whispering Willows',
    story: 'The old willow trees guard the gate to the Golden Treehouse. Decipher Lock 9!',
    character: '🦉',
    characterName: 'Professor Hoot',
    boss: false,
    accent: '#6366F1',
    rewardBadge: '🦉 Willow Scholar',
    questions: [
      { storyPrompt: 'What clever bird sits in the tree and hoots?', word: 'owl', emoji: '🦉', hint: 'O - W - L', clue: 'Big round eyes that see in the dark', choices: ['owl', 'cow', 'bow'] },
      { storyPrompt: 'What bright lamp glows at the top of the branch?', word: 'sun', emoji: '☀️', hint: 'S - U - N', clue: 'Shines warmth across the valley', choices: ['sun', 'star', 'sea'] },
      { storyPrompt: 'Lock-Breaker Challenge: What magical creature flies on feathered wings?', word: 'bat', emoji: '🦇', hint: 'B - A - T', clue: 'Flits under the stars at twilight', choices: ['bat', 'cat', 'hat'] },
    ],
  },
  {
    id: 'l1s10',
    level: 1,
    lockNumber: 10,
    title: 'King Koala’s Golden Treehouse',
    story: 'Grand Star Boss! King Koala invites you to the Royal Canopy. Crack all 3 Boss Runes to win the Valley Crown!',
    character: '🐨',
    characterName: 'King Koala',
    boss: true,
    accent: '#F59E0B',
    rewardBadge: '👑 Grand Seedling Crown',
    questions: [
      { storyPrompt: 'Boss Challenge 1: What glowing star lights the royal hall?', word: 'star', emoji: '⭐', hint: 'S - T - A - R', clue: 'Twinkles in the nighttime sky', choices: ['star', 'sun', 'sky'] },
      { storyPrompt: 'Boss Challenge 2: What green friend jumps onto the royal lily pad?', word: 'frog', emoji: '🐸', hint: 'F - R - O - G', clue: 'Ribbit! Jumps high from the pond', choices: ['frog', 'fox', 'fish'] },
      { storyPrompt: 'FINAL BOSS LOCK: What golden treasure sits on King Koala’s head?', word: 'crown', emoji: '👑', hint: 'C - R - O - W - N', clue: 'Golden headpiece worn by a king', choices: ['crown', 'clover', 'clock'] },
    ],
  },
];

/** 10 Tailored Quest Locks for Level 2 (Sprout) */
const LEVEL_2_STAGES: MapStage[] = [
  {
    id: 'l2s1',
    level: 2,
    lockNumber: 1,
    title: 'Parrot Lookout Ridge',
    story: 'Penny Parrot spotted secret runes high on the jungle canopy. Break Lock 1 to start the expedition!',
    character: '🦜',
    characterName: 'Penny Parrot',
    boss: false,
    accent: '#10B981',
    rewardBadge: '🦜 Jungle Lookout',
    questions: [
      { storyPrompt: 'What green amphibian leaps across the giant jungle leaves?', word: 'frog', emoji: '🐸', hint: 'FR- blend', clue: 'Green hopper with long legs', choices: ['frog', 'fish', 'flag'] },
      { storyPrompt: 'What ticks high on the camp tower wall?', word: 'clock', emoji: '⏰', hint: 'CL- blend', clue: 'Tells the exact hour and minute', choices: ['clock', 'cloud', 'clown'] },
      { storyPrompt: 'Lock-Breaker Challenge: What rolls on rails through the jungle pass?', word: 'train', emoji: '🚂', hint: 'TR- blend', clue: 'Choo-choo on metal tracks', choices: ['train', 'truck', 'tree'] },
    ],
  },
  {
    id: 'l2s2',
    level: 2,
    lockNumber: 2,
    title: 'Monkey Vine Suspension Bridge',
    story: 'Kiki the Spider Monkey swings through the vines. Solve the bridge puzzles to cross Lock 2!',
    character: '🐒',
    characterName: 'Kiki Monkey',
    boss: false,
    accent: '#059669',
    rewardBadge: '🐒 Vine Swinger',
    questions: [
      { storyPrompt: 'What musical instrument does Kiki play with wooden sticks?', word: 'drum', emoji: '🥁', hint: 'DR- blend', clue: 'You tap it with sticks to make beats', choices: ['drum', 'drop', 'dress'] },
      { storyPrompt: 'What shines brightly in the clear night jungle sky?', word: 'star', emoji: '⭐', hint: 'ST- blend', clue: 'Twinkling diamond in the heavens', choices: ['star', 'sun', 'sky'] },
      { storyPrompt: 'Lock-Breaker Challenge: Where do parent birds keep their fragile eggs?', word: 'nest', emoji: '🪺', hint: '-ST ending blend', clue: 'Made of twigs and soft moss in trees', choices: ['nest', 'neck', 'next'] },
    ],
  },
  {
    id: 'l2s3',
    level: 2,
    lockNumber: 3,
    title: 'Emerald Lily Marsh',
    story: 'The water is glowing with emerald light. Decode the swamp runes to unlock Lock 3!',
    character: '🐸',
    characterName: 'Barnaby Bullfrog',
    boss: false,
    accent: '#0D9488',
    rewardBadge: '🌿 Emerald Navigator',
    questions: [
      { storyPrompt: 'What walks sideways with hard pinching claws?', word: 'crab', emoji: '🦀', hint: 'CR- blend', clue: 'Shell critter with two big claws', choices: ['crab', 'crow', 'crib'] },
      { storyPrompt: 'What green shoot grows toward the sunlight?', word: 'plant', emoji: '🌱', hint: 'PL- blend', clue: 'Has green leaves, stems and roots', choices: ['plant', 'play', 'plate'] },
      { storyPrompt: 'Lock-Breaker Challenge: What swimming hunter has a sharp gray fin?', word: 'shark', emoji: '🦈', hint: 'SH- sound', clue: 'Fast ocean swimmer with keen teeth', choices: ['shark', 'sheep', 'ship'] },
    ],
  },
  {
    id: 'l2s4',
    level: 2,
    lockNumber: 4,
    title: 'Tiger Waterfall Grotto',
    story: 'Leo Tiger guards the roaring waterfall. Find the water words to unlock Lock 4!',
    character: '🐅',
    characterName: 'Leo Tiger',
    boss: false,
    accent: '#EA580C',
    rewardBadge: '🐅 Waterfall Brave',
    questions: [
      { storyPrompt: 'What falls gently from the storm clouds above?', word: 'rain', emoji: '🌧️', hint: 'R-AI-N vowel pair', clue: 'Water droplets falling from sky', choices: ['rain', 'river', 'rope'] },
      { storyPrompt: 'What big water vessel sails across the river rapids?', word: 'boat', emoji: '⛵', hint: 'B-OA-T', clue: 'Floats on water with sails or oars', choices: ['boat', 'boot', 'bark'] },
      { storyPrompt: 'Lock-Breaker Challenge: What small water creature swims with silver scales?', word: 'fish', emoji: '🐟', hint: '-SH ending', clue: 'Breaths underwater with gills', choices: ['fish', 'frog', 'flag'] },
    ],
  },
  {
    id: 'l2s5',
    level: 2,
    lockNumber: 5,
    title: 'Midway Canopy Outpost',
    story: 'The halfway jungle treehouse towers high! Break Lock 5 to enter the upper canopy!',
    character: '🦜',
    characterName: 'Captain Macaw',
    boss: false,
    accent: '#6366F1',
    rewardBadge: '🗝️ Canopy Keymaster',
    questions: [
      { storyPrompt: 'What white puffy shape drifts across the blue heavens?', word: 'cloud', emoji: '☁️', hint: 'CL- blend', clue: 'Fluffy floating water vapor', choices: ['cloud', 'clock', 'clown'] },
      { storyPrompt: 'What colorful piece of cloth flaps on the flagpole?', word: 'flag', emoji: '🚩', hint: 'FL- blend', clue: 'Waves in the breeze on a tall pole', choices: ['flag', 'frog', 'flat'] },
      { storyPrompt: 'Lock-Breaker Challenge: What bright silver circle glows in the night?', word: 'moon', emoji: '🌙', hint: 'Double O sound', clue: 'Orbits the earth and shines at night', choices: ['moon', 'marsh', 'moss'] },
    ],
  },
  {
    id: 'l2s6',
    level: 2,
    lockNumber: 6,
    title: 'Ancient Python Stele',
    story: 'Ancient stone snakes are carved on the ruined temple. Decipher Lock 6 to enter the ruins!',
    character: '🐍',
    characterName: 'Zara Serpent',
    boss: false,
    accent: '#059669',
    rewardBadge: '🗿 Ruins Decoder',
    questions: [
      { storyPrompt: 'What long scaly friend slithers through jungle leaves?', word: 'snake', emoji: '🐍', hint: 'SN- blend', clue: 'Hisses and glides without legs', choices: ['snake', 'snail', 'snap'] },
      { storyPrompt: 'What hard gray mineral builds the temple steps?', word: 'stone', emoji: '🪨', hint: 'ST- blend', clue: 'Solid natural rock from the earth', choices: ['stone', 'star', 'stick'] },
      { storyPrompt: 'Lock-Breaker Challenge: What shiny treasure glows inside the dark ruin?', word: 'gold', emoji: '🪙', hint: '-LD blend', clue: 'Precious yellow glittering metal', choices: ['gold', 'glad', 'gate'] },
    ],
  },
  {
    id: 'l2s7',
    level: 2,
    lockNumber: 7,
    title: 'Whispering Shell Cavern',
    story: 'The cavern walls whisper ancient rhymes. Solve the shell puzzle to crack Lock 7!',
    character: '🐢',
    characterName: 'Toby Turtle',
    boss: false,
    accent: '#0284C7',
    rewardBadge: '🐚 Shell Keeper',
    questions: [
      { storyPrompt: 'What spiral home does a hermit crab carry on its back?', word: 'shell', emoji: '🐚', hint: 'SH- blend', clue: 'Hard protective sea cover', choices: ['shell', 'shark', 'ship'] },
      { storyPrompt: 'What gentle ocean wave rolls onto the sandy shore?', word: 'wave', emoji: '🌊', hint: 'W-A-V-E', clue: 'Moving crest of sea water', choices: ['wave', 'whale', 'wind'] },
      { storyPrompt: 'Lock-Breaker Challenge: What giant friendly sea mammal spouts water?', word: 'whale', emoji: '🐳', hint: 'WH- sound', clue: 'Biggest magnificent creature in the deep', choices: ['whale', 'wave', 'wheel'] },
    ],
  },
  {
    id: 'l2s8',
    level: 2,
    lockNumber: 8,
    title: 'Toucan Echo Gorge',
    story: 'Your voice echoes off the canyon cliffs! Shout the correct words to unlock Lock 8!',
    character: '🦜',
    characterName: 'Tico Toucan',
    boss: false,
    accent: '#D97706',
    rewardBadge: '📢 Echo Whisperer',
    questions: [
      { storyPrompt: 'What strong wooden limb supports the leaves of an oak?', word: 'branch', emoji: '🌿', hint: 'BR- and -CH', clue: 'Woody arm growing out of a tree', choices: ['branch', 'beach', 'bench'] },
      { storyPrompt: 'What green leaf cluster blankets the damp jungle rocks?', word: 'moss', emoji: '🌱', hint: 'M-O-S-S', clue: 'Soft green carpet growing on wet stones', choices: ['moss', 'moon', 'mist'] },
      { storyPrompt: 'Lock-Breaker Challenge: What loud rumbling sound echoes in the canyon?', word: 'roar', emoji: '🦁', hint: 'R-O-A-R', clue: 'Fierce voice of a lion or tiger', choices: ['roar', 'rain', 'road'] },
    ],
  },
  {
    id: 'l2s9',
    level: 2,
    lockNumber: 9,
    title: 'Crystal Cavern Gateway',
    story: 'You’re at the entrance to the Guardian’s Sanctum. Clear Lock 9 to reach the Boss!',
    character: '🦎',
    characterName: 'Chameleon Rex',
    boss: false,
    accent: '#7C3AED',
    rewardBadge: '💎 Crystal Seeker',
    questions: [
      { storyPrompt: 'What glittering jewel sparkles in the cave wall?', word: 'gem', emoji: '💎', hint: 'Soft G sound', clue: 'Precious sparkling gemstone', choices: ['gem', 'gum', 'gap'] },
      { storyPrompt: 'What flickering golden light guides our path through darkness?', word: 'torch', emoji: '🔦', hint: 'T-OR-CH', clue: 'Burning flame on a wooden stick', choices: ['torch', 'touch', 'track'] },
      { storyPrompt: 'Lock-Breaker Challenge: What ancient stone barrier blocks the inner sanctum?', word: 'door', emoji: '🚪', hint: 'D-O-O-R', clue: 'Swings open on hinges to let you in', choices: ['door', 'deer', 'drop'] },
    ],
  },
  {
    id: 'l2s10',
    level: 2,
    lockNumber: 10,
    title: 'Guardian Sphinx of the Jungle',
    story: 'Grand Star Boss! The Great Sphinx tests your blend power. Crack all 3 Boss Trials to claim the Jungle Crown!',
    character: '🦁',
    characterName: 'Great Sphinx',
    boss: true,
    accent: '#F59E0B',
    rewardBadge: '👑 Grand Sprout Crown',
    questions: [
      { storyPrompt: 'Boss Trial 1: What mighty metal shield defends the temple?', word: 'shield', emoji: '🛡️', hint: 'SH- blend', clue: 'Armor piece held to block arrows', choices: ['shield', 'sword', 'spear'] },
      { storyPrompt: 'Boss Trial 2: What brilliant yellow metal is the Sphinx carved from?', word: 'gold', emoji: '🪙', hint: 'G-O-L-D', clue: 'Shining royal treasure metal', choices: ['gold', 'glass', 'grass'] },
      { storyPrompt: 'FINAL BOSS LOCK: What golden treasure rests upon the Sphinx’s throne?', word: 'crown', emoji: '👑', hint: 'CR- blend', clue: 'Royal jewel worn by kings and queens', choices: ['crown', 'cross', 'crane'] },
    ],
  },
];

/** Stages for Level 3, 4, 5 dynamically generated with tailored difficulty */
function makeLevelStages(level: number): MapStage[] {
  const titles = [
    { name: 'Shipwreck Bay', char: '⚓', charName: 'First Mate Finn', w1: 'ship', w2: 'sand', w3: 'sail' },
    { name: 'Coral Lagoon', char: '🐬', charName: 'Marina Dolphin', w1: 'water', w2: 'coral', w3: 'ocean' },
    { name: 'Knight’s Watchtower', char: '🛡️', charName: 'Sir Cedric', w1: 'sword', w2: 'tower', w3: 'armor' },
    { name: 'Enchanted Forest Gate', char: '🦌', charName: 'Silver Stag', w1: 'forest', w2: 'magic', w3: 'bridge' },
    { name: 'Midway Compass Shrine', char: '🧭', charName: 'Navigator Nova', w1: 'north', w2: 'guide', w3: 'beacon' },
    { name: 'Crystal Dragon Lair', char: '🐉', charName: 'Ember Drake', w1: 'dragon', w2: 'flame', w3: 'crystal' },
    { name: 'Floating Sky Haven', char: '🦅', charName: 'Sky Falcon', w1: 'feather', w2: 'flight', w3: 'clouds' },
    { name: 'Ancient Library of Runes', char: '📜', charName: 'Grand Sage', w1: 'scroll', w2: 'cipher', w3: 'wisdom' },
    { name: 'Starlight Observatory', char: '🔭', charName: 'Stargazer Lyra', w1: 'planet', w2: 'comet', w3: 'galaxy' },
    { name: 'Crown Citadel of the Realm', char: '👑', charName: 'Royal Guardian', w1: 'citadel', w2: 'triumph', w3: 'victory' },
  ];

  return titles.map((t, i) => {
    const isBoss = i === 9;
    return {
      id: `l${level}s${i + 1}`,
      level,
      lockNumber: i + 1,
      title: t.name,
      story: isBoss
        ? `Grand Star Boss! The ${t.charName} challenges your mastery. Solve all 3 final trials to unlock Lock 10!`
        : `Lock ${i + 1} Trial: Help ${t.charName} break the enchanted barrier!`,
      character: t.char,
      characterName: t.charName,
      boss: isBoss,
      accent: isBoss ? '#F59E0B' : i === 4 ? '#8B5CF6' : '#2563EB',
      rewardBadge: isBoss ? `👑 Level ${level} Master Crown` : `⭐ Lock ${i + 1} Champion`,
      questions: [
        {
          storyPrompt: `Quest Clue 1: What key element guides ${t.charName}?`,
          word: t.w1,
          emoji: t.char,
          hint: `Starts with ${t.w1[0].toUpperCase()}`,
          clue: `A key word of power in ${t.name}`,
          choices: [t.w1, `${t.w1}s`, `${t.w1}ing`],
        },
        {
          storyPrompt: `Quest Clue 2: Assemble the power rune for the second lock pin!`,
          word: t.w2,
          emoji: '✨',
          hint: `Starts with ${t.w2[0].toUpperCase()}`,
          clue: `Echoes through the realm of ${t.name}`,
          choices: [t.w2, 'light', 'power'],
        },
        {
          storyPrompt: isBoss ? 'FINAL BOSS LOCK: Crack the legendary lock cipher!' : `Lock-Breaker Challenge: Shatter the padlock!`,
          word: t.w3,
          emoji: isBoss ? '👑' : '🔓',
          hint: `Starts with ${t.w3[0].toUpperCase()}`,
          clue: isBoss ? 'The ultimate badge of victory' : 'Opens the path forward',
          choices: [t.w3, 'unlock', 'golden'],
        },
      ],
    };
  });
}

const ALL_STAGES_BY_LEVEL: Record<number, MapStage[]> = {
  1: LEVEL_1_STAGES,
  2: LEVEL_2_STAGES,
  3: makeLevelStages(3),
  4: makeLevelStages(4),
  5: makeLevelStages(5),
};

export function getStagesForLevel(level = 1): MapStage[] {
  return ALL_STAGES_BY_LEVEL[level] || ALL_STAGES_BY_LEVEL[1];
}

export function getStageById(stageId: string, level = 1): MapStage | undefined {
  const list = getStagesForLevel(level);
  const found = list.find((s) => s.id === stageId);
  if (found) return found;
  // Search other levels as fallback
  for (const lvl of [1, 2, 3, 4, 5]) {
    const s = ALL_STAGES_BY_LEVEL[lvl].find((x) => x.id === stageId);
    if (s) return s;
  }
  return undefined;
}

/** Check if a stage (lock 1..10) is unlocked */
export function isStageUnlocked(lockNumber: number, stars: Record<string, number>, stages: MapStage[]): boolean {
  if (lockNumber <= 1) return true;
  const prevStage = stages.find((s) => s.lockNumber === lockNumber - 1);
  if (!prevStage) return true;
  return (stars[prevStage.id] ?? 0) >= 1;
}

/** Index of current active lock (first unlocked stage without stars) */
export function getCurrentLockIndex(stars: Record<string, number>, stages: MapStage[]): number {
  const idx = stages.findIndex((s) => isStageUnlocked(s.lockNumber, stars, stages) && !(stars[s.id] > 0));
  return idx === -1 ? stages.length - 1 : idx;
}

/** Backward compatibility exports for existing references in ParentScreen & GameScreen */
export const BOSS_ROUNDS = 8;
export const WORLDS = MAP_WORLDS;
export const STAGES = LEVEL_1_STAGES.map((s, idx) => ({
  id: s.id,
  world: 0,
  index: idx,
  game: 'spell' as const,
  boss: s.boss,
  label: s.title,
  route: '/quest',
}));
export function isUnlocked(i: number, stars: Record<string, number>): boolean {
  return i === 0 || (stars[`l1s${i}`] ?? stars[STAGES[i - 1]?.id ?? ''] ?? 0) >= 1;
}
export function currentStageIndex(stars: Record<string, number>): number {
  return getCurrentLockIndex(stars, LEVEL_1_STAGES);
}
