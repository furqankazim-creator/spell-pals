/**
 * Spell Pals story library — 5 levels (ages 4–9), 5 stories per level.
 * Level 1 = very short CVC sentences; level 5 = longer, richer stories.
 * Every page has a scene (pictures); every story ends with comprehension questions.
 */
export interface Option { emoji: string; label: string }
export interface Question { q: string; options: Option[]; answer: number }
export interface Page { text: string; pics: string[] }
export interface Story {
  id: string; title: string; emoji: string; color: string; level: 1 | 2 | 3 | 4 | 5;
  pages: Page[]; questions: Question[]; keywords: string[];
}

type PageT = [string, string];                 // [text, 'emoji,emoji']
type QT = [string, number, string[]];           // [question, correct index, ['🎩 hat', ...]]

function story(id: string, level: Story['level'], title: string, emoji: string, color: string, keywords: string[], pages: PageT[], qs: QT[]): Story {
  return {
    id, level, title, emoji, color, keywords,
    pages: pages.map(([text, pics]) => ({ text, pics: pics.split(',') })),
    questions: qs.map(([q, answer, opts]) => ({
      q, answer,
      options: opts.map((o) => { const i = o.indexOf(' '); return { emoji: o.slice(0, i), label: o.slice(i + 1) }; }),
    })),
  };
}

export const STORIES: Story[] = [
  // ───────────────────────── LEVEL 1 · age 4 · short 3-letter words ─────────────────────────
  story('cat-hat', 1, 'The Cat and the Hat', '🐱', '#FFE29A', ['cat', 'hat', 'rat'], [
    ['A cat sat on a mat.', '🐱'],
    ['The cat had a red hat.', '🐱,🎩'],
    ['A rat ran to the cat. The rat sat in the hat!', '🐀,🎩'],
    ['The cat did not mind. The cat and the rat had a nap.', '🐱,🐀'],
  ], [
    ['What did the cat have?', 1, ['🚗 car', '🎩 hat', '🥚 egg']],
    ['Who sat in the hat?', 0, ['🐀 rat', '🐶 dog', '🐝 bee']],
  ]),
  story('pig-mud', 1, 'Pig in the Mud', '🐷', '#FFB8CC', ['pig', 'hen', 'mud'], [
    ['A big pig is in the mud.', '🐷'],
    ['The pig has fun. Mud, mud, mud!', '🐷'],
    ['A hen sees the pig. The hen will not step in the mud.', '🐔,🐷'],
    ['The pig gets in a tub. Now the pig is not in the mud.', '🛁,🐷'],
  ], [
    ['What did the pig get in?', 2, ['🛏️ bed', '🚌 bus', '🛁 tub']],
    ['Who saw the pig?', 0, ['🐔 hen', '🐮 cow', '🦊 fox']],
  ]),
  story('dan-bus', 1, 'Dan and the Bus', '🚌', '#BAE6FD', ['bus', 'dog', 'hug'], [
    ['Dan is on a bus. The bus is red.', '🚌'],
    ['Dan has a dog. The dog is on the bus.', '🐶,🚌'],
    ['The bus stops. Dan and the dog get off.', '🚌'],
    ['Dan gives the dog a hug. Fun, fun, fun!', '🐶'],
  ], [
    ['What did Dan ride?', 0, ['🚌 bus', '🚗 car', '✈️ jet']],
    ['Who is with Dan?', 1, ['🐱 cat', '🐶 dog', '🐷 pig']],
  ]),
  story('sun-ant', 1, 'The Sun and the Ant', '🐜', '#FFE29A', ['sun', 'ant', 'nut'], [
    ['The sun is up. An ant is up too.', '☀️,🐜'],
    ['The ant has a nut. The nut is big!', '🐜,🥜'],
    ['The ant can not lift the nut. Ten ants can!', '🐜'],
    ['The ants run home with the nut. What a day!', '🏠,🥜'],
  ], [
    ['What did the ant have?', 0, ['🥜 nut', '🥚 egg', '☕ cup']],
    ['Who helped the ant?', 2, ['🐝 bees', '🐀 rats', '🐜 ants']],
  ]),
  story('jam-bun', 1, 'Jam on the Bun', '🍞', '#FFB8CC', ['jam', 'bun', 'bug'], [
    ['Leo and Bella sit in the sun.', '🦁,🐰,☀️'],
    ['Bella has a pot of jam. Leo has a bun.', '🍓,🍞'],
    ['Leo and Bella put the jam on the bun. Yum, yum!', '🍞,🍓'],
    ['A bug sits on the bun! Leo and Bella run.', '🐛,🦁,🐰'],
  ], [
    ['What did they put on the bun?', 1, ['🥚 egg', '🍓 jam', '🥛 milk']],
    ['What sat on the bun?', 2, ['🐸 frog', '🐝 bee', '🐛 bug']],
  ]),

  // ───────────────────────── LEVEL 2 · age 5 · 4–5 letter words ─────────────────────────
  story('picnic', 2, 'The Big Picnic', '🧺', '#FFE29A', ['cake', 'ant', 'bee', 'jam'], [
    ['Leo and Bella pack a big picnic. They put a cake and a pie in the box.', '🧺,🍰'],
    ['Oh no! An ant wants the cake. Two ants, three ants… a lot of ants!', '🐜,🍰'],
    ['A bee hums by the flowers. Bella gives the bee a tiny bit of jam.', '🐝,🌸,🍯'],
    ['The sun is warm. Leo and Bella eat the cake under a big tree. Yum!', '☀️,🌳,🍰'],
  ], [
    ['What did the ant want?', 0, ['🍰 cake', '🥧 pie', '🍯 jam']],
    ['Who got a bit of jam?', 1, ['🐜 ant', '🐝 bee', '🐸 frog']],
  ]),
  story('rainy', 2, 'The Rainy Day', '🌧️', '#BAE6FD', ['frog', 'duck', 'rain'], [
    ['Rain taps on the roof. Leo and Bella watch the rain from the door.', '🌧️,🚪'],
    ['A frog hops in the wet grass. Hop, hop! The frog loves the rain.', '🐸'],
    ['A duck splashes in a big puddle. Quack, quack! What a fun bath!', '🦆,💧'],
    ['The rain stops. A rainbow shines in the sky, and the sun comes out to play.', '🌈,☀️'],
  ], [
    ['Who hops in the grass?', 1, ['🦆 duck', '🐸 frog', '🐱 cat']],
    ['What shines in the sky at the end?', 0, ['🌈 rainbow', '⭐ star', '🌙 moon']],
  ]),
  story('boat', 2, 'The Little Boat', '🚤', '#99F0E3', ['fish', 'seal', 'boat'], [
    ['Leo has a little red boat. Bella helps him push it to the sea.', '🚤,🦁,🐰'],
    ['A fish jumps by the boat. Then two fish, then three! Hello, fish!', '🐟'],
    ['A seal waves a flipper at the boat. Leo and Bella wave back.', '🦭,👋'],
    ['The sun goes down. The little boat sails home. What a happy day!', '🌅,⛵'],
  ], [
    ['What color is the boat?', 2, ['🔵 blue', '🟢 green', '🔴 red']],
    ['Who jumps by the boat?', 0, ['🐟 fish', '🐸 frog', '🐦 bird']],
  ]),
  story('moon', 2, 'The Moon Picnic', '🌙', '#D4C9FF', ['moon', 'star', 'milk'], [
    ['An owl hoots in the night. Leo and Bella look up at the moon and the stars.', '🦉,🌙,⭐'],
    ['The moon looks like a big round cheese! Leo laughs. Silly moon!', '🌙,🧀'],
    ['Bella pours warm milk. They sip and count the stars. One, two, three…', '🥛,⭐'],
    ['Time for bed. The moon sings a soft song, and Leo and Bella fall asleep.', '🛏️,🌙'],
  ], [
    ['What does the moon look like to Leo?', 1, ['🍪 a cookie', '🧀 a cheese', '🍕 a pizza']],
    ['What do they drink?', 0, ['🥛 milk', '🧃 juice', '☕ tea']],
  ]),
  story('kite', 2, 'The Red Kite', '🪁', '#FFB4BA', ['kite', 'wind', 'tree'], [
    ['Leo has a red kite. Bella has a blue kite.', '🪁,🦁,🐰'],
    ['The wind blows. Up, up, up go the kites!', '🪁,💨'],
    ['Oh no! The red kite gets stuck in a tree.', '🌳,🪁'],
    ['Bella jumps up and gets the kite. Leo says, "Thank you, Bella!"', '🐰,🪁'],
  ], [
    ['Where did the red kite get stuck?', 2, ['🏠 a house', '🚌 a bus', '🌳 a tree']],
    ['Who got the kite back?', 1, ['🦁 Leo', '🐰 Bella', '🐶 a dog']],
  ]),

  // ───────────────────────── LEVEL 3 · age 6 · everyday words ─────────────────────────
  story('farm-day', 3, 'A Day at the Farm', '🚜', '#FFE29A', ['farm', 'cow', 'bread'], [
    ['Leo and Bella wake up early. Today they visit a farm.', '🦁,🐰,🌄'],
    ['The farmer shows them a cow. The cow gives milk every day.', '🐮,🥛'],
    ['In the barn, a hen sits on her eggs. Bella must be very quiet.', '🐔,🥚'],
    ['The farmer bakes fresh bread. Leo and Bella eat it with warm milk.', '🍞,🥛'],
    ['What a happy day on the farm! They wave goodbye to the animals.', '🚜,👋'],
  ], [
    ['What does the cow give every day?', 0, ['🥛 milk', '🍞 bread', '🥚 eggs']],
    ['What did the hen sit on?', 2, ['🍞 bread', '🍎 apples', '🥚 eggs']],
    ['Where did Leo and Bella go?', 1, ['🏫 school', '🚜 a farm', '🏖️ the beach']],
  ]),
  story('monkey-banana', 3, 'The Monkey and the Banana', '🐵', '#FFE29A', ['monkey', 'banana', 'tree'], [
    ['A little monkey lives in a tall tree. He loves to eat bananas.', '🐵,🌳,🍌'],
    ['One morning, he cannot find a single banana. The monkey is sad.', '🐵,😢'],
    ['A kind zebra says, "Look by the river!" The monkey runs and runs.', '🦓,🌊'],
    ['There is a big bunch of bananas! The monkey shares them with his friends.', '🍌,🐵,🦓'],
    ['Now everyone is happy. The monkey says, "Thank you, friend!"', '😊,🐵'],
  ], [
    ['What does the monkey love to eat?', 2, ['🍎 apples', '🍇 grapes', '🍌 bananas']],
    ['Who told the monkey where to look?', 0, ['🦓 a zebra', '🦁 a lion', '🐼 a panda']],
    ['What did the monkey do with the bananas?', 1, ['🙈 hid them', '🤝 shared them', '🗑️ threw them']],
  ]),
  story('birthday-cake', 3, "Bella's Birthday Cake", '🎂', '#FFB8CC', ['cake', 'candy', 'house'], [
    ['Today is Bella\'s birthday. Leo wants to make her a surprise.', '🎂,🐰,🦁'],
    ['Leo mixes the flour, the eggs, and the sugar. He puts the cake in the oven.', '🥚,🍰'],
    ['Oh no! The cake is a little burnt. Leo feels sorry.', '🔥,😟'],
    ['Bella smiles. She puts cherries and candy on top. Now it looks lovely!', '🍒,🍬,🎂'],
    ['They sing a song and share the cake with the whole house. Happy birthday!', '🎶,🏠,🎉'],
  ], [
    ['Whose birthday was it?', 1, ['🦁 Leo\'s', '🐰 Bella\'s', '🐶 a dog\'s']],
    ['What went wrong with the cake?', 0, ['🔥 It got burnt', '🥛 It was cold', '🐜 Ants ate it']],
    ['What did Bella put on top?', 2, ['🍌 bananas', '🍕 pizza', '🍒 cherries']],
  ]),
  story('train-beach', 3, 'The Train to the Beach', '🚂', '#BAE6FD', ['train', 'beach', 'shark'], [
    ['Toot, toot! Leo and Bella climb on the train. It is going to the beach.', '🚂,🦁,🐰'],
    ['The train goes over a bridge and past a green forest.', '🌉,🌲'],
    ['At last they see the sea. They run to the sand and build a castle.', '🏖️,🏰'],
    ['A big wave comes! It splashes the castle. A little crab waves hello.', '🌊,🦀'],
    ['Leo sees a fin in the water. "A shark!" he shouts. But it is only a dolphin.', '🦈,🐬'],
  ], [
    ['How did they get to the beach?', 0, ['🚂 by train', '✈️ by plane', '🚲 by bike']],
    ['What did they build in the sand?', 2, ['🏠 a house', '🌉 a bridge', '🏰 a castle']],
    ['What was in the water?', 1, ['🦈 a shark', '🐬 a dolphin', '🐳 a whale']],
  ]),
  story('sleepy-panda', 3, 'The Sleepy Panda', '🐼', '#D4C9FF', ['panda', 'sleep', 'dream'], [
    ['Pip the panda is very sleepy. He yawns a big yawn.', '🐼,🥱'],
    ['But Pip cannot sleep. The forest is too noisy tonight.', '🌲,🔊'],
    ['An owl says, "Close your eyes and count the stars." Pip counts one, two, three.', '🦉,⭐'],
    ['The noise fades. A soft wind hums a gentle tune.', '🌙,🎵'],
    ['Pip falls fast asleep and has a sweet dream about bamboo.', '😴,🎋'],
  ], [
    ['Why could Pip not sleep?', 2, ['🍔 He was hungry', '🥶 He was cold', '🔊 It was noisy']],
    ['Who told Pip to count stars?', 0, ['🦉 an owl', '🐯 a tiger', '🐒 a monkey']],
    ['What did Pip dream about?', 1, ['🍕 pizza', '🎋 bamboo', '🏖️ the beach']],
  ]),

  // ───────────────────────── LEVEL 4 · age 7 · longer words ─────────────────────────
  story('rocket-planet', 4, 'The Rocket to the Planet', '🚀', '#BAE6FD', ['rocket', 'planet', 'camera'], [
    ['Leo built a rocket in the garden. It had shiny wings and a round window. Bella packed a basket of snacks and a camera.', '🚀,🧺,📷'],
    ['Three, two, one — blast off! The rocket zoomed past the clouds and into the dark sky.', '🚀,☁️'],
    ['Soon they landed on a purple planet. The ground sparkled like glitter, and tiny glowing flowers grew everywhere.', '🪐,🌸'],
    ['Bella took pictures of everything with her camera. Leo found a friendly alien who loved carrots.', '📷,👽,🥕'],
    ['They shared their snacks with the alien. He gave them a round blue magnet as a present.', '🧲,🎁'],
    ['It was time to go home. Leo and Bella waved from the window as the planet became a tiny dot.', '🚀,🪐'],
  ], [
    ['What did Bella bring to take pictures?', 1, ['🎸 a guitar', '📷 a camera', '✏️ a pencil']],
    ['What color was the planet?', 0, ['🟣 purple', '🔴 red', '🟢 green']],
    ['What did the alien give them?', 2, ['🥕 a carrot', '🎈 a balloon', '🧲 a magnet']],
  ]),
  story('penguin-fly', 4, 'The Penguin Who Wanted to Fly', '🐧', '#BAE6FD', ['penguin', 'island', 'balloon'], [
    ['Pablo the penguin lived on a snowy island. Every day he watched the birds fly high above him.', '🐧,🏝️,🐦'],
    ['"I wish I could fly," he sighed. He flapped his flippers as fast as he could, but he only fell in the snow.', '🐧,❄️'],
    ['A wise old turtle swam by. "Penguins cannot fly in the sky," he said, "but you are a champion in the sea."', '🐢,🌊'],
    ['Pablo dived into the water and zoomed like a rocket. He swam faster than every fish!', '🐧,🐟'],
    ['Just then a red balloon floated down from the sky. Pablo caught it and held it high.', '🎈,🐧'],
    ['"Now I am flying a little!" he laughed. Pablo learned that everyone is good at something special.', '😄,🎈'],
  ], [
    ['Where did Pablo live?', 0, ['🏝️ on an island', '🌋 near a volcano', '🏜️ in a desert']],
    ['What is Pablo great at?', 2, ['🏃 running', '🧗 climbing', '🏊 swimming']],
    ['What lesson did Pablo learn?', 1, ['🍕 Eat more fish', '⭐ Everyone is good at something special', '😴 Sleep all day']],
  ]),
  story('pumpkin-patch', 4, 'The Pumpkin Patch', '🎃', '#FFE29A', ['pumpkin', 'scooter', 'candle'], [
    ['In October, Leo and Bella rode their scooters to the pumpkin patch. The field was full of big orange pumpkins.', '🛴,🎃'],
    ['Leo wanted the tallest pumpkin. Bella wanted the roundest one. They searched up and down the rows.', '🦁,🐰,🎃'],
    ['At last, they found a giant pumpkin hiding behind a scarecrow. It was too heavy to lift!', '🎃,🧑‍🌾'],
    ['Together they pushed it onto a wheelbarrow. Push, roll, push, roll — they carried it home.', '🛒,🎃'],
    ['That night Leo carved a funny face and Bella placed a candle inside. The pumpkin glowed in the window.', '🕯️,🎃'],
  ], [
    ['How did Leo and Bella travel to the patch?', 2, ['🚲 on bikes', '🚌 by bus', '🛴 on scooters']],
    ['Where was the giant pumpkin hiding?', 0, ['🧑‍🌾 behind a scarecrow', '🌳 behind a tree', '🏠 behind a barn']],
    ['What did Bella put inside the pumpkin?', 1, ['🍬 candy', '🕯️ a candle', '🔦 a torch']],
  ]),
  story('magic-guitar', 4, 'The Magic Guitar', '🎸', '#D4C9FF', ['guitar', 'piano', 'rainbow'], [
    ['Bella found an old guitar in the attic. It was dusty, but when she touched the strings, they glowed softly.', '🎸,✨'],
    ['She played one gentle note, and a tiny rainbow floated out of the guitar.', '🎸,🌈'],
    ['Leo ran to the piano and played along. Together the music made flowers bloom on the windowsill.', '🎹,🌷'],
    ['The neighbours heard the song and came to listen. Everyone clapped and cheered.', '👏,🏠'],
    ['Bella smiled. "Music is magic," she whispered, "even without the glowing strings."', '🐰,🎵'],
  ], [
    ['Where did Bella find the guitar?', 1, ['🧺 in a basket', '🏠 in the attic', '🌳 in a tree']],
    ['What came out of the guitar?', 0, ['🌈 a rainbow', '🦋 a butterfly', '🎈 a balloon']],
    ['What did Leo play?', 2, ['🥁 drums', '🎺 a trumpet', '🎹 the piano']],
  ]),
  story('turtle-race', 4, "The Turtle's Race", '🐢', '#99F0E3', ['turtle', 'rabbit', 'trophy'], [
    ['Timmy the turtle and Rosie the rabbit decided to have a race to the old lighthouse.', '🐢,🐇'],
    ['"Ha! I will win easily," laughed Rosie, hopping far ahead. Timmy walked slowly and steadily.', '🐇,🐢'],
    ['Halfway there, Rosie got tired. She lay down under a tree and fell fast asleep.', '🌳,😴'],
    ['Timmy never stopped. Step by step, he passed the sleeping rabbit and kept going.', '🐢,👣'],
    ['When Rosie woke up, Timmy was almost at the finish line. She ran as fast as she could, but it was too late!', '🏁,🐇'],
    ['Timmy won a golden trophy. "Slow and steady wins the race," he said with a smile.', '🏆,🐢'],
  ], [
    ['Why did Rosie lose the race?', 0, ['😴 She fell asleep', '🤕 She got hurt', '🚫 She got lost']],
    ['What did Timmy win?', 2, ['🏅 a medal', '🍰 a cake', '🏆 a trophy']],
    ['What lesson does the story teach?', 1, ['🏃 Always run fast', '🐢 Slow and steady wins', '😴 Naps are bad']],
  ]),

  // ───────────────────────── LEVEL 5 · age 8–9 · rich vocabulary ─────────────────────────
  story('butterfly-journey', 5, "The Butterfly's Journey", '🦋', '#FFB8CC', ['butterfly', 'sunflower', 'umbrella'], [
    ['Once upon a time, a tiny caterpillar named Luna lived on a sunflower leaf. She spent her days eating and dreaming about the sky.', '🐛,🌻'],
    ['One chilly morning, Luna spun a silky cocoon around herself. Inside it was dark and quiet, so she slept for many days.', '🛏️,🌙'],
    ['When she finally pushed her way out, something amazing had happened. Luna had two beautiful, shimmering wings!', '🦋,✨'],
    ['She flapped them carefully, and suddenly she was floating above the garden. The sunflowers looked like golden stars below her.', '🌻,☁️'],
    ['A storm arrived without warning. Luna hid under a bright red umbrella that someone had left on the bench.', '⛈️,☂️'],
    ['When the clouds cleared, a rainbow stretched across the sky. Luna flew toward it, happier and braver than ever before.', '🌈,🦋'],
  ], [
    ['What did Luna do on the chilly morning?', 1, ['🍃 ate leaves', '🐛 spun a cocoon', '🌊 swam away']],
    ['Where did Luna hide from the storm?', 2, ['🏠 inside a house', '🌳 in a tree', '☂️ under an umbrella']],
    ['What changed Luna from a caterpillar?', 0, ['🦋 she grew wings', '🌻 she ate more', '🌈 she saw a rainbow']],
  ]),
  story('treasure-hunt', 5, 'The Treasure Hunt', '💰', '#FFE29A', ['treasure', 'backpack', 'telescope'], [
    ['Leo found a crumpled map inside an old bottle on the beach. In the corner, a red cross marked a hidden treasure.', '🗺️,🏖️'],
    ['He packed his backpack with a flashlight, a sandwich, and a shiny telescope. Bella grabbed a shovel and followed him.', '🎒,🔭,🥪'],
    ['Through the telescope, Leo spotted a rocky hill with two palm trees at the top. "That is the place on the map!" he cried.', '🔭,🌴'],
    ['They climbed higher and higher. The path was steep, but they encouraged each other all the way.', '⛰️,🦁,🐰'],
    ['Under the biggest palm tree, the shovel hit something hard. A wooden chest! Inside lay sparkling coins and a note.', '📦,💰'],
    ['The note said: "The real treasure is friendship." Leo and Bella laughed, shared the coins, and walked home arm in arm.', '💌,🤝'],
  ], [
    ['Where did Leo find the map?', 0, ['🍾 in a bottle', '🎒 in his backpack', '📦 in a chest']],
    ['What did Leo use to look far away?', 2, ['🔬 a microscope', '📷 a camera', '🔭 a telescope']],
    ['What was the real treasure?', 1, ['💰 gold coins', '🤝 friendship', '💎 a diamond']],
  ]),
  story('little-telescope', 5, 'The Little Telescope', '🔭', '#D4C9FF', ['telescope', 'calendar', 'fireworks'], [
    ['Maya received a telescope for her eighth birthday. She circled the date on her calendar and waited for a clear night.', '🔭,📅'],
    ['On the first clear evening, she pointed it at the sky. The moon was covered with craters that looked like tiny bowls.', '🌙,🔭'],
    ['Next she found Jupiter, a bright dot with four little moons beside it. Maya wrote everything in her notebook.', '🪐,📓'],
    ['Suddenly a streak of light raced across the sky — a shooting star! She made a wish before it disappeared.', '🌠,✨'],
    ['The next night, the town celebrated with fireworks. Maya thought they looked like colourful flowers made of light.', '🎆,🏙️'],
    ['"Science is wonderful," she thought. "The sky has surprises every single night."', '🔭,⭐'],
  ], [
    ['What gift did Maya receive?', 1, ['🚲 a bicycle', '🔭 a telescope', '💻 a computer']],
    ['What did Maya see near Jupiter?', 0, ['🌙 four little moons', '☁️ a cloud', '🛸 a spaceship']],
    ['What did the fireworks look like to Maya?', 2, ['🐟 fish', '🦋 butterflies', '🌸 flowers of light']],
  ]),
  story('elephant-day', 5, "The Elephant's Big Day", '🐘', '#99F0E3', ['elephant', 'strawberry', 'watermelon'], [
    ['Ellie the elephant woke up before sunrise. Today was the annual summer fair, and she had promised to help.', '🐘,🌄'],
    ['First, she carried a huge basket of juicy strawberries to the market stall. Her trunk made carrying them look easy.', '🍓,🧺'],
    ['Then the farmer asked her to move a giant watermelon. No one else was strong enough to lift it!', '🍉,💪'],
    ['At noon, a little hedgehog got lost in the crowd. Ellie lifted him gently and returned him to his worried mother.', '🦔,👩‍👧'],
    ['By evening, everyone cheered for Ellie. The mayor gave her a medal for being the kindest helper.', '🏅,🎉'],
    ['Ellie was tired but proud. She learned that being big and strong is best when you use it to help others.', '🐘,❤️'],
  ], [
    ['What did Ellie carry first?', 0, ['🍓 strawberries', '🍉 watermelons', '🍌 bananas']],
    ['Who got lost in the crowd?', 2, ['🐿️ a squirrel', '🦘 a kangaroo', '🦔 a hedgehog']],
    ['What did the mayor give Ellie?', 1, ['🏆 a trophy', '🏅 a medal', '🎁 a present']],
  ]),
  story('science-fair', 5, 'The Rainy Science Fair', '🔬', '#BAE6FD', ['microscope', 'lightning', 'computer'], [
    ['Sam and Zara spent weeks preparing for the school science fair. Their project was called "How Rainbows Are Made".', '🔬,🌈'],
    ['On the big morning, black clouds covered the sky. Thunder rumbled and heavy rain began to fall.', '⛈️,🌧️'],
    ['Inside the hall, a flash of lightning made the lights flicker. The computer with their slides went completely dark.', '⚡,💻'],
    ['Zara stayed calm. "We do not need the screen," she said. "We can use a glass of water and a torch!"', '💡,🥛'],
    ['She shone the torch through the glass, and a tiny rainbow appeared on the wall. The judges gasped with delight.', '🔦,🌈'],
    ['They won first prize. Sam and Zara learned that a good scientist can solve problems even when things go wrong.', '🥇,🔬'],
  ], [
    ['What was the project about?', 2, ['🌋 volcanoes', '🌌 space', '🌈 how rainbows are made']],
    ['What went wrong during the fair?', 0, ['⚡ the computer went dark', '🔥 a fire started', '🐕 a dog ran in']],
    ['How did Zara make a rainbow?', 1, ['🎨 with paint', '🔦 a torch and a glass of water', '☂️ with an umbrella']],
  ]),
  // ───────────── PERSONAL STORIES · one per level · they star the child ({name}) and their buddy ({buddy}) ─────────────
  story('me-pal', 1, 'My Pal', '{avatar}', '#FFE29A', ['sun', 'run', 'hug'], [
    ['{name} has a pal. The pal is a {buddy}.', '{avatar}'],
    ['{name} and the {buddy} sit in the sun.', '{avatar},☀️'],
    ['They run and run. Fun, fun, fun!', '🏃,{avatar}'],
    ['{name} gives the {buddy} a big hug.', '{avatar},❤️'],
  ], [
    ["Who is {name}'s pal?", 0, ['{avatar} the {buddy}', '🐶 a dog', '🐱 a cat']],
    ['What do they do after they sit?', 1, ['😴 nap', '🏃 run', '🍽️ eat']],
  ]),
  story('me-park', 2, "{name}'s Day at the Park", '🌳', '#99F0E3', ['frog', 'cake', 'tree'], [
    ['{name} and the {buddy} walk to the park. The sky is blue and the sun is warm.', '{avatar},🌳'],
    ['They see a big frog by the pond. Hop, hop, hop! The frog jumps in.', '🐸,💧'],
    ['{name} and the {buddy} play in the sun. Run, run, run!', '{avatar},☀️'],
    ['At the end of the day they eat a cake under the tree. What a fun day!', '🍰,🌳'],
  ], [
    ['Who went to the park with {name}?', 0, ['{avatar} the {buddy}', '🐸 a frog', '🐶 a dog']],
    ['What jumped in the pond?', 0, ['🐸 a frog', '🐱 a cat', '🦆 a duck']],
  ]),
  story('me-bike', 3, "{name}'s New Bike", '🚲', '#FFB4BA', ['bike', 'friend', 'beach'], [
    ['{name} got a shiny new bike for a birthday present. It was bright red with a little bell.', '🚲,🎁'],
    ['The {buddy} said, "Let us ride to the beach!" {name} was happy but a little bit nervous.', '{avatar},🏖️'],
    ['At first {name} wobbled and almost fell. The {buddy} held the bike and said, "You can do it, friend!"', '🚲,{avatar}'],
    ['Soon {name} was riding all alone. The wind blew and the wheels spun fast.', '🚲,💨'],
    ['They reached the beach and shared a big juicy orange. It was the best day ever.', '🏖️,🍊'],
  ], [
    ['What color was the new bike?', 0, ['🔴 red', '🔵 blue', '🟢 green']],
    ['Where did they ride to?', 0, ['🏖️ the beach', '🏫 school', '🏰 a castle']],
    ['How did {name} feel at first?', 0, ['😟 nervous', '😴 sleepy', '😡 angry']],
  ]),
  story('me-rocket', 4, '{name} and the Rainbow Rocket', '🚀', '#BAE6FD', ['rocket', 'rainbow', 'basket'], [
    ['One sunny morning, {name} found a tiny rocket hiding behind the garden shed. It sparkled with every colour of the rainbow.', '🚀,🌈'],
    ['The {buddy} climbed in first and shouted, "Hurry, {name}! The rocket is warming up!"', '{avatar},🚀'],
    ['Whoosh! They zoomed past birds, clouds and a surprised balloon floating in the sky.', '☁️,🎈'],
    ['They landed on a bumpy little planet covered in sweet pink flowers. {name} filled a basket to take home.', '🪐,🧺'],
    ['On the way back, the rocket drew a giant rainbow across the sky. Everyone in town looked up and cheered.', '🌈,🏠'],
  ], [
    ['Where was the rocket hiding?', 1, ['🌳 behind a tree', '🏠 behind the garden shed', '🚗 behind a car']],
    ['What did {name} fill with flowers?', 0, ['🧺 a basket', '🪣 a bucket', '🎒 a backpack']],
    ['What did the rocket draw in the sky?', 0, ['🌈 a rainbow', '⭐ a star', '☁️ a cloud']],
  ]),
  story('me-detective', 5, '{name} the Detective', '🔍', '#D4C9FF', ['umbrella', 'backpack', 'treasure'], [
    ['Every morning, {name} packed a backpack with a notebook, a magnifying glass and a sandwich. Today, a mystery was waiting.', '🎒,🔍'],
    ['Someone had taken the golden trophy from the school hall! The {buddy} whispered, "We must find the thief before lunch."', '🏆,{avatar}'],
    ['{name} noticed wet footprints leading toward the garden. It had rained all night, so the clues were easy to follow.', '👣,🌧️'],
    ['Behind a bush, they found a bright yellow umbrella. Underneath it sat a tiny hedgehog hugging the shiny trophy.', '☂️,🦔'],
    ['The hedgehog explained, "I thought it was a golden acorn!" {name} and the {buddy} laughed kindly.', '🌰,🏆'],
    ['They returned the trophy to the hall, and the head teacher gave {name} a special badge for solving the case.', '🏅,🏫'],
  ], [
    ['What did {name} carry in the backpack?', 0, ['🔍 a magnifying glass', '📺 a television', '🎸 a guitar']],
    ['How did they follow the thief?', 0, ['👣 wet footprints', '📞 a phone call', '🗺️ a map']],
    ['Who took the trophy?', 0, ['🦔 a hedgehog', '🐿️ a squirrel', '🦊 a fox']],
  ]),
];

/** Stories for a level (falls back to all stories if a level has none). */
export const storiesForLevel = (level: number) => {
  const list = STORIES.filter((s) => s.level === level);
  return list.length ? list : STORIES;
};
