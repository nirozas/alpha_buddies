import { useParams } from 'react-router-dom';
import { LetterOfTheDay } from './LetterOfTheDay';
import { TraceDraw } from './TraceDraw';
import { SayItOutLoud, AlphabetSong } from './SayItAndSong';
import { LetterMatch } from './LetterMatch';
import { PopTheBubble } from './PopTheBubble';
import { FlipFind } from './FlipFind';
import { ColourTheLetter } from './ColourTheLetter';
import { LetterCaterpillar } from './LetterCaterpillar';
import { WhatStartsWith } from './WhatStartsWith';
import { StampTheLetter } from './StampTheLetter';
import { FindInParagraph } from './FindInParagraph';
import { ColorByCode } from './ColorByCode';

export function LetterActivityRouter() {
  const { activity } = useParams<{ activity: string }>();
  switch (activity) {
    case 'letter-of-the-day':   return <LetterOfTheDay />;
    case 'trace-draw':           return <TraceDraw />;
    case 'say-it-out-loud':      return <SayItOutLoud />;
    case 'letter-match':         return <LetterMatch />;
    case 'pop-the-bubble':       return <PopTheBubble />;
    case 'alphabet-song':        return <AlphabetSong />;
    case 'flip-find':            return <FlipFind />;
    case 'colour-the-letter':    return <ColourTheLetter />;
    case 'letter-caterpillar':   return <LetterCaterpillar />;
    case 'what-starts-with':     return <WhatStartsWith />;
    case 'stamp-letter':         return <StampTheLetter />;
    case 'find-in-paragraph':    return <FindInParagraph />;
    case 'color-by-code':        return <ColorByCode />;
    default: return <div style={{ fontFamily: 'Nunito', padding: 32, fontSize: '1.2rem' }}>Activity not found 😕</div>;
  }
}
