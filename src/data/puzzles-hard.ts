import type { Puzzle } from '../types';

export const hardPuzzles: Puzzle[] = [
  {
    id: 'hard-space-1',
    title: 'The Solar System',
    ageGroup: '12-15',
    difficulty: 'hard',
    gridSize: 13,
    theme: 'Space',
    themeEmoji: '🪐',
    words: [
      {
        id: 'jupiter', number: 1, direction: 'down', answer: 'JUPITER', clue: 'The largest planet in our solar system', row: 0, col: 3,
        imageHint: '🪐',
        funFact: { word: 'JUPITER', emoji: '🪐', funFact: 'Jupiter\'s Great Red Spot is a storm that has been raging for over 350 years!', didYouKnow: 'Jupiter is so large that all other planets in the solar system could fit inside it.', imageDescription: 'Giant Jupiter with its colorful swirling storm bands', category: 'Space', difficulty: 'hard' }
      },
      {
        id: 'nebula', number: 2, direction: 'across', answer: 'NEBULA', clue: 'A vast cloud of gas and dust in space where stars are born', row: 1, col: 0,
        imageHint: '🌌',
        funFact: { word: 'NEBULA', emoji: '🌌', funFact: 'Our Sun was born inside a nebula about 4.6 billion years ago!', didYouKnow: 'The Pillars of Creation nebula is 7,000 light-years away from Earth.', imageDescription: 'A glowing purple and pink nebula with new stars forming inside', category: 'Space', difficulty: 'hard' }
      },
      {
        id: 'gravity', number: 5, direction: 'across', answer: 'GRAVITY', clue: 'The invisible force that pulls objects toward each other', row: 6, col: 2,
        imageHint: '⚡',
        funFact: { word: 'GRAVITY', emoji: '🍎', funFact: 'Isaac Newton began to understand gravity after watching an apple fall from a tree!', didYouKnow: 'On the Moon you would weigh 6 times less than on Earth.', imageDescription: 'An apple falling from a tree toward the ground', category: 'Space', difficulty: 'hard' }
      },
      {
        id: 'eclipse', number: 3, direction: 'across', answer: 'ECLIPSE', clue: 'When the Moon blocks the Sun from Earth\'s view', row: 3, col: 0,
        imageHint: '🌑',
        funFact: { word: 'ECLIPSE', emoji: '🌑', funFact: 'A total solar eclipse turns day into night for a few minutes!', didYouKnow: 'Ancient civilisations were terrified of solar eclipses — they thought the Sun was being eaten!', imageDescription: 'A total solar eclipse with a diamond ring of light', category: 'Space', difficulty: 'hard' }
      },
      {
        id: 'saturn', number: 4, direction: 'down', answer: 'SATURN', clue: 'The ringed planet second largest in our solar system', row: 4, col: 7,
        imageHint: '🪐',
        funFact: { word: 'SATURN', emoji: '💫', funFact: 'Saturn\'s rings are made of billions of pieces of ice and rock!', didYouKnow: 'Saturn is so light it could float on water — if you had an ocean big enough!', imageDescription: 'Saturn with its beautiful golden rings against a starry backdrop', category: 'Space', difficulty: 'hard' }
      },
    ]
  },
  {
    id: 'hard-world-1',
    title: 'World Capitals',
    ageGroup: '12-15',
    difficulty: 'hard',
    gridSize: 13,
    theme: 'Geography',
    themeEmoji: '🌍',
    words: [
      {
        id: 'london', number: 1, direction: 'down', answer: 'LONDON', clue: 'Capital city of the United Kingdom, home to Big Ben', row: 0, col: 1,
        imageHint: '🇬🇧',
        funFact: { word: 'LONDON', emoji: '🏙️', funFact: 'London has more trees than people — there are over 8 million trees in the city!', didYouKnow: 'London\'s Underground (the Tube) is the world\'s oldest subway system, opened in 1863.', imageDescription: 'Big Ben and the Thames river on a foggy London morning', category: 'Geography', difficulty: 'hard' }
      },
      {
        id: 'ottawa', number: 3, direction: 'across', answer: 'OTTAWA', clue: 'The capital city of Canada', row: 1, col: 1,
        imageHint: '🇨🇦',
        funFact: { word: 'OTTAWA', emoji: '🍁', funFact: 'Ottawa has the world\'s largest naturally frozen skating rink — the Rideau Canal!', didYouKnow: 'Ottawa gets more snowfall than Moscow each year.', imageDescription: 'The Canadian Parliament building in Ottawa in winter', category: 'Geography', difficulty: 'hard' }
      },
      {
        id: 'cairo', number: 2, direction: 'down', answer: 'CAIRO', clue: 'The capital of Egypt, city of the ancient pyramids', row: 0, col: 4,
        imageHint: '🇪🇬',
        funFact: { word: 'CAIRO', emoji: '🏛️', funFact: 'Cairo means "The Victorious" in Arabic!', didYouKnow: 'Cairo is home to the last surviving Ancient Wonder of the World — the Great Pyramid of Giza.', imageDescription: 'The Cairo skyline with the pyramids of Giza in the background', category: 'Geography', difficulty: 'hard' }
      },
      {
        id: 'tokyo', number: 4, direction: 'across', answer: 'TOKYO', clue: 'The capital and largest city of Japan', row: 4, col: 0,
        imageHint: '🇯🇵',
        funFact: { word: 'TOKYO', emoji: '🗼', funFact: 'Tokyo is the largest metropolitan area in the world with over 37 million people!', didYouKnow: 'Tokyo was originally a small fishing village called Edo before becoming the capital in 1869.', imageDescription: 'The Tokyo skyline with Mount Fuji glowing in the background', category: 'Geography', difficulty: 'hard' }
      },
    ]
  },
  {
    id: 'hard-ramadan-1',
    title: 'Eid & Ramadan',
    ageGroup: '12-15',
    difficulty: 'hard',
    gridSize: 13,
    theme: 'Muslim Holidays',
    themeEmoji: '🌙',
    words: [
      {
        id: 'ramadan', number: 4, direction: 'across', answer: 'RAMADAN', clue: 'The holy month of fasting in Islam', row: 6, col: 0,
        imageHint: '🌙',
        funFact: { word: 'RAMADAN', emoji: '🌙', funFact: 'Ramadan is the ninth month of the Islamic calendar and lasts 29 or 30 days!', didYouKnow: 'During Ramadan, Muslims fast from dawn to sunset and break their fast with dates and water.', imageDescription: 'A glowing crescent moon over a beautiful mosque at night', category: 'Muslim Holidays', difficulty: 'hard' }
      },
      {
        id: 'iftar', number: 3, direction: 'down', answer: 'IFTAR', clue: 'The evening meal when Muslims break their daily fast', row: 2, col: 0,
        imageHint: '🍽️',
        funFact: { word: 'IFTAR', emoji: '🍽️', funFact: 'Traditionally, iftar begins with eating dates and drinking water, following the example of the Prophet Muhammad!', didYouKnow: 'Families and communities gather together for iftar, making it a time of togetherness.', imageDescription: 'A festive iftar table with dates, lanterns, and shared dishes', category: 'Muslim Holidays', difficulty: 'hard' }
      },
      {
        id: 'lantern', number: 1, direction: 'down', answer: 'LANTERN', clue: 'A glowing light hung during Ramadan celebrations', row: 0, col: 6,
        imageHint: '🏮',
        funFact: { word: 'LANTERN', emoji: '🏮', funFact: 'Ramadan lanterns called "fanous" are a beloved tradition in Egypt and across the Arab world!', didYouKnow: 'Children carry colourful lanterns in the streets singing Ramadan songs after sunset.', imageDescription: 'Colorful ornate lanterns glowing along a festive street', category: 'Muslim Holidays', difficulty: 'hard' }
      },
      {
        id: 'zakat', number: 2, direction: 'across', answer: 'ZAKAT', clue: 'Giving a portion of your wealth to help those in need in Islam', row: 1, col: 5,
        imageHint: '💝',
        funFact: { word: 'ZAKAT', emoji: '💝', funFact: 'Zakat is one of the Five Pillars of Islam — it means giving 2.5% of savings to help the poor!', didYouKnow: 'Zakat comes from an Arabic word meaning "purification" — sharing wealth purifies the giver\'s heart.', imageDescription: 'Hands offering food and gifts to a grateful family', category: 'Muslim Holidays', difficulty: 'hard' }
      },
    ]
  },
  {
    id: 'hard-science-1',
    title: 'Amazing Science',
    ageGroup: '15-18',
    difficulty: 'hard',
    gridSize: 13,
    theme: 'Science',
    themeEmoji: '🔬',
    words: [
      {
        id: 'photon', number: 2, direction: 'down', answer: 'PHOTON', clue: 'A tiny particle of light with no mass', row: 1, col: 5,
        imageHint: '💡',
        funFact: { word: 'PHOTON', emoji: '💡', funFact: 'Photons travel at 186,000 miles per second — the speed of light!', didYouKnow: 'When you see a star, the photons hitting your eye may have traveled for millions of years.', imageDescription: 'A beam of light splitting into a rainbow spectrum', category: 'Science', difficulty: 'hard' }
      },
      {
        id: 'osmosis', number: 1, direction: 'down', answer: 'OSMOSIS', clue: 'Water molecules moving through a membrane from high to low concentration', row: 0, col: 8,
        imageHint: '💧',
        funFact: { word: 'OSMOSIS', emoji: '💧', funFact: 'Osmosis is how plant roots absorb water from the soil!', didYouKnow: 'Your body uses osmosis constantly to move water in and out of your cells.', imageDescription: 'A diagram of water molecules passing through a cell membrane', category: 'Science', difficulty: 'hard' }
      },
      {
        id: 'neuron', number: 4, direction: 'across', answer: 'NEURON', clue: 'A nerve cell that transmits signals in your brain and body', row: 6, col: 0,
        imageHint: '🧠',
        funFact: { word: 'NEURON', emoji: '🧠', funFact: 'Your brain contains about 86 billion neurons — more than the stars in the Milky Way galaxy!', didYouKnow: 'Neurons can fire signals up to 268 miles per hour.', imageDescription: 'An illuminated network of glowing neurons in the brain', category: 'Science', difficulty: 'hard' }
      },
      {
        id: 'plasma', number: 2, direction: 'across', answer: 'PLASMA', clue: 'The fourth state of matter — superheated ionised gas', row: 1, col: 5,
        imageHint: '⚡',
        funFact: { word: 'PLASMA', emoji: '⚡', funFact: 'Lightning bolts and stars are both made of plasma!', didYouKnow: 'Over 99% of all visible matter in the universe is in the plasma state.', imageDescription: 'A spectacular lightning bolt illuminating a stormy night sky', category: 'Science', difficulty: 'hard' }
      },
    ]
  },
  {
    id: 'hard-mythology-1',
    title: 'Greek Mythology',
    ageGroup: '18+',
    difficulty: 'hard',
    gridSize: 13,
    theme: 'Mythology',
    themeEmoji: '⚡',
    words: [
      {
        id: 'olympus', number: 4, direction: 'across', answer: 'OLYMPUS', clue: 'The mountain home of the Greek gods', row: 3, col: 2,
        imageHint: '⛰️',
        funFact: { word: 'OLYMPUS', emoji: '⛰️', funFact: 'Mount Olympus is a real mountain in Greece — it is 2,917 meters tall!', didYouKnow: 'The ancient Greeks believed the 12 Olympian gods lived above the clouds on this mountain.', imageDescription: 'A majestic snow-capped Mount Olympus glowing above the clouds', category: 'Mythology', difficulty: 'hard' }
      },
      {
        id: 'athena', number: 1, direction: 'down', answer: 'ATHENA', clue: 'The Greek goddess of wisdom and warfare strategy', row: 0, col: 0,
        imageHint: '🦉',
        funFact: { word: 'ATHENA', emoji: '🦉', funFact: 'Athens, the capital of Greece, was named after the goddess Athena!', didYouKnow: 'The owl is Athena\'s sacred symbol — that\'s why owls are associated with wisdom.', imageDescription: 'The goddess Athena in gleaming armour with her sacred owl', category: 'Mythology', difficulty: 'hard' }
      },
      {
        id: 'minotaur', number: 2, direction: 'down', answer: 'MINOTAUR', clue: 'A monster with a man\'s body and a bull\'s head from Greek myth', row: 0, col: 2,
        imageHint: '🐂',
        funFact: { word: 'MINOTAUR', emoji: '🐂', funFact: 'The Minotaur lived in a giant maze called the Labyrinth on the island of Crete!', didYouKnow: 'The hero Theseus used a ball of thread to find his way back out after defeating the Minotaur.', imageDescription: 'A dark shadowy labyrinth with the Minotaur lurking inside', category: 'Mythology', difficulty: 'hard' }
      },
      {
        id: 'trojan', number: 3, direction: 'across', answer: 'TROJAN', clue: 'Relating to the ancient city of Troy and its famous war', row: 1, col: 0,
        imageHint: '🏛️',
        funFact: { word: 'TROJAN', emoji: '🐴', funFact: 'The Greeks hid soldiers inside a giant wooden horse to sneak into Troy!', didYouKnow: 'Archaeologists discovered the actual ruins of the ancient city of Troy in Turkey in 1870.', imageDescription: 'The great Trojan horse being wheeled through city gates at night', category: 'Mythology', difficulty: 'hard' }
      },
    ]
  },
];
