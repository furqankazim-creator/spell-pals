# Builds content/words.json: keeps the original 208 words (levels 1-3) and adds level 4 and 5 words.
# Level 1 = age 4 (3-letter CVC) ... Level 5 = age 8-9 (8+ letter words). Run: python scripts/build-content.py
import json, io
P = 'content/words.json'
words = json.load(io.open(P, encoding='utf-8'))
words = [w for w in words if w['level'] <= 3]

L4 = """rabbit 🐰|turtle 🐢|spider 🕷️|dragon 🐉|rocket 🚀|flower 🌸|carrot 🥕|potato 🥔|tomato 🍅|pepper 🌶️|guitar 🎸|camera 📷|pencil ✏️|basket 🧺|window 🪟|mirror 🪞|bucket 🪣|candle 🕯️|planet 🪐|island 🏝️|rainbow 🌈|balloon 🎈|magnet 🧲|tractor 🚜|anchor ⚓|ticket 🎫|trophy 🏆|parrot 🦜|turkey 🦃|rooster 🐓|dolphin 🐬|penguin 🐧|giraffe 🦒|puppy 🐶|beetle 🪲|pumpkin 🎃|cactus 🌵|volcano 🌋|snowman ⛄|present 🎁|scooter 🛴|piano 🎹|lobster 🦞|octopus 🐙|shrimp 🦐|donut 🍩|burger 🍔|cupcake 🧁|popcorn 🍿|waffle 🧇|pretzel 🥨|butter 🧈|honey 🍯|avocado 🥑|coconut 🥥|diamond 💎|bubble 🫧|rocket 🚀|medal 🏅|tulip 🌷|ladybug 🐞|noodles 🍜|kitten 🐱|donkey 🫏|toast 🍞"""
L5 = """elephant 🐘|butterfly 🦋|dinosaur 🦖|crocodile 🐊|kangaroo 🦘|hedgehog 🦔|squirrel 🐿️|flamingo 🦩|hamburger 🍔|sandwich 🥪|chocolate 🍫|strawberry 🍓|pineapple 🍍|watermelon 🍉|broccoli 🥦|mushroom 🍄|sunflower 🌻|snowflake ❄️|umbrella ☂️|telescope 🔭|microscope 🔬|helicopter 🚁|airplane ✈️|motorcycle 🏍️|bicycle 🚲|ambulance 🚑|skateboard 🛹|backpack 🎒|calendar 📅|keyboard ⌨️|computer 💻|telephone ☎️|fireworks 🎆|lightning ⚡|hourglass ⌛|toothbrush 🪥|blueberry 🫐|cucumber 🥒|sunglasses 🕶️|snowboard 🏂|crayon 🖍️|paintbrush 🖌️|treasure 💰|lollipop 🍭|pancakes 🥞|spaghetti 🍝|bandage 🩹|stethoscope 🩺|rhinoceros 🦏|crocodile 🐊|jellyfish 🪼|starfish ⭐|dandelion 🌼|raindrop 💧|campfire 🔥|trumpet 🎺|saxophone 🎷|baseball ⚾|football 🏈|basketball 🏀|volleyball 🏐"""

LET = dict(b='buh', c='kuh', d='duh', f='fff', g='guh', h='huh', j='juh', k='kuh', l='lll', m='mmm', n='nnn', p='puh', q='kwuh', r='rrr', s='sss', t='tuh', v='vvv', w='wuh', x='ks', y='yuh', z='zzz', a='a', e='e', i='i', o='o', u='u')
seen = {w['word'] for w in words}
bad = []
for level, raw in ((4, L4), (5, L5)):
    for item in raw.split('|'):
        word, emoji = item.split(' ')
        if word in seen: continue
        seen.add(word)
        words.append({'word': word, 'emoji': emoji, 'level': level, 'sounds': [LET[c] for c in word]})
io.open(P, 'w', encoding='utf-8').write(json.dumps(words, ensure_ascii=False, indent=2))
from collections import Counter
print(Counter(w['level'] for w in words), len(words))
