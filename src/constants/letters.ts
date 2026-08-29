import type { LetterData } from '../types';

const LOCAL_ICONS = ['apple', 'ball', 'cat'];
const getImg = (word: string) => {
  const slug = word.toLowerCase().replace(/ /g, '-');
  if (LOCAL_ICONS.includes(slug)) return `/icons/${slug}.png`;
  return `https://img.icons8.com/color/200/${slug}.png`;
};

export const LETTERS_DATA: LetterData[] = [
  { letter: 'A', uppercase: 'A', lowercase: 'a', phoneme: '/æ/', exampleWord: 'Apple', exampleImage: getImg('Apple'), exampleEmoji: '🍎', funFact: 'A is the most used vowel!', color: '#EF4444', bgColor: '#FEF2F2', objects: [
    { word: 'Acorn', image: getImg('nut') }, { word: 'Airplane', image: getImg('airplane-front-view') }, { word: 'Alligator', image: getImg('Alligator') },
    { word: 'Anchor', image: getImg('Anchor') }, { word: 'Angel', image: getImg('Angel') }, { word: 'Ant', image: getImg('Ant') },
    { word: 'Antler', image: getImg('Deer') }, { word: 'Apple', image: getImg('Apple') }, { word: 'Arrow', image: getImg('Arrow') },
    { word: 'Astronaut', image: getImg('Astronaut') }, { word: 'Avocado', image: getImg('Avocado') }, { word: 'Ax', image: getImg('small-axe') }
  ]},
  { letter: 'B', uppercase: 'B', lowercase: 'b', phoneme: '/b/', exampleWord: 'Ball', exampleImage: getImg('Ball'), exampleEmoji: '⚽', funFact: 'B looks like bubbles!', color: '#F97316', bgColor: '#FFF7ED', objects: [
    { word: 'Ball', image: getImg('basketball') }, { word: 'Banana', image: getImg('Banana') }, { word: 'Bear', image: getImg('Bear') },
    { word: 'Bed', image: getImg('Bed') }, { word: 'Bee', image: getImg('Bee') }, { word: 'Bell', image: getImg('Bell') },
    { word: 'Boat', image: getImg('sailboat') }, { word: 'Book', image: getImg('Book') }, { word: 'Box', image: getImg('Box') },
    { word: 'Bug', image: getImg('ladybird') }, { word: 'Bus', image: getImg('Bus') }, { word: 'Butterfly', image: getImg('Butterfly') }
  ]},
  { letter: 'C', uppercase: 'C', lowercase: 'c', phoneme: '/k/', exampleWord: 'Cat', exampleImage: getImg('Cat'), exampleEmoji: '🐱', funFact: 'Cats are smart!', color: '#F59E0B', bgColor: '#FFFBEB', objects: [
    { word: 'Cake', image: getImg('Cake') }, { word: 'Camel', image: getImg('Camel') }, { word: 'Can', image: getImg('Can') },
    { word: 'Cap', image: getImg('Cap') }, { word: 'Car', image: getImg('Car') }, { word: 'Cat', image: getImg('Cat') },
    { word: 'Cog', image: getImg('Settings') }, { word: 'Cot', image: getImg('Baby-Bed') }, { word: 'Cow', image: getImg('Cow') },
    { word: 'Cub', image: getImg('Lion') }, { word: 'Cup', image: getImg('Cup') }, { word: 'Glass', image: getImg('Glass') }
  ]},
  { letter: 'D', uppercase: 'D', lowercase: 'd', phoneme: '/d/', exampleWord: 'Dog', exampleImage: getImg('Dog'), exampleEmoji: '🐕', funFact: 'Dinosaurs are big!', color: '#84CC16', bgColor: '#F7FEE7', objects: [
    { word: 'Day', image: getImg('Sun') }, { word: 'Den', image: getImg('Cave') }, { word: 'Dew', image: getImg('Water-Drop') },
    { word: 'Dig', image: getImg('Shovel') }, { word: 'Dinosaur', image: getImg('Dinosaur') }, { word: 'Dip', image: getImg('Sauce') },
    { word: 'Dog', image: getImg('Dog') }, { word: 'Doll', image: getImg('Doll') }, { word: 'Dolphin', image: getImg('Dolphin') },
    { word: 'Dot', image: getImg('Circle') }, { word: 'Drum', image: getImg('Drum') }, { word: 'Duck', image: getImg('Duck') }
  ]},
  { letter: 'E', uppercase: 'E', lowercase: 'e', phoneme: '/ɛ/', exampleWord: 'Elephant', exampleImage: getImg('Elephant'), exampleEmoji: '🐘', funFact: 'E is everywhere!', color: '#22C55E', bgColor: '#F0FDF4', objects: [
    { word: 'Eagle', image: getImg('Eagle') }, { word: 'Ear', image: getImg('Ear') }, { word: 'Earth', image: getImg('Earth') },
    { word: 'Eel', image: getImg('Fish') }, { word: 'Egg', image: getImg('Egg') }, { word: 'Elephant', image: getImg('Elephant') },
    { word: 'Elk', image: getImg('Deer') }, { word: 'Elm', image: getImg('Tree') }, { word: 'Elf', image: getImg('Elf') },
    { word: 'Emu', image: getImg('Bird') }, { word: 'Envelope', image: getImg('Envelope') }, { word: 'Eye', image: getImg('Eye') }
  ]},
  { letter: 'F', uppercase: 'F', lowercase: 'f', phoneme: '/f/', exampleWord: 'Fish', exampleImage: getImg('Fish'), exampleEmoji: '🐟', funFact: 'Fish love water!', color: '#14B8A6', bgColor: '#F0FDFA', objects: [
    { word: 'Fan', image: getImg('Fan') }, { word: 'Fig', image: getImg('Fruit') }, { word: 'Fin', image: getImg('Shark') },
    { word: 'Fish', image: getImg('Fish') }, { word: 'Flag', image: getImg('Flag') }, { word: 'Flower', image: getImg('Flower') },
    { word: 'Fly', image: getImg('Fly') }, { word: 'Fog', image: getImg('Cloud') }, { word: 'Fork', image: getImg('Fork') },
    { word: 'Fox', image: getImg('Fox') }, { word: 'Frog', image: getImg('Frog') }, { word: 'Fur', image: getImg('Cat-Footprint') }
  ]},
  { letter: 'G', uppercase: 'G', lowercase: 'g', phoneme: '/g/', exampleWord: 'Giraffe', exampleImage: getImg('Giraffe'), exampleEmoji: '🦒', funFact: 'Giraffes are tall!', color: '#06B6D4', bgColor: '#ECFEFF', objects: [
    { word: 'Gap', image: getImg('Mountain') }, { word: 'Gas', image: getImg('Gas-Station') }, { word: 'Gem', image: getImg('Diamond') },
    { word: 'Gift', image: getImg('Gift') }, { word: 'Giraffe', image: getImg('Giraffe') }, { word: 'Girl', image: getImg('Girl') },
    { word: 'Goal', image: getImg('Football-Goal') }, { word: 'Goat', image: getImg('Goat') }, { word: 'Grapes', image: getImg('Grapes') },
    { word: 'Guitar', image: getImg('Guitar') }, { word: 'Gum', image: getImg('Candy') }, { word: 'Guy', image: getImg('Man') }
  ]},
  { letter: 'H', uppercase: 'H', lowercase: 'h', phoneme: '/h/', exampleWord: 'Horse', exampleImage: getImg('Horse'), exampleEmoji: '🐎', funFact: 'Horses are fast!', color: '#3B82F6', bgColor: '#EFF6FF', objects: [
    { word: 'Hat', image: getImg('Hat') }, { word: 'Hay', image: getImg('Straw') }, { word: 'Heart', image: getImg('Heart') },
    { word: 'Hen', image: getImg('Chicken') }, { word: 'Hip', image: getImg('Leg') }, { word: 'Hippo', image: getImg('Hippo') },
    { word: 'Hog', image: getImg('Pig') }, { word: 'Hop', image: getImg('Rabbit') }, { word: 'Horse', image: getImg('Horse') },
    { word: 'House', image: getImg('House') }, { word: 'Hum', image: getImg('Speaker') }, { word: 'Hut', image: getImg('Cabin') }
  ]},
  { letter: 'I', uppercase: 'I', lowercase: 'i', phoneme: '/ɪ/', exampleWord: 'Ice Cream', exampleImage: getImg('Ice-Cream'), exampleEmoji: '🍦', funFact: 'Icy treats!', color: '#6366F1', bgColor: '#EEF2FF', objects: [
    { word: 'Ice', image: getImg('Ice') }, { word: 'Ice Cream', image: getImg('Ice-Cream') }, { word: 'Igloo', image: getImg('Igloo') },
    { word: 'Igneous', image: getImg('Rock') }, { word: 'Iguana', image: getImg('Lizard') }, { word: 'Ill', image: getImg('Sick') },
    { word: 'Ink', image: getImg('Ink-Bottle') }, { word: 'Inn', image: getImg('Hotel') }, { word: 'Ion', image: getImg('Atom') },
    { word: 'Iron', image: getImg('Iron') }, { word: 'Island', image: getImg('Island') }, { word: 'Ivy', image: getImg('Leaf') }
  ]},
  { letter: 'J', uppercase: 'J', lowercase: 'j', phoneme: '/dʒ/', exampleWord: 'Jellyfish', exampleImage: getImg('Jellyfish'), exampleEmoji: '🪼', funFact: 'Jellyfish glow!', color: '#8B5CF6', bgColor: '#F5F3FF', objects: [
    { word: 'Jacket', image: getImg('Jacket') }, { word: 'Jam', image: getImg('Jam') }, { word: 'Jar', image: getImg('Jar') },
    { word: 'Jaw', image: getImg('Tooth') }, { word: 'Jeep', image: getImg('Jeep') }, { word: 'Jellyfish', image: getImg('Jellyfish') },
    { word: 'Jet', image: getImg('Jet') }, { word: 'Jigsaw', image: getImg('Puzzle') }, { word: 'Job', image: getImg('Work') },
    { word: 'Jog', image: getImg('Running') }, { word: 'Joy', image: getImg('Happy') }, { word: 'Jut', image: getImg('Mountain') }
  ]},
  { letter: 'K', uppercase: 'K', lowercase: 'k', phoneme: '/k/', exampleWord: 'Kangaroo', exampleImage: getImg('Kangaroo'), exampleEmoji: '🦘', funFact: 'Kangaroos hop!', color: '#EC4899', bgColor: '#FDF2F8', objects: [
    { word: 'Kangaroo', image: getImg('Kangaroo') }, { word: 'Kayak', image: getImg('Boat') }, { word: 'Keg', image: getImg('Barrel') },
    { word: 'Key', image: getImg('Key') }, { word: 'Keyboard', image: getImg('Keyboard') }, { word: 'Kid', image: getImg('Child') },
    { word: 'Kin', image: getImg('Family') }, { word: 'King', image: getImg('King') }, { word: 'Kit', image: getImg('Box') },
    { word: 'Kitchen', image: getImg('Kitchen') }, { word: 'Kite', image: getImg('Kite') }, { word: 'Koala', image: getImg('Koala') }
  ]},
  { letter: 'L', uppercase: 'L', lowercase: 'l', phoneme: '/l/', exampleWord: 'Lion', exampleImage: getImg('Lion'), exampleEmoji: '🦁', funFact: 'Lions roar!', color: '#F43F5E', bgColor: '#FFF1F2', objects: [
    { word: 'Lake', image: getImg('Lake') }, { word: 'Lamp', image: getImg('Lamp') }, { word: 'Lap', image: getImg('Running') },
    { word: 'Leaf', image: getImg('Leaf') }, { word: 'Lemon', image: getImg('Lemon') }, { word: 'Lid', image: getImg('Pot') },
    { word: 'Lion', image: getImg('Lion') }, { word: 'Lip', image: getImg('Lips') }, { word: 'Lizard', image: getImg('Lizard') },
    { word: 'Log', image: getImg('Wood') }, { word: 'Lollipop', image: getImg('Lollipop') }, { word: 'Low', image: getImg('Down') }
  ]},
  { letter: 'M', uppercase: 'M', lowercase: 'm', phoneme: '/m/', exampleWord: 'Monkey', exampleImage: getImg('Monkey'), exampleEmoji: '🐒', funFact: 'Monkeys love fruit!', color: '#EF4444', bgColor: '#FEF2F2', objects: [
    { word: 'Mad', image: getImg('Angry') }, { word: 'Map', image: getImg('Map') }, { word: 'Milk', image: getImg('Milk') },
    { word: 'Mix', image: getImg('Blender') }, { word: 'Mom', image: getImg('Woman') }, { word: 'Monkey', image: getImg('Monkey') },
    { word: 'Moon', image: getImg('Moon') }, { word: 'Mountain', image: getImg('Mountain') }, { word: 'Mouse', image: getImg('Mouse') },
    { word: 'Mud', image: getImg('Soil') }, { word: 'Mug', image: getImg('Cup') }, { word: 'Mushroom', image: getImg('Mushroom') }
  ]},
  { letter: 'N', uppercase: 'N', lowercase: 'n', phoneme: '/n/', exampleWord: 'Nest', exampleImage: getImg('Nest'), exampleEmoji: '🪹', funFact: 'Nests are home!', color: '#F97316', bgColor: '#FFF7ED', objects: [
    { word: 'Nap', image: getImg('Sleep') }, { word: 'Neck', image: getImg('Neck') }, { word: 'Nest', image: getImg('Nest') },
    { word: 'Net', image: getImg('Net') }, { word: 'New', image: getImg('Box') }, { word: 'Night', image: getImg('Night') },
    { word: 'Nil', image: getImg('Zero') }, { word: 'Nod', image: getImg('Ok') }, { word: 'Nose', image: getImg('Nose') },
    { word: 'Now', image: getImg('Clock') }, { word: 'Nurse', image: getImg('Nurse') }, { word: 'Nut', image: getImg('Nut') }
  ]},
  { letter: 'O', uppercase: 'O', lowercase: 'o', phoneme: '/ɒ/', exampleWord: 'Octopus', exampleImage: getImg('Octopus'), exampleEmoji: '🐙', funFact: 'Eight arms!', color: '#F59E0B', bgColor: '#FFFBEB', objects: [
    { word: 'Oak', image: getImg('Tree') }, { word: 'Ocean', image: getImg('Wave') }, { word: 'Octopus', image: getImg('Octopus') },
    { word: 'Off', image: getImg('Switch') }, { word: 'Oil', image: getImg('Oil') }, { word: 'Old', image: getImg('Old-Man') },
    { word: 'Onion', image: getImg('Onion') }, { word: 'Orange', image: getImg('Orange') }, { word: 'Orb', image: getImg('Ball') },
    { word: 'Ostrich', image: getImg('Ostrich') }, { word: 'Owl', image: getImg('Owl') }, { word: 'Oyster', image: getImg('Shell') }
  ]},
  { letter: 'P', uppercase: 'P', lowercase: 'p', phoneme: '/p/', exampleWord: 'Penguin', exampleImage: getImg('Penguin'), exampleEmoji: '🐧', funFact: 'Penguins slide!', color: '#84CC16', bgColor: '#F7FEE7', objects: [
    { word: 'Pan', image: getImg('Pan') }, { word: 'Parrot', image: getImg('Parrot') }, { word: 'Pear', image: getImg('Pear') },
    { word: 'Peg', image: getImg('Clothes-Peg') }, { word: 'Pen', image: getImg('Pen') }, { word: 'Penguin', image: getImg('Penguin') },
    { word: 'Pig', image: getImg('Pig') }, { word: 'Pin', image: getImg('Pin') }, { word: 'Pizza', image: getImg('Pizza') },
    { word: 'Pop', image: getImg('Popcorn') }, { word: 'Pot', image: getImg('Pot') }, { word: 'Pup', image: getImg('Dog') }
  ]},
  { letter: 'Q', uppercase: 'Q', lowercase: 'q', phoneme: '/kw/', exampleWord: 'Queen', exampleImage: getImg('Queen'), exampleEmoji: '👸', funFact: 'Queens have crowns!', color: '#22C55E', bgColor: '#F0FDF4', objects: [
    { word: 'Quack', image: getImg('Duck') }, { word: 'Quad', image: getImg('Atv') }, { word: 'Quail', image: getImg('Bird') },
    { word: 'Quay', image: getImg('Port') }, { word: 'Queen', image: getImg('Queen') }, { word: 'Question', image: getImg('Question') },
    { word: 'Quick', image: getImg('Flash') }, { word: 'Quiet', image: getImg('Silence') }, { word: 'Quilt', image: getImg('Blanket') },
    { word: 'Quip', image: getImg('Chat') }, { word: 'Quit', image: getImg('Exit') }, { word: 'Quiz', image: getImg('Exam') }
  ]},
  { letter: 'R', uppercase: 'R', lowercase: 'r', phoneme: '/r/', exampleWord: 'Rainbow', exampleImage: getImg('Rainbow'), exampleEmoji: '🌈', funFact: 'Rainbows are magic!', color: '#14B8A6', bgColor: '#F0FDFA', objects: [
    { word: 'Rabbit', image: getImg('Rabbit') }, { word: 'Rain', image: getImg('Rain') }, { word: 'Rat', image: getImg('Rat') },
    { word: 'Ray', image: getImg('Sun') }, { word: 'Rib', image: getImg('Bones') }, { word: 'Rice', image: getImg('Rice') },
    { word: 'Ring', image: getImg('Ring') }, { word: 'Robot', image: getImg('Robot') }, { word: 'Rocket', image: getImg('Rocket') },
    { word: 'Rod', image: getImg('Fish') }, { word: 'Row', image: getImg('Boat') }, { word: 'Rug', image: getImg('Carpet') }
  ]},
  { letter: 'S', uppercase: 'S', lowercase: 's', phoneme: '/s/', exampleWord: 'Sun', exampleImage: getImg('Sun'), exampleEmoji: '☀️', funFact: 'Sunshine!', color: '#06B6D4', bgColor: '#ECFEFF', objects: [
    { word: 'Sap', image: getImg('Tree') }, { word: 'Set', image: getImg('TV') }, { word: 'Shark', image: getImg('Shark') },
    { word: 'Ship', image: getImg('Ship') }, { word: 'Sip', image: getImg('Drink') }, { word: 'Sit', image: getImg('Chair') },
    { word: 'Snake', image: getImg('Snake') }, { word: 'Socks', image: getImg('Socks') }, { word: 'Soy', image: getImg('Beans') },
    { word: 'Spider', image: getImg('Spider') }, { word: 'Star', image: getImg('Star') }, { word: 'Sun', image: getImg('Sun') }
  ]},
  { letter: 'T', uppercase: 'T', lowercase: 't', phoneme: '/t/', exampleWord: 'Tiger', exampleImage: getImg('Tiger'), exampleEmoji: '🐯', funFact: 'Tigers are strong!', color: '#3B82F6', bgColor: '#EFF6FF', objects: [
    { word: 'Tag', image: getImg('Price-Tag') }, { word: 'Ten', image: getImg('10') }, { word: 'Tent', image: getImg('Tent') },
    { word: 'Tiger', image: getImg('Tiger') }, { word: 'Tip', image: getImg('Pin') }, { word: 'Tomato', image: getImg('Tomato') },
    { word: 'Top', image: getImg('Top') }, { word: 'Toy', image: getImg('Teddy-Bear') }, { word: 'Train', image: getImg('Train') },
    { word: 'Truck', image: getImg('Truck') }, { word: 'Turtle', image: getImg('Turtle') }, { word: 'Tux', image: getImg('Suit') }
  ]},
  { letter: 'U', uppercase: 'U', lowercase: 'u', phoneme: '/ʌ/', exampleWord: 'Umbrella', exampleImage: getImg('Umbrella'), exampleEmoji: '☂️', funFact: 'Stay dry!', color: '#6366F1', bgColor: '#EEF2FF', objects: [
    { word: 'Ufo', image: getImg('Ufo') }, { word: 'Ulu', image: getImg('Knife') }, { word: 'Umbrella', image: getImg('Umbrella') },
    { word: 'Uncle', image: getImg('Man') }, { word: 'Under', image: getImg('Down') }, { word: 'Unicorn', image: getImg('Unicorn') },
    { word: 'Uniform', image: getImg('Shirt') }, { word: 'Up', image: getImg('Up') }, { word: 'Urn', image: getImg('Pot') },
    { word: 'Urp', image: getImg('Sick') }, { word: 'Use', image: getImg('Tool') }, { word: 'Utu', image: getImg('Statue') }
  ]},
  { letter: 'V', uppercase: 'V', lowercase: 'v', phoneme: '/v/', exampleWord: 'Volcano', exampleImage: getImg('Volcano'), exampleEmoji: '🌋', funFact: 'Volcanoes are hot!', color: '#8B5CF6', bgColor: '#F5F3FF', objects: [
    { word: 'Vac', image: getImg('Vacuum') }, { word: 'Van', image: getImg('Van') }, { word: 'Vase', image: getImg('Vase') },
    { word: 'Vest', image: getImg('Vest') }, { word: 'Vet', image: getImg('Doctor') }, { word: 'Via', image: getImg('Road') },
    { word: 'Video', image: getImg('Video') }, { word: 'Vim', image: getImg('Flash') }, { word: 'Violin', image: getImg('Violin') },
    { word: 'Volcano', image: getImg('Volcano') }, { word: 'Vow', image: getImg('Ring') }, { word: 'Vulture', image: getImg('Bird') }
  ]},
  { letter: 'W', uppercase: 'W', lowercase: 'w', phoneme: '/w/', exampleWord: 'Whale', exampleImage: getImg('Whale'), exampleEmoji: '🐳', funFact: 'Whales are huge!', color: '#EC4899', bgColor: '#FDF2F8', objects: [
    { word: 'Watch', image: getImg('Watch') }, { word: 'Watermelon', image: getImg('Watermelon') }, { word: 'Wave', image: getImg('Wave') },
    { word: 'Wax', image: getImg('Candle') }, { word: 'Way', image: getImg('Road') }, { word: 'Web', image: getImg('Spider-Web') },
    { word: 'Wet', image: getImg('Rain') }, { word: 'Whale', image: getImg('Whale') }, { word: 'Wig', image: getImg('Hair') },
    { word: 'Win', image: getImg('Trophy') }, { word: 'Wolf', image: getImg('Wolf') }, { word: 'Worm', image: getImg('Worm') }
  ]},
  { letter: 'X', uppercase: 'X', lowercase: 'x', phoneme: '/ks/', exampleWord: 'Xylophone', exampleImage: getImg('Xylophone'), exampleEmoji: '🪈', funFact: 'Musical X!', color: '#F43F5E', bgColor: '#FFF1F2', objects: [
    { word: 'X-ray', image: getImg('X-Ray') }, { word: 'X-ray fish', image: getImg('Fish') }, { word: 'Xan', image: getImg('Medicine') },
    { word: 'Xat', image: getImg('Hat') }, { word: 'Xeb', image: getImg('Ship') }, { word: 'Xenon', image: getImg('Atom') },
    { word: 'Xerus', image: getImg('Squirrel') }, { word: 'Xis', image: getImg('Paper') }, { word: 'Xmas', image: getImg('Christmas-Tree') },
    { word: 'Xyl', image: getImg('Wood') }, { word: 'Xylophone', image: getImg('Xylophone') }, { word: 'Xer', image: getImg('Desert') }
  ]},
  { letter: 'Y', uppercase: 'Y', lowercase: 'y', phoneme: '/j/', exampleWord: 'Yak', exampleImage: getImg('Yak'), exampleEmoji: '🐂', funFact: 'Yaks are furry!', color: '#EF4444', bgColor: '#FEF2F2', objects: [
    { word: 'Yacht', image: getImg('Boat') }, { word: 'Yak', image: getImg('Yak') }, { word: 'Yap', image: getImg('Dog') },
    { word: 'Yarn', image: getImg('Yarn') }, { word: 'Yawn', image: getImg('Sleepy') }, { word: 'Yellow', image: getImg('Circle') },
    { word: 'Yen', image: getImg('Money') }, { word: 'Yes', image: getImg('Check') }, { word: 'Yet', image: getImg('Wait') },
    { word: 'Yo-yo', image: getImg('Yo-Yo') }, { word: 'Yoga', image: getImg('Yoga') }, { word: 'Yum', image: getImg('Happy') }
  ]},
  { letter: 'Z', uppercase: 'Z', lowercase: 'z', phoneme: '/z/', exampleWord: 'Zebra', exampleImage: getImg('Zebra'), exampleEmoji: '🦓', funFact: 'Stripes!', color: '#F97316', bgColor: '#FFF7ED', objects: [
    { word: 'Zag', image: getImg('Lines') }, { word: 'Zap', image: getImg('Flash') }, { word: 'Zebra', image: getImg('Zebra') },
    { word: 'Zed', image: getImg('Sleep') }, { word: 'Zero', image: getImg('0') }, { word: 'Zest', image: getImg('Lemon') },
    { word: 'Zig', image: getImg('Lines') }, { word: 'Zigzag', image: getImg('Lines') }, { word: 'Zip', image: getImg('Zipper') },
    { word: 'Zone', image: getImg('Map') }, { word: 'Zoo', image: getImg('Zoo') }, { word: 'Zucchini', image: getImg('Cucumber') }
  ]},
];


export const LETTER_COLORS = LETTERS_DATA.map(l => l.color);
