import type { Puzzle } from '../types';

export const easyPuzzles: Puzzle[] = [
  {
    id: 'easy-animals-1',
    title: 'Friendly Animals',
    ageGroup: '4-5',
    difficulty: 'easy',
    gridSize: 7,
    theme: 'Animals',
    themeEmoji: '🐾',
    words: [
      {
        id: 'cat', number: 1, direction: 'down', answer: 'CAT', clue: 'A fluffy pet that meows', row: 1, col: 2,
        imageHint: '🐱',
        funFact: { word: 'CAT', emoji: '🐱', funFact: 'Cats sleep up to 16 hours a day!', didYouKnow: 'A cat can jump 6 times its own height.', imageDescription: 'A fluffy orange cat napping in the sun', category: 'Animals', difficulty: 'easy' }
      },
      {
        id: 'dog', number: 2, direction: 'down', answer: 'DOG', clue: 'A loyal pet that barks', row: 0, col: 3,
        imageHint: '🐶',
        funFact: { word: 'DOG', emoji: '🐶', funFact: 'Dogs can smell 100,000 times better than humans!', didYouKnow: 'Dogs have wet noses to help them smell better.', imageDescription: 'A happy golden dog wagging its tail', category: 'Animals', difficulty: 'easy' }
      },
      {
        id: 'cow', number: 1, direction: 'across', answer: 'COW', clue: 'A farm animal that gives milk', row: 1, col: 2,
        imageHint: '🐮',
        funFact: { word: 'COW', emoji: '🐮', funFact: 'Cows have best friends and get stressed when separated!', didYouKnow: 'A cow produces about 200,000 glasses of milk in her lifetime.', imageDescription: 'A black-and-white cow grazing in a green field', category: 'Animals', difficulty: 'easy' }
      },
      {
        id: 'bat', number: 4, direction: 'across', answer: 'BAT', clue: 'A flying animal that sleeps upside down', row: 3, col: 0,
        imageHint: '🦇',
        funFact: { word: 'BAT', emoji: '🦇', funFact: 'Bats are the only mammals that can truly fly!', didYouKnow: 'A single bat can eat up to 1,000 mosquitoes in an hour.', imageDescription: 'A cute bat hanging upside down in a cave', category: 'Animals', difficulty: 'easy' }
      },
      {
        id: 'owl', number: 3, direction: 'down', answer: 'OWL', clue: 'A wise bird that hoots at night', row: 0, col: 4,
        imageHint: '🦉',
        funFact: { word: 'OWL', emoji: '🦉', funFact: 'Owls can turn their heads almost all the way around — 270 degrees!', didYouKnow: 'A group of owls is called a parliament.', imageDescription: 'A big-eyed owl perched on a moonlit branch', category: 'Animals', difficulty: 'easy' }
      },
    ]
  },
  {
    id: 'easy-christmas-1',
    title: 'Christmas Fun!',
    ageGroup: '4-5',
    difficulty: 'easy',
    gridSize: 7,
    theme: 'Christmas',
    themeEmoji: '🎄',
    words: [
      {
        id: 'star', number: 1, direction: 'across', answer: 'STAR', clue: 'It goes on top of the Christmas tree', row: 0, col: 0,
        imageHint: '⭐',
        funFact: { word: 'STAR', emoji: '⭐', funFact: 'The star on a Christmas tree represents the Star of Bethlehem!', didYouKnow: 'The Sun is a star — and it is 4.6 billion years old!', imageDescription: 'A shining golden star on top of a Christmas tree', category: 'Christmas', difficulty: 'easy' }
      },
      {
        id: 'tree', number: 2, direction: 'down', answer: 'TREE', clue: 'A tall green plant we decorate', row: 0, col: 1,
        imageHint: '🌲',
        funFact: { word: 'TREE', emoji: '🌲', funFact: 'The first artificial Christmas trees were made of goose feathers!', didYouKnow: 'Pine trees stay green all winter long.', imageDescription: 'A beautifully decorated Christmas tree', category: 'Christmas', difficulty: 'easy' }
      },
      {
        id: 'snow', number: 1, direction: 'down', answer: 'SNOW', clue: 'Cold white stuff that falls from the sky in winter', row: 0, col: 0,
        imageHint: '❄️',
        funFact: { word: 'SNOW', emoji: '❄️', funFact: 'Every snowflake has 6 sides and no two are exactly alike!', didYouKnow: 'It can be too cold to snow — the air needs some moisture.', imageDescription: 'Big fluffy snowflakes falling on a cozy cabin', category: 'Christmas', difficulty: 'easy' }
      },
      {
        id: 'elf', number: 3, direction: 'across', answer: 'ELF', clue: "Santa's little helper in the workshop", row: 3, col: 1,
        imageHint: '🧝',
        funFact: { word: 'ELF', emoji: '🧝', funFact: "In folklore, elves were magical beings who helped craftsmen!", didYouKnow: "The movie 'Elf' was filmed with Will Ferrell actually surrounded by shorter extras.", imageDescription: 'A cheerful elf wrapping presents in Santa\'s workshop', category: 'Christmas', difficulty: 'easy' }
      },
    ]
  },
  {
    id: 'easy-colors-1',
    title: 'Rainbow Colors',
    ageGroup: '4-5',
    difficulty: 'easy',
    gridSize: 8,
    theme: 'Colors',
    themeEmoji: '🌈',
    words: [
      {
        id: 'red', number: 3, direction: 'across', answer: 'RED', clue: 'The color of apples and fire trucks', row: 3, col: 0,
        imageHint: '🍎',
        funFact: { word: 'RED', emoji: '❤️', funFact: 'Red is the first color babies can see clearly!', didYouKnow: 'Bulls are actually colorblind to red — it is the movement that excites them.', imageDescription: 'A bright red apple on a white background', category: 'Colors', difficulty: 'easy' }
      },
      {
        id: 'blue', number: 2, direction: 'across', answer: 'BLUE', clue: 'The color of the sky and ocean', row: 2, col: 1,
        imageHint: '🌊',
        funFact: { word: 'BLUE', emoji: '💙', funFact: 'Blue is the world\'s favorite color — most people prefer it!', didYouKnow: 'There is no natural blue food — blueberries are actually purple!', imageDescription: 'A clear blue sky over a sparkling ocean', category: 'Colors', difficulty: 'easy' }
      },
      {
        id: 'gold', number: 1, direction: 'down', answer: 'GOLD', clue: 'A shiny yellow color like treasure', row: 0, col: 2,
        imageHint: '✨',
        funFact: { word: 'GOLD', emoji: '🥇', funFact: 'Gold does not rust or tarnish — it stays shiny forever!', didYouKnow: 'All the gold ever mined could fit in about 3.5 Olympic swimming pools.', imageDescription: 'Gleaming gold coins and a treasure chest', category: 'Colors', difficulty: 'easy' }
      },
    ]
  },
  {
    id: 'mid-fruits-1',
    title: 'Yummy Fruits',
    ageGroup: '6-8',
    difficulty: 'easy',
    gridSize: 9,
    theme: 'Food',
    themeEmoji: '🍓',
    words: [
      {
        id: 'apple', number: 2, direction: 'across', answer: 'APPLE', clue: 'A red or green fruit that keeps the doctor away', row: 1, col: 1,
        imageHint: '🍎',
        funFact: { word: 'APPLE', emoji: '🍎', funFact: 'There are over 7,500 varieties of apples in the world!', didYouKnow: 'Apples float in water because they are 25% air.', imageDescription: 'A basket of colorful red and green apples', category: 'Food', difficulty: 'easy' }
      },
      {
        id: 'mango', number: 1, direction: 'down', answer: 'MANGO', clue: 'A sweet tropical fruit with orange flesh', row: 0, col: 1,
        imageHint: '🥭',
        funFact: { word: 'MANGO', emoji: '🥭', funFact: 'Mango is the national fruit of India, Pakistan, and the Philippines!', didYouKnow: 'There are over 400 varieties of mango.', imageDescription: 'A juicy orange mango cut open on a tropical beach', category: 'Food', difficulty: 'easy' }
      },
      {
        id: 'grape', number: 3, direction: 'across', answer: 'GRAPE', clue: 'Small round fruits that grow in bunches', row: 3, col: 1,
        imageHint: '🍇',
        funFact: { word: 'GRAPE', emoji: '🍇', funFact: 'Grapes burst into flame when put in a microwave — do not try this!', didYouKnow: 'Raisins, currants, and sultanas are all just dried grapes.', imageDescription: 'A bunch of purple grapes on a vine', category: 'Food', difficulty: 'easy' }
      },
      {
        id: 'plum', number: 4, direction: 'down', answer: 'PLUM', clue: 'A small purple-red fruit with a pit inside', row: 3, col: 4,
        imageHint: '🟣',
        funFact: { word: 'PLUM', emoji: '💜', funFact: 'Dried plums are called prunes and are great for your tummy!', didYouKnow: 'China grows more plums than any other country.', imageDescription: 'Deep purple plums on a wooden table', category: 'Food', difficulty: 'easy' }
      },
      {
        id: 'lime', number: 5, direction: 'across', answer: 'LIME', clue: 'A small green sour citrus fruit', row: 4, col: 4,
        imageHint: '🍋',
        funFact: { word: 'LIME', emoji: '🍋', funFact: 'British sailors ate limes to prevent scurvy — that is why they were called "limeys"!', didYouKnow: 'Key lime pie gets its name from the Florida Keys where the limes grow.', imageDescription: 'Bright green limes cut in half on a colorful background', category: 'Food', difficulty: 'easy' }
      },
    ]
  },
  {
    id: 'mid-beach-1',
    title: 'Beach Day!',
    ageGroup: '6-8',
    difficulty: 'easy',
    gridSize: 9,
    theme: 'Beach',
    themeEmoji: '🏖️',
    words: [
      {
        id: 'sand', number: 1, direction: 'down', answer: 'SAND', clue: 'Tiny grains you find at the beach', row: 0, col: 2,
        imageHint: '🏖️',
        funFact: { word: 'SAND', emoji: '🏖️', funFact: 'There are more stars in the universe than grains of sand on all Earth\'s beaches!', didYouKnow: 'Sand is actually tiny pieces of rocks and shells worn down over millions of years.', imageDescription: 'Golden sand with footprints leading to the ocean', category: 'Beach', difficulty: 'easy' }
      },
      {
        id: 'wind', number: 3, direction: 'across', answer: 'WIND', clue: 'Moving air that flies kites', row: 2, col: 0,
        imageHint: '💨',
        funFact: { word: 'WIND', emoji: '💨', funFact: 'The fastest wind ever recorded on Earth was 253 mph!', didYouKnow: 'Wind is caused by the sun heating the Earth unevenly.', imageDescription: 'A colorful kite flying high in the breezy sky', category: 'Beach', difficulty: 'easy' }
      },
      {
        id: 'crab', number: 2, direction: 'across', answer: 'CRAB', clue: 'A sea creature that walks sideways', row: 1, col: 0,
        imageHint: '🦀',
        funFact: { word: 'CRAB', emoji: '🦀', funFact: 'Crabs walk sideways because their legs bend that way!', didYouKnow: 'Crabs have 10 legs — 2 big claws and 8 walking legs.', imageDescription: 'An orange crab scuttling sideways on the sand', category: 'Beach', difficulty: 'easy' }
      },
      {
        id: 'ship', number: 1, direction: 'across', answer: 'SHIP', clue: 'A big boat that sails on the ocean', row: 0, col: 2,
        imageHint: '🚢',
        funFact: { word: 'SHIP', emoji: '🚢', funFact: 'The biggest ships today are longer than 4 football fields!', didYouKnow: 'Ancient Egyptians built wooden ships over 4,000 years ago.', imageDescription: 'A big white cruise ship on sparkling blue water', category: 'Beach', difficulty: 'easy' }
      },
    ]
  },
];
