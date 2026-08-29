import type { Puzzle } from '../types';

export const mediumPuzzles: Puzzle[] = [
  {
    id: 'med-animals-1',
    title: 'Wild Animals',
    ageGroup: '9-11',
    difficulty: 'medium',
    gridSize: 11,
    theme: 'Animals',
    themeEmoji: '🦁',
    words: [
      {
        id: 'tiger', number: 3, direction: 'down', answer: 'TIGER', clue: 'The largest wild cat with orange and black stripes', row: 1, col: 2,
        imageHint: '🐯',
        funFact: { word: 'TIGER', emoji: '🐯', funFact: 'Every tiger has a unique stripe pattern — like a human fingerprint!', didYouKnow: 'Tigers are excellent swimmers and love to play in water.', imageDescription: 'A majestic tiger wading through a jungle river', category: 'Animals', difficulty: 'medium' }
      },
      {
        id: 'eagle', number: 5, direction: 'across', answer: 'EAGLE', clue: 'A powerful bird with sharp talons that soars high', row: 3, col: 0,
        imageHint: '🦅',
        funFact: { word: 'EAGLE', emoji: '🦅', funFact: 'Eagles can spot a rabbit from 2 miles away!', didYouKnow: 'A bald eagle\'s nest can weigh over a tonne — the largest bird nest in the world.', imageDescription: 'A bald eagle soaring over snow-capped mountains', category: 'Animals', difficulty: 'medium' }
      },
      {
        id: 'shark', number: 2, direction: 'down', answer: 'SHARK', clue: 'A powerful ocean fish with lots of teeth', row: 1, col: 1,
        imageHint: '🦈',
        funFact: { word: 'SHARK', emoji: '🦈', funFact: 'Sharks have been around longer than trees — over 400 million years!', didYouKnow: 'Sharks never run out of teeth — they grow new ones their whole life.', imageDescription: 'A great white shark gliding through deep blue ocean', category: 'Animals', difficulty: 'medium' }
      },
      {
        id: 'hippo', number: 4, direction: 'across', answer: 'HIPPO', clue: 'A giant African animal that loves mud and rivers', row: 2, col: 1,
        imageHint: '🦛',
        funFact: { word: 'HIPPO', emoji: '🦛', funFact: 'Hippos produce a natural sunscreen — a pink oily liquid from their skin!', didYouKnow: 'Despite their size, hippos can run up to 19 mph on land.', imageDescription: 'A hippo yawning widely in a muddy African river', category: 'Animals', difficulty: 'medium' }
      },
      {
        id: 'lion', number: 1, direction: 'down', answer: 'LION', clue: 'The king of the jungle with a big mane', row: 0, col: 5,
        imageHint: '🦁',
        funFact: { word: 'LION', emoji: '🦁', funFact: 'A lion\'s roar can be heard from 5 miles away!', didYouKnow: 'Female lions do 90% of the hunting.', imageDescription: 'A proud male lion roaring in the savanna', category: 'Animals', difficulty: 'medium' }
      },
    ]
  },
  {
    id: 'med-space-1',
    title: 'Outer Space',
    ageGroup: '9-11',
    difficulty: 'medium',
    gridSize: 11,
    theme: 'Space',
    themeEmoji: '🚀',
    words: [
      {
        id: 'orbit', number: 3, direction: 'down', answer: 'ORBIT', clue: 'The curved path a planet or satellite takes around a star', row: 3, col: 4,
        imageHint: '🌍',
        funFact: { word: 'ORBIT', emoji: '🌍', funFact: 'Earth travels around the Sun at 67,000 miles per hour!', didYouKnow: 'The Moon is slowly drifting away from Earth — about 1.5 inches per year.', imageDescription: 'Earth orbiting the glowing Sun in the starry universe', category: 'Space', difficulty: 'medium' }
      },
      {
        id: 'comet', number: 4, direction: 'across', answer: 'COMET', clue: 'An icy space rock with a bright glowing tail', row: 7, col: 0,
        imageHint: '☄️',
        funFact: { word: 'COMET', emoji: '☄️', funFact: 'Comets are like dirty snowballs — made of ice, dust, and rock!', didYouKnow: 'Halley\'s Comet visits Earth every 75–76 years. The next visit is in 2061!', imageDescription: 'A blazing comet streaking past planets in space', category: 'Space', difficulty: 'medium' }
      },
      {
        id: 'lunar', number: 1, direction: 'down', answer: 'LUNAR', clue: 'Relating to the Moon (adjective)', row: 0, col: 6,
        imageHint: '🌙',
        funFact: { word: 'LUNAR', emoji: '🌙', funFact: 'The Moon has "moonquakes" — earthquakes on the Moon!', didYouKnow: '12 humans have walked on the Moon and all of them were American men.', imageDescription: 'An astronaut leaving footprints on the dusty Moon surface', category: 'Space', difficulty: 'medium' }
      },
      {
        id: 'nova', number: 2, direction: 'across', answer: 'NOVA', clue: 'A star that suddenly increases greatly in brightness', row: 3, col: 3,
        imageHint: '💥',
        funFact: { word: 'NOVA', emoji: '💥', funFact: 'A supernova explosion can outshine an entire galaxy for a few weeks!', didYouKnow: 'The elements in your body — like iron and calcium — were made in ancient supernovas.', imageDescription: 'A spectacular colorful nova explosion in deep space', category: 'Space', difficulty: 'medium' }
      },
    ]
  },
  {
    id: 'med-thanksgiving-1',
    title: 'Thanksgiving Time!',
    ageGroup: '9-11',
    difficulty: 'medium',
    gridSize: 11,
    theme: 'Thanksgiving',
    themeEmoji: '🦃',
    words: [
      {
        id: 'turkey', number: 2, direction: 'down', answer: 'TURKEY', clue: 'The star of the Thanksgiving dinner table', row: 2, col: 2,
        imageHint: '🦃',
        funFact: { word: 'TURKEY', emoji: '🦃', funFact: 'Male turkeys "gobble" but female turkeys "cluck"!', didYouKnow: 'Benjamin Franklin wanted the turkey — not the eagle — to be America\'s national bird.', imageDescription: 'A golden roasted turkey on a festive Thanksgiving table', category: 'Thanksgiving', difficulty: 'medium' }
      },
      {
        id: 'harvest', number: 4, direction: 'across', answer: 'HARVEST', clue: 'The time of year when farmers collect their crops', row: 4, col: 0,
        imageHint: '🌾',
        funFact: { word: 'HARVEST', emoji: '🌾', funFact: 'The word "harvest" comes from an Old English word meaning "autumn"!', didYouKnow: 'The first Thanksgiving harvest feast in 1621 lasted for three days.', imageDescription: 'A farmer gathering golden wheat under an autumn sky', category: 'Thanksgiving', difficulty: 'medium' }
      },
      {
        id: 'feast', number: 1, direction: 'down', answer: 'FEAST', clue: 'A big special meal shared with family', row: 0, col: 6,
        imageHint: '🍽️',
        funFact: { word: 'FEAST', emoji: '🍽️', funFact: 'The first Thanksgiving feast likely included venison, shellfish, and corn — not pumpkin pie!', didYouKnow: 'Americans eat about 46 million turkeys every Thanksgiving.', imageDescription: 'A long table loaded with Thanksgiving food and family', category: 'Thanksgiving', difficulty: 'medium' }
      },
      {
        id: 'maple', number: 3, direction: 'across', answer: 'MAPLE', clue: 'A tree whose leaves turn brilliant red and orange in autumn', row: 2, col: 5,
        imageHint: '🍁',
        funFact: { word: 'MAPLE', emoji: '🍁', funFact: 'It takes 40 gallons of maple sap to make just 1 gallon of maple syrup!', didYouKnow: 'The red maple leaf is the symbol on Canada\'s flag.', imageDescription: 'A maple tree with brilliant red autumn leaves', category: 'Thanksgiving', difficulty: 'medium' }
      },
    ]
  },
  {
    id: 'med-summer-1',
    title: 'Summer Fun',
    ageGroup: '6-8',
    difficulty: 'medium',
    gridSize: 11,
    theme: 'Seasons',
    themeEmoji: '☀️',
    words: [
      {
        id: 'sunny', number: 1, direction: 'down', answer: 'SUNNY', clue: 'Bright and full of sunshine', row: 0, col: 3,
        imageHint: '☀️',
        funFact: { word: 'SUNNY', emoji: '☀️', funFact: 'Sunlight takes about 8 minutes to travel from the Sun to Earth!', didYouKnow: 'Sunshine makes your body produce Vitamin D, which helps your bones grow strong.', imageDescription: 'A bright sunny day with children playing outdoors', category: 'Seasons', difficulty: 'medium' }
      },
      {
        id: 'picnic', number: 2, direction: 'across', answer: 'PICNIC', clue: 'Eating a meal outdoors on a blanket in the park', row: 2, col: 0,
        imageHint: '🧺',
        funFact: { word: 'PICNIC', emoji: '🧺', funFact: 'The word picnic comes from a French word "pique-nique" meaning a meal outdoors!', didYouKnow: 'Ants can smell food from very far away — that\'s why they always find your picnic!', imageDescription: 'A family picnic on a green meadow with colorful food', category: 'Seasons', difficulty: 'medium' }
      },
      {
        id: 'towel', number: 3, direction: 'across', answer: 'TOWEL', clue: 'You wrap yourself in this after swimming', row: 5, col: 0,
        imageHint: '🏊',
        funFact: { word: 'TOWEL', emoji: '🏊', funFact: 'The world\'s largest towel ever made was as big as a football pitch!', didYouKnow: '"The Hitchhiker\'s Guide to the Galaxy" says a towel is the most useful thing you can carry.', imageDescription: 'A colorful striped beach towel drying in the summer sun', category: 'Seasons', difficulty: 'medium' }
      },
      {
        id: 'tent', number: 4, direction: 'down', answer: 'TENT', clue: 'A portable shelter you sleep in when camping', row: 5, col: 0,
        imageHint: '⛺',
        funFact: { word: 'TENT', emoji: '⛺', funFact: 'The oldest known tents were made of animal hides and mammoth bones 40,000 years ago!', didYouKnow: 'Modern tents use lightweight poles made of fiberglass or aluminum.', imageDescription: 'A cozy tent set up in a beautiful forest', category: 'Seasons', difficulty: 'medium' }
      },
    ]
  },
];
