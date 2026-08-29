import { useParams } from 'react-router-dom';
import { NumberOfTheDay } from './NumberOfTheDay';
import { CountTap } from './CountTap';
import { RollCount } from './RollCount';
import { FillTheJar } from './FillTheJar';
import { MoreOrLess } from './MoreOrLess';
import { BuildTower } from './BuildTower';
import { TraceNumber, NumberMatch, NumberRoad, CountingSong } from './NumberActivities';
import { NumberSounds } from './NumberSounds';

export function NumberActivityRouter() {
  const { activity } = useParams<{ activity: string }>();
  switch (activity) {
    case 'number-of-the-day': return <NumberOfTheDay />;
    case 'number-sounds':      return <NumberSounds />;
    case 'trace-number':       return <TraceNumber />;
    case 'count-tap':          return <CountTap />;
    case 'number-match':       return <NumberMatch />;
    case 'roll-count':         return <RollCount />;
    case 'number-road':        return <NumberRoad />;
    case 'fill-the-jar':       return <FillTheJar />;
    case 'more-or-less':       return <MoreOrLess />;
    case 'counting-song':      return <CountingSong />;
    case 'build-tower':        return <BuildTower />;
    default: return <div style={{ fontFamily: 'Nunito', padding: 32, fontSize: '1.2rem' }}>Activity not found 😕</div>;
  }
}
