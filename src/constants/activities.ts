import type { ActivityMeta } from '../types';

export const LETTER_ACTIVITIES: ActivityMeta[] = [
  // Recognition (Identifying the letters)
  { id: 'learn-my-letters', name: 'Learn My Letters', description: 'Meet all your letters!', icon: '📖', type: 'letter', group: 'recognition' },
  { id: 'alphabet-song', name: 'Letter Song', description: 'Sing along!', icon: '🎵', type: 'letter', group: 'recognition' },
  { id: 'letter-sounds', name: 'Letter Sounds', description: 'Listen and find!', icon: '🔊', type: 'letter', group: 'recognition' },
  { id: 'pop-the-bubble', name: 'Pop the Bubble', description: 'Pop the right bubble!', icon: '🫧', type: 'letter', group: 'recognition' },
  { id: 'memory-letters', name: 'Memory Letters', description: 'Match the letters!', icon: '🧠', type: 'letter', group: 'recognition' },
  { id: 'flip-find', name: 'Flip & Find', description: 'Match the pairs!', icon: '🃏', type: 'letter', group: 'recognition' },
  { id: 'letter-match', name: 'Letter Match', description: 'Match capital and small!', icon: '🔍', type: 'letter', group: 'recognition' },
  { id: 'letter-caterpillar', name: 'Letter Caterpillar', description: 'Catch the letters!', icon: '🐛', type: 'letter', group: 'recognition' },
  { id: 'color-by-code', name: 'Color by Code', description: 'Color by letters!', icon: '🖌️', type: 'letter', group: 'recognition', multiSelect: true },
  
  // Sequencing & Visual Memory
  { id: 'alphabet-train', name: 'Alphabet Train', description: 'Put letters in order!', icon: '🚂', type: 'letter', group: 'recognition' },
  { id: 'mystery-reveal', name: 'Mystery Reveal', description: 'Scratch and guess!', icon: '❄️', type: 'letter', group: 'recognition' },
  { id: 'scavenger-hunt', name: 'Scavenger Hunt', description: 'Find real things!', icon: '🔍', type: 'letter', group: 'usage' },

  // Formation (Guided -> Creative)
  { id: 'build-a-letter', name: 'Build a Letter', description: 'Build with blocks!', icon: '🧱', type: 'letter', group: 'formation' },
  { id: 'letter-dot-to-dot', name: 'Connect the Dots', description: 'Follow the numbers!', icon: '🔢', type: 'letter', group: 'formation' },
  { id: 'magic-trace', name: 'Magic Trace', description: 'Trace with sparkles!', icon: '✨', type: 'letter', group: 'formation' },
  { id: 'trace-draw', name: 'Trace & Draw', description: 'Trace the letter!', icon: '✏️', type: 'letter', group: 'formation' },
  { id: 'colour-the-letter', name: 'Colour the Letter', description: 'Colour it in!', icon: '🎨', type: 'letter', group: 'formation' },
  { id: 'stamp-letter', name: 'Stamp the Letter', description: 'Stamp the matches!', icon: '🖍️', type: 'letter', group: 'formation' },

  // Usage / Phonics
  { id: 'missing-bridge', name: 'Missing Bridge', description: 'Fix the bridge!', icon: '🌉', type: 'letter', group: 'usage' },
  { id: 'say-it-out-loud', name: 'Say It Out Loud', description: 'Repeat after me!', icon: '🗣️', type: 'letter', group: 'usage' },
  { id: 'first-letter-sound', name: 'First Letter Sound', description: 'Find the starting letter!', icon: '🔤', type: 'letter', group: 'usage' },
  { id: 'what-starts-with', name: 'What Starts With?', description: 'Find the right picture!', icon: '🖼️', type: 'letter', group: 'usage' },
  { id: 'find-in-paragraph', name: 'Find in Story', description: 'Find letters in story!', icon: '📚', type: 'letter', group: 'usage' },
];

export const NUMBER_ACTIVITIES: ActivityMeta[] = [
  // Recognition
  { id: 'number-of-the-day', name: 'Number of the Day', description: 'Meet your number!', icon: '🔢', type: 'number', group: 'recognition' },
  { id: 'counting-song', name: 'Counting Song', description: 'Sing and count!', icon: '🎶', type: 'number', group: 'recognition' },
  { id: 'number-sounds', name: 'Number Recognition', description: 'Listen and find numbers!', icon: '🔊', type: 'number', group: 'recognition' },
  { id: 'number-match', name: 'Number Match', description: 'Match the number!', icon: '🔍', type: 'number', group: 'recognition' },
  { id: 'color-by-code', name: 'Color by Code', description: 'Color by numbers!', icon: '🖌️', type: 'number', group: 'recognition', multiSelect: true },
  // Formation
  { id: 'trace-number', name: 'Trace the Number', description: 'Trace it!', icon: '✏️', type: 'number', group: 'formation' },
  { id: 'build-tower', name: 'Build the Tower', description: 'Stack the blocks!', icon: '🏗️', type: 'number', group: 'formation' },
  // Usage
  { id: 'count-tap', name: 'Count & Tap', description: 'Count and tap!', icon: '👆', type: 'number', group: 'usage' },
  { id: 'fill-the-jar', name: 'Fill the Jar', description: 'Fill it up!', icon: '🫙', type: 'number', group: 'usage' },
  { id: 'more-or-less', name: 'More or Less?', description: 'Which is more?', icon: '⚖️', type: 'number', group: 'usage' },
  { id: 'number-road', name: 'Number Road', description: 'Drive the car!', icon: '🚗', type: 'number', group: 'usage' },
  { id: 'roll-count', name: 'Roll & Count', description: 'Roll the dice!', icon: '🎲', type: 'number', group: 'usage' },
];
